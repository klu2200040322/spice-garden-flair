import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, CalendarDays, UtensilsCrossed, ArrowLeft } from "lucide-react";

const links = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Reservations", href: "/admin/reservations", icon: CalendarDays },
  { label: "Menu Items", href: "/admin/menu", icon: UtensilsCrossed },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-primary text-primary-foreground flex flex-col">
      <div className="p-6 border-b border-primary-foreground/10">
        <h2 className="font-display text-xl font-bold">Spice Garden</h2>
        <p className="text-primary-foreground/60 text-xs uppercase tracking-widest mt-1">Admin Panel</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const active = location.pathname === link.href;
          return (
            <Link
              key={link.href}
              to={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-secondary text-secondary-foreground"
                  : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-primary-foreground/10">
        <Link
          to="/"
          className="flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Site
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
