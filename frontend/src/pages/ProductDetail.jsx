import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FadeInSection } from "@/components/FadeInSection";
import { Header } from "@/components/Header";
import { 
  Heart, ShoppingCart, Minus, Plus, ChevronLeft, Truck, Shield, Gift,
  Share2, Star, StarHalf, Check, Ruler, Package, MessageSquare,
  Facebook, Twitter, Link as LinkIcon, X
} from "lucide-react";
import { productsAPI, reviewsAPI } from '@/lib/api';
import { categoryLabels } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';

// Star Rating Component
const StarRating = ({ rating, size = 16, interactive = false, onRate }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(
        <Star 
          key={i} 
          size={size} 
          className={`text-yellow-400 fill-yellow-400 ${interactive ? 'cursor-pointer hover:scale-110' : ''}`}
          onClick={() => interactive && onRate?.(i)}
        />
      );
    } else if (i - 0.5 <= rating) {
      stars.push(<StarHalf key={i} size={size} className="text-yellow-400 fill-yellow-400" />);
    } else {
      stars.push(
        <Star 
          key={i} 
          size={size} 
          className={`text-gray-300 ${interactive ? 'cursor-pointer hover:scale-110' : ''}`}
          onClick={() => interactive && onRate?.(i)}
        />
      );
    }
  }
  return <div className="flex gap-0.5">{stars}</div>;
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ total: 0, averageRating: 0, ratingDistribution: {} });
  const [canReview, setCanReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '' });
  
  // Share dialog
  const [shareOpen, setShareOpen] = useState(false);
  
  // Related products
  const [relatedProducts, setRelatedProducts] = useState([]);

// Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await productsAPI.getById(id);
        setProduct(data.product);
        
        // Parse images if needed
        if (data.product?.images && typeof data.product.images === 'string') {
          data.product.images = JSON.parse(data.product.images);
        }
        
        // Fetch related products
        const allProducts = await productsAPI.getAll();
        const related = (allProducts.products || [])
          .filter(p => p.category === data.product.category && p.id !== data.product.id)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, toast]);
  
  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      try {
        const data = await reviewsAPI.getProductReviews(id);
        setReviews(data.reviews || []);
        setReviewStats({
          total: data.total,
          averageRating: data.averageRating,
          ratingDistribution: data.ratingDistribution,
        });
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };
    fetchReviews();
  }, [id]);
  
  // Check if user can review
  useEffect(() => {
    const checkCanReview = async () => {
      if (!isAuthenticated || !id) return;
      try {
        const data = await reviewsAPI.canReview(id);
        setCanReview(data.canReview);
      } catch (error) {
        console.error('Failed to check review eligibility:', error);
      }
    };
    checkCanReview();
  }, [isAuthenticated, id]);
  
  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out ${product?.name} on Cozy Stitches!`;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast({
          title: "Link Copied!",
          description: "Product link copied to clipboard",
        });
        break;
    }
    setShareOpen(false);
  };
  
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to leave a review",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await reviewsAPI.createReview({
        productId: id,
        ...newReview,
      });
      toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback",
      });
      setShowReviewForm(false);
      setNewReview({ rating: 5, title: '', comment: '' });
      // Refresh reviews
      const data = await reviewsAPI.getProductReviews(id);
      setReviews(data.reviews || []);
      setReviewStats({
        total: data.total,
        averageRating: data.averageRating,
        ratingDistribution: data.ratingDistribution,
      });
      setCanReview(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </main>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-serif mb-4">Product Not Found</h1>
            <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
          </div>
        </main>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Added to cart!",
      description: `${quantity}x ${product.name} has been added to your cart.`,
    });
  };
  
  // Parse specifications and measurements from JSON
  const specifications = product.specifications ? JSON.parse(product.specifications) : {};
  const measurements = product.measurements ? JSON.parse(product.measurements) : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-4 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <FadeInSection>
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
              <span>/</span>
              <Link 
                to={`/shop?category=${product.category}`} 
                className="hover:text-primary transition-colors"
              >
                {categoryLabels[product.category]}
              </Link>
              <span>/</span>
              <span className="text-foreground">
                {product.name}
              </span>
            </nav>
          </FadeInSection>
          
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          {/* Product Details */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Images */}
            <FadeInSection className="space-y-4">
              <div className="relative overflow-hidden rounded-3xl bg-card">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                />
                {product.tag && (
                  <span className={`absolute top-6 left-6 text-sm font-medium px-4 py-2 rounded-full ${
                    product.tag === 'Sale' 
                      ? 'bg-destructive text-destructive-foreground' 
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    {product.tag}
                  </span>
                )}
              </div>
              {/* Thumbnail Gallery */}
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-xl overflow-hidden transition-all ${
                      selectedImage === index 
                        ? 'ring-2 ring-primary ring-offset-2' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </FadeInSection>
            <FadeInSection delay={100} className="space-y-6">
              <div>
                <p className="text-primary font-medium uppercase tracking-wider text-sm mb-2">
                  {categoryLabels[product.category]}
                </p>
                <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl font-semibold text-primary">
                    ${product.price}
                  </span> {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="bg-destructive/10 text-destructive text-sm font-medium px-2 py-1 rounded-full">
                      Save ${product.originalPrice - product.price}
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border rounded-full bg-card">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <Button 
                  size="lg" 
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className={`px-4 ${isInWishlist(product.id) ? 'bg-rose-50 border-rose-300 text-rose-500' : ''}`}
                  onClick={() => toggleWishlist(product)}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                </Button>
                
                {/* Share Button */}
                <Dialog open={shareOpen} onOpenChange={setShareOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="lg" className="px-4">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Share this product</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                      <div className="flex justify-center gap-4">
                        <Button variant="outline" size="lg" onClick={() => handleShare('facebook')}>
                          <Facebook className="w-5 h-5 text-blue-600" />
                        </Button>
                        <Button variant="outline" size="lg" onClick={() => handleShare('twitter')}>
                          <Twitter className="w-5 h-5 text-sky-500" />
                        </Button>
                        <Button variant="outline" size="lg" onClick={() => handleShare('copy')}>
                          <LinkIcon className="w-5 h-5" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input 
                          value={typeof window !== 'undefined' ? window.location.href : ''} 
                          readOnly 
                          className="flex-1"
                        />
                        <Button onClick={() => handleShare('copy')}>Copy</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center mx-auto mb-2">
                    <Truck className="w-5 h-5 text-sage" />
                  </div>
                  <p className="text-xs text-muted-foreground">Free shipping over $75</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-blush-light flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-5 h-5 text-blush" />
                  </div>
                  <p className="text-xs text-muted-foreground">Handmade quality</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-soft-pink flex items-center justify-center mx-auto mb-2">
                    <Gift className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Gift wrapping available</p>
                </div>
              </div>
              <Card className="p-6 bg-card border-none">
                <h3 className="font-serif font-medium text-lg mb-3">Care Instructions</h3>
                <p className="text-muted-foreground text-sm">
                  {product.careInstructions}
                </p>
              </Card>
            </FadeInSection>
          </div>
          
          {/* Product Details Tabs */}
          <FadeInSection className="mb-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger 
                  value="description" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-6"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger 
                  value="specifications"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-6"
                >
                  Specifications
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-6"
                >
                  Reviews ({reviewStats.total})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="pt-6">
                <div className="max-w-3xl">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                  
                  {product.careInstructions && (
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Care Instructions
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {product.careInstructions}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="specifications" className="pt-6">
                <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
                  <Card className="p-6">
                    <h4 className="font-medium mb-4 flex items-center gap-2">
                      <Ruler className="w-4 h-4" />
                      Measurements
                    </h4>
                    {measurements ? (
                      <dl className="space-y-2">
                        {Object.entries(measurements).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <dt className="text-muted-foreground capitalize">{key}</dt>
                            <dd className="font-medium">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : (
                      <p className="text-muted-foreground text-sm">No measurements available</p>
                    )}
                  </Card>
                  
                  <Card className="p-6">
                    <h4 className="font-medium mb-4">Product Details</h4>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Category</dt>
                        <dd className="font-medium capitalize">{product.category}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Materials</dt>
                        <dd className="font-medium">{product.materials || 'Premium yarn'}</dd>
                      </div>
                      {product.weight && (
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Weight</dt>
                          <dd className="font-medium">{product.weight}g</dd>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">In Stock</dt>
                        <dd className="font-medium">{product.inStock ? 'Yes' : 'No'}</dd>
                      </div>
                      {specifications && Object.entries(specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <dt className="text-muted-foreground capitalize">{key}</dt>
                          <dd className="font-medium">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="pt-6">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Rating Summary */}
                  <div className="space-y-4">
                    <Card className="p-6 text-center">
                      <div className="text-5xl font-bold text-foreground mb-2">
                        {reviewStats.averageRating.toFixed(1)}
                      </div>
                      <StarRating rating={reviewStats.averageRating} size={20} />
                      <p className="text-muted-foreground mt-2">
                        Based on {reviewStats.total} reviews
                      </p>
                    </Card>
                    
                    {/* Rating Distribution */}
                    <Card className="p-4">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-2 mb-2">
                          <span className="w-8 text-sm">{star} ★</span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-400 rounded-full"
                              style={{ 
                                width: reviewStats.total > 0 
                                  ? `${(reviewStats.ratingDistribution[star] || 0) / reviewStats.total * 100}%` 
                                  : '0%' 
                              }}
                            />
                          </div>
                          <span className="w-8 text-sm text-muted-foreground text-right">
                            {reviewStats.ratingDistribution[star] || 0}
                          </span>
                        </div>
                      ))}
                    </Card>
                    
                    {/* Write Review Button */}
                    {isAuthenticated && canReview && (
                      <Button 
                        className="w-full"
                        onClick={() => setShowReviewForm(true)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Write a Review
                      </Button>
                    )}
                    {!isAuthenticated && (
                      <Button className="w-full" asChild>
                        <Link to="/auth">Sign in to Review</Link>
                      </Button>
                    )}
                  </div>
                  
                  {/* Reviews List */}
                  <div className="md:col-span-2 space-y-4">
                    {showReviewForm && (
                      <Card className="p-6">
                        <h4 className="font-medium mb-4">Write Your Review</h4>
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                          <div>
                            <Label>Rating</Label>
                            <div className="flex gap-1 mt-1">
                              <StarRating 
                                rating={newReview.rating} 
                                size={24} 
                                interactive 
                                onRate={(rating) => setNewReview({...newReview, rating})}
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="title">Title (Optional)</Label>
                            <Input 
                              id="title"
                              value={newReview.title}
                              onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                              placeholder="Summarize your experience"
                            />
                          </div>
                          <div>
                            <Label htmlFor="comment">Review</Label>
                            <Textarea 
                              id="comment"
                              value={newReview.comment}
                              onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                              placeholder="Share your thoughts about this product..."
                              rows={4}
                              required
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button type="submit">Submit Review</Button>
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => setShowReviewForm(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </Card>
                    )}
                    
                    {reviews.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No reviews yet. Be the first to review!</p>
                      </div>
                    ) : (
                      reviews.map((review) => (
                        <Card key={review.id} className="p-6">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <StarRating rating={review.rating} size={14} />
                                <span className="font-medium">{review.user.firstName} {review.user.lastName}</span>
                              </div>
                              {review.title && (
                                <h5 className="font-medium">{review.title}</h5>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </FadeInSection>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section>
              <FadeInSection className="mb-8">
                <h2 className="text-2xl font-serif font-semibold text-foreground">
                  You May Also Like
                </h2>
              </FadeInSection>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct, index) => (
                  <FadeInSection key={relatedProduct.id} delay={index * 50}>
                    <Card className="group overflow-hidden bg-card border-none">
                      <Link to={`/product/${relatedProduct.id}`}>
                        <div className="relative overflow-hidden">
                          <img
                            src={relatedProduct.images[0]}
                            alt={relatedProduct.name}
                            className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-serif font-medium text-foreground group-hover:text-primary transition-colors">
                            {relatedProduct.name}
                          </h3>
                          <p className="text-primary font-semibold mt-1">${relatedProduct.price}</p>
                        </div>
                      </Link>
                    </Card>
                  </FadeInSection>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
