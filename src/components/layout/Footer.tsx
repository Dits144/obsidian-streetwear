import { Link } from "react-router-dom";

const footerLinks = {
  Shop: [
    { label: "T-Shirts", href: "/shop?category=t-shirts" },
    { label: "Hoodies", href: "/shop?category=hoodies" },
    { label: "Jackets", href: "/shop?category=jackets" },
    { label: "Pants", href: "/shop?category=pants" },
    { label: "Accessories", href: "/shop?category=accessories" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Careers", href: "#" },
  ],
  Support: [
    { label: "Shipping & Returns", href: "#" },
    { label: "Size Guide", href: "#" },
    { label: "FAQ", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-display text-lg font-extrabold uppercase tracking-tight mb-4">VOIDWEAR</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium streetwear for the modern individual. Quality over quantity, always.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(l => (
                  <li key={l.label}>
                    <Link to={l.href} className="text-sm hover:text-foreground text-muted-foreground transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2026 VOIDWEAR. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="text-xs text-muted-foreground">Privacy Policy</span>
            <span className="text-xs text-muted-foreground">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
