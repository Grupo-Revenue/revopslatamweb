import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LeadFormProvider } from "@/hooks/useLeadForm";
import LeadFormModal from "@/components/LeadFormModal";
import DynamicStylesLoader from "./components/DynamicStylesLoader";
import CustomCursor from "./components/CustomCursor";

// Only eagerly load the Index page (most common entry point)
import Index from "./pages/Index";

// Lazy-load all other pages for code splitting
const Nosotros = lazy(() => import("./pages/Nosotros"));
const ParaCeos = lazy(() => import("./pages/ParaCeos"));
const ParaDirectoresComerciales = lazy(() => import("./pages/ParaDirectoresComerciales"));
const ParaMarketingDirectors = lazy(() => import("./pages/ParaMarketingDirectors"));
const ParaCustomerSuccess = lazy(() => import("./pages/ParaCustomerSuccess"));
const ParaOperaciones = lazy(() => import("./pages/ParaOperaciones"));
const ConoceTuPista = lazy(() => import("./pages/ConoceTuPista"));
const RevOpsCheckup = lazy(() => import("./pages/RevOpsCheckup"));
const DiagnosticoRevOps = lazy(() => import("./pages/DiagnosticoRevOps"));
const MotorDeIngresos = lazy(() => import("./pages/MotorDeIngresos"));
const DisenaYConstruye = lazy(() => import("./pages/DisenaYConstruye"));
const DisenoDeProcesos = lazy(() => import("./pages/DisenoDeProcesos"));
const OnboardingHubspot = lazy(() => import("./pages/OnboardingHubspot"));
const ImplementacionHubspot = lazy(() => import("./pages/ImplementacionHubspot"));
const PersonalizacionCRM = lazy(() => import("./pages/PersonalizacionCRM"));
const IntegracionesDesarrollo = lazy(() => import("./pages/IntegracionesDesarrollo"));
const OperaTuPista = lazy(() => import("./pages/OperaTuPista"));
const RevOpsAsAService = lazy(() => import("./pages/RevOpsAsAService"));
const MarketingOps = lazy(() => import("./pages/MarketingOps"));
const SoporteHubspot = lazy(() => import("./pages/SoporteHubspot"));
const PotenciaConIA = lazy(() => import("./pages/PotenciaConIA"));
const QueHacemos = lazy(() => import("./pages/QueHacemos"));
const HubspotPartnerChile = lazy(() => import("./pages/HubspotPartnerChile"));
const ConoceTuPistaLanding = lazy(() => import("./pages/ConoceTuPistaLanding"));
const ImplementacionHubspotLanding = lazy(() => import("./pages/ImplementacionHubspotLanding"));
const AgenticLandingPage = lazy(() => import("./pages/AgenticLandingPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PoliticaPrivacidad = lazy(() => import("./pages/PoliticaPrivacidad"));

// Admin pages - always lazy
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminPages = lazy(() => import("./pages/admin/AdminPages"));
const AdminPageSections = lazy(() => import("./pages/admin/AdminPageSections"));
const AdminStyles = lazy(() => import("./pages/admin/AdminStyles"));
const AdminCTAStyles = lazy(() => import("./pages/admin/AdminCTAStyles"));
const AdminMedia = lazy(() => import("./pages/admin/AdminMedia"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminSetup = lazy(() => import("./pages/admin/AdminSetup"));

// Admin Agent pages
const AdminAgentLogin = lazy(() => import("./pages/admin-agent/AdminAgentLogin"));
const AdminAgentLayout = lazy(() => import("./pages/admin-agent/AdminAgentLayout"));
const ConversationsPage = lazy(() => import("./pages/admin-agent/ConversationsPage"));
const ScoringPage = lazy(() => import("./pages/admin-agent/ScoringPage"));
const KnowledgePage = lazy(() => import("./pages/admin-agent/KnowledgePage"));
const ConfigPage = lazy(() => import("./pages/admin-agent/ConfigPage"));

const BlogRedirect = () => {
  const path = window.location.pathname.replace(/^\/blog/, '');
  window.location.replace(`https://blog.revopslatam.com${path}`);
  return null;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min cache
      gcTime: 10 * 60 * 1000,
    },
  },
});

// Minimal fallback - no heavy animations
const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: "#0D0D1A" }}>
    <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#BE1869", borderTopColor: "transparent" }} />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LeadFormProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <DynamicStylesLoader />
          <CustomCursor />
          <LeadFormModal />
          <BrowserRouter>
            <Suspense fallback={<PageFallback />}>
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
                <Route path="/hubspot-partner" element={<Navigate to="/hubspot-partner-chile" replace />} />
                <Route path="/lp/conoce-tu-pista" element={<ConoceTuPistaLanding />} />
                <Route path="/lp/implementacion-hubspot" element={<ImplementacionHubspotLanding />} />
                <Route path="/lp/agentic" element={<AgenticLandingPage />} />
                <Route path="/politica-de-privacidad" element={<PoliticaPrivacidad />} />
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
                {/* Admin Agent routes */}
                <Route path="/admin-agent/login" element={<AdminAgentLogin />} />
                <Route path="/admin-agent" element={<AdminAgentLayout />}>
                  <Route index element={<ConversationsPage />} />
                  <Route path="scoring" element={<ScoringPage />} />
                  <Route path="knowledge" element={<KnowledgePage />} />
                  <Route path="config" element={<ConfigPage />} />
                </Route>
                <Route path="/blog/*" element={<BlogRedirect />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </LeadFormProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
