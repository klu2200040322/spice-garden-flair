import Navbar from "@/components/Navbar";
import ReservationSection from "@/components/ReservationSection";
import Footer from "@/components/Footer";

const Reservations = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <ReservationSection />
      </div>
      <Footer />
    </div>
  );
};

export default Reservations;
