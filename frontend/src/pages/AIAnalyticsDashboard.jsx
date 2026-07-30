import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  FaChartLine,
  FaTrendingUp,
  FaBox,
  FaSpinner,
  FaWarehouse,
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function AIAnalyticsDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products?limit=20');
      setProducts(response.data);
      if (response.data.length > 0) {
        setSelectedProduct(response.data[0]);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductAnalytics = useCallback(async () => {
    if (!selectedProduct) return;
    try {
      const pricingResponse = await axios.get(
        `/api/ai/dynamic-price/${selectedProduct._id}`
      );
      setPricing(pricingResponse.data);

      const predictionResponse = await axios.get(
        `/api/ai/stock-prediction/${selectedProduct._id}?days=30`
      );
      setPrediction(predictionResponse.data);
    } catch (error) {
      console.error('Erreur analytics:', error);
    }
  }, [selectedProduct]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (selectedProduct) {
      fetchProductAnalytics();
    }
  }, [selectedProduct, fetchProductAnalytics]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="text-4xl text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">📊 Dashboard IA Analytics</h1>
          <p className="text-gray-600">
            Pricing dynamique • Prédictions stock • Recommandations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          {/* Sélection produit */}
          <div className="lg:col-span-4">
            <label className="block text-sm font-medium mb-2">
              Sélectionner un produit à analyser
            </label>
            <select
              value={selectedProduct?._id || ''}
              onChange={(e) => {
                const product = products.find(p => p._id === e.target.value);
                setSelectedProduct(product);
              }}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {products.map(product => (
                <option key={product._id} value={product._id}>
                  {product.name} (Stock: {product.stock})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedProduct && (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {/* Prix actuel */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Prix Actuel</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedProduct.price}€
                    </p>
                  </div>
                  <FaChartLine className="text-4xl text-blue-200" />
                </div>
              </div>

              {/* Prix dynamique */}
              {pricing && (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Prix Dynamique</p>
                      <p className="text-2xl font-bold text-green-600">
                        {pricing.pricing.dynamicPrice.toFixed(2)}€
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {pricing.pricing.multiplier > 1 ? '📈 +' : '📉'}{' '}
                        {Math.round((pricing.pricing.multiplier - 1) * 100)}%
                      </p>
                    </div>
                    <FaTrendingUp className="text-4xl text-green-200" />
                  </div>
                </div>
              )}

              {/* Stock actuel */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Stock Actuel</p>
                    <p className="text-2xl font-bold">
                      {selectedProduct.stock}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">unités</p>
                  </div>
                  <FaBox className="text-4xl text-yellow-200" />
                </div>
              </div>

              {/* Recommandation stock */}
              {prediction && (
                <div className={`rounded-lg shadow p-6 ${
                  prediction.prediction.needsRestock
                    ? 'bg-red-50 border-l-4 border-red-500'
                    : 'bg-white'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">
                        Recommandation
                      </p>
                      <p className="text-2xl font-bold">
                        {prediction.prediction.recommendation}
                      </p>
                      <p className={`text-xs mt-1 ${
                        prediction.prediction.needsRestock
                          ? 'text-red-600 font-semibold'
                          : 'text-gray-500'
                      }`}>
                        {prediction.prediction.needsRestock
                          ? '⚠️ Restock recommandé!'
                          : '✅ Stock OK'}
                      </p>
                    </div>
                    <FaWarehouse className="text-4xl text-orange-200" />
                  </div>
                </div>
              )}
            </div>

            {/* Graphiques */}
            {pricing && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Pricing Factors */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold mb-6">📊 Facteurs de Prix</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        {
                          name: 'Facteurs',
                          'Prix de base': pricing.pricing.basePrice,
                          'Demande': pricing.pricing.demandFactor * pricing.pricing.basePrice,
                          'Stock': pricing.pricing.stockFactor * pricing.pricing.basePrice,
                        },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Prix de base" fill="#3b82f6" />
                      <Bar dataKey="Demande" fill="#10b981" />
                      <Bar dataKey="Stock" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>

                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                      <span className="text-sm">Facteur Demande</span>
                      <span className="font-bold text-blue-600">
                        +{Math.round(pricing.pricing.demandFactor * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                      <span className="text-sm">Facteur Stock</span>
                      <span className="font-bold text-orange-600">
                        {pricing.pricing.stockFactor > 0 ? '+' : ''}{Math.round(pricing.pricing.stockFactor * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="text-sm">Multiplicateur Final</span>
                      <span className="font-bold text-green-600">
                        x{pricing.pricing.multiplier.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Prédiction Stock */}
                {prediction && prediction.salesHistory && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-6">📈 Historique Ventes</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={prediction.salesHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="_id" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#3b82f6"
                          name="Commandes/jour"
                        />
                      </LineChart>
                    </ResponsiveContainer>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded">
                        <p className="text-sm text-gray-600">Ventes/jour (moyenne)</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {prediction.prediction.avgDailyMail.toFixed(1)}
                        </p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded">
                        <p className="text-sm text-gray-600">Demande projetée (30j)</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {prediction.prediction.projectedDemand}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">💡 Recommandations IA</h2>
              <div className="space-y-3">
                {pricing?.pricing.multiplier > 1.1 && (
                  <div className="flex gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-2xl">📈</span>
                    <div>
                      <p className="font-semibold text-green-900">Augmenter le prix</p>
                      <p className="text-sm text-green-800">
                        La demande est forte. Considérez une augmentation de{' '}
                        {Math.round((pricing.pricing.multiplier - 1) * 100)}% pour améliorer
                        les marges.
                      </p>
                    </div>
                  </div>
                )}

                {prediction?.prediction.needsRestock && (
                  <div className="flex gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <p className="font-semibold text-red-900">Restock urgent</p>
                      <p className="text-sm text-red-800">
                        Le stock va s'épuiser dans 7 jours. Commandez{' '}
                        {Math.max(
                          prediction.prediction.recommendation - selectedProduct.stock,
                          50
                        )}{' '}
                        unités immédiatement.
                      </p>
                    </div>
                  </div>
                )}

                {!prediction?.prediction.needsRestock &&
                  selectedProduct.stock > prediction?.prediction.recommendation && (
                  <div className="flex gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <span className="text-2xl">📉</span>
                    <div>
                      <p className="font-semibold text-yellow-900">Stock élevé</p>
                      <p className="text-sm text-yellow-800">
                        Vous avez {selectedProduct.stock - prediction.prediction.recommendation} unités en
                        excès. Envisagez des promotions ou des réductions pour écouler le stock.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
