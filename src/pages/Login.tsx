import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome back!");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 section-padding bg-background min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your Spice Garden account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email" required placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-card border border-border text-foreground placeholder:text-muted-foreground rounded px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
            />
            <input
              type="password" required placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-card border border-border text-foreground placeholder:text-muted-foreground rounded px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
            />
            <button
              type="submit" disabled={loading}
              className="w-full bg-secondary hover:bg-spice-light text-secondary-foreground font-bold tracking-wider uppercase text-sm py-3 rounded transition-all disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <div className="text-center mt-6 space-y-2">
            <Link to="/forgot-password" className="text-secondary hover:underline text-sm block">Forgot password?</Link>
            <p className="text-muted-foreground text-sm">
              Don't have an account? <Link to="/signup" className="text-secondary hover:underline">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
