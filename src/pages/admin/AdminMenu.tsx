import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

const categories = ["starters", "main", "breads", "desserts", "beverages"];

const emptyItem = { name: "", price: 0, description: "", category: "main", tag: "", available: true, image_url: "" };

const AdminMenu = () => {
  const [items, setItems] = useState<Tables<"menu_items">[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Tables<"menu_items">> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetchItems = async () => {
    const { data } = await supabase.from("menu_items").select("*").order("category").order("name");
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async () => {
    if (!editing || !editing.name || !editing.price) {
      toast.error("Name and price are required");
      return;
    }

    if (isNew) {
      const { error } = await supabase.from("menu_items").insert({
        name: editing.name,
        price: Number(editing.price),
        description: editing.description || null,
        category: editing.category || "main",
        tag: editing.tag || null,
        available: editing.available ?? true,
        image_url: editing.image_url || null,
      });
      if (error) {
        toast.error("Failed to add item");
        return;
      }
      toast.success("Menu item added");
    } else {
      const { error } = await supabase.from("menu_items").update({
        name: editing.name,
        price: Number(editing.price),
        description: editing.description || null,
        category: editing.category || "main",
        tag: editing.tag || null,
        available: editing.available ?? true,
        image_url: editing.image_url || null,
      }).eq("id", editing.id!);
      if (error) {
        toast.error("Failed to update item");
        return;
      }
      toast.success("Menu item updated");
    }

    setEditing(null);
    setIsNew(false);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this menu item?")) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete item");
    } else {
      toast.success("Item deleted");
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Menu Items</h1>
        <button
          onClick={() => { setEditing({ ...emptyItem }); setIsNew(true); }}
          className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-spice-light transition-colors"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      {/* Edit/Add modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => { setEditing(null); setIsNew(false); }}>
          <div className="bg-card rounded-xl border border-border p-6 w-full max-w-lg space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-foreground">{isNew ? "Add Menu Item" : "Edit Menu Item"}</h2>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-foreground uppercase tracking-wide block mb-1">Name *</label>
                <input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground uppercase tracking-wide block mb-1">Price (₹) *</label>
                  <input type="number" step="0.01" value={editing.price || ""} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground" />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground uppercase tracking-wide block mb-1">Category</label>
                  <select value={editing.category || "main"} onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground">
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-foreground uppercase tracking-wide block mb-1">Description</label>
                <textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground uppercase tracking-wide block mb-1">Tag</label>
                  <input value={editing.tag || ""} onChange={(e) => setEditing({ ...editing, tag: e.target.value })}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground" placeholder="e.g. Bestseller" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editing.available ?? true} onChange={(e) => setEditing({ ...editing, available: e.target.checked })}
                      className="rounded border-border" />
                    <span className="text-sm text-foreground font-medium">Available</span>
                  </label>
                </div>
              </div>
            </div>
            <button onClick={handleSave}
              className="w-full bg-secondary text-secondary-foreground py-3 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-spice-light transition-colors">
              {isNew ? "Add Item" : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading menu items...</p>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-semibold text-foreground">Name</th>
                  <th className="text-left p-4 font-semibold text-foreground">Category</th>
                  <th className="text-left p-4 font-semibold text-foreground">Price</th>
                  <th className="text-left p-4 font-semibold text-foreground">Tag</th>
                  <th className="text-left p-4 font-semibold text-foreground">Available</th>
                  <th className="text-left p-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-semibold">{item.name}</td>
                    <td className="p-4 capitalize text-muted-foreground">{item.category}</td>
                    <td className="p-4 font-bold text-secondary">₹{Number(item.price).toFixed(2)}</td>
                    <td className="p-4 text-muted-foreground">{item.tag || "—"}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {item.available ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditing(item); setIsNew(false); }}
                          className="text-muted-foreground hover:text-foreground"><Pencil size={16} /></button>
                        <button onClick={() => handleDelete(item.id)}
                          className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
                      </div>
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

export default AdminMenu;
