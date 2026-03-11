import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

const statusOptions = ["pending", "confirmed", "cancelled"];

const AdminReservations = () => {
  const [reservations, setReservations] = useState<Tables<"reservations">[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    const { data } = await supabase.from("reservations").select("*").order("date", { ascending: false });
    if (data) setReservations(data);
    setLoading(false);
  };

  useEffect(() => { fetchReservations(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("reservations").update({ status }).eq("id", id);
    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`Reservation ${status}`);
      setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    }
  };

  const statusColor = (s: string) => {
    const map: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return map[s] || "bg-muted text-muted-foreground";
  };

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">Reservations</h1>
      {loading ? (
        <p className="text-muted-foreground">Loading reservations...</p>
      ) : reservations.length === 0 ? (
        <p className="text-muted-foreground">No reservations yet.</p>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-semibold text-foreground">Name</th>
                  <th className="text-left p-4 font-semibold text-foreground">Email</th>
                  <th className="text-left p-4 font-semibold text-foreground">Phone</th>
                  <th className="text-left p-4 font-semibold text-foreground">Date</th>
                  <th className="text-left p-4 font-semibold text-foreground">Time</th>
                  <th className="text-left p-4 font-semibold text-foreground">Guests</th>
                  <th className="text-left p-4 font-semibold text-foreground">Status</th>
                  <th className="text-left p-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res) => (
                  <tr key={res.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-semibold">{res.name}</td>
                    <td className="p-4 text-muted-foreground">{res.email}</td>
                    <td className="p-4 text-muted-foreground">{res.phone}</td>
                    <td className="p-4">{res.date}</td>
                    <td className="p-4">{res.time}</td>
                    <td className="p-4 text-center">{res.guests}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColor(res.status)}`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={res.status}
                        onChange={(e) => updateStatus(res.id, e.target.value)}
                        className="bg-background border border-border rounded px-2 py-1 text-xs text-foreground"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminReservations;
