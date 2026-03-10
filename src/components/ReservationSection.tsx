import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const ReservationSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", time: "", guests: "2" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to make a reservation");
      navigate("/login");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("reservations").insert({
      user_id: user.id,
      name: form.name,
      email: form.email,
      phone: form.phone,
      date: form.date,
      time: form.time,
      guests: parseInt(form.guests),
    });
    setLoading(false);
    if (error) {
      toast.error("Failed to submit reservation. Please try again.");
    } else {
      toast.success("Reservation submitted! We'll confirm shortly.");
      setForm({ name: "", email: "", phone: "", date: "", time: "", guests: "2" });
    }
  };

  return (
    <section id="reservation" className="section-padding bg-primary">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <p className="text-secondary font-body text-sm tracking-[0.3em] uppercase mb-2">Book a Table</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
            Make a Reservation
          </h2>
          <p className="text-primary-foreground/70 text-lg">
            Reserve your table for an unforgettable dining experience
          </p>
        </div>
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <input type="text" required placeholder="Full Name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-forest-light/30 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 rounded px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
          />
          <input type="email" required placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="bg-forest-light/30 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 rounded px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
          />
          <input type="tel" required placeholder="Phone" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="bg-forest-light/30 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 rounded px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
          />
          <select value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })}
            className="bg-forest-light/30 border border-primary-foreground/20 text-primary-foreground rounded px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
          >
            {[1,2,3,4,5,6,7,8].map(n => (
              <option key={n} value={n} className="bg-primary text-primary-foreground">{n} {n === 1 ? "Guest" : "Guests"}</option>
            ))}
          </select>
          <input type="date" required value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="bg-forest-light/30 border border-primary-foreground/20 text-primary-foreground rounded px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
          />
          <input type="time" required value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="bg-forest-light/30 border border-primary-foreground/20 text-primary-foreground rounded px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
          />
          <button type="submit" disabled={loading}
            className="sm:col-span-2 bg-secondary hover:bg-spice-light text-secondary-foreground font-bold tracking-wider uppercase text-sm py-4 rounded transition-all hover:shadow-lg hover:shadow-secondary/30 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Reserve Now"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ReservationSection;
