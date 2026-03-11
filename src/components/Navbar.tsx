import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminCheck } from "@/hooks/useAdminCheck";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Menu", href: "/menu" },
  { label: "Order Online", href: "/order" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reviews", href: "/reviews" },
  { label: "Reservations", href: "/reservations" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminCheck();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/" className="font-display text-2xl font-bold text-primary-foreground tracking-wide">
          Spice Garden
        </Link>
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm font-medium tracking-wide uppercase"
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1 text-primary-foreground/80 hover:text-secondary transition-colors text-sm font-medium tracking-wide uppercase"
            >
              <Shield size={16} />
              Admin
            </Link>
          )}
          {user ? (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1 text-primary-foreground/80 hover:text-secondary transition-colors text-sm font-medium tracking-wide uppercase"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 bg-secondary text-secondary-foreground px-4 py-2 rounded font-bold text-sm tracking-wide uppercase hover:bg-spice-light transition-colors"
            >
              <User size={16} />
              Sign In
            </Link>
          )}
        </div>
        <button
          className="lg:hidden text-primary-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden bg-primary/98 border-t border-primary-foreground/10 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setOpen(false)}
              className="block px-6 py-3 text-primary-foreground/80 hover:text-secondary transition-colors text-sm tracking-wide uppercase"
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="block px-6 py-3 text-secondary font-bold text-sm tracking-wide uppercase"
            >
              Admin Panel
            </Link>
          )}
          {user ? (
            <button
              onClick={() => { signOut(); setOpen(false); }}
              className="block w-full text-left px-6 py-3 text-primary-foreground/80 hover:text-secondary transition-colors text-sm tracking-wide uppercase"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="block px-6 py-3 text-secondary font-bold text-sm tracking-wide uppercase"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
