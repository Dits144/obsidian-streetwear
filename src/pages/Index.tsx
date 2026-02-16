import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProducts, useCategories, formatPrice, getImageUrl } from "@/hooks/useProducts";
import ProductCard from "@/components/product/ProductCard";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Clock, Truck } from "lucide-react";
import heroImage from "@/assets/hero-fashion.jpg";
import { Skeleton } from "@/components/ui/skeleton";

const trustBadges = [
  { icon: Shield, title: "Premium Quality", desc: "280gsm+ heavyweight fabrics" },
  { icon: Clock, title: "Limited Drops", desc: "Exclusive, small-batch releases" },
  { icon: Truck, title: "Fast Shipping", desc: "2-4 day delivery nationwide" },
];

export default function HomePage() {
  const { data: categories = [] } = useCategories();
  const { data: products = [], isLoading } = useProducts({ sort: "best-seller" });

  const bestSellers = products.filter(p => p.badge === "Best Seller" || p.rating >= 4.7).slice(0, 4);
  const newArrivals = products.filter(p => p.badge === "New" || p.badge === "Limited").slice(0, 4);

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="VOIDWEAR Premium Streetwear" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
        </div>
        <div className="container relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">New Collection 2026</p>
            <h1 className="text-5xl md:text-7xl font-display font-extrabold uppercase leading-[0.9] mb-6">Wear<br />The Void</h1>
            <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-md leading-relaxed">Premium streetwear essentials. Designed for those who move differently.</p>
            <Button asChild size="lg" className="h-14 px-10 text-sm uppercase tracking-widest font-semibold">
              <Link to="/shop">Shop Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-20">
        <h2 className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground mb-10">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Link to={`/shop?category=${cat.slug}`} className="group block">
                <div className="aspect-square bg-secondary flex items-center justify-center group-hover:bg-accent transition-colors duration-300">
                  <span className="font-display text-lg font-bold uppercase tracking-tight group-hover:scale-105 transition-transform">{cat.name}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="container pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase">Best Sellers</h2>
          <Link to="/shop?sort=best-seller" className="text-sm uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1,2,3,4].map(i => <div key={i}><Skeleton className="aspect-[3/4] mb-3" /><Skeleton className="h-4 w-3/4" /></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {bestSellers.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </section>

      {/* New Arrivals */}
      <section className="container pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase">New Arrivals</h2>
          <Link to="/shop?sort=newest" className="text-sm uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1,2,3,4].map(i => <div key={i}><Skeleton className="aspect-[3/4] mb-3" /><Skeleton className="h-4 w-3/4" /></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </section>

      {/* Brand Story + Trust */}
      <section className="bg-secondary">
        <div className="container py-20">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold uppercase mb-6">Built Different</h2>
            <p className="text-muted-foreground leading-relaxed">VOIDWEAR is born from the intersection of minimal design and street culture. Every piece is crafted with heavyweight materials, considered construction, and a relentless focus on quality over quantity.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {trustBadges.map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <b.icon className="h-8 w-8 mx-auto mb-4 text-foreground" strokeWidth={1.5} />
                <h3 className="font-display text-sm font-bold uppercase tracking-wide mb-2">{b.title}</h3>
                <p className="text-xs text-muted-foreground">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container py-20">
        <div className="max-w-md mx-auto text-center">
          <h2 className="font-display text-2xl font-bold uppercase mb-3">Stay in the Loop</h2>
          <p className="text-sm text-muted-foreground mb-6">Get early access to drops and exclusive content.</p>
          <form className="flex gap-2" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="your@email.com" className="flex-1 h-12 px-4 border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground" />
            <Button type="submit" className="h-12 px-6 text-sm uppercase tracking-widest font-semibold">Join</Button>
          </form>
        </div>
      </section>
    </main>
  );
}
