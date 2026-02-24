import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Symptoms from "@/components/Symptoms";
import Methodology from "@/components/Methodology";
import Services from "@/components/Services";
import PulsoComercial from "@/components/PulsoComercial";
import Credibility from "@/components/Credibility";
import RolesSolutions from "@/components/RolesSolutions";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Symptoms />
      <Methodology />
      <Services />
      <PulsoComercial />
      <Credibility />
      <RolesSolutions />
    </div>
  );
};

export default Index;
