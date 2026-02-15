import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const shipping = subtotal > 500000 ? 0 : 25000;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <main className="container py-20 text-center">
        <h1 className="font-display text-3xl font-bold uppercase mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
        <Button asChild className="h-12 px-8 text-sm uppercase tracking-widest">
          <Link to="/shop">Continue Shopping</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="container py-8 md:py-12">
      <h1 className="font-display text-3xl md:text-4xl font-bold uppercase mb-8">Cart</h1>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 pb-3 border-b border-border text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <span>Product</span><span>Size / Color</span><span>Quantity</span><span>Total</span><span />
          </div>
          {items.map(item => {
            const key = `${item.product.id}-${item.size}-${item.color}`;
            return (
              <div key={key} className="grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center py-4 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-20 bg-secondary flex-shrink-0 flex items-center justify-center">
                    <span className="text-[8px] text-muted-foreground uppercase">{item.product.category}</span>
                  </div>
                  <div>
                    <Link to={`/product/${item.product.slug}`} className="text-sm font-medium hover:underline underline-offset-4">{item.product.name}</Link>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatPrice(item.product.price)}</p>
                  </div>
                </div>
                <p className="text-sm">{item.size} / {item.color}</p>
                <div className="inline-flex items-center border border-border w-fit">
                  <button className="p-2 hover:bg-accent" onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}><Minus className="h-3 w-3" /></button>
                  <span className="px-3 text-sm font-medium">{item.quantity}</span>
                  <button className="p-2 hover:bg-accent" onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}><Plus className="h-3 w-3" /></button>
                </div>
                <span className="text-sm font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                <button onClick={() => removeItem(item.product.id, item.size, item.color)} className="p-2 hover:bg-accent"><X className="h-4 w-4" /></button>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-secondary p-6 space-y-4">
            <h2 className="font-display text-lg font-bold uppercase mb-4">Order Summary</h2>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            {shipping > 0 && <p className="text-xs text-muted-foreground">Free shipping on orders over Rp500.000</p>}
            <div className="border-t border-border pt-4 flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Button className="w-full h-14 text-sm uppercase tracking-widest font-semibold mt-4" asChild>
              <Link to="/checkout">Checkout <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
