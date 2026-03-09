const Footer = () => {
  return (
    <footer className="bg-primary py-12 px-4">
      <div className="container mx-auto text-center">
        <h3 className="font-display text-2xl font-bold text-primary-foreground mb-4">Spice Garden</h3>
        <p className="text-primary-foreground/60 text-sm mb-6">Authentic Indian Flavors</p>
        <div className="flex justify-center gap-6 mb-8">
          {["Facebook", "Instagram", "Twitter", "Yelp"].map((social) => (
            <a
              key={social}
              href="#"
              className="text-primary-foreground/50 hover:text-secondary transition-colors text-sm tracking-wide"
            >
              {social}
            </a>
          ))}
        </div>
        <div className="border-t border-primary-foreground/10 pt-6">
          <p className="text-primary-foreground/40 text-sm">
            © {new Date().getFullYear()} Spice Garden. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
