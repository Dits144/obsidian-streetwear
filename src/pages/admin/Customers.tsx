import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Customer {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id, full_name, phone, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setCustomers(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase mb-6">Customers</h1>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 bg-secondary animate-pulse" />)}</div>
      ) : customers.length === 0 ? (
        <p className="text-muted-foreground text-sm">No customers yet</p>
      ) : (
        <div className="border border-border overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="text-left p-3 text-xs uppercase tracking-widest text-muted-foreground">Name</th>
                <th className="text-left p-3 text-xs uppercase tracking-widest text-muted-foreground">Phone</th>
                <th className="text-right p-3 text-xs uppercase tracking-widest text-muted-foreground">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id} className="border-b border-border">
                  <td className="p-3 font-medium">{c.full_name || "Unnamed"}</td>
                  <td className="p-3 text-muted-foreground">{c.phone || "-"}</td>
                  <td className="p-3 text-right text-muted-foreground">{new Date(c.created_at).toLocaleDateString("id-ID")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
