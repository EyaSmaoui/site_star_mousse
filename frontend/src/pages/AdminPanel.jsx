import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiEdit2, FiTrash2, FiPlus, FiArrowLeft, FiSearch,
  FiPackage, FiShoppingCart, FiDollarSign, FiUsers,
  FiX, FiCheck
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import httpClient from '../services/httpClient';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Matelas',
    inStock: true
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes] = await Promise.all([
        httpClient.get('/api/products'),
        httpClient.get('/api/orders/getAllOrders'),
      ]);
      const loadedProducts = Array.isArray(productsRes.data) ? productsRes.data : [];
      const loadedOrders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
      setProducts(loadedProducts.map((product) => ({ ...product, id: String(product._id), inStock: Number(product.stock || 0) > 0 })));
      setOrders(loadedOrders.map((order) => ({ ...order, id: String(order._id), items: order.items || order.products || [] })));
      setStats({
        totalProducts: loadedProducts.length,
        totalOrders: loadedOrders.length,
        totalRevenue: loadedOrders.filter((order) => order.status !== 'annulé').reduce((sum, order) => sum + Number(order.total || 0), 0),
        totalCustomers: new Set(loadedOrders.map((order) => order.customerEmail).filter(Boolean)).size,
      });
    } catch (err) {
      console.error('Admin dashboard loading error:', err);
      toast.error('Impossible de charger les donnees du tableau de bord.');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await httpClient.post('/api/products/add', {
        ...formData,
        price: Number(formData.price),
        basePrice: Number(formData.price),
        stock: formData.inStock ? 1 : 0,
      });
      await fetchData();
      setShowProductForm(false);
      setFormData({ name: '', price: '', description: '', category: 'Matelas', inStock: true });
      toast.success('Produit ajoute avec succes');
    } catch (err) {
      console.error('Error adding product:', err);
      toast.error(err.message || 'Erreur lors de l’ajout du produit');
    }
  };
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await httpClient.put(`/api/products/update/${editingProduct.id}`, {
        ...formData,
        price: Number(formData.price),
        basePrice: Number(formData.price),
        stock: formData.inStock ? Math.max(Number(editingProduct.stock || 0), 1) : 0,
      });
      await fetchData();
      setEditingProduct(null);
      setShowProductForm(false);
      setFormData({ name: '', price: '', description: '', category: 'Matelas', inStock: true });
      toast.success('Produit mis a jour');
    } catch (err) {
      console.error('Error updating product:', err);
      toast.error(err.message || 'Erreur lors de la mise a jour du produit');
    }
  };
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Voulez-vous supprimer ce produit ?')) return;
    try {
      await httpClient.delete(`/api/products/delete/${id}`);
      await fetchData();
      toast.success('Produit supprime');
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error(err.message || 'Erreur lors de la suppression du produit');
    }
  };
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await httpClient.put(`/api/orders/updateOrder/${orderId}`, { status: newStatus });
      await fetchData();
    } catch (err) {
      console.error('Error updating order:', err);
      toast.error(err.message || 'Erreur lors de la mise a jour de la commande');
    }
  };
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(o =>
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      inStock: Number(product.stock || 0) > 0
    });
    setShowProductForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-hairline border-t-ink rounded-full mx-auto mb-4" />
          <p className="text-ink">Chargement du panneau d'administration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <div className="border-b border-hairline bg-paper sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="flex items-center gap-2 text-ink hover:text-muted transition-colors">
              <FiArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </Link>
            <button
              onClick={fetchData}
              className="px-4 py-2 border border-hairline text-ink rounded-none hover:bg-paper transition-colors"
            >
              Rafraîchir
            </button>
          </div>
          <h1 className="font-serif text-4xl text-ink">Panneau d'Administration</h1>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-hairline bg-paper sticky top-[80px] z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Tableau de bord', icon: FiPackage },
              { id: 'products', label: 'Produits', icon: FiShoppingCart },
              { id: 'orders', label: 'Commandes', icon: FiDollarSign },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-ink text-ink font-sans font-600'
                      : 'border-transparent text-muted hover:text-ink'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade">
            <h2 className="font-serif text-2xl text-ink mb-8">Statistiques</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {[
                { label: 'Produits', value: stats.totalProducts || 0, icon: FiPackage, color: 'text-ink' },
                { label: 'Commandes', value: stats.totalOrders || 0, icon: FiShoppingCart, color: 'text-ink' },
                { label: 'Revenu Total', value: `${stats.totalRevenue || 0} TND`, icon: FiDollarSign, color: 'text-ink' },
                { label: 'Clients', value: stats.totalCustomers || 0, icon: FiUsers, color: 'text-ink' },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="p-6 bg-white border border-hairline rounded-none">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-muted font-sans font-600 uppercase tracking-wide text-sm">
                        {stat.label}
                      </p>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <p className="font-serif text-3xl text-ink">{stat.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Recent Orders */}
            <div className="p-6 bg-white border border-hairline rounded-none">
              <h3 className="font-serif text-xl text-ink mb-6">Commandes Récentes</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-hairline">
                      <th className="text-left py-3 px-4 text-sm font-sans font-600 text-muted uppercase tracking-wide">ID</th>
                      <th className="text-left py-3 px-4 text-sm font-sans font-600 text-muted uppercase tracking-wide">Client</th>
                      <th className="text-left py-3 px-4 text-sm font-sans font-600 text-muted uppercase tracking-wide">Montant</th>
                      <th className="text-left py-3 px-4 text-sm font-sans font-600 text-muted uppercase tracking-wide">Statut</th>
                      <th className="text-left py-3 px-4 text-sm font-sans font-600 text-muted uppercase tracking-wide">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(order => (
                      <tr key={order.id} className="border-b border-hairline hover:bg-paper transition-colors">
                        <td className="py-3 px-4 text-ink font-sans font-500">#{order.id}</td>
                        <td className="py-3 px-4 text-muted">{order.customerEmail}</td>
                        <td className="py-3 px-4 text-ink font-sans font-600">{order.total.toLocaleString('fr-TN')} TND</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs font-sans font-600 rounded-none ${
                            order.status === 'livré' ? 'bg-green-100 text-green-700' :
                            order.status === 'expédié' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'en cours' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted text-sm">
                          {new Date(order.createdAt).toLocaleDateString('fr-TN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="animate-fade">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl text-ink">Gestion des Produits</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setFormData({ name: '', price: '', description: '', category: 'Matelas', inStock: true });
                  setShowProductForm(true);
                }}
                className="btn-minimal flex items-center gap-2"
              >
                <FiPlus className="w-5 h-5" />
                <span>Nouveau Produit</span>
              </button>
            </div>

            {/* Search */}
            <div className="mb-8 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-hairline text-ink rounded-none focus:outline-none focus:border-ink"
              />
            </div>

            {/* Product Form Modal */}
            {showProductForm && (
              <div className="mb-8 p-6 bg-white border border-hairline rounded-none">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-xl text-ink">
                    {editingProduct ? 'Modifier Produit' : 'Ajouter Produit'}
                  </h3>
                  <button
                    onClick={() => setShowProductForm(false)}
                    className="p-2 hover:bg-paper transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-sans font-600 text-ink mb-2 uppercase tracking-wide">
                        Nom du Produit
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-minimal w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-sans font-600 text-ink mb-2 uppercase tracking-wide">
                        Prix (TND)
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        className="input-minimal w-full"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-sans font-600 text-ink mb-2 uppercase tracking-wide">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="input-minimal w-full h-24"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-sans font-600 text-ink mb-2 uppercase tracking-wide">
                        Catégorie
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="input-minimal w-full"
                      >
                        <option>Matelas</option>
                        <option>Oreillers</option>
                        <option>Couettes</option>
                        <option>Draps</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-sans font-600 text-ink mb-2 uppercase tracking-wide">
                        Stock
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.inStock}
                          onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span className="text-ink">En stock</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="btn-minimal"
                    >
                      {editingProduct ? 'Mettre à jour' : 'Ajouter'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowProductForm(false)}
                      className="px-6 py-3 border border-hairline text-ink rounded-none hover:bg-paper transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products Table */}
            <div className="bg-white border border-hairline rounded-none overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-hairline">
                    <th className="text-left py-4 px-6 text-sm font-sans font-600 text-muted uppercase tracking-wide">Nom</th>
                    <th className="text-left py-4 px-6 text-sm font-sans font-600 text-muted uppercase tracking-wide">Prix</th>
                    <th className="text-left py-4 px-6 text-sm font-sans font-600 text-muted uppercase tracking-wide">Catégorie</th>
                    <th className="text-left py-4 px-6 text-sm font-sans font-600 text-muted uppercase tracking-wide">Stock</th>
                    <th className="text-left py-4 px-6 text-sm font-sans font-600 text-muted uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="border-b border-hairline hover:bg-paper transition-colors">
                      <td className="py-4 px-6 text-ink">{product.name}</td>
                      <td className="py-4 px-6 font-sans font-600 text-ink">
                        {product.price.toLocaleString('fr-TN')} TND
                      </td>
                      <td className="py-4 px-6 text-muted">{product.category}</td>
                      <td className="py-4 px-6">
                        {product.inStock ? (
                          <span className="flex items-center gap-1 text-green-700">
                            <FiCheck className="w-4 h-4" />
                            En stock
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-700">
                            <FiX className="w-4 h-4" />
                            Rupture
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 flex items-center gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-ink hover:bg-paper transition-colors rounded-none"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-red-700 hover:bg-red-50 transition-colors rounded-none"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="animate-fade">
            <h2 className="font-serif text-2xl text-ink mb-8">Gestion des Commandes</h2>

            {/* Search */}
            <div className="mb-8 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une commande..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-hairline text-ink rounded-none focus:outline-none focus:border-ink"
              />
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-hairline rounded-none overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-hairline">
                    <th className="text-left py-4 px-6 text-sm font-sans font-600 text-muted uppercase tracking-wide">ID</th>
                    <th className="text-left py-4 px-6 text-sm font-sans font-600 text-muted uppercase tracking-wide">Client</th>
                    <th className="text-left py-4 px-6 text-sm font-sans font-600 text-muted uppercase tracking-wide">Articles</th>
                    <th className="text-left py-4 px-6 text-sm font-sans font-600 text-muted uppercase tracking-wide">Montant</th>
                    <th className="text-left py-4 px-6 text-sm font-sans font-600 text-muted uppercase tracking-wide">Statut</th>
                    <th className="text-left py-4 px-6 text-sm font-sans font-600 text-muted uppercase tracking-wide">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="border-b border-hairline hover:bg-paper transition-colors">
                      <td className="py-4 px-6 text-ink font-sans font-600">#{order.id}</td>
                      <td className="py-4 px-6 text-muted">{order.customerEmail}</td>
                      <td className="py-4 px-6 text-ink">{order.items?.length || 0}</td>
                      <td className="py-4 px-6 font-sans font-600 text-ink">
                        {order.total.toLocaleString('fr-TN')} TND
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className={`px-3 py-1 rounded-none text-sm font-sans font-600 border-0 cursor-pointer ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <option value="en attente">En attente</option>
                          <option value="en cours">En préparation</option>
                          <option value="expédié">Expédiée</option>
                          <option value="livré">Livrée</option>
                          <option value="annulé">Annulée</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-muted text-sm">
                        {new Date(order.createdAt).toLocaleDateString('fr-TN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
