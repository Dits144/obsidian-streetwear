import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/hooks/useProducts";
import { DollarSign, ShoppingBag, Users, AlertTriangle } from "lucide-react";

interface Stats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  lowStockItems: number;
}

interface RecentOrder {
  id: string;
  status: string;
  total: number;
  created_at: string;
  shipping_address: any;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalSales: 0, totalOrders: 0, totalCustomers: 0, lowStockItems: 0 });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [ordersRes, customersRes, lowStockRes] = await Promise.all([
        supabase.from("orders").select("total, status"),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("product_variants").select("id", { count: "exact", head: true }).lt("stock", 5),
      ]);

      const orders = ordersRes.data || [];
      const totalSales = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + Number(o.total), 0);

      setStats({
        totalSales,
        totalOrders: orders.length,
        totalCustomers: customersRes.count || 0,
        lowStockItems: lowStockRes.count || 0,
      });

      const { data: recent } = await supabase
        .from("orders")
        .select("id, status, total, created_at, shipping_address")
        .order("created_at", { ascending: false })
        .limit(10);
      setRecentOrders((recent || []) as RecentOrder[]);
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Sales", value: formatPrice(stats.totalSales), icon: DollarSign },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag },
    { label: "Customers", value: stats.totalCustomers, icon: Users },
    { label: "Low Stock", value: stats.lowStockItems, icon: AlertTriangle },
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-muted text-muted-foreground",
    paid: "bg-accent text-accent-foreground",
    shipped: "bg-primary/10 text-foreground",
    delivered: "bg-foreground text-background",
    cancelled: "bg-destructive/10 text-destructive",
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className="border border-border p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</span>
              <c.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xl md:text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-lg font-bold uppercase mb-4">Recent Orders</h2>
      {recentOrders.length === 0 ? (
        <p className="text-muted-foreground text-sm">No orders yet</p>
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
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id} className="border-b border-border">
                  <td className="p-3 font-medium">#{o.id.slice(0, 8)}</td>
                  <td className="p-3 text-muted-foreground">{o.shipping_address?.full_name || "-"}</td>
                  <td className="p-3">
                    <span className={`text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 ${statusColors[o.status] || ""}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-3 text-right font-medium">{formatPrice(o.total)}</td>
                  <td className="p-3 text-right text-muted-foreground">{new Date(o.created_at).toLocaleDateString("id-ID")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
