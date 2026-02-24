import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Symptoms from "@/components/Symptoms";
import Methodology from "@/components/Methodology";
import Services from "@/components/Services";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Symptoms />
      <Methodology />
      <Services />
    </div>
  );
};

export default Index;
