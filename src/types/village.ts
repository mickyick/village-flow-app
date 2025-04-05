
export interface Village {
  id: string;
  name: string;
  description: string | null;
  goal: string;
  start_date: string;
  end_date: string;
  created_at: string;
  stake_amount: number;
  created_by: string | null;
}

export interface VillageMember {
  id: string;
  village_id: string;
  user_id: string;
  joined_at: string;
  villages?: Village;
}
