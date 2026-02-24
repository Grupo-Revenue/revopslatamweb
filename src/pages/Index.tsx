import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Symptoms from "@/components/Symptoms";
import Methodology from "@/components/Methodology";
import PulsoComercial from "@/components/PulsoComercial";
import Credibility from "@/components/Credibility";
import AboutTeaser from "@/components/AboutTeaser";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Symptoms />
      <Methodology />
      <PulsoComercial />
      <Credibility />
      <AboutTeaser />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
