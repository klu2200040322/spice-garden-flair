import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const images = [
  { src: gallery1, alt: "Indian food spread" },
  { src: gallery2, alt: "Chef at tandoor" },
  { src: gallery3, alt: "Restaurant interior" },
  { src: gallery4, alt: "Indian desserts" },
  { src: gallery5, alt: "Aromatic spices" },
  { src: gallery6, alt: "Fresh naan bread" },
];

const GallerySection = () => {
  return (
    <section id="gallery" className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-secondary font-body text-sm tracking-[0.3em] uppercase mb-2">Visual Journey</p>
          <h2 className="section-title">Gallery</h2>
          <p className="section-subtitle">A glimpse into the Spice Garden experience</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <div key={i} className="overflow-hidden rounded-lg group aspect-square">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
