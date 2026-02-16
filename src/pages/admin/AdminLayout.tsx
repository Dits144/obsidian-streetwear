import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { LayoutDashboard, Package, Tag, ShoppingCart, Users, Ticket, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tag },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Promotions", href: "/admin/promotions", icon: Ticket },
];

export default function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/");
    }
  }, [user, isAdmin, loading]);

  if (loading || !user || !isAdmin) return null;

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Mobile toggle */}
      <button className="md:hidden fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground p-3 shadow-lg" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 w-60 bg-sidebar border-r border-sidebar-border transition-transform md:transition-none pt-16 md:pt-0`}>
        <div className="p-4 border-b border-sidebar-border">
          <h2 className="font-display text-sm font-bold uppercase tracking-widest text-sidebar-foreground">Admin Panel</h2>
        </div>
        <nav className="p-2 space-y-0.5">
          {navItems.map(item => {
            const active = location.pathname === item.href || (item.href !== "/admin" && location.pathname.startsWith(item.href));
            return (
              <Link key={item.href} to={item.href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${active ? "bg-sidebar-accent text-sidebar-primary font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent/50"}`}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-foreground/20 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
