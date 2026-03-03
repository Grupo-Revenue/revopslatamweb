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

  return (
    <div className="min-h-screen">
      <Navbar />
      <NosotrosHero section={getSection("nosotros-hero")} />
      <PorQueExistimos section={getSection("por-que-existimos")} />
      <PorQueDeEstaForma section={getSection("por-que-de-esta-forma")} />
      <ComoEntendemos section={getSection("como-entendemos")} />
      <LosNumeros section={getSection("los-numeros")} />
      <ElEquipo section={getSection("el-equipo")} />
      <MasAllaDelRevenue section={getSection("mas-alla-del-revenue")} />
      <NosotrosCTA section={getSection("nosotros-cta")} />
      <Footer />
    </div>
  );
};

export default Nosotros;
