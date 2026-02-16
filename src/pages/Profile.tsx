import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Package, User, MapPin, LogOut } from "lucide-react";

interface Order {
  id: string;
  status: string;
  total: number;
  created_at: string;
  shipping_address: any;
  order_items: { id: string; quantity: number; price_snapshot: number; product_snapshot: any }[];
}

export default function ProfilePage() {
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders((data || []) as Order[]);
        setLoadingOrders(false);
      });
  }, [user]);

  const updateProfile = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ full_name: fullName, phone }).eq("id", user.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Profile updated!" });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const statusColors: Record<string, string> = {
    pending: "bg-muted text-muted-foreground",
    paid: "bg-accent text-accent-foreground",
    shipped: "bg-primary/10 text-foreground",
    delivered: "bg-foreground text-background",
    cancelled: "bg-destructive/10 text-destructive",
  };

  if (authLoading || !user) return null;

  return (
    <main className="container py-8 md:py-12">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold uppercase">My Account</h1>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>

        <Tabs defaultValue="orders">
          <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start gap-6 h-auto p-0 mb-8">
            <TabsTrigger value="orders" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-0 pb-3 text-xs uppercase tracking-widest">
              <Package className="h-3.5 w-3.5 mr-2" /> Orders
            </TabsTrigger>
            <TabsTrigger value="profile" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-0 pb-3 text-xs uppercase tracking-widest">
              <User className="h-3.5 w-3.5 mr-2" /> Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            {loadingOrders ? (
              <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-24 bg-secondary animate-pulse" />)}</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" strokeWidth={1} />
                <p className="text-muted-foreground mb-4">No orders yet</p>
                <Button asChild><Link to="/shop">Start Shopping</Link></Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border border-border p-4 md:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">#{order.id.slice(0, 8)}</span>
                        <span className={`text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 ${statusColors[order.status] || ""}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{formatPrice(order.total)}</p>
                        <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString("id-ID")}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {order.order_items?.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.product_snapshot?.name || "Product"} × {item.quantity}
                            {item.product_snapshot?.size && ` (${item.product_snapshot.size}/${item.product_snapshot.color})`}
                          </span>
                          <span>{formatPrice(item.price_snapshot * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <div className="max-w-md space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-2">Email</label>
                <input type="email" value={user.email || ""} disabled
                  className="w-full h-11 px-4 border border-border bg-muted text-sm text-muted-foreground" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-2">Full Name</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                  className="w-full h-11 px-4 border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-2">Phone</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full h-11 px-4 border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground" />
              </div>
              <Button onClick={updateProfile} className="h-12 px-8 text-sm uppercase tracking-widest font-semibold">
                Save Changes
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </main>
  );
}
