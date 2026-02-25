import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Symptoms from "@/components/Symptoms";
import Methodology from "@/components/Methodology";
import PulsoComercial from "@/components/PulsoComercial";
import AnimatedStats from "@/components/AnimatedStats";
import Credibility from "@/components/Credibility";
import AboutTeaser from "@/components/AboutTeaser";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import { useHomeSections } from "@/hooks/useHomeSections";

const Index = () => {
  const { getSection, getMeta, loading } = useHomeSections();

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero section={getSection("hero")} logosSection={getSection("client-logos")} />
      <Symptoms section={getSection("symptoms")} />
      <Methodology section={getSection("methodology")} />
      <PulsoComercial section={getSection("pulso-comercial")} />
      <AnimatedStats section={getSection("animated-stats")} />
      <Credibility section={getSection("credibility")} />
      <AboutTeaser section={getSection("about-teaser")} />
      <FinalCTA section={getSection("final-cta")} />
      <Footer />
    </div>
  );
};

export default Index;
