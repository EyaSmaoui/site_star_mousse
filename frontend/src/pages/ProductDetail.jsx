import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiShare2, FiArrowLeft, FiCheck, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import cartService from '../services/cartService';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [addedToCart, setAddedToCart] = useState(false);
  const [error, setError] = useState(null);

  const fetchProductDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) throw new Error('Produit non trouvé');
      const data = await response.json();
      setProduct(data);

      const reviewsRes = await fetch(`/api/products/${productId}/reviews`);
      if (reviewsRes.ok) {
        setReviews(await reviewsRes.json());
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductDetail();
  }, [fetchProductDetail]);

  const handleAddToCart = () => {
    if (product) {
      cartService.addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.images?.[0] || '/images/placeholder.jpg'
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href
        });
      } catch (err) {
        console.error('Share cancelled or failed', err);
      }
    } else {
      // Fallback: copy URL to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papiers');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="animate-fade">
          <div className="text-center">
            <div className="w-16 h-16 border-2 border-hairline border-t-ink rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted">Chargement du produit...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="text-center animate-fade">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-ink font-serif text-xl mb-4">Produit non trouvé</p>
          <p className="text-muted mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="btn-minimal"
          >
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images || ['/images/placeholder.jpg'];
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-paper">
      {/* Breadcrumb & Back Button */}
      <div className="border-b border-hairline bg-paper sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-ink hover:text-muted transition-colors duration-200"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12 animate-fade">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="mb-6 bg-white border border-hairline rounded-none overflow-hidden aspect-square">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square border-2 rounded-none overflow-hidden transition-all duration-200 ${
                      selectedImage === idx
                        ? 'border-ink'
                        : 'border-hairline hover:border-muted'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Category Badge */}
            {product.category && (
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-paper border border-hairline text-sm text-muted rounded-none">
                  {product.category}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="font-serif text-4xl md:text-5xl text-ink mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {reviews.length > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(averageRating)
                          ? 'fill-ink text-ink'
                          : 'text-hairline'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted">
                  {averageRating} ({reviews.length} avis)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mb-8 pb-8 border-b border-hairline">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-4xl text-ink">
                  {product.price.toLocaleString('fr-TN')} TND
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-muted line-through">
                    {product.originalPrice.toLocaleString('fr-TN')} TND
                  </span>
                )}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-sm text-ink mt-2">
                  Économies: {(product.originalPrice - product.price).toLocaleString('fr-TN')} TND
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <p className="text-muted leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mb-8 pb-8 border-b border-hairline">
                <h3 className="font-serif text-lg text-ink mb-4">Caractéristiques</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-sm text-muted font-sans font-500 mb-1 uppercase tracking-wide">
                        {key}
                      </p>
                      <p className="text-ink">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-8 pb-8 border-b border-hairline">
              {product.inStock ? (
                <div className="flex items-center gap-2 text-green-700">
                  <FiCheck className="w-5 h-5" />
                  <span>En stock - Livraison rapide</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-700">
                  <FiX className="w-5 h-5" />
                  <span>En rupture de stock</span>
                </div>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="mb-8 flex gap-4">
              {product.inStock ? (
                <>
                  <div className="flex items-center border border-hairline rounded-none">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-ink hover:bg-paper transition-colors duration-200"
                    >
                      −
                    </button>
                    <span className="px-6 py-2 text-ink border-l border-r border-hairline min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-ink hover:bg-paper transition-colors duration-200"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 btn-minimal flex items-center justify-center gap-2"
                  >
                    <FiShoppingCart className="w-5 h-5" />
                    <span>Ajouter au panier</span>
                  </button>
                </>
              ) : (
                <button
                  disabled
                  className="w-full py-3 bg-paper border border-hairline text-muted cursor-not-allowed rounded-none"
                >
                  Indisponible
                </button>
              )}
            </div>

            {/* Success Message */}
            {addedToCart && (
              <div className="mb-8 p-4 bg-white border border-hairline border-l-4 border-l-ink rounded-none animate-fade">
                <p className="flex items-center gap-2 text-ink">
                  <FiCheck className="w-5 h-5" />
                  <span>Produit ajouté au panier!</span>
                </p>
              </div>
            )}

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="w-full py-3 border border-hairline text-ink rounded-none hover:bg-paper transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <FiShare2 className="w-5 h-5" />
              <span>Partager</span>
            </button>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 pt-12 border-t border-hairline grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="font-sans font-600 text-ink mb-2 uppercase tracking-wide">Livraison Rapide</p>
            <p className="text-muted">Livraison à travers toute la Tunisie en 1-3 jours ouvrables</p>
          </div>
          <div>
            <p className="font-sans font-600 text-ink mb-2 uppercase tracking-wide">Paiement Sécurisé</p>
            <p className="text-muted">Paiement à la livraison ou en ligne avec chiffrement SSL</p>
          </div>
          <div>
            <p className="font-sans font-600 text-ink mb-2 uppercase tracking-wide">Garantie 10 Ans</p>
            <p className="text-muted">Tous nos produits sont garantis et testés</p>
          </div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="mt-16 pt-12 border-t border-hairline">
            <h2 className="font-serif text-3xl text-ink mb-8">Avis Clients ({reviews.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.slice(0, 6).map((review, idx) => (
                <div key={idx} className="p-6 bg-white border border-hairline rounded-none">
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'fill-ink text-ink'
                            : 'text-hairline'
                        }`}
                      />
                    ))}
                  </div>
                  {/* Review Text */}
                  <p className="text-muted mb-3">{review.text}</p>
                  {/* Author */}
                  <p className="font-sans font-600 text-ink text-sm">
                    {review.author}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products Placeholder */}
        <div className="mt-16 pt-12 border-t border-hairline">
          <h2 className="font-serif text-3xl text-ink mb-8">Produits Similaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Placeholder - Can be fetched from API */}
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="group cursor-pointer animate-fade" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="bg-white border border-hairline aspect-square mb-4 rounded-none overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-paper to-hairline flex items-center justify-center">
                    <span className="text-muted">Produit #{idx}</span>
                  </div>
                </div>
                <p className="font-serif text-lg text-ink mb-1 group-hover:text-muted transition-colors">
                  Produit Similaire {idx}
                </p>
                <p className="text-muted text-sm">À partir de 500 TND</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
