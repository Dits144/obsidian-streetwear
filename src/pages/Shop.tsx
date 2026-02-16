import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts, useCategories, type DBProduct, getImageUrl } from "@/hooks/useProducts";
import ProductCard from "@/components/product/ProductCard";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Best Seller", value: "best-seller" },
  { label: "Price: Low → High", value: "price-asc" },
  { label: "Price: High → Low", value: "price-desc" },
];

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [filterOpen, setFilterOpen] = useState(false);

  const { data: categories = [] } = useCategories();
  const { data: products = [], isLoading } = useProducts({
    category: selectedCategory,
    search: search || undefined,
    sort,
  });

  const clearFilters = () => { setSearch(""); setSelectedCategory(""); setSort("newest"); };

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Category</h4>
        <div className="space-y-1.5">
          <button onClick={() => setSelectedCategory("")} className={`block text-sm w-full text-left py-1.5 px-2 transition-colors ${!selectedCategory ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>All</button>
          {categories.map(c => (
            <button key={c.id} onClick={() => setSelectedCategory(c.slug)} className={`block text-sm w-full text-left py-1.5 px-2 transition-colors ${selectedCategory === c.slug ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>{c.name}</button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Sort By</h4>
        <div className="space-y-1.5">
          {sortOptions.map(o => (
            <button key={o.value} onClick={() => setSort(o.value)} className={`block text-sm w-full text-left py-1.5 px-2 transition-colors ${sort === o.value ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>{o.label}</button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <main className="container py-8 md:py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase mb-2">Shop</h1>
        <p className="text-sm text-muted-foreground">{products.length} products</p>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground" />
        </div>
        <div className="hidden md:flex items-center gap-2">
          {categories.map(c => (
            <button key={c.id} onClick={() => setSelectedCategory(selectedCategory === c.slug ? "" : c.slug)} className={`text-xs uppercase tracking-wide px-3 py-2 border transition-colors ${selectedCategory === c.slug ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent"}`}>
              {c.name}
            </button>
          ))}
          <select value={sort} onChange={e => setSort(e.target.value)} className="h-9 px-3 border border-border text-xs bg-background">
            {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" className="h-11 w-11">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh]">
            <SheetHeader><SheetTitle className="font-display uppercase">Filters</SheetTitle></SheetHeader>
            <div className="py-4"><FilterContent /></div>
            <Button className="w-full mt-4" onClick={() => setFilterOpen(false)}>Apply Filters</Button>
          </SheetContent>
        </Sheet>
      </div>

      {(selectedCategory || search) && (
        <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1">
          <X className="h-3 w-3" /> Clear filters
        </button>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i}><Skeleton className="aspect-[3/4] mb-3" /><Skeleton className="h-4 w-3/4 mb-2" /><Skeleton className="h-4 w-1/3" /></div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-muted-foreground mb-4">No products found</p>
          <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}
    </main>
  );
}
