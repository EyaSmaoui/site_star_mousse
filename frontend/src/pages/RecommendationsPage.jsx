import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { FaSpinner, FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cartService } from '../services/cartService';

export default function RecommendationsPage() {
  const { userId } = useParams();
  const [recommendations, setRecommendations] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('recommendations'); // 'recommendations' ou 'similar'

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get(`/api/ai/recommendations/${userId}?count=6`);
      setRecommendations(response.data.recommendations);

      if (selectedProduct) {
        const similarResponse = await axios.get(
          `/api/ai/product-recommendations/${selectedProduct._id}`
        );
        setSimilar(similarResponse.data.similar);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la récupération des recommandations');
    } finally {
      setLoading(false);
    }
  }, [userId, selectedProduct]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const handleProductSelect = async (product) => {
    setSelectedProduct(product);
    setTab('similar');

    try {
      const response = await axios.get(
        `/api/ai/product-recommendations/${product._id}`
      );
      setSimilar(response.data.similar);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la récupération des produits similaires');
    }
  };

  const handleAddToCart = (product) => {
    cartService.addToCart(product);
    toast.success(`${product.name} ajouté au panier !`);
  };

  const renderProductCard = (product, showReason = false) => (
    <div
      key={product._id}
      className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
      onClick={() => handleProductSelect(product)}
    >
      {/* Image */}
      <div className="w-full h-48 bg-gray-200 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Pas d'image
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Raison recommandation (si applicable) */}
        {showReason && product.reason && (
          <p className="text-xs text-blue-600 mb-2 italic">💡 {product.reason}</p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <FaStar className="text-yellow-400" size={14} />
          <span className="text-sm font-semibold">
            {product.averageRating?.toFixed(1) || 'N/A'}
          </span>
          <span className="text-xs text-gray-500">
            ({product.reviewCount || 0} avis)
          </span>
        </div>

        {/* Similarité (si produits similaires) */}
        {product.similarity && (
          <div className="mb-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition"
                style={{ width: `${product.similarity * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Similarité: {Math.round(product.similarity * 100)}%
            </p>
          </div>
        )}

        {/* Prix */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-xl font-bold text-blue-600">
            {product.price}€
          </span>
          <span className={`text-xs px-2 py-1 rounded ${
            product.stock > 5
              ? 'bg-green-100 text-green-800'
              : product.stock > 0
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(product);
            }}
            disabled={product.stock === 0}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:bg-gray-400"
          >
            <FaShoppingCart size={14} /> Ajouter
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition flex items-center justify-center"
          >
            <FaHeart size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🤖 Recommandations Intelligentes</h1>
          <p className="text-gray-600">
            Basées sur votre historique d'achat et l'IA machine learning
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setTab('recommendations')}
            className={`px-6 py-3 font-semibold transition ${
              tab === 'recommendations'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Pour Vous (6)
          </button>
          <button
            onClick={() => setTab('similar')}
            disabled={!selectedProduct}
            className={`px-6 py-3 font-semibold transition ${
              tab === 'similar'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800 disabled:opacity-50'
            }`}
          >
            Produits Similaires {selectedProduct && `(${selectedProduct.name})`}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <FaSpinner className="text-4xl text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Génération des recommandations...</p>
          </div>
        ) : (
          <>
            {tab === 'recommendations' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.length > 0 ? (
                  recommendations.map(product =>
                    renderProductCard(product, true)
                  )
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-600">
                      Pas de recommandations disponibles pour le moment.
                      Revenez après vos premiers achats !
                    </p>
                  </div>
                )}
              </div>
            )}

            {tab === 'similar' && selectedProduct && (
              <div>
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-700">
                    Produits similaires à{' '}
                    <span className="font-semibold">{selectedProduct.name}</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {similar.length > 0 ? (
                    similar.map(product =>
                      renderProductCard(product, false)
                    )
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-600">
                        Aucun produit similaire trouvé.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
