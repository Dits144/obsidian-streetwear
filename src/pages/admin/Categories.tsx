import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Category { id: string; name: string; slug: string; sort_order: number }

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const { toast } = useToast();

  const fetch = async () => {
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    setCategories(data || []);
  };
  useEffect(() => { fetch(); }, []);

  const openNew = () => { setEditId(null); setName(""); setSlug(""); setSortOrder(categories.length); setDialogOpen(true); };
  const openEdit = (c: Category) => { setEditId(c.id); setName(c.name); setSlug(c.slug); setSortOrder(c.sort_order); setDialogOpen(true); };

  const handleSave = async () => {
    const payload = { name, slug: slug || name.toLowerCase().replace(/\s+/g, "-"), sort_order: sortOrder };
    if (editId) {
      await supabase.from("categories").update(payload).eq("id", editId);
      toast({ title: "Category updated" });
    } else {
      await supabase.from("categories").insert(payload);
      toast({ title: "Category created" });
    }
    setDialogOpen(false);
    fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await supabase.from("categories").delete().eq("id", id);
    toast({ title: "Category deleted" });
    fetch();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold uppercase">Categories</h1>
        <Button onClick={openNew} size="sm"><Plus className="h-4 w-4 mr-2" /> Add Category</Button>
      </div>

      <div className="border border-border">
        {categories.map(c => (
          <div key={c.id} className="flex items-center justify-between p-4 border-b border-border last:border-0">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-muted-foreground">/{c.slug} · Order: {c.sort_order}</p>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}><Pencil className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        ))}
        {categories.length === 0 && <p className="text-muted-foreground text-sm p-4">No categories</p>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display uppercase">{editId ? "Edit" : "New"} Category</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest block mb-1">Name</label>
              <input type="text" value={name} onChange={e => { setName(e.target.value); if (!editId) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-")); }}
                className="w-full h-10 px-3 border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest block mb-1">Slug</label>
              <input type="text" value={slug} onChange={e => setSlug(e.target.value)}
                className="w-full h-10 px-3 border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest block mb-1">Sort Order</label>
              <input type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))}
                className="w-full h-10 px-3 border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground" />
            </div>
            <Button onClick={handleSave} className="w-full h-12 text-sm uppercase tracking-widest font-semibold">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
