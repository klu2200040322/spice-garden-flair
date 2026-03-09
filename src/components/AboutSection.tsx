import gallery3 from "@/assets/gallery-3.jpg";

const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="overflow-hidden rounded-lg">
            <img
              src={gallery3}
              alt="Spice Garden restaurant interior"
              className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          </div>
          <div>
            <p className="text-secondary font-body text-sm tracking-[0.3em] uppercase mb-2">Our Story</p>
            <h2 className="section-title">A Legacy of Flavors</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Founded in 2010, Spice Garden was born from Chef Arjun Mehta's passion for bringing the rich,
              diverse flavors of India to every plate. With over 20 years of culinary experience across
              Mumbai, Delhi, and London, Chef Mehta crafts each dish as a tribute to India's vibrant
              culinary heritage.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Every ingredient is hand-selected, every spice freshly ground, and every recipe perfected
              over generations. At Spice Garden, dining isn't just a meal — it's a journey through the
              heart of India.
            </p>
            <div className="flex gap-12">
              <div>
                <p className="font-display text-3xl font-bold text-secondary">15+</p>
                <p className="text-muted-foreground text-sm">Years of Excellence</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-secondary">50+</p>
                <p className="text-muted-foreground text-sm">Signature Dishes</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-secondary">10K+</p>
                <p className="text-muted-foreground text-sm">Happy Guests</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
