import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  user_id: string;
  status: string;
  subtotal: number;
  shipping_cost: number;
  discount: number;
  total: number;
  shipping_address: any;
  shipping_method: string;
  coupon_code: string | null;
  created_at: string;
  order_items: { id: string; quantity: number; price_snapshot: number; product_snapshot: any }[];
}

const statuses = ["pending", "paid", "shipped", "delivered", "cancelled"];
const statusColors: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  paid: "bg-accent text-accent-foreground",
  shipped: "bg-primary/10 text-foreground",
  delivered: "bg-foreground text-background",
  cancelled: "bg-destructive/10 text-destructive",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  const fetchOrders = async () => {
    let q = supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
    if (filterStatus) q = q.eq("status", filterStatus);
    const { data } = await q;
    setOrders((data || []) as Order[]);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [filterStatus]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    toast({ title: `Order updated to ${newStatus}` });
    fetchOrders();
    if (selectedOrder?.id === orderId) setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold uppercase">Orders</h1>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="h-9 px-3 border border-border text-xs bg-background">
          <option value="">All Status</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-secondary animate-pulse" />)}</div>
      ) : orders.length === 0 ? (
        <p className="text-muted-foreground text-sm">No orders found</p>
      ) : (
        <div className="border border-border overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="text-left p-3 text-xs uppercase tracking-widest text-muted-foreground">Order</th>
                <th className="text-left p-3 text-xs uppercase tracking-widest text-muted-foreground">Customer</th>
                <th className="text-left p-3 text-xs uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="text-right p-3 text-xs uppercase tracking-widest text-muted-foreground">Total</th>
                <th className="text-right p-3 text-xs uppercase tracking-widest text-muted-foreground">Date</th>
                <th className="text-right p-3 text-xs uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-b border-border cursor-pointer hover:bg-accent/50" onClick={() => setSelectedOrder(o)}>
                  <td className="p-3 font-medium">#{o.id.slice(0, 8)}</td>
                  <td className="p-3 text-muted-foreground">{o.shipping_address?.full_name || "-"}</td>
                  <td className="p-3">
                    <span className={`text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 ${statusColors[o.status]}`}>{o.status}</span>
                  </td>
                  <td className="p-3 text-right font-medium">{formatPrice(o.total)}</td>
                  <td className="p-3 text-right text-muted-foreground">{new Date(o.created_at).toLocaleDateString("id-ID")}</td>
                  <td className="p-3 text-right" onClick={e => e.stopPropagation()}>
                    <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                      className="h-8 px-2 border border-border text-xs bg-background">
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display uppercase">Order #{selectedOrder?.id.slice(0, 8)}</DialogTitle></DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 ${statusColors[selectedOrder.status]}`}>{selectedOrder.status}</span>
                <span className="text-xs text-muted-foreground">{new Date(selectedOrder.created_at).toLocaleString("id-ID")}</span>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-2">Shipping</h3>
                <p className="text-sm">{selectedOrder.shipping_address?.full_name}</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.shipping_address?.address}, {selectedOrder.shipping_address?.city}</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.shipping_address?.province} {selectedOrder.shipping_address?.postal_code}</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.shipping_address?.phone}</p>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-2">Items</h3>
                {selectedOrder.order_items?.map(item => (
                  <div key={item.id} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
                    <span>{item.product_snapshot?.name} × {item.quantity} {item.product_snapshot?.size && `(${item.product_snapshot.size})`}</span>
                    <span>{formatPrice(item.price_snapshot * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 pt-2 border-t border-border">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(selectedOrder.subtotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span>{formatPrice(selectedOrder.shipping_cost)}</span></div>
                {selectedOrder.discount > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Discount</span><span>-{formatPrice(selectedOrder.discount)}</span></div>}
                <div className="flex justify-between font-semibold pt-1"><span>Total</span><span>{formatPrice(selectedOrder.total)}</span></div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-1">Update Status</label>
                <select value={selectedOrder.status} onChange={e => updateStatus(selectedOrder.id, e.target.value)}
                  className="w-full h-10 px-3 border border-border bg-background text-sm">
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
