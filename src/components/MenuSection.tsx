import paneerTikka from "@/assets/paneer-tikka.jpg";
import butterChicken from "@/assets/butter-chicken.jpg";
import vegBiryani from "@/assets/veg-biryani.jpg";
import tandooriChicken from "@/assets/tandoori-chicken.jpg";

const menuItems = [
  { name: "Paneer Tikka", price: "₹249", description: "Marinated cottage cheese grilled in tandoor with bell peppers", image: paneerTikka, tag: "Vegetarian" },
  { name: "Butter Chicken", price: "₹349", description: "Tender chicken in rich, creamy tomato-butter sauce", image: butterChicken, tag: "Bestseller" },
  { name: "Veg Biryani", price: "₹299", description: "Fragrant basmati rice layered with seasonal vegetables & saffron", image: vegBiryani, tag: "Vegetarian" },
  { name: "Tandoori Chicken", price: "₹329", description: "Whole chicken marinated in yogurt and spices, clay-oven roasted", image: tandooriChicken, tag: "Chef's Pick" },
];

const MenuSection = () => {
  return (
    <section id="menu" className="section-padding bg-primary">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-secondary font-body text-sm tracking-[0.3em] uppercase mb-2">Our Specialties</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
            Featured Menu
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            Each dish tells a story of tradition, passion, and the finest ingredients
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <div
              key={item.name}
              className="group bg-forest-light/30 rounded-lg overflow-hidden hover:bg-forest-light/50 transition-all duration-300"
            >
              <div className="overflow-hidden h-56">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <span className="text-secondary text-xs font-bold tracking-wider uppercase">{item.tag}</span>
                <h3 className="font-display text-xl font-semibold text-primary-foreground mt-1 mb-2">
                  {item.name}
                </h3>
                <p className="text-primary-foreground/60 text-sm mb-3 leading-relaxed">{item.description}</p>
                <p className="font-display text-2xl font-bold text-secondary">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
