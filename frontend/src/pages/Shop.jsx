import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FadeInSection } from "@/components/FadeInSection";
import { Header } from "@/components/Header";
import { Heart, ShoppingCart, Filter } from "lucide-react";
import { productsAPI } from '@/lib/api';
import { categoryLabels } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';

const categories = ['all', 'bouquets', 'scarves', 'keyrings', 'plushies', 'gifts', 'custom'];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('newest');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
   
  const activeCategory = searchParams.get('category') || 'all';

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getAll();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [toast]);

  // Extract unique categories from products
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
    return ['All Products', ...cats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = activeCategory === 'all' 
      ? [...products] 
      : products.filter(p => p.category === activeCategory);
    
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        result.sort((a, b) => {
          const order = { 'Bestseller': 0, 'Popular': 1, 'New': 2, 'Sale': 3 };
          return (order[a.tag] ?? 4) - (order[b.tag] ?? 4);
        });
        break;
      case 'newest':
      default:
        result.sort((a, b) => {
          if (a.tag === 'New' && b.tag !== 'New') return -1;
          if (b.tag === 'New' && a.tag !== 'New') return 1;
          return 0;
        });
    }
    
    return result;
  }, [activeCategory, sortBy, products]);

  const handleCategoryChange = (category) => {
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <FadeInSection className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-4">
              Our Shop
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our collection of handmade crochet treasures. Each piece is crafted with love and care.
            </p>
          </FadeInSection>
          
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {categories.map((category) => {
                const catValue = category === 'All Products' ? 'all' : category;
                return (
                  <Button
                    key={category}
                    variant={activeCategory === catValue ? 'default' : 'warm'}
                    size="sm"
                    onClick={() => handleCategoryChange(catValue)}
                    className="capitalize"
                  >
                    {category}
                  </Button>
                );
              })}
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card rounded-2xl p-4">
              <p className="text-muted-foreground">
                Showing <span className="font-medium text-foreground">
                  {filteredProducts.length}
                </span> products
              </p>
              
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                  <SelectTrigger className="w-[180px] bg-background">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => {
              // Parse images from backend (JSON string or array)
              let images = [];
              try {
                if (product.images) {
                  if (typeof product.images === 'string') {
                    images = JSON.parse(product.images);
                  } else if (Array.isArray(product.images)) {
                    images = product.images;
                  }
                }
              } catch (e) {
                images = [];
              }
              const imageUrl = images[0] || 'https://via.placeholder.com/400x400?text=No+Image';
              
              return (
              <FadeInSection key={product.id} delay={index * 50}>
                <Card className="group overflow-hidden bg-card border-none h-full flex flex-col">
                  <div className="relative overflow-hidden">
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </Link> {product.tag && (
                      <span className={`absolute top-4 left-4 text-xs font-medium px-3 py-1 rounded-full ${
                        product.tag === 'Sale' 
                          ? 'bg-destructive text-destructive-foreground' 
                          : 'bg-primary text-primary-foreground'
                      }`}>
                        {product.tag}
                      </span>
                    )}
                    
                    <div className="absolute inset-0 bg-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <Button 
                        variant="warm" 
                        size="icon" 
                        className={`rounded-full ${isInWishlist(product.id) ? 'bg-rose-500 text-white hover:bg-rose-600' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(product);
                        }}
                      >
                        <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                      </Button>
                      <Button 
                        variant="blush" 
                        size="icon" 
                        className="rounded-full"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      {categoryLabels[product.category]}
                    </span>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-serif font-medium text-lg text-foreground mt-1 mb-2 hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        <span className="text-primary font-semibold text-lg">
                          ${product.price}
                        </span> {product.originalPrice && (
                          <span className="text-muted-foreground line-through text-sm">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground hover:text-primary"
                        asChild
                      >
                        <Link to={`/product/${product.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </FadeInSection>
            )})}
          </div>
          {loading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No products found in this category.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => handleCategoryChange('all')}
              >
                View All Products
              </Button>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default Shop;
