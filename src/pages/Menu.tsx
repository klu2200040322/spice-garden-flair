import Navbar from "@/components/Navbar";
import MenuSection from "@/components/MenuSection";
import Footer from "@/components/Footer";

const Menu = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <MenuSection />
      </div>
      <Footer />
    </div>
  );
};

export default Menu;
