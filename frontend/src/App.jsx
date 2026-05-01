import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Layout wrapper component for consistent page structure
const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 pt-24">
      <div className="w-full">
        {children}
      </div>
    </main>
    <Footer />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={
                <Layout>
                  <Index />
                </Layout>
              } />
              <Route path="/shop" element={
                <Layout>
                  <Shop />
                </Layout>
              } />
              <Route path="/product/:id" element={
                <Layout>
                  <ProductDetail />
                </Layout>
              } />
              <Route path="/cart" element={
                <Layout>
                  <Cart />
                </Layout>
              } />
              <Route path="/auth" element={
                <Layout>
                  <Auth />
                </Layout>
              } />
              <Route path="/checkout" element={
                <Layout>
                  <Checkout />
                </Layout>
              } />
              <Route path="/order-confirmation/:orderId" element={
                <Layout>
                  <OrderConfirmation />
                </Layout>
              } />
              <Route path="/profile" element={
                <Layout>
                  <Profile />
                </Layout>
              } />
              <Route path="/wishlist" element={
                <Layout>
                  <Wishlist />
                </Layout>
              } />
              <Route path="/admin" element={
                <Layout>
                  <AdminDashboard />
                </Layout>
              } />
              <Route path="*" element={
                <Layout>
                  <NotFound />
                </Layout>
              } />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
