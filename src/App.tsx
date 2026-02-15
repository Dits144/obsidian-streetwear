import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <CartProvider>
          <Toaster />
          <Sonner />
          <CartDrawer />
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </CartProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
