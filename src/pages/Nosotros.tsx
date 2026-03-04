import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePageSections } from "@/hooks/usePageSections";
import NosotrosHero from "@/components/nosotros/NosotrosHero";
import PorQueExistimos from "@/components/nosotros/PorQueExistimos";
import PorQueDeEstaForma from "@/components/nosotros/PorQueDeEstaForma";
import ComoEntendemos from "@/components/nosotros/ComoEntendemos";
import LosNumeros from "@/components/nosotros/LosNumeros";
import ElEquipo from "@/components/nosotros/ElEquipo";
import MasAllaDelRevenue from "@/components/nosotros/MasAllaDelRevenue";
import NosotrosCTA from "@/components/nosotros/NosotrosCTA";

const Nosotros = () => {
  const { getSection } = usePageSections("/nosotros");

  const heroSection = getSection("nosotros-hero");
  const porQueExistimosSection = getSection("por-que-existimos");
  const porQueDeEstaFormaSection = getSection("por-que-de-esta-forma");
  const comoEntendemosSection = getSection("como-entendemos");
  const losNumerosSection = getSection("los-numeros");
  const elEquipoSection = getSection("el-equipo");
  const masAllaDelRevenueSection = getSection("mas-alla-del-revenue");
  const nosotrosCTASection = getSection("nosotros-cta");

  return (
    <div className="min-h-screen">
      <Navbar />
      {heroSection && <NosotrosHero section={heroSection} />}
      {porQueExistimosSection && <PorQueExistimos section={porQueExistimosSection} />}
      {porQueDeEstaFormaSection && <PorQueDeEstaForma section={porQueDeEstaFormaSection} />}
      {comoEntendemosSection && <ComoEntendemos section={comoEntendemosSection} />}
      {losNumerosSection && <LosNumeros section={losNumerosSection} />}
      {elEquipoSection && <ElEquipo section={elEquipoSection} />}
      {masAllaDelRevenueSection && <MasAllaDelRevenue section={masAllaDelRevenueSection} />}
      {nosotrosCTASection && <NosotrosCTA section={nosotrosCTASection} />}
      <Footer />
    </div>
  );
};

export default Nosotros;
