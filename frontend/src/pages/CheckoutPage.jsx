import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Banknote, LockKeyhole } from 'lucide-react';
import { toast } from 'react-toastify';
import { trackEvent } from '../utils/analyticsEvents';
import { getCartItems } from '../utils/cartUtils';
import httpClient from '../services/httpClient';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    phone: '',
    address: '',
    region: 'Tunis',
    paymentMethod: 'cash_on_delivery',
  });
  const [deliveryZones, setDeliveryZones] = useState([]);
  const [deliveryZonesLoading, setDeliveryZonesLoading] = useState(true);

  const cartItems = useMemo(() => getCartItems(), []);

  useEffect(() => {
    const itemCount = cartItems.length;
    const subtotalValue = Number(cartItems.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 1)), 0).toFixed(2));

    trackEvent('checkout_page_view', {
      cartItems: itemCount,
      region: formData.region,
      subtotal: subtotalValue,
    });
    // We intentionally record initial checkout page load once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let active = true;
    if (cartItems.length === 0) return () => {
      active = false;
    };
    httpClient.get('/api/delivery-zones')
      .then((response) => {
        if (active && Array.isArray(response.data)) {
          setDeliveryZones(response.data);
        }
      })
      .catch((error) => {
        console.warn('Erreur chargement zones de livraison:', error?.message || error);
      })
      .finally(() => {
        if (active) setDeliveryZonesLoading(false);
      });
    return () => {
      active = false;
    };
  }, [cartItems.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const selectedZone = deliveryZones.find((zone) => zone.region === formData.region);
  const shippingCost = selectedZone ? selectedZone.cost : 0;
  const estimatedDelivery = selectedZone ? `${selectedZone.minDays}-${selectedZone.maxDays} jours` : 'à déterminer';
  const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 1)), 0);
  const total = subtotal + shippingCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (cartItems.length === 0) {
        toast.error('Panier vide !');
        navigate('/products');
        return;
      }

      const sanitizedItems = cartItems.map((item) => ({
        productId: String(item.productId || item._id || ''),
        name: String(item.name || item.title || 'Produit Star Mousse'),
        quantity: Math.max(1, Number(item.quantity || 1)),
        price: Number(item.price || 0),
        dimension: String(item.dimension || ''),
      }));

      const orderData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        phone: formData.phone,
        address: formData.address,
        region: formData.region,
        shippingCost,
        paymentMethod: formData.paymentMethod,
        products: sanitizedItems,
        items: sanitizedItems,
        total,
      };

      trackEvent('checkout_submit', {
        cartSize: cartItems.length,
        total,
        paymentMethod: formData.paymentMethod,
        region: formData.region,
      });

      if (formData.paymentMethod === 'stripe') {
        const response = await httpClient.post('/api/payments/create-session', orderData);
        if (response?.data?.url) {
          window.location.assign(response.data.url);
          return;
        }
        throw new Error('Impossible de démarrer le paiement Stripe.');
      }

      const orderResponse = await httpClient.post('/api/orders/addOrder', orderData);
      const orderId = orderResponse.data._id;

      trackEvent('checkout_success', {
        orderId,
        paymentMethod: 'cash_on_delivery',
        total,
      });

      localStorage.removeItem('cart');
      localStorage.removeItem('starMousseCart');
      toast.success('Commande créée avec succès !');
      navigate(`/order-confirmation/${orderId}?email=${encodeURIComponent(formData.customerEmail)}`);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.error || error.message || 'Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  const regions = [
    'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Sousse', 'Monastir',
    'Mahdia', 'Sfax', 'Gabes', 'Medenine', 'Tataouine', 'Gafsa', 'Tozeur',
    'Kebili', 'Sidi Bouzid', 'Kairouan', 'Kasserine', 'Jendouba', 'Le Kef',
    'Siliana', 'Bizerte'
  ];

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 bs-ecommerce-page sm-checkout-page">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-4xl mb-4" aria-hidden="true">🛒</div>
            <h1 className="text-3xl font-bold mb-3">Votre panier est vide</h1>
            <p className="text-gray-600 mb-6">
              Ajoutez un produit avant de commencer votre commande.
            </p>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Découvrir nos produits
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 bs-ecommerce-page sm-checkout-page">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">💳 Finaliser ma commande</h1>
        <div className="sm-checkout-steps" aria-label="Étapes de commande">
          <span className="is-active">1. Livraison</span>
          <span>2. Paiement</span>
          <span>3. Confirmation</span>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
          {/* Infos personnelles */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4">👤 Informations personnelles</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom complet *</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="jean@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Téléphone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+216 92 123 456"
                />
              </div>
            </div>
          </div>

          {/* Adresse de livraison */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4">📍 Adresse de livraison</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Région *</label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {regions.map(region => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              {selectedZone && (
                <p className="mt-2 text-sm text-gray-600">
                    Frais de livraison estimés: <strong>{selectedZone.cost} DT</strong> · Livraison en <strong>{estimatedDelivery}</strong>
                </p>
              )}
              </div>
 
              <div>
                <label className="block text-sm font-medium mb-2">Adresse *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Rue de la Paix&#10;Tunis 1000"
                />
              </div>
            </div>
          </div>

          {/* Paiement */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4">💰 Méthode de paiement</h2>

            <div className="space-y-3">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash_on_delivery"
                  checked={formData.paymentMethod === 'cash_on_delivery'}
                  onChange={handleChange}
                  className="mr-3"
                />
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    <Banknote aria-hidden="true" /> Paiement à la livraison
                  </div>
                  <p className="text-sm text-gray-600">Paiement en espèces à la réception</p>
                </div>
              </label>

              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  disabled
                  className="mr-3"
                  checked={formData.paymentMethod === 'stripe'}
                  onChange={handleChange}
                />
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    Paiement par carte prochainement
                  </div>
                  <p className="text-sm text-gray-600">Activation future du règlement en dinars.</p>
                </div>
              </label>

              <label className="flex items-center p-4 border rounded-lg cursor-pointer bg-gray-50 opacity-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="flouci"
                  disabled
                  className="mr-3"
                />
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    <Banknote aria-hidden="true" /> Flouci (Tunisie)
                  </div>
                  <p className="text-sm text-gray-600">À venir bientôt</p>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Sous-total</span>
              <span>{subtotal.toFixed(2)} DT</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Livraison</span>
              <span>{deliveryZonesLoading ? 'Calcul…' : selectedZone ? `${shippingCost.toFixed(2)} DT` : 'Indisponible'}</span>
            </div>
            <div className="flex justify-between text-base font-semibold mt-3 pt-3 border-t border-gray-200">
              <span>Total estimé</span>
              <span>{deliveryZonesLoading || !selectedZone ? '—' : `${total.toFixed(2)} DT`}</span>
            </div>
          </div>

          {/* Conditions */}
          <div className="flex items-start gap-3 mb-6">
            <input
              type="checkbox"
              id="terms"
              required
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              J'accepte les conditions de vente et la politique de confidentialité
            </label>
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={loading || deliveryZonesLoading || !selectedZone}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold text-lg flex items-center justify-center gap-2 disabled:bg-gray-400"
          >
            <LockKeyhole aria-hidden="true" /> {loading ? 'Traitement...' : 'Confirmer la commande'}
          </button>

          <p className="text-center text-sm text-gray-600">
            🔒 Votre commande est sécurisée
          </p>
        </form>
      </div>
    </div>
  );
}
