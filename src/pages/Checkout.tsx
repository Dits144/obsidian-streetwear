import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const shippingMethods = [
  { id: "standard", name: "Standard Shipping", price: 25000, days: "3-5 business days" },
  { id: "express", name: "Express Shipping", price: 50000, days: "1-2 business days" },
];

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: "", phone: "", address: "", city: "", province: "", postalCode: "" });
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const shipping = shippingMethods.find(m => m.id === shippingMethod)!;
  const total = subtotal - discount + shipping.price;

  const applyCoupon = async () => {
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", couponCode.toUpperCase())
      .eq("active", true)
      .single();

    if (error || !data) {
      toast({ title: "Invalid coupon", variant: "destructive" });
      return;
    }

    if (subtotal < (data.min_purchase || 0)) {
      toast({ title: `Minimum purchase ${formatPrice(data.min_purchase || 0)}`, variant: "destructive" });
      return;
    }

    if (data.usage_limit && data.used_count >= data.usage_limit) {
      toast({ title: "Coupon has been fully used", variant: "destructive" });
      return;
    }

    const discountAmount = data.type === "percent" ? subtotal * (Number(data.value) / 100) : Number(data.value);
    setDiscount(Math.min(discountAmount, subtotal));
    setCouponApplied(data.code);
    toast({ title: `Coupon applied! -${formatPrice(discountAmount)}` });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          subtotal,
          shipping_cost: shipping.price,
          discount,
          total,
          shipping_method: shippingMethod,
          coupon_code: couponApplied || null,
          shipping_address: {
            full_name: form.fullName,
            phone: form.phone,
            address: form.address,
            city: form.city,
            province: form.province,
            postal_code: form.postalCode,
          },
        })
        .select("id")
        .single();

      if (orderErr) throw orderErr;

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        variant_id: item.variantId || null,
        quantity: item.quantity,
        price_snapshot: item.product.price,
        product_snapshot: {
          name: item.product.name,
          image: item.product.image,
          size: item.size,
          color: item.color,
        },
      }));

      const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
      if (itemsErr) throw itemsErr;

      // Reduce stock
      for (const item of items) {
        if (item.variantId) {
          const newStock = Math.max(0, item.variantStock - item.quantity);
          await supabase
            .from("product_variants")
            .update({ stock: newStock })
            .eq("id", item.variantId);
        }
      }

      // Update coupon usage
      if (couponApplied) {
        const { data: coupon } = await supabase.from("coupons").select("used_count").eq("code", couponApplied).single();
        if (coupon) {
          await supabase.from("coupons").update({ used_count: coupon.used_count + 1 }).eq("code", couponApplied);
        }
      }

      clearCart();
      toast({ title: "Order placed successfully!" });
      navigate(`/order-success/${order.id}`);
    } catch (err: any) {
      toast({ title: "Checkout failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <main className="container py-8 md:py-12">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="font-display text-3xl font-bold uppercase mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="font-display text-lg font-bold uppercase mb-4">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Full Name", field: "fullName", span: 2 },
                    { label: "Phone", field: "phone", span: 2 },
                    { label: "Address", field: "address", span: 2 },
                    { label: "City", field: "city", span: 1 },
                    { label: "Province", field: "province", span: 1 },
                    { label: "Postal Code", field: "postalCode", span: 1 },
                  ].map(f => (
                    <div key={f.field} className={f.span === 2 ? "col-span-2" : ""}>
                      <label className="text-xs font-semibold uppercase tracking-widest block mb-2">{f.label}</label>
                      <input type="text" required value={(form as any)[f.field]} onChange={updateField(f.field)}
                        className="w-full h-11 px-4 border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-display text-lg font-bold uppercase mb-4">Shipping Method</h2>
                <div className="space-y-2">
                  {shippingMethods.map(m => (
                    <label key={m.id} className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${shippingMethod === m.id ? "border-foreground bg-accent" : "border-border"}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="shipping" value={m.id} checked={shippingMethod === m.id} onChange={() => setShippingMethod(m.id)} className="accent-foreground" />
                        <div>
                          <p className="text-sm font-medium">{m.name}</p>
                          <p className="text-xs text-muted-foreground">{m.days}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold">{formatPrice(m.price)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-secondary p-6 space-y-4">
                <h2 className="font-display text-lg font-bold uppercase mb-4">Order Summary</h2>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {items.map(item => (
                    <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex justify-between text-sm">
                      <span className="truncate flex-1">{item.product.name} × {item.quantity}</span>
                      <span className="ml-2">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{formatPrice(shipping.price)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-destructive">
                      <span>Discount ({couponApplied})</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                </div>

                {!couponApplied && (
                  <div className="flex gap-2">
                    <input type="text" placeholder="Coupon code" value={couponCode} onChange={e => setCouponCode(e.target.value)}
                      className="flex-1 h-10 px-3 border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground" />
                    <Button type="button" variant="outline" size="sm" onClick={applyCoupon}>Apply</Button>
                  </div>
                )}

                <div className="border-t border-border pt-3 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <Button type="submit" className="w-full h-14 text-sm uppercase tracking-widest font-semibold" disabled={loading}>
                  {loading ? "Processing..." : "Place Order"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </main>
  );
}
