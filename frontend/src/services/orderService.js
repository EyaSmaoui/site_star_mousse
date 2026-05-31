import httpClient from './httpClient';

const PENDING_ORDER_KEY = 'pendingOrder';

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
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

  clearPendingOrder();
  return submitOrder(pendingOrder);
};

export const submitOrder = async (orderPayload) => {
  const token = localStorage.getItem('token');
  if (!token || token === 'null' || token === 'undefined') {
    savePendingOrder(orderPayload);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams();
      const name = orderPayload.customerName || orderPayload.name || '';
      const email = orderPayload.customerEmail || orderPayload.email || '';
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
    customerName: orderPayload.customerName || orderPayload.name || user.name || user.username || 'Client',
    customerEmail: orderPayload.customerEmail || orderPayload.email || user.email || 'client@starmousse.tn',
    phone: orderPayload.phone,
    address: orderPayload.address,
    products,
    total: Number(orderPayload.total ?? totalFromProducts),
    status: orderPayload.status || 'en attente',
  };

  try {
    const response = await httpClient.post('orders/addOrder', payload);
    const savedOrder = response.data;

    try {
      const firstProduct = products[0] || {};
      sessionStorage.setItem('pendingReviewOrder', JSON.stringify({
        orderId: savedOrder?._id,
        productName: firstProduct.name || '',
        createdAt: Date.now(),
      }));
      await waitForInlineReviewPrompt(savedOrder, firstProduct);
    } catch {
      // Ignore storage errors; the order itself was saved successfully.
    }

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

const waitForInlineReviewPrompt = (order, product) => {
  if (typeof window === 'undefined') return Promise.resolve();

  return new Promise((resolve) => {
    let settled = false;
    const detail = {
      order,
      product,
      opened: false,
      complete: () => {
        if (settled) return;
        settled = true;
        resolve();
      },
    };

    window.dispatchEvent(new CustomEvent('star-mousse:order-saved', { detail }));

    if (!detail.opened) {
      detail.complete();
      return;
    }

    window.setTimeout(detail.complete, 5 * 60 * 1000);
  });
};

export const submitProductOrder = submitOrder;

export const getMyOrders = async () => {
  const response = await httpClient.get('orders/my-orders');
  return response.data;
};
