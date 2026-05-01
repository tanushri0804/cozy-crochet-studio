import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { wishlistAPI } from '@/lib/api';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Load wishlist on mount when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated]);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const data = await wishlistAPI.getWishlist();
      setWishlist(data.wishlist || []);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const addToWishlist = useCallback(async (product) => {
    if (!isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to add items to your wishlist",
        variant: "destructive",
      });
      return false;
    }

    try {
      const data = await wishlistAPI.addToWishlist(product.id);
      setWishlist(prev => [...prev, data.item]);
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist`,
      });
      return true;
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add to wishlist",
        variant: "destructive",
      });
      return false;
    }
  }, [isAuthenticated, toast]);

  const removeFromWishlist = useCallback(async (productId) => {
    if (!isAuthenticated) return false;

    try {
      await wishlistAPI.removeFromWishlist(productId);
      setWishlist(prev => prev.filter(item => item.productId !== productId));
      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist",
      });
      return true;
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove from wishlist",
        variant: "destructive",
      });
      return false;
    }
  }, [isAuthenticated, toast]);

  const isInWishlist = useCallback((productId) => {
    return wishlist.some(item => item.productId === productId);
  }, [wishlist]);

  const toggleWishlist = useCallback(async (product) => {
    if (isInWishlist(product.id)) {
      return await removeFromWishlist(product.id);
    } else {
      return await addToWishlist(product);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  const wishlistCount = wishlist.length;

  const value = {
    wishlist,
    wishlistCount,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    fetchWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
