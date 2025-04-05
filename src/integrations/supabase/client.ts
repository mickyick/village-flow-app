
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ilzrakdidphizbglpayu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsenJha2RpZHBoaXpiZ2xwYXl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3OTM0NTQsImV4cCI6MjA1OTM2OTQ1NH0.BSGHfOr5CcjkaLJEv9HFWs3YffxOU7RNa3j_F71Mx3M";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Define database types manually since we're getting type errors
// This is a temporary solution until proper types are generated
type Tables = {
  village: {
    Row: {
      id: string;
      name: string;
      description: string | null;
      goal: string;
      start_date: string;
      end_date: string;
      stake: number;
      invite_link: string | null;
      reward_type: string | null;
      created_by: string | null;
      created_at: string | null;
    };
    Insert: {
      name: string;
      description?: string | null;
      goal: string;
      start_date: string;
      end_date: string;
      stake: number;
      invite_link?: string | null;
      reward_type?: string | null;
      created_by?: string | null;
    };
  };
  village_members: {
    Row: {
      id: string;
      user_id: string;
      village_id: string;
      role: string;
      stake_amount: number | null;
      joined_at: string | null;
    };
    Insert: {
      user_id: string;
      village_id: string;
      role?: string;
      stake_amount?: number | null;
    };
  };
  activities: {
    Row: {
      id: number;
      title: string | null;
      description: string | null;
      image_proof: string | null;
      timestamp: string;
      user_id: string | null;
      village_id: string | null;
    };
    Insert: {
      title?: string | null;
      description?: string | null;
      image_proof?: string | null;
      timestamp?: string;
      user_id?: string | null;
      village_id?: string | null;
    };
  };
};

// Create a simplified Database type for our client
interface CustomDatabase {
  public: {
    Tables: Tables;
  };
}

export const supabase = createClient<CustomDatabase>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
