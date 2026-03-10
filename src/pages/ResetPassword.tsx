import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("type=recovery")) {
      toast.error("Invalid reset link");
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated!");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 section-padding bg-background min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md text-center">
          <h1 className="font-display text-3xl font-bold text-primary mb-6">Set New Password</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password" required placeholder="New password (min 6 characters)" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-card border border-border text-foreground placeholder:text-muted-foreground rounded px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
            />
            <button
              type="submit" disabled={loading}
              className="w-full bg-secondary hover:bg-spice-light text-secondary-foreground font-bold tracking-wider uppercase text-sm py-3 rounded transition-all disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
