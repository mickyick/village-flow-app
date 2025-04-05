
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreateVillage from "./pages/CreateVillage";
import JoinVillage from "./pages/JoinVillage";
import VillageDetail from "./pages/VillageDetail";
import MyVillage from "./pages/MyVillage";
import NotFound from "./pages/NotFound";
import { initFlowConfig } from "./integrations/flow/config";
import { useFlowAuth } from "./integrations/flow/useFlowAuth";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isConnected } = useFlowAuth();
  
  if (!isConnected) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

// Home route handler - directs to MyVillage for authenticated users
const HomeRoute = () => {
  const { isConnected } = useFlowAuth();
  
  if (isConnected) {
    return <Navigate to="/my-village" />;
  }
  
  return <Home />;
};

const AppRoutes = () => {
  const { isConnected } = useFlowAuth();

  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route 
        path="/create" 
        element={
          <ProtectedRoute>
            <CreateVillage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/join" 
        element={
          <ProtectedRoute>
            <JoinVillage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/my-village" 
        element={
          <ProtectedRoute>
            <MyVillage />
          </ProtectedRoute>
        } 
      />
      <Route path="/village/:id" element={<VillageDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
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
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
