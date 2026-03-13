import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, Package, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  menu_item: { name: string } | null;
}

interface Order {
  id: string;
  created_at: string;
  order_type: string;
  status: string;
  total: number;
  special_instructions: string | null;
  payment_method?: string;
  items: OrderItem[];
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-orange-100 text-orange-800",
  ready: "bg-green-100 text-green-800",
  completed: "bg-green-200 text-green-900",
  cancelled: "bg-red-100 text-red-800",
};

const OrderHistory = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!ordersData || ordersData.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const orderIds = ordersData.map((o) => o.id);
      const { data: itemsData } = await supabase
        .from("order_items")
        .select("id, quantity, price, order_id, menu_item_id")
        .in("order_id", orderIds);

      const menuItemIds = [...new Set((itemsData || []).map((i) => i.menu_item_id))];
      const { data: menuData } = await supabase
        .from("menu_items")
        .select("id, name")
        .in("id", menuItemIds);

      const menuMap = new Map((menuData || []).map((m) => [m.id, m]));

      const enrichedOrders: Order[] = ordersData.map((order) => ({
        ...order,
        payment_method: (order as any).payment_method,
        items: (itemsData || [])
          .filter((i) => i.order_id === order.id)
          .map((i) => ({
            id: i.id,
            quantity: i.quantity,
            price: i.price,
            menu_item: menuMap.get(i.menu_item_id) || null,
          })),
      }));

      setOrders(enrichedOrders);
      setLoading(false);
    };

    fetchOrders();
  }, [user, authLoading, navigate]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 section-padding bg-background min-h-[70vh]">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <p className="text-secondary font-body text-sm tracking-[0.3em] uppercase mb-2">Your Account</p>
            <h1 className="section-title">Order History</h1>
            <p className="section-subtitle">Track your past and current orders</p>
          </div>

          {loading ? (
            <div className="text-center py-16 text-muted-foreground">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="mx-auto mb-4 text-muted-foreground" size={48} />
              <p className="text-muted-foreground mb-4">You haven't placed any orders yet</p>
              <Link
                to="/order"
                className="inline-block bg-secondary text-secondary-foreground px-6 py-3 rounded font-bold text-sm uppercase tracking-wider hover:bg-spice-light transition-colors"
              >
                Order Now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const isExpanded = expandedOrder === order.id;
                return (
                  <div key={order.id} className="bg-card border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Clock size={18} className="text-muted-foreground" />
                        <div>
                          <p className="font-display font-semibold text-foreground">
                            {new Date(order.created_at).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", year: "numeric",
                            })}
                            <span className="text-muted-foreground font-body text-xs ml-2">
                              {new Date(order.created_at).toLocaleTimeString("en-IN", {
                                hour: "2-digit", minute: "2-digit",
                              })}
                            </span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} item{order.items.length !== 1 ? "s" : ""} · {order.order_type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${statusColors[order.status] || "bg-muted text-muted-foreground"}`}>
                          {order.status}
                        </span>
                        <span className="font-display font-bold text-secondary">₹{order.total.toFixed(2)}</span>
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-border px-5 pb-5 pt-3 space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-foreground">
                              {item.menu_item?.name || "Unknown item"} × {item.quantity}
                            </span>
                            <span className="text-muted-foreground">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-border flex justify-between text-xs text-muted-foreground">
                          <span>Payment: {order.payment_method === "cash" ? "Cash on " + (order.order_type === "pickup" ? "Pickup" : "Delivery") : order.payment_method || "Cash"}</span>
                          <span>Order #{order.id.slice(0, 8)}</span>
                        </div>
                        {order.special_instructions && (
                          <p className="text-xs text-muted-foreground italic">Note: {order.special_instructions}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderHistory;
