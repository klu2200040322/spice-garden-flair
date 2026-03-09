import { Star } from "lucide-react";

const reviews = [
  {
    name: "Sarah Mitchell",
    text: "The Butter Chicken here is absolutely divine. Best Indian food I've had outside of India. The ambiance is perfect for a special evening out.",
    rating: 5,
  },
  {
    name: "James Rodriguez",
    text: "Incredible flavors and beautiful presentation. Chef Mehta truly understands the art of Indian cuisine. We keep coming back every month!",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    text: "As someone who grew up in Mumbai, I can say Spice Garden captures the authentic taste of home. The Biryani is outstanding!",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="section-padding bg-muted">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-secondary font-body text-sm tracking-[0.3em] uppercase mb-2">What People Say</p>
          <h2 className="section-title">Guest Reviews</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="bg-card p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} size={18} className="fill-gold text-gold" />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed italic mb-6">"{review.text}"</p>
              <p className="font-display font-semibold text-foreground">{review.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
