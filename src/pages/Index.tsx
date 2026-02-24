import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Symptoms from "@/components/Symptoms";
import Methodology from "@/components/Methodology";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Symptoms />
      <Methodology />
    </div>
  );
};

export default Index;
