import React, { useCallback, useEffect, useState } from 'react';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiArrowLeft, FiDownload } from 'react-icons/fi';
import { toast } from 'react-toastify';

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [trackingCode, setTrackingCode] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;

    try {
      const response = await fetch(`/api/orders/${trackingCode}`);
      if (response.ok) {
        setSearchResult(await response.json());
      } else {
        toast.error('Commande non trouvée');
      }
    } catch (err) {
      console.error('Error searching order:', err);
      toast.error('Erreur lors de la recherche');
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders
    : orders.filter(order => order.status === filter);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock className="w-6 h-6" />;
      case 'processing':
        return <FiPackage className="w-6 h-6" />;
      case 'shipped':
        return <FiTruck className="w-6 h-6" />;
      case 'delivered':
        return <FiCheckCircle className="w-6 h-6" />;
      default:
        return <FiPackage className="w-6 h-6" />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'En attente',
      processing: 'En préparation',
      shipped: 'Expédié',
      delivered: 'Livré',
      cancelled: 'Annulé'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-700';
      case 'shipped':
        return 'text-blue-700';
      case 'processing':
        return 'text-yellow-700';
      case 'pending':
        return 'text-gray-700';
      case 'cancelled':
        return 'text-red-700';
      default:
        return 'text-muted';
    }
  };

  const renderTimeline = (order) => {
    const timeline = [
      { label: 'Commande passée', status: 'pending', date: order.createdAt },
      { label: 'En préparation', status: 'processing', date: order.processingDate },
      { label: 'Expédié', status: 'shipped', date: order.shippedDate },
      { label: 'Livré', status: 'delivered', date: order.deliveredDate }
    ];

    return (
      <div className="mt-6 relative">
        {timeline.map((step, idx) => {
          const isCompleted = order.status === 'delivered' || 
                             (order.status === 'shipped' && idx <= 2) ||
                             (order.status === 'processing' && idx <= 1);

          return (
            <div key={idx} className="flex gap-4 mb-4">
              {/* Timeline dot */}
              <div className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  isCompleted ? 'bg-ink border-ink' : 'bg-paper border-hairline'
                }`} />
                {idx !== timeline.length - 1 && (
                  <div className={`w-0.5 h-12 ${isCompleted ? 'bg-ink' : 'bg-hairline'}`} />
                )}
              </div>

              {/* Step content */}
              <div className="pb-4">
                <p className="font-sans font-600 text-ink uppercase tracking-wide text-sm">
                  {step.label}
                </p>
                {step.date && (
                  <p className="text-sm text-muted mt-1">
                    {new Date(step.date).toLocaleDateString('fr-TN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <div className="border-b border-hairline bg-paper sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <a href="/" className="flex items-center gap-2 text-ink hover:text-muted transition-colors mb-4">
            <FiArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </a>
          <h1 className="font-serif text-4xl text-ink">Suivi de Commande</h1>
          <p className="text-muted mt-2">Suivez l'état de vos commandes en temps réel</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="mb-12 animate-fade">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Entrez votre numéro de commande..."
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              className="flex-1 px-4 py-3 bg-white border border-hairline text-ink rounded-none focus:outline-none focus:border-ink transition-colors"
            />
            <button
              type="submit"
              className="btn-minimal px-6"
            >
              Rechercher
            </button>
          </form>
        </div>

        {/* Search Result */}
        {searchResult && (
          <div className="mb-12 p-8 bg-white border-2 border-ink rounded-none animate-fade">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl text-ink">
                Commande #{searchResult.id}
              </h2>
              <button className="flex items-center gap-2 py-2 px-4 border border-hairline text-ink hover:bg-paper transition-colors rounded-none">
                <FiDownload className="w-4 h-4" />
                Télécharger la facture
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8 pb-8 border-b border-hairline">
              <div>
                <p className="text-sm text-muted font-sans font-600 uppercase tracking-wide mb-1">Date</p>
                <p className="text-ink">
                  {new Date(searchResult.createdAt).toLocaleDateString('fr-TN')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted font-sans font-600 uppercase tracking-wide mb-1">Montant Total</p>
                <p className="font-serif text-2xl text-ink">
                  {searchResult.total.toLocaleString('fr-TN')} TND
                </p>
              </div>
              <div>
                <p className="text-sm text-muted font-sans font-600 uppercase tracking-wide mb-1">Statut</p>
                <div className={`flex items-center gap-2 font-sans font-600 ${getStatusColor(searchResult.status)}`}>
                  {getStatusIcon(searchResult.status)}
                  <span>{getStatusLabel(searchResult.status)}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            {renderTimeline(searchResult)}

            {/* Items */}
            <div className="mt-8 pt-8 border-t border-hairline">
              <h3 className="font-serif text-xl text-ink mb-4">Articles</h3>
              <div className="space-y-3">
                {searchResult.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-3 border-b border-hairline">
                    <div>
                      <p className="text-ink font-sans font-500">{item.name}</p>
                      <p className="text-sm text-muted">Quantité: {item.quantity}</p>
                    </div>
                    <p className="text-ink font-sans font-600">
                      {(item.price * item.quantity).toLocaleString('fr-TN')} TND
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8 flex gap-2 flex-wrap">
          {['all', 'pending', 'processing', 'shipped', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-none font-sans font-500 transition-all duration-200 ${
                filter === status
                  ? 'bg-ink text-paper border border-ink'
                  : 'bg-white text-ink border border-hairline hover:border-ink'
              }`}
            >
              {status === 'all' ? 'Toutes les commandes' : getStatusLabel(status)}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-2 border-hairline border-t-ink rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted">Chargement des commandes...</p>
          </div>
        )}

        {/* Orders List */}
        {!loading && filteredOrders.length > 0 && (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="p-6 bg-white border border-hairline rounded-none hover:shadow-md transition-shadow duration-200 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4 pb-4 border-b border-hairline">
                  <div>
                    <h3 className="font-serif text-xl text-ink group-hover:text-muted transition-colors">
                      Commande #{order.id}
                    </h3>
                    <p className="text-sm text-muted mt-1">
                      {new Date(order.createdAt).toLocaleDateString('fr-TN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center gap-2 font-sans font-600 mb-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span>{getStatusLabel(order.status)}</span>
                    </div>
                    <p className="font-serif text-2xl text-ink">
                      {order.total.toLocaleString('fr-TN')} TND
                    </p>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="mb-4">
                  <p className="text-sm text-muted font-sans font-600 uppercase tracking-wide mb-2">
                    Articles ({order.items?.length || 0})
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {order.items?.slice(0, 3).map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-paper border border-hairline text-sm text-ink rounded-none"
                      >
                        {item.name}
                        {item.quantity > 1 && ` (×${item.quantity})`}
                      </span>
                    ))}
                    {order.items?.length > 3 && (
                      <span className="px-3 py-1 bg-paper border border-hairline text-sm text-muted rounded-none">
                        +{order.items.length - 3} autre(s)
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Timeline */}
                <div className="flex gap-2 items-center text-xs text-muted">
                  <span>Progression:</span>
                  {['pending', 'processing', 'shipped', 'delivered'].map((status, idx) => {
                    const isCompleted = 
                      order.status === 'delivered' ||
                      (order.status === 'shipped' && idx <= 2) ||
                      (order.status === 'processing' && idx <= 1);

                    return (
                      <div key={status} className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-ink' : 'bg-hairline'}`} />
                        {idx !== 3 && <span className="text-hairline">•</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredOrders.length === 0 && (
          <div className="text-center py-12 animate-fade">
            <FiPackage className="w-16 h-16 mx-auto text-hairline mb-4" />
            <p className="font-serif text-2xl text-ink mb-2">Aucune commande trouvée</p>
            <p className="text-muted mb-6">
              {filter === 'all'
                ? 'Vous n\'avez pas encore passé de commande.'
                : `Aucune commande avec le statut "${getStatusLabel(filter)}".`}
            </p>
            <a
              href="/store"
              className="btn-minimal inline-block"
            >
              Découvrir nos produits
            </a>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderTracking;
