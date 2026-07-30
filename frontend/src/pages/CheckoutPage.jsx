import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaCreditCard, FaMoneyBill } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { trackEvent } from '../utils/analyticsEvents';

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

  const cartItems = useMemo(() => JSON.parse(localStorage.getItem('cart') || '[]'), []);

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
    axios.get('/api/delivery-zones')
      .then((response) => {
        if (active && Array.isArray(response.data)) {
          setDeliveryZones(response.data);
        }
      })
      .catch((error) => {
        console.warn('Erreur chargement zones de livraison:', error?.message || error);
      });
    return () => {
      active = false;
    };
  }, []);

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
        const response = await axios.post('/api/payments/create-session', orderData);
        if (response?.data?.url) {
          window.location.assign(response.data.url);
          return;
        }
        throw new Error('Impossible de démarrer le paiement Stripe.');
      }

      const orderResponse = await axios.post('/api/orders/addOrder', orderData);
      const orderId = orderResponse.data._id;

      await axios.post('/api/payments/confirm-payment', {
        orderId,
        transactionId: `cash_${orderId}`,
        paymentMethod: 'cash_on_delivery',
      });

      trackEvent('checkout_success', {
        orderId,
        paymentMethod: 'cash_on_delivery',
        total,
      });

      localStorage.removeItem('cart');
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">💳 Checkout</h1>

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
                    <FaMoneyBill /> Paiement à la livraison
                  </div>
                  <p className="text-sm text-gray-600">Paiement en espèces à la réception</p>
                </div>
              </label>

              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  className="mr-3"
                  checked={formData.paymentMethod === 'stripe'}
                  onChange={handleChange}
                />
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    <FaCreditCard /> Carte bancaire (Stripe)
                  </div>
                  <p className="text-sm text-gray-600">Paiement sécurisé par carte bancaire</p>
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
                    <FaMoneyBill /> Flouci (Tunisie)
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
              <span>{shippingCost.toFixed(2)} DT</span>
            </div>
            <div className="flex justify-between text-base font-semibold mt-3 pt-3 border-t border-gray-200">
              <span>Total estimé</span>
              <span>{total.toFixed(2)} DT</span>
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
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold text-lg flex items-center justify-center gap-2 disabled:bg-gray-400"
          >
            <FaLock /> {loading ? 'Traitement...' : 'Confirmer la commande'}
          </button>

          <p className="text-center text-sm text-gray-600">
            🔒 Votre commande est sécurisée
          </p>
        </form>
      </div>
    </div>
  );
}
