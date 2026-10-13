import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  Check,
  Star,
  Share2,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import StarRating from '../components/common/StarRating';
import ProductCard from '../components/common/ProductCard';
import { productService, reviewService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description'); // 'description', 'reviews'

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const res = await productService.getProduct(slug);
        const p = res.data;
        setProduct(p);
        setSelectedImage(p.image);
        if (p.variants && p.variants.length > 0) {
          setSelectedVariant(p.variants[0]);
        } else {
          setSelectedVariant(null);
        }
        setQuantity(1);

        // Fetch related products & reviews in parallel
        const [relatedRes, reviewsRes] = await Promise.all([
          productService.getRelatedProducts(p.id),
          reviewService.getProductReviews(p.id),
        ]);
        setRelatedProducts(relatedRes.data || []);
        setReviews(reviewsRes.data?.results || reviewsRes.data || []);
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-slate-200 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-6 bg-slate-200 rounded w-1/4"></div>
            <div className="h-10 bg-slate-200 rounded w-3/4"></div>
            <div className="h-6 bg-slate-200 rounded w-1/3"></div>
            <div className="h-24 bg-slate-200 rounded w-full"></div>
            <div className="h-12 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Product Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">The requested product could not be found or is currently unavailable.</p>
        <Link to="/shop" className="px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const maxStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = maxStock <= 0;

  // Effective price with variant difference
  let finalPrice = Number(product.effective_price);
  if (selectedVariant && selectedVariant.additional_price) {
    finalPrice += Number(selectedVariant.additional_price);
  }

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    setAddingToCart(true);
    await addToCart(product.id, quantity, selectedVariant?.id);
    setAddingToCart(false);
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) return;
    setAddingToCart(true);
    const res = await addToCart(product.id, quantity, selectedVariant?.id);
    setAddingToCart(false);
    if (res.success) {
      navigate('/checkout');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please sign in to share a review.', 'info');
      navigate('/login');
      return;
    }
    if (!reviewComment.trim()) {
      showToast('Please provide your review comments.', 'error');
      return;
    }

    try {
      setSubmittingReview(true);
      await reviewService.addReview(product.id, {
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });
      showToast('Review submitted successfully!', 'success');
      setReviewTitle('');
      setReviewComment('');
      // Reload reviews
      const updated = await reviewService.getProductReviews(product.id);
      setReviews(updated.data?.results || updated.data || []);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to submit review.';
      showToast(msg, 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Image Gallery array including main image
  const galleryImages = [
    product.image,
    ...(product.images ? product.images.map((img) => img.url) : []),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-white">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category?.slug}`} className="hover:text-white capitalize">
            {product.category?.name}
          </Link>
          <span>/</span>
          <span className="text-slate-200 truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Hero Layout: Gallery Left, Details Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-slate-900 rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-800 shadow-md mb-12">
          {/* Gallery Area */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-sm">
              <img
                src={selectedImage || product.image || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80'}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {product.has_discount && (
                <div className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                  Save {product.discount_percent}%
                </div>
              )}
            </div>

            {/* Thumbnail list */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all bg-slate-950 ${
                      selectedImage === img
                        ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-sm'
                        : 'border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-bold uppercase tracking-wider text-brand-400">
                  {product.category?.name}
                </span>
                <span>SKU: {selectedVariant?.sku || product.sku}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                {product.name}
              </h1>

              {/* Rating Preview */}
              <div className="flex items-center gap-3 mb-5">
                <StarRating rating={product.rating} reviewCount={product.review_count} size="md" showValue />
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-xs text-brand-400 hover:underline font-semibold"
                >
                  Read all {product.review_count} reviews
                </button>
              </div>

              {/* Price Block */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 mb-6 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-white">
                  ${finalPrice.toFixed(2)}
                </span>
                {product.has_discount && (
                  <span className="text-sm font-semibold text-slate-500 line-through">
                    ${Number(product.price).toFixed(2)}
                  </span>
                )}
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ml-auto ${
                  isOutOfStock ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}>
                  {isOutOfStock ? 'Sold Out' : `In Stock (${maxStock} available)`}
                </span>
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                {product.short_description || product.description}
              </p>

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 block">
                    Choose Variant: <span className="text-brand-400 font-semibold">{selectedVariant?.name}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                          selectedVariant?.id === v.id
                            ? 'bg-brand-600 text-white border-brand-500 shadow-sm'
                            : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        {v.name}
                        {v.additional_price > 0 && ` (+$${Number(v.additional_price).toFixed(2)})`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 block">
                  Quantity
                </label>
                <div className="inline-flex items-center border border-slate-700 rounded-xl bg-slate-800 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-200 disabled:opacity-30 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                    disabled={quantity >= maxStock || isOutOfStock}
                    className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-200 disabled:opacity-30 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || addingToCart}
                  className="w-full py-3.5 px-6 rounded-2xl bg-brand-600 hover:bg-brand-500 active:scale-95 text-white font-bold text-sm shadow-premium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock || addingToCart}
                  className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold text-sm border border-slate-700 shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  Buy Now
                </button>
              </div>

              {/* Wishlist toggle action */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                  inWishlist
                    ? 'border-rose-900 bg-rose-950/80 text-rose-400'
                    : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-750'
                }`}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
                {inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}
              </button>

              {/* Value propositions */}
              <div className="grid grid-cols-3 gap-2 pt-6 mt-6 border-t border-slate-800 text-slate-400 text-[11px] font-medium text-center">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-brand-400" />
                  <span>Free shipping &gt; $100</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-brand-400" />
                  <span>Authentic warranty</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-brand-400" />
                  <span>30-Day returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs (Description, Specifications, Reviews) */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md mb-12">
          {/* Tab buttons */}
          <div className="flex items-center gap-8 border-b border-slate-800 pb-4 mb-6 text-sm font-bold">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-2 transition-colors relative ${
                activeTab === 'description'
                  ? 'text-brand-400 border-b-2 border-brand-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Description & Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2 transition-colors relative ${
                activeTab === 'reviews'
                  ? 'text-brand-400 border-b-2 border-brand-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Verified Customer Reviews ({reviews.length})
            </button>
          </div>

          {/* Description Tab Content */}
          {activeTab === 'description' && (
            <div className="prose max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4">
              <p>{product.description}</p>
              <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
                  <h5 className="font-bold text-white mb-2">Product Specifications</h5>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    <li>• Standard SKU: <span className="font-semibold text-white">{product.sku}</span></li>
                    <li>• Category: <span className="font-semibold text-white">{product.category?.name}</span></li>
                    <li>• Manufacturing Quality: <span className="font-semibold text-white">ISO 9001 Certified Standards</span></li>
                    <li>• Packaging: <span className="font-semibold text-white">100% Recyclable Eco-Luxe Box</span></li>
                  </ul>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
                  <h5 className="font-bold text-white mb-2">Shipping & Guarantee</h5>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    <li>• Global Shipping: <span className="font-semibold text-white">Dispatched in 24-48 hours</span></li>
                    <li>• Tracking: <span className="font-semibold text-white">Real-time express SMS & email tracking</span></li>
                    <li>• Returns: <span className="font-semibold text-white">Complimentary 30-day trial</span></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab Content */}
          {activeTab === 'reviews' && (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Reviews List (Left) */}
                <div className="lg:col-span-7 space-y-4">
                  {reviews.length === 0 ? (
                    <div className="p-8 text-center bg-slate-800/50 rounded-2xl border border-slate-700/80">
                      <MessageSquare className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-slate-400">No reviews yet for this product. Be the first to review!</p>
                    </div>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{rev.user_name}</span>
                            {rev.is_verified_purchase && (
                              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                                Verified Buyer
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {new Date(rev.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <StarRating rating={rev.rating} size="sm" />
                        {rev.title && <h5 className="text-xs font-bold text-white">{rev.title}</h5>}
                        <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Review Form (Right) */}
                <div className="lg:col-span-5 bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80">
                  <h4 className="text-sm font-bold text-white mb-1">Write a Review</h4>
                  <p className="text-xs text-slate-400 mb-4">Share your genuine experience with other customers.</p>

                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Your Rating</label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className="p-1 text-amber-400 focus:outline-none"
                          >
                            <Star className={`w-5 h-5 ${reviewRating >= star ? 'fill-amber-400' : 'text-slate-600'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Review Headline</label>
                      <input
                        type="text"
                        placeholder="e.g. Exceptional audio and battery life"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-brand-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Your Feedback</label>
                      <textarea
                        rows="3"
                        placeholder="What did you like or dislike about this product?"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full text-xs p-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-brand-500"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-sm transition-colors disabled:opacity-50"
                    >
                      {submittingReview ? 'Submitting...' : 'Post Customer Review'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="pt-4">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-6">
              You May Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
