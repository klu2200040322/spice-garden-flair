import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

const categories = [
  { key: "starters", label: "Starters" },
  { key: "main", label: "Main Course" },
  { key: "breads", label: "Breads" },
  { key: "desserts", label: "Desserts" },
  { key: "beverages", label: "Beverages" },
];

const Order = () => {
  const { user } = useAuth();
  const { items: cartItems, addItem, removeItem, updateQuantity, clearCart, total, itemCount } = useCart();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<Tables<"menu_items">[]>([]);
  const [activeCategory, setActiveCategory] = useState("starters");
  const [orderType, setOrderType] = useState<"pickup" | "dine-in">("pickup");
  const [instructions, setInstructions] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    supabase.from("menu_items").select("*").eq("available", true).then(({ data }) => {
      if (data) setMenuItems(data);
    });
  }, []);

  const filteredItems = menuItems.filter((item) => item.category === activeCategory);

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please sign in to place an order");
      navigate("/login");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setSubmitting(true);
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        order_type: orderType,
        special_instructions: instructions || null,
        total,
      })
      .select()
      .single();

    if (orderError || !order) {
      toast.error("Failed to place order. Please try again.");
      setSubmitting(false);
      return;
    }

    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      menu_item_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    setSubmitting(false);

    if (itemsError) {
      toast.error("Failed to save order items.");
    } else {
      toast.success("Order placed successfully! We'll have it ready soon.");
      clearCart();
      setInstructions("");
      setShowCart(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 section-padding bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <p className="text-secondary font-body text-sm tracking-[0.3em] uppercase mb-2">Order Online</p>
            <h1 className="section-title">Place Your Order</h1>
            <p className="section-subtitle">Choose your favorites and we'll prepare them fresh</p>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-5 py-2 rounded-full text-sm font-bold tracking-wide uppercase transition-all ${
                  activeCategory === cat.key
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Menu grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {filteredItems.map((item) => {
              const inCart = cartItems.find((c) => c.id === item.id);
              return (
                <div key={item.id} className="bg-card rounded-lg p-5 border border-border hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-foreground">{item.name}</h3>
                      {item.tag && <span className="text-secondary text-xs font-bold tracking-wider uppercase">{item.tag}</span>}
                    </div>
                    <p className="font-display text-xl font-bold text-secondary">₹{item.price.toFixed(2)}</p>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{item.description}</p>
                  {inCart ? (
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQuantity(item.id, inCart.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-foreground">{inCart.quantity}</span>
                      <button onClick={() => addItem({ id: item.id, name: item.name, price: item.price })}
                        className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-spice-light transition-colors">
                        <Plus size={14} />
                      </button>
                      <button onClick={() => removeItem(item.id)}
                        className="ml-auto text-destructive hover:text-destructive/80">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addItem({ id: item.id, name: item.name, price: item.price })}
                      className="w-full bg-primary text-primary-foreground py-2 rounded font-body font-bold text-sm tracking-wider uppercase hover:bg-forest-light transition-colors"
                    >
                      Add to Order
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Floating cart button */}
          {itemCount > 0 && (
            <button
              onClick={() => setShowCart(!showCart)}
              className="fixed bottom-6 right-6 z-40 bg-secondary text-secondary-foreground px-6 py-3 rounded-full font-bold shadow-lg hover:bg-spice-light transition-all flex items-center gap-2"
            >
              <ShoppingCart size={20} />
              {itemCount} items · ₹{total.toFixed(2)}
            </button>
          )}

          {/* Cart panel */}
          {showCart && (
            <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setShowCart(false)}>
              <div className="bg-card w-full max-w-md h-full shadow-2xl overflow-y-auto p-6"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-display text-2xl font-bold text-foreground">Your Order</h2>
                  <button onClick={() => setShowCart(false)} className="text-muted-foreground hover:text-foreground text-xl">✕</button>
                </div>

                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-semibold text-foreground">{item.name}</p>
                      <p className="text-muted-foreground text-sm">₹{item.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                        <Minus size={12} />
                      </button>
                      <span className="font-bold w-6 text-center">{item.quantity}</span>
                      <button onClick={() => addItem({ id: item.id, name: item.name, price: item.price })}
                        className="w-7 h-7 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="text-sm font-bold text-foreground tracking-wide uppercase block mb-2">Order Type</label>
                    <div className="flex gap-3">
                      {(["pickup", "dine-in"] as const).map((type) => (
                        <button key={type} onClick={() => setOrderType(type)}
                          className={`flex-1 py-2 rounded font-bold text-sm uppercase tracking-wide transition-all ${
                            orderType === type
                              ? "bg-secondary text-secondary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}>
                          {type === "pickup" ? "Pickup" : "Dine-in"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-foreground tracking-wide uppercase block mb-2">Special Instructions</label>
                    <textarea
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="Any allergies or preferences..."
                      className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-secondary"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-between text-lg font-bold text-foreground pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-secondary">${total.toFixed(2)}</span>
                  </div>

                  {!user && (
                    <p className="text-sm text-muted-foreground text-center">
                      <Link to="/login" className="text-secondary hover:underline">Sign in</Link> to place your order
                    </p>
                  )}

                  <button
                    onClick={handlePlaceOrder}
                    disabled={submitting || cartItems.length === 0}
                    className="w-full bg-secondary hover:bg-spice-light text-secondary-foreground font-bold tracking-wider uppercase text-sm py-4 rounded transition-all disabled:opacity-50"
                  >
                    {submitting ? "Placing order..." : "Place Order"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Order;
