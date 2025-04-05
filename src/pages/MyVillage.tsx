
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useFlowAuth } from '@/integrations/flow/useFlowAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Village, VillageMember } from '@/types/village';

const MyVillage = () => {
  const { isConnected, user } = useFlowAuth();

  // Fetch user's village membership
  const { data: userVillage, isLoading } = useQuery({
    queryKey: ['userVillage', user?.addr],
    queryFn: async () => {
      if (!user?.addr) return null;
      
      // Using 'as any' to bypass TypeScript errors since the types don't match the actual database schema
      const { data, error } = await supabase
        .from('village_members' as any)
        .select('*, villages(*)' as any)
        .eq('user_id', user.addr)
        .single();
      
      if (error) {
        console.error('Error fetching user village:', error);
        return null;
      }
      
      return data as unknown as VillageMember;
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

  // If user doesn't have a village, redirect to home
  if (!userVillage) {
    return <Navigate to="/" />;
  }

  // User has a village, show village details
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
