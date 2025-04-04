
import { useState, useEffect, useCallback } from "react";
import * as fcl from "@onflow/fcl";
import { initFlowConfig } from "./config";

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

  useEffect(() => {
    // Initialize Flow configuration
    initFlowConfig();
    
    // Subscribe to user authentication changes
    const unsubscribe = fcl.currentUser().subscribe((currentUser: FlowUser) => {
      setUser(currentUser);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  const connectWallet = useCallback(async () => {
    setIsLoading(true);
    try {
      await fcl.authenticate();
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    setIsLoading(true);
    try {
      await fcl.unauthenticate();
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isLoading,
    isConnected: user?.loggedIn,
    connectWallet,
    disconnectWallet
  };
};
