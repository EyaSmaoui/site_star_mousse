import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaBox, FaClock } from 'react-icons/fa';
import { trackEvent } from '../utils/analyticsEvents';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      const email = searchParams.get('email');
      if (email) {
        params.set('email', email);
      }
      const response = await axios.get(`/api/orders/${orderId}${params.toString() ? `?${params.toString()}` : ''}`);
      setOrder(response.data);
      localStorage.removeItem('cart');
      trackEvent('order_confirmation_view', {
        orderId,
        status: response.data.status,
        total: Number(response.data.total || 0),
      });
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }, [orderId, searchParams]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Commande non trouvÃ©e</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Confirmation */}
        <div className="bg-white rounded-lg shadow p-8 text-center mb-8">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-600 mb-2">Commande confirmée !</h1>
          <p className="text-gray-600 mb-4">Merci pour votre achat</p>
          <p className="text-2xl font-bold text-blue-600 mb-6">Commande #${order._id?.substring(0, 8) || 'N/A'}</p>

          <p className="text-gray-700 mb-8">
            Vous recevrez un email de confirmation Ã  <span className="font-semibold">{order.customerEmail}</span>
          </p>

          <Link
            to="/products"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
          >
            Continuer les achats
          </Link>
        </div>

        {/* DÃ©tails de la commande */}
        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaBox /> DÃ©tails de la commande
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Statut:</span>
                <span className="font-semibold capitalize">
                  {order.status === 'en attente' ? 'â³ En attente' :
                   order.status === 'en cours' ? 'ðŸšš En cours' :
                   order.status === 'confirmée' ? 'âœ… confirmée' :
                   order.status === 'expédié' ? 'ðŸ“¦ expédiée' :
                   order.status === 'livré' ? 'âœ“ livrée' : order.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-semibold">
                  {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="text-2xl font-bold text-blue-600">{Number(order.total || 0).toFixed(2)} DT</span>
              </div>
            </div>
          </div>

          {/* Livraison */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaClock /> Livraison
            </h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">{order.customerName}</span>
              </p>
              <p className="text-gray-700 mb-2">{order.address}</p>
              <p className="text-gray-700 mb-4">{order.phone}</p>
              <p className="text-sm text-gray-600">
                Notre Ã©quipe vous contactera prochainement pour confirmer votre livraison
              </p>
            </div>
          </div>

          {/* Produits */}
          <div>
            <h2 className="text-xl font-semibold mb-4">ðŸ“¦ Produits</h2>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center pb-3 border-b">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      QuantitÃ©: {item.quantity} Ã— {item.price}â‚¬
                    </p>
                  </div>
                  <p className="font-semibold">{(item.quantity * item.price).toFixed(2)}â‚¬</p>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">ðŸ“Œ Ã€ savoir:</span><br />
              â€¢ Vous recevrez votre commande en {2}-{3} jours<br />
              â€¢ Paiement Ã  la livraison<br />
              â€¢ Suivi en ligne disponible sous peu<br />
              â€¢ Contactez-nous pour toute question: support@starmousse.tn
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

