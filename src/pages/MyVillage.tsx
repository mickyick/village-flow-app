
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useFlowAuth } from '@/integrations/flow/useFlowAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Village, VillageMember } from '@/types/village';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MyVillage = () => {
  const { isConnected, user } = useFlowAuth();

  // Fetch user's village membership
  const { data: villageMemberships, isLoading, error } = useQuery({
    queryKey: ['userVillage', user?.addr],
    queryFn: async () => {
      if (!user?.addr) return [];
      
      // Changed to not use .single() and instead just get all memberships
      const { data, error } = await supabase
        .from('village_members' as any)
        .select('*, villages(*)' as any)
        .eq('user_id', user.addr);
      
      if (error) {
        console.error('Error fetching user village:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!isConnected && !!user?.addr,
  });

  // If user is not authenticated, redirect to home
  if (!isConnected) {
    return <Navigate to="/" />;
  }

  // If loading, show skeleton
  if (isLoading) {
    return (
      <div className="village-container py-12">
        <Skeleton className="h-12 w-2/3 mb-8" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }
  
  // If there was an error fetching data, show error message
  if (error) {
    return (
      <div className="village-container py-12">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load village data. Please try again later.
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-center mt-8">
          <Link 
            to="/"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 gap-2"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // If user doesn't have a village, show create/join options
  if (!villageMemberships || villageMemberships.length === 0) {
    return (
      <div className="village-container py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">My Village</h1>
        
        <div className="bg-muted/50 p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">You're not part of any village yet</h2>
          <p className="text-muted-foreground mb-8">Create your own village or join an existing one to get started.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 gap-2"
            >
              Create Village
            </Link>
            <Link 
              to="/join"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 gap-2"
            >
              Join Village
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // User has a village, use the first one if they somehow have multiple
  const userVillage = villageMemberships[0];
  
  // Fix the TypeScript error by checking the structure of userVillage
  if (!userVillage || typeof userVillage !== 'object' || !('villages' in userVillage)) {
    return (
      <div className="village-container py-12">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Invalid village data structure. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  const village = userVillage.villages as Village;

  return (
    <div className="village-container py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">{village.name}</h1>
      
      <div className="village-card mb-8 bg-card p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-bold mb-2">Goal</h2>
        <p className="text-muted-foreground">{village.goal}</p>
      </div>
      
      <div className="village-card mb-8 bg-card p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-bold mb-2">About</h2>
        <p className="text-muted-foreground">{village.description || 'No description available.'}</p>
      </div>
      
      <div className="flex justify-center mt-8">
        <Link 
          to={`/village/${village.id}`}
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 gap-2"
        >
          View Village Details <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default MyVillage;
