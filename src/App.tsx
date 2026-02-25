import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ParaCeos from "./pages/ParaCeos";
import ParaDirectoresComerciales from "./pages/ParaDirectoresComerciales";
import ParaMarketingDirectors from "./pages/ParaMarketingDirectors";
import ParaCustomerSuccess from "./pages/ParaCustomerSuccess";
import NotFound from "./pages/NotFound";
import LoadingScreen from "./components/LoadingScreen";
import CustomCursor from "./components/CustomCursor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LoadingScreen />
      <CustomCursor />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/para-ceos-y-gerentes-generales" element={<ParaCeos />} />
          <Route path="/para-directores-comerciales" element={<ParaDirectoresComerciales />} />
          <Route path="/para-directores-y-gerentes-de-marketing" element={<ParaMarketingDirectors />} />
          <Route path="/para-customer-success-y-servicio-al-cliente" element={<ParaCustomerSuccess />} />
          {/* Future admin routes */}
          {/* <Route path="/admin/*" element={<AdminLayout />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
