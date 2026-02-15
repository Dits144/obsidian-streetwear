import { useParams, Link } from "react-router-dom";
import { products, formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product/ProductCard";
import { useState } from "react";
import { Minus, Plus, Star, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find(p => p.slug === slug);
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-display font-bold mb-4">Product not found</h1>
        <Button asChild variant="outline"><Link to="/shop">Back to Shop</Link></Button>
      </div>
    );
  }

  const related = products.filter(p => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;
    addItem(product, selectedSize, selectedColor, quantity);
  };

  return (
    <main className="container py-6 md:py-12">
      {/* Breadcrumb */}
      <Link to="/shop" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="h-3.5 w-3.5" /> Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-8 md:gap-16">
        {/* Image */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative aspect-[3/4] bg-secondary flex items-center justify-center">
          <span className="font-display text-5xl font-extrabold uppercase text-muted-foreground/15 select-none">{product.category}</span>
          {product.badge && (
            <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5">{product.badge}</span>
          )}
        </motion.div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex flex-col">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{product.category}</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold uppercase mb-3">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-foreground" />
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-xs text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-base text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span>
              )}
            </div>
          </div>

          {/* Size */}
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(s => (
                <button key={s} onClick={() => setSelectedSize(s)} className={`min-w-[48px] h-10 px-3 border text-sm font-medium transition-colors ${selectedSize === s ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3">Color</p>
            <div className="flex gap-2">
              {product.colors.map(c => (
                <button key={c.name} onClick={() => setSelectedColor(c.name)} className={`flex items-center gap-2 px-3 h-10 border text-sm transition-colors ${selectedColor === c.name ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent"}`}>
                  <span className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: c.hex }} />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3">Quantity</p>
            <div className="inline-flex items-center border border-border">
              <button className="p-3 hover:bg-accent" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="h-3.5 w-3.5" /></button>
              <span className="px-5 text-sm font-medium">{quantity}</span>
              <button className="p-3 hover:bg-accent" onClick={() => setQuantity(quantity + 1)}><Plus className="h-3.5 w-3.5" /></button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{product.stock} in stock</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <Button
              className="flex-1 h-14 text-sm uppercase tracking-widest font-semibold"
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedColor}
            >
              Add to Cart
            </Button>
          </div>

          {(!selectedSize || !selectedColor) && (
            <p className="text-xs text-muted-foreground -mt-4 mb-6">Please select size and color</p>
          )}

          {/* Tabs */}
          <Tabs defaultValue="description" className="mt-auto">
            <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start gap-6 h-auto p-0">
              <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-0 pb-3 text-xs uppercase tracking-widest">Description</TabsTrigger>
              <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-0 pb-3 text-xs uppercase tracking-widest">Details</TabsTrigger>
              <TabsTrigger value="shipping" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-0 pb-3 text-xs uppercase tracking-widest">Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-4">
              <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            </TabsContent>
            <TabsContent value="details" className="pt-4">
              <ul className="text-sm text-muted-foreground space-y-2">
                <li><span className="font-medium text-foreground">Material:</span> {product.material}</li>
                <li><span className="font-medium text-foreground">Sizes:</span> {product.sizes.join(", ")}</li>
                <li><span className="font-medium text-foreground">Colors:</span> {product.colors.map(c => c.name).join(", ")}</li>
              </ul>
            </TabsContent>
            <TabsContent value="shipping" className="pt-4">
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>Standard Shipping: 3-5 business days</li>
                <li>Express Shipping: 1-2 business days</li>
                <li>Free returns within 14 days</li>
              </ul>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold uppercase mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </main>
  );
}
