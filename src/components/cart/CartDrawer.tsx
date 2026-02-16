import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/hooks/useProducts";
import { Link } from "react-router-dom";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, subtotal } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
        <SheetHeader className="px-6 py-5 border-b border-border">
          <SheetTitle className="font-display text-lg uppercase tracking-tight">Cart ({items.length})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <Button onClick={() => setIsOpen(false)} asChild><Link to="/shop">Continue Shopping</Link></Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((item) => {
                const key = `${item.product.id}-${item.size}-${item.color}`;
                return (
                  <div key={key} className="flex gap-4">
                    <div className="w-20 h-24 bg-secondary flex-shrink-0 overflow-hidden">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium truncate">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.size} / {item.color}</p>
                        </div>
                        <button onClick={() => removeItem(item.product.id, item.size, item.color)} className="p-1 hover:bg-accent">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-border">
                          <button className="p-1.5 hover:bg-accent" onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-3 text-xs font-medium">{item.quantity}</span>
                          <button className="p-1.5 hover:bg-accent" onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-border px-6 py-5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shipping calculated at checkout</p>
              <Button className="w-full h-12 text-sm uppercase tracking-widest font-semibold" asChild onClick={() => setIsOpen(false)}>
                <Link to="/cart">Checkout</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
