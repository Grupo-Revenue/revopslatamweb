import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ClientLogos from "@/components/ClientLogos";
import Symptoms from "@/components/Symptoms";
import Methodology from "@/components/Methodology";
import PulsoComercial from "@/components/PulsoComercial";
import AnimatedStats from "@/components/AnimatedStats";
import Credibility from "@/components/Credibility";
import AboutTeaser from "@/components/AboutTeaser";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import { PageContentProvider } from "@/hooks/usePageContent";

const Index = () => {
  return (
    <PageContentProvider slug="/">
      <div className="min-h-screen">
        <Navbar />
        <Hero />
        <ClientLogos />
        <Symptoms />
        <Methodology />
        <PulsoComercial />
        <AnimatedStats />
        <Credibility />
        <AboutTeaser />
        <FinalCTA />
        <Footer />
      </div>
    </PageContentProvider>
  );
};

export default Index;
