import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, CalendarDays, UtensilsCrossed, IndianRupee } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ orders: 0, reservations: 0, menuItems: 0, revenue: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from("orders").select("id, total"),
      supabase.from("reservations").select("id", { count: "exact", head: true }),
      supabase.from("menu_items").select("id", { count: "exact", head: true }),
    ]).then(([ordersRes, reservationsRes, menuRes]) => {
      const orders = ordersRes.data || [];
      setStats({
        orders: orders.length,
        reservations: reservationsRes.count || 0,
        menuItems: menuRes.count || 0,
        revenue: orders.reduce((sum, o) => sum + Number(o.total), 0),
      });
    });
  }, []);

  const cards = [
    { label: "Total Orders", value: stats.orders, icon: ShoppingBag, color: "text-secondary" },
    { label: "Revenue", value: `₹${stats.revenue.toFixed(2)}`, icon: IndianRupee, color: "text-green-600" },
    { label: "Reservations", value: stats.reservations, icon: CalendarDays, color: "text-blue-500" },
    { label: "Menu Items", value: stats.menuItems, icon: UtensilsCrossed, color: "text-purple-500" },
  ];

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground text-sm font-medium uppercase tracking-wide">{card.label}</span>
              <card.icon size={20} className={card.color} />
            </div>
            <p className="text-3xl font-bold text-foreground">{card.value}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
