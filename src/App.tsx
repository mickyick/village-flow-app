
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
import { supabase } from "./integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isConnected } = useFlowAuth();
  
  if (!isConnected) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

// Route that requires user to NOT be in a village
const NoVillageOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isConnected, user } = useFlowAuth();
  
  const { data: isInVillage, isLoading } = useQuery({
    queryKey: ['userInVillage', user?.addr],
    queryFn: async () => {
      if (!user?.addr) return false;
      
      const { data, error } = await supabase
        .from('village_members' as any)
        .select('id')
        .eq('user_id', user.addr);
      
      if (error) {
        console.error('Error checking village membership:', error);
        return false;
      }
      
      return data && data.length > 0;
    },
    enabled: !!isConnected && !!user?.addr,
  });
  
  // If loading, show nothing yet
  if (isLoading) {
    return null;
  }
  
  // If user is already in a village, redirect to their village page
  if (isInVillage) {
    return <Navigate to="/my-village" />;
  }
  
  // If user is not logged in, redirect to home
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
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route 
        path="/create" 
        element={
          <NoVillageOnlyRoute>
            <CreateVillage />
          </NoVillageOnlyRoute>
        } 
      />
      <Route 
        path="/join" 
        element={
          <NoVillageOnlyRoute>
            <JoinVillage />
          </NoVillageOnlyRoute>
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
