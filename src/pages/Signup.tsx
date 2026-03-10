import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const Signup = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, displayName);
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created! Check your email to confirm.");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 section-padding bg-background min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">Create Account</h1>
            <p className="text-muted-foreground">Join the Spice Garden family</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text" required placeholder="Full Name" value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-card border border-border text-foreground placeholder:text-muted-foreground rounded px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
            />
            <input
              type="email" required placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-card border border-border text-foreground placeholder:text-muted-foreground rounded px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
            />
            <input
              type="password" required placeholder="Password (min 6 characters)" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-card border border-border text-foreground placeholder:text-muted-foreground rounded px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
            />
            <button
              type="submit" disabled={loading}
              className="w-full bg-secondary hover:bg-spice-light text-secondary-foreground font-bold tracking-wider uppercase text-sm py-3 rounded transition-all disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
          <p className="text-center mt-6 text-muted-foreground text-sm">
            Already have an account? <Link to="/login" className="text-secondary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
