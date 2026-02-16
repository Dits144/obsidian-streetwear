import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/hooks/useProducts";
import { getProductImage } from "@/data/productImages";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  status: string;
  badge: string | null;
  category: { name: string } | null;
  product_variants: { stock: number }[];
}

interface ProductForm {
  name: string;
  slug: string;
  description: string;
  material: string;
  price: string;
  compare_at_price: string;
  category_id: string;
  status: string;
  badge: string;
}

const emptyForm: ProductForm = { name: "", slug: "", description: "", material: "", price: "", compare_at_price: "", category_id: "", status: "active", badge: "" };

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const { toast } = useToast();

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("id, name, slug, price, status, badge, category:categories(name), product_variants(stock)").order("created_at", { ascending: false });
    setProducts((data || []) as Product[]);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("id, name").order("sort_order");
    setCategories(data || []);
  };

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  const openNew = () => { setEditId(null); setForm(emptyForm); setDialogOpen(true); };

  const openEdit = async (id: string) => {
    const { data } = await supabase.from("products").select("*").eq("id", id).single();
    if (data) {
      setEditId(id);
      setForm({
        name: data.name,
        slug: data.slug,
        description: data.description || "",
        material: data.material || "",
        price: String(data.price),
        compare_at_price: data.compare_at_price ? String(data.compare_at_price) : "",
        category_id: data.category_id || "",
        status: data.status,
        badge: data.badge || "",
      });
      setDialogOpen(true);
    }
  };

  const handleSave = async () => {
    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      description: form.description,
      material: form.material,
      price: Number(form.price),
      compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
      category_id: form.category_id || null,
      status: form.status,
      badge: form.badge || null,
    };

    if (editId) {
      const { error } = await supabase.from("products").update(payload).eq("id", editId);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Product updated!" });
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Product created!" });
    }
    setDialogOpen(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    toast({ title: "Product deleted" });
    fetchProducts();
  };

  const totalStock = (variants: { stock: number }[]) => variants.reduce((s, v) => s + v.stock, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold uppercase">Products</h1>
        <Button onClick={openNew} size="sm"><Plus className="h-4 w-4 mr-2" /> Add Product</Button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-secondary animate-pulse" />)}</div>
      ) : (
        <div className="border border-border overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="text-left p-3 text-xs uppercase tracking-widest text-muted-foreground">Product</th>
                <th className="text-left p-3 text-xs uppercase tracking-widest text-muted-foreground">Category</th>
                <th className="text-left p-3 text-xs uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="text-right p-3 text-xs uppercase tracking-widest text-muted-foreground">Price</th>
                <th className="text-right p-3 text-xs uppercase tracking-widest text-muted-foreground">Stock</th>
                <th className="text-right p-3 text-xs uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-border">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={getProductImage(p.slug)} alt="" className="w-10 h-12 object-cover bg-secondary" />
                      <div>
                        <p className="font-medium">{p.name}</p>
                        {p.badge && <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{p.badge}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{p.category?.name || "-"}</td>
                  <td className="p-3"><span className={`text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 ${p.status === "active" ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}>{p.status}</span></td>
                  <td className="p-3 text-right">{formatPrice(p.price)}</td>
                  <td className="p-3 text-right">{totalStock(p.product_variants || [])}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p.id)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display uppercase">{editId ? "Edit" : "New"} Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {[
              { label: "Name", field: "name", type: "text" },
              { label: "Slug", field: "slug", type: "text" },
              { label: "Description", field: "description", type: "textarea" },
              { label: "Material", field: "material", type: "text" },
              { label: "Price (IDR)", field: "price", type: "number" },
              { label: "Compare At Price", field: "compare_at_price", type: "number" },
            ].map(f => (
              <div key={f.field}>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-1">{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea value={(form as any)[f.field]} onChange={e => setForm(prev => ({ ...prev, [f.field]: e.target.value }))}
                    className="w-full h-20 px-3 py-2 border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground resize-none" />
                ) : (
                  <input type={f.type} value={(form as any)[f.field]} onChange={e => setForm(prev => ({ ...prev, [f.field]: e.target.value }))}
                    className="w-full h-10 px-3 border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground" />
                )}
              </div>
            ))}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest block mb-1">Category</label>
              <select value={form.category_id} onChange={e => setForm(prev => ({ ...prev, category_id: e.target.value }))}
                className="w-full h-10 px-3 border border-border bg-background text-sm">
                <option value="">None</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full h-10 px-3 border border-border bg-background text-sm">
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-1">Badge</label>
                <select value={form.badge} onChange={e => setForm(prev => ({ ...prev, badge: e.target.value }))}
                  className="w-full h-10 px-3 border border-border bg-background text-sm">
                  <option value="">None</option>
                  <option value="New">New</option>
                  <option value="Limited">Limited</option>
                  <option value="Best Seller">Best Seller</option>
                </select>
              </div>
            </div>
            <Button onClick={handleSave} className="w-full h-12 text-sm uppercase tracking-widest font-semibold">
              {editId ? "Update" : "Create"} Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
