import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LeadFormProvider } from "@/hooks/useLeadForm";
import LeadFormModal from "@/components/LeadFormModal";
import Index from "./pages/Index";
import Nosotros from "./pages/Nosotros";
import ParaCeos from "./pages/ParaCeos";
import ParaDirectoresComerciales from "./pages/ParaDirectoresComerciales";
import ParaMarketingDirectors from "./pages/ParaMarketingDirectors";
import ParaCustomerSuccess from "./pages/ParaCustomerSuccess";
import ParaOperaciones from "./pages/ParaOperaciones";
import ConoceTuPista from "./pages/ConoceTuPista";
import RevOpsCheckup from "./pages/RevOpsCheckup";
import DiagnosticoRevOps from "./pages/DiagnosticoRevOps";
import MotorDeIngresos from "./pages/MotorDeIngresos";
import DisenaYConstruye from "./pages/DisenaYConstruye";
import DisenoDeProcesos from "./pages/DisenoDeProcesos";
import OnboardingHubspot from "./pages/OnboardingHubspot";
import ImplementacionHubspot from "./pages/ImplementacionHubspot";
import PersonalizacionCRM from "./pages/PersonalizacionCRM";
import IntegracionesDesarrollo from "./pages/IntegracionesDesarrollo";
import OperaTuPista from "./pages/OperaTuPista";
import RevOpsAsAService from "./pages/RevOpsAsAService";
import MarketingOps from "./pages/MarketingOps";
import SoporteHubspot from "./pages/SoporteHubspot";
import PotenciaConIA from "./pages/PotenciaConIA";
import QueHacemos from "./pages/QueHacemos";
import HubspotPartnerChile from "./pages/HubspotPartnerChile";
import NotFound from "./pages/NotFound";
import { Navigate } from "react-router-dom";

const ExternalRedirect = ({ to }: { to: string }) => {
  window.location.replace(to);
  return null;
};

import LoadingScreen from "./components/LoadingScreen";
import DynamicStylesLoader from "./components/DynamicStylesLoader";
import CustomCursor from "./components/CustomCursor";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPages from "./pages/admin/AdminPages";
import AdminPageSections from "./pages/admin/AdminPageSections";
import AdminStyles from "./pages/admin/AdminStyles";
import AdminCTAStyles from "./pages/admin/AdminCTAStyles";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSetup from "./pages/admin/AdminSetup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LeadFormProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {/* LoadingScreen removed */}
          <DynamicStylesLoader />
          <CustomCursor />
          <LeadFormModal />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/para-ceos-y-gerentes-generales" element={<ParaCeos />} />
              <Route path="/para-directores-comerciales" element={<ParaDirectoresComerciales />} />
              <Route path="/para-directores-y-gerentes-de-marketing" element={<ParaMarketingDirectors />} />
              <Route path="/para-customer-success-y-servicio-al-cliente" element={<ParaCustomerSuccess />} />
              <Route path="/para-los-que-operan-el-negocio-sin-el-titulo" element={<ParaOperaciones />} />
              <Route path="/conoce-tu-pista" element={<ConoceTuPista />} />
              <Route path="/revops-checkup" element={<RevOpsCheckup />} />
              <Route path="/diagnostico-revops" element={<DiagnosticoRevOps />} />
              <Route path="/motor-de-ingresos" element={<MotorDeIngresos />} />
              <Route path="/diseña-y-construye-tu-pista" element={<DisenaYConstruye />} />
              <Route path="/diseño-de-procesos" element={<DisenoDeProcesos />} />
              <Route path="/onboarding-hubspot" element={<OnboardingHubspot />} />
              <Route path="/implementacion-hubspot" element={<ImplementacionHubspot />} />
              <Route path="/personalizacion-crm" element={<PersonalizacionCRM />} />
              <Route path="/integraciones-desarrollo" element={<IntegracionesDesarrollo />} />
              <Route path="/opera-tu-pista" element={<OperaTuPista />} />
              <Route path="/revops-as-a-service" element={<RevOpsAsAService />} />
              <Route path="/marketing-ops" element={<MarketingOps />} />
              <Route path="/soporte-hubspot" element={<SoporteHubspot />} />
              <Route path="/potencia-con-ia" element={<PotenciaConIA />} />
              <Route path="/que-hacemos" element={<QueHacemos />} />
              <Route path="/hubspot-partner-chile" element={<HubspotPartnerChile />} />
              {/* Admin routes */}
              <Route path="/admin/setup" element={<AdminSetup />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="pages" element={<AdminPages />} />
                <Route path="pages/:pageId" element={<AdminPageSections />} />
                <Route path="styles" element={<AdminStyles />} />
                <Route path="cta-styles" element={<AdminCTAStyles />} />
                <Route path="media" element={<AdminMedia />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>
              <Route path="/que-es-revenue-operations-y-cual-es-su-beneficio" element={<ExternalRedirect to="https://blog.revopslatam.com/que-es-revenue-operations-y-cual-es-su-beneficio" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LeadFormProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
