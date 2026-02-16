import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  min_purchase: number;
  usage_limit: number;
  used_count: number;
  active: boolean;
}

export default function AdminPromotions() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ code: "", type: "percent", value: "", min_purchase: "0", usage_limit: "0", active: true });
  const { toast } = useToast();

  const fetchCoupons = async () => {
    const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    setCoupons((data || []) as Coupon[]);
  };
  useEffect(() => { fetchCoupons(); }, []);

  const openNew = () => { setEditId(null); setForm({ code: "", type: "percent", value: "", min_purchase: "0", usage_limit: "0", active: true }); setDialogOpen(true); };

  const openEdit = (c: Coupon) => {
    setEditId(c.id);
    setForm({ code: c.code, type: c.type, value: String(c.value), min_purchase: String(c.min_purchase), usage_limit: String(c.usage_limit), active: c.active });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload = { code: form.code.toUpperCase(), type: form.type, value: Number(form.value), min_purchase: Number(form.min_purchase), usage_limit: Number(form.usage_limit), active: form.active };
    if (editId) {
      await supabase.from("coupons").update(payload).eq("id", editId);
      toast({ title: "Coupon updated" });
    } else {
      await supabase.from("coupons").insert(payload);
      toast({ title: "Coupon created" });
    }
    setDialogOpen(false);
    fetchCoupons();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    await supabase.from("coupons").delete().eq("id", id);
    toast({ title: "Coupon deleted" });
    fetchCoupons();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold uppercase">Promotions</h1>
        <Button onClick={openNew} size="sm"><Plus className="h-4 w-4 mr-2" /> Add Coupon</Button>
      </div>

      <div className="border border-border overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary">
              <th className="text-left p-3 text-xs uppercase tracking-widest text-muted-foreground">Code</th>
              <th className="text-left p-3 text-xs uppercase tracking-widest text-muted-foreground">Type</th>
              <th className="text-right p-3 text-xs uppercase tracking-widest text-muted-foreground">Value</th>
              <th className="text-right p-3 text-xs uppercase tracking-widest text-muted-foreground">Min Purchase</th>
              <th className="text-right p-3 text-xs uppercase tracking-widest text-muted-foreground">Usage</th>
              <th className="text-left p-3 text-xs uppercase tracking-widest text-muted-foreground">Status</th>
              <th className="text-right p-3 text-xs uppercase tracking-widest text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c.id} className="border-b border-border">
                <td className="p-3 font-medium font-mono">{c.code}</td>
                <td className="p-3 text-muted-foreground">{c.type}</td>
                <td className="p-3 text-right">{c.type === "percent" ? `${c.value}%` : formatPrice(c.value)}</td>
                <td className="p-3 text-right text-muted-foreground">{formatPrice(c.min_purchase)}</td>
                <td className="p-3 text-right">{c.used_count}/{c.usage_limit || "∞"}</td>
                <td className="p-3">
                  <span className={`text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 ${c.active ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}>
                    {c.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display uppercase">{editId ? "Edit" : "New"} Coupon</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest block mb-1">Code</label>
              <input type="text" value={form.code} onChange={e => setForm(prev => ({ ...prev, code: e.target.value }))}
                className="w-full h-10 px-3 border border-border bg-background text-sm font-mono uppercase focus:outline-none focus:ring-1 focus:ring-foreground" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-1">Type</label>
                <select value={form.type} onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full h-10 px-3 border border-border bg-background text-sm">
                  <option value="percent">Percent</option>
                  <option value="fixed">Fixed (IDR)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-1">Value</label>
                <input type="number" value={form.value} onChange={e => setForm(prev => ({ ...prev, value: e.target.value }))}
                  className="w-full h-10 px-3 border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-1">Min Purchase</label>
                <input type="number" value={form.min_purchase} onChange={e => setForm(prev => ({ ...prev, min_purchase: e.target.value }))}
                  className="w-full h-10 px-3 border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-1">Usage Limit</label>
                <input type="number" value={form.usage_limit} onChange={e => setForm(prev => ({ ...prev, usage_limit: e.target.value }))}
                  className="w-full h-10 px-3 border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground" />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e => setForm(prev => ({ ...prev, active: e.target.checked }))} className="accent-foreground" />
              <span className="text-sm">Active</span>
            </label>
            <Button onClick={handleSave} className="w-full h-12 text-sm uppercase tracking-widest font-semibold">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
