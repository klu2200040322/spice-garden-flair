import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-primary/70" />
      <div className="relative z-10 text-center px-4 animate-fade-in-up">
        <p className="text-secondary font-body text-lg md:text-xl tracking-[0.3em] uppercase mb-4">
          Est. 2010
        </p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground mb-6 leading-tight">
          Spice Garden
        </h1>
        <p className="font-display text-xl md:text-2xl text-primary-foreground/90 italic mb-10">
          Authentic Indian Flavors
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#menu"
            className="inline-block bg-secondary hover:bg-spice-light text-secondary-foreground px-8 py-3 rounded font-body font-bold tracking-wider uppercase text-sm transition-all hover:shadow-lg hover:shadow-secondary/30"
          >
            View Menu
          </a>
          <a
            href="#reservation"
            className="inline-block border-2 border-primary-foreground/60 hover:border-secondary hover:text-secondary text-primary-foreground px-8 py-3 rounded font-body font-bold tracking-wider uppercase text-sm transition-all"
          >
            Reserve Table
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
