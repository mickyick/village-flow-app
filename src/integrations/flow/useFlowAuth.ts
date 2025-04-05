
import { useState, useEffect, useCallback } from "react";
import * as fcl from "@onflow/fcl";
import { initFlowConfig } from "./config";
import { supabase } from "../supabase/client";
import { toast } from "sonner";

export type FlowUser = {
  addr: string | null;
  loggedIn: boolean | null;
  cid: string | null;
  expiresAt: number | null;
};

export const useFlowAuth = () => {
  const [user, setUser] = useState<FlowUser>({
    addr: null,
    loggedIn: null,
    cid: null,
    expiresAt: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [villageMembership, setVillageMembership] = useState<any>(null);

  // Check if user exists in Supabase and create if not
  const syncUserWithSupabase = useCallback(async (flowUser: FlowUser) => {
    if (!flowUser.addr) return;
    
    try {
      // Check if user exists in Supabase
      const { data: existingUser, error: queryError } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', flowUser.addr)
        .single();
      
      if (queryError && queryError.code !== 'PGRST116') {  // PGRST116 is "not found" error
        console.error("Error checking user in Supabase:", queryError);
        return;
      }
      
      // If user doesn't exist, add them to Supabase
      if (!existingUser) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({ wallet_address: flowUser.addr });
          
        if (insertError) {
          console.error("Error creating user in Supabase:", insertError);
          return;
        } else {
          console.log("User created in Supabase:", flowUser.addr);
        }
      } else {
        console.log("User already exists in Supabase:", flowUser.addr);
      }
      
      // Check for village membership
      const { data: membership, error: membershipError } = await supabase
        .from('memberships')
        .select('*')
        .eq('user_wallet', flowUser.addr);
        
      if (membershipError) {
        console.error("Error checking village membership:", membershipError);
        return;
      }
      
      setVillageMembership(membership && membership.length > 0 ? membership[0] : null);
      
    } catch (error) {
      console.error("Error syncing user with Supabase:", error);
    }
  }, []);

  useEffect(() => {
    // Initialize Flow configuration
    initFlowConfig();
    
    // Subscribe to user authentication changes
    const unsubscribe = fcl.currentUser().subscribe((currentUser: FlowUser) => {
      setUser(currentUser);
      
      // If user is authenticated, sync with Supabase
      if (currentUser && currentUser.loggedIn && currentUser.addr) {
        syncUserWithSupabase(currentUser);
      } else {
        setVillageMembership(null);
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [syncUserWithSupabase]);

  const connectWallet = useCallback(async () => {
    setIsLoading(true);
    try {
      await fcl.authenticate();
      toast.success("Wallet connected successfully");
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      toast.error("Failed to connect wallet");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    setIsLoading(true);
    try {
      await fcl.unauthenticate();
      setVillageMembership(null);
      toast.success("Wallet disconnected");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast.error("Failed to disconnect wallet");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isLoading,
    isConnected: user?.loggedIn,
    villageMembership,
    connectWallet,
    disconnectWallet
  };
};
