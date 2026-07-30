import React, { useState } from 'react';
import axios from 'axios';
import { FaSearch, FaSpinner, FaStar, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { cartService } from '../services/cartService';

export default function AISearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setSearched(true);

      const response = await axios.post('/api/ai/search', {
        query: query.trim(),
      });

      setResults(response.data.results);

      if (response.data.results.length === 0) {
        toast.info('Aucun produit trouvé');
      } else {
        toast.success(
          `${response.data.results.length} produit(s) trouvé(s)`
        );
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    cartService.addToCart(product);
    toast.success(`${product.name} ajouté au panier !`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">🔍 Recherche Intelligente</h1>
          <p className="text-gray-600 mb-8">
            Recherche sémantique basée sur l'IA pour trouver exactement ce que vous cherchez
          </p>

          {/* Barre recherche */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex: matelas ferme confortable pour dormir..."
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 pl-12"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />

              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
              >
                {loading ? <FaSpinner className="animate-spin" /> : 'Chercher'}
              </button>
            </div>
          </form>

          {/* Suggestions */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <span className="text-gray-600 text-sm">Essayez:</span>
            {[
              'Matelas ergonomique',
              'Oreillers mémoire de forme',
              'Lits confortables',
              'Matelas pour mal de dos',
            ].map(suggestion => (
              <button
                key={suggestion}
                onClick={() => setQuery(suggestion)}
                className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Résultats */}
        {searched && (
          <>
            {loading ? (
              <div className="text-center py-12">
                <FaSpinner className="text-4xl text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Recherche en cours...</p>
              </div>
            ) : (
              <>
                {results.length > 0 ? (
                  <>
                    <div className="mb-6 text-gray-600">
                      <p>
                        <span className="font-semibold">{results.length}</span> résultat(s) pour{' '}
                        <span className="font-semibold">"{query}"</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {results.map(product => (
                        <div
                          key={product._id}
                          className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                        >
                          {/* Image */}
                          <div className="w-full h-40 bg-gray-200 overflow-hidden">
                            {product.image ? (
                              <img loading="lazy" decoding="async" src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover hover:scale-105 transition"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No Image
                              </div>
                            )}
                          </div>

                          {/* Contenu */}
                          <div className="p-4 flex-1 flex flex-col">
                            <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                              {product.name}
                            </h3>

                            {/* Pertinence */}
                            {product.relevanceScore && (
                              <div className="mb-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full transition"
                                    style={{
                                      width: `${Math.round(product.relevanceScore * 100)}%`,
                                    }}
                                  ></div>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                  Pertinence: {Math.round(product.relevanceScore * 100)}%
                                </p>
                              </div>
                            )}

                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-3">
                              <FaStar className="text-yellow-400" size={14} />
                              <span className="text-sm font-semibold">
                                {product.averageRating?.toFixed(1) || 'N/A'}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({product.reviewCount || 0})
                              </span>
                            </div>

                            {/* Prix & Stock */}
                            <div className="mb-3 flex justify-between items-center">
                              <span className="text-lg font-bold text-blue-600">
                                {product.price}€
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                product.stock > 5
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {product.stock > 0 ? 'Stock: ' + product.stock : 'Rupture'}
                              </span>
                            </div>

                            {/* Bouton */}
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={product.stock === 0}
                              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:bg-gray-400 mt-auto"
                            >
                              <FaShoppingCart size={14} /> Ajouter
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-6">
                      Aucun produit ne correspond à votre recherche.
                    </p>
                    <button
                      onClick={() => {
                        setQuery('');
                        setSearched(false);
                        setResults([]);
                      }}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Nouvelle recherche
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Info initiale */}
        {!searched && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded">
            <p className="text-blue-800">
              💡 <span className="font-semibold">Astuce:</span> Utilisez une description naturelle
              pour trouver les produits. Par exemple: "Je cherche un matelas pour le mal de dos"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

