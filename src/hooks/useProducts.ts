import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getProductImage } from "@/data/productImages";

export interface DBProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  material: string | null;
  price: number;
  compare_at_price: number | null;
  category_id: string | null;
  status: string;
  badge: string | null;
  tags: string[];
  rating: number;
  review_count: number;
  created_at: string;
  category?: { id: string; name: string; slug: string } | null;
  product_images?: { id: string; url: string; sort_order: number }[];
  product_variants?: { id: string; size: string; color: string; color_hex: string; stock: number }[];
}

export interface DBCategory {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  sort_order: number;
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as DBCategory[];
    },
  });
}

export function useProducts(filters?: { category?: string; search?: string; sort?: string }) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select(`
          *,
          category:categories(id, name, slug),
          product_images(id, url, sort_order),
          product_variants(id, size, color, color_hex, stock)
        `)
        .eq("status", "active");

      if (filters?.category) {
        const { data: cat } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", filters.category)
          .single();
        if (cat) query = query.eq("category_id", cat.id);
      }

      if (filters?.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }

      switch (filters?.sort) {
        case "price-asc": query = query.order("price", { ascending: true }); break;
        case "price-desc": query = query.order("price", { ascending: false }); break;
        case "best-seller": query = query.order("review_count", { ascending: false }); break;
        default: query = query.order("created_at", { ascending: false }); break;
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as DBProduct[];
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          category:categories(id, name, slug),
          product_images(id, url, sort_order),
          product_variants(id, size, color, color_hex, stock)
        `)
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data as DBProduct;
    },
    enabled: !!slug,
  });
}

export function getImageUrl(product: DBProduct): string {
  if (product.product_images && product.product_images.length > 0) {
    const img = product.product_images.sort((a, b) => a.sort_order - b.sort_order)[0];
    if (img.url && !img.url.includes("placeholder")) return img.url;
  }
  return getProductImage(product.slug);
}

export function getUniqueColors(variants: DBProduct["product_variants"]): { name: string; hex: string }[] {
  if (!variants) return [];
  const seen = new Set<string>();
  return variants.filter(v => {
    if (seen.has(v.color)) return false;
    seen.add(v.color);
    return true;
  }).map(v => ({ name: v.color, hex: v.color_hex }));
}

export function getUniqueSizes(variants: DBProduct["product_variants"]): string[] {
  if (!variants) return [];
  const seen = new Set<string>();
  return variants.filter(v => {
    if (seen.has(v.size)) return false;
    seen.add(v.size);
    return true;
  }).map(v => v.size);
}

export function getTotalStock(variants: DBProduct["product_variants"]): number {
  if (!variants) return 0;
  return variants.reduce((s, v) => s + v.stock, 0);
}

export function getVariantStock(variants: DBProduct["product_variants"], size: string, color: string): number {
  if (!variants) return 0;
  const v = variants.find(v => v.size === size && v.color === color);
  return v?.stock ?? 0;
}

export function getVariantId(variants: DBProduct["product_variants"], size: string, color: string): string | null {
  if (!variants) return null;
  const v = variants.find(v => v.size === size && v.color === color);
  return v?.id ?? null;
}

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
