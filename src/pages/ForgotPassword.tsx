import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
      toast.success("Password reset link sent to your email!");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 section-padding bg-background min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md text-center">
          <h1 className="font-display text-3xl font-bold text-primary mb-2">Reset Password</h1>
          {sent ? (
            <div>
              <p className="text-muted-foreground mb-4">Check your email for a reset link.</p>
              <Link to="/login" className="text-secondary hover:underline">Back to login</Link>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-6">Enter your email to receive a reset link</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email" required placeholder="Email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-card border border-border text-foreground placeholder:text-muted-foreground rounded px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                />
                <button
                  type="submit" disabled={loading}
                  className="w-full bg-secondary hover:bg-spice-light text-secondary-foreground font-bold tracking-wider uppercase text-sm py-3 rounded transition-all disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
              <Link to="/login" className="text-muted-foreground hover:text-secondary text-sm mt-4 inline-block">Back to login</Link>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
