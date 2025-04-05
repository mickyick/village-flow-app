
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreateVillage from "./pages/CreateVillage";
import JoinVillage from "./pages/JoinVillage";
import VillageDetail from "./pages/VillageDetail";
import NotFound from "./pages/NotFound";
import { initFlowConfig } from "./integrations/flow/config";

const queryClient = new QueryClient();

const App: React.FC = () => {
  useEffect(() => {
    // Initialize Flow FCL configuration
    initFlowConfig();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateVillage />} />
            <Route path="/join" element={<JoinVillage />} />
            <Route path="/village/:id" element={<VillageDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
