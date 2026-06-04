import httpClient from './httpClient';

const PENDING_ORDER_KEY = 'pendingOrder';
const PENDING_REVIEW_KEY = 'pendingReviewOrder';

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
};

export const savePendingReviewOrder = ({ orderId, productName }) => {
  try {
    sessionStorage.setItem(PENDING_REVIEW_KEY, JSON.stringify({ orderId, productName, createdAt: Date.now() }));
  } catch {
    // ignore storage errors
  }
};

export const getPendingReviewOrder = () => {
  try {
    return JSON.parse(sessionStorage.getItem(PENDING_REVIEW_KEY) || 'null');
  } catch {
    return null;
  }
};

export const clearPendingReviewOrder = () => {
  try {
    sessionStorage.removeItem(PENDING_REVIEW_KEY);
  } catch {
    // ignore storage errors
  }
};

export const savePendingOrder = (orderPayload) => {
  try {
    sessionStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(orderPayload));
  } catch {
    // ignore storage errors
  }
};

export const getPendingOrder = () => {
  try {
    return JSON.parse(sessionStorage.getItem(PENDING_ORDER_KEY) || 'null');
  } catch {
    return null;
  }
};

export const clearPendingOrder = () => {
  try {
    sessionStorage.removeItem(PENDING_ORDER_KEY);
  } catch {
    // ignore
  }
};

const isValidPendingOrder = (orderPayload) => {
  const products = Array.isArray(orderPayload?.products) ? orderPayload.products : [];
  return Boolean(
    orderPayload &&
    String(orderPayload.phone || '').trim() &&
    String(orderPayload.address || '').trim() &&
    products.some((product) => product?.name) &&
    Number.isFinite(Number(orderPayload.total ?? products.reduce(
      (sum, product) => sum + Number(product?.price || 0) * Number(product?.quantity || 1),
      0
    )))
  );
};

export const submitPendingOrder = async () => {
  const pendingOrder = getPendingOrder();
  if (!pendingOrder) return null;

  if (!isValidPendingOrder(pendingOrder)) {
    clearPendingOrder();
    return null;
  }

  try {
    const savedOrder = await submitOrder(pendingOrder);
    savePendingReviewOrder({
      orderId: savedOrder._id || savedOrder.data?._id,
      productName: Array.isArray(pendingOrder.products) ? pendingOrder.products[0]?.name : '',
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('star-mousse:pending-review-ready'));
    }
    return savedOrder;
  } finally {
    clearPendingOrder();
  }
};

export const submitOrder = async (orderPayload) => {
  const token = localStorage.getItem('token');
  if (!token || token === 'null' || token === 'undefined') {
    savePendingOrder(orderPayload);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams();
      const name = orderPayload.customerName || '';
      const email = orderPayload.customerEmail || '';
      const phone = orderPayload.phone || '';

      if (name.trim()) params.set('username', name.trim());
      if (email.trim()) params.set('email', email.trim());
      if (phone.trim()) params.set('phone', phone.trim());

      const query = params.toString();
      window.location.href = `/register${query ? `?${query}` : ''}`;
    }
    return;
  }

  const user = getStoredUser();
  const products = Array.isArray(orderPayload.products) ? orderPayload.products : [];
  const totalFromProducts = products.reduce(
    (sum, product) => sum + Number(product.price || 0) * Number(product.quantity || 1),
    0
  );

  const payload = {
    customerName: orderPayload.customerName || user.username || 'Client',
    customerEmail: orderPayload.customerEmail || user.email || 'client@starmousse.tn',
    phone: orderPayload.phone,
    address: orderPayload.address,
    products,
    total: Number(orderPayload.total ?? totalFromProducts),
    status: orderPayload.status || 'en attente',
  };

  try {
    const response = await httpClient.post('/api/orders/addOrder', payload);
    const savedOrder = response.data;

    // Some product pages read response._id, others read response.data._id.
    return { ...savedOrder, data: savedOrder };
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Erreur lors de l’envoi de la commande.';
    const thrown = new Error(message);
    if (error.response) {
      thrown.response = error.response;
      thrown.status = error.response.status;
    }
    throw thrown;
  }
};

export const submitProductOrder = submitOrder;

export const getMyOrders = async (forceRefresh = false) => {
  console.log('📥 getMyOrders() appelé - forceRefresh:', forceRefresh);
  try {
    // Ajouter un paramètre cache-busting pour forcer le rafraîchissement
    const url = forceRefresh 
      ? `/api/orders/my-orders?_t=${Date.now()}` 
      : '/api/orders/my-orders';
    
    const response = await httpClient.get(url);
    console.log('✅ Commandes récupérées du serveur:', response.data.length, 'commandes');
    
    // Vérifier que les données contiennent bien les nouvelles infos
    if (response.data.length > 0) {
      console.log('📋 Première commande:', {
        customerName: response.data[0].customerName,
        phone: response.data[0].phone,
        address: response.data[0].address
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur getMyOrders:', error);
    throw error;
  }
};
