import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "New Arrivals", href: "/shop?sort=newest" },
  { label: "Best Sellers", href: "/shop?badge=best-seller" },
];

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart();
  const { user, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <nav className="container flex h-16 items-center justify-between">
        <button className="md:hidden p-2 -ml-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/" className="font-display text-xl font-extrabold tracking-tight uppercase">VOIDWEAR</Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(l => (
            <Link key={l.href} to={l.href} className="text-sm font-medium tracking-wide uppercase text-muted-foreground hover:text-foreground transition-colors">{l.label}</Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className="text-sm font-medium tracking-wide uppercase text-muted-foreground hover:text-foreground transition-colors">Admin</Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/shop" className="p-2 hover:bg-accent transition-colors" aria-label="Search"><Search className="h-5 w-5" /></Link>
          <button className="p-2 hover:bg-accent transition-colors relative" onClick={() => setIsOpen(true)} aria-label="Cart">
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold">{totalItems}</span>
            )}
          </button>
          <Link to={user ? "/profile" : "/auth"} className="p-2 hover:bg-accent transition-colors hidden md:block" aria-label="Account">
            <User className="h-5 w-5" />
          </Link>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border overflow-hidden bg-background">
            <div className="container py-4 flex flex-col gap-3">
              {navLinks.map(l => (
                <Link key={l.href} to={l.href} onClick={() => setMobileOpen(false)} className="text-sm font-medium uppercase tracking-wide py-2">{l.label}</Link>
              ))}
              <Link to={user ? "/profile" : "/auth"} onClick={() => setMobileOpen(false)} className="text-sm font-medium uppercase tracking-wide py-2">
                {user ? "Account" : "Sign In"}
              </Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-sm font-medium uppercase tracking-wide py-2">Admin</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
