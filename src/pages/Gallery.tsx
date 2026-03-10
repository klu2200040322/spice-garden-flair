import Navbar from "@/components/Navbar";
import GallerySection from "@/components/GallerySection";
import Footer from "@/components/Footer";

const Gallery = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <GallerySection />
      </div>
      <Footer />
    </div>
  );
};

export default Gallery;
