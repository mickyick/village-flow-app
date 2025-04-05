
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Calendar, Clock, ImagePlus, Loader2, Plus, Users } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { format, formatDistanceToNow } from 'date-fns';

// Types for our data
interface Village {
  id: string;
  name: string;
  description: string | null;
  goal: string;
  start_date: string;
  end_date: string;
  stake: number;
  reward_type: string | null;
}

interface Member {
  id: string;
  user_id: string;
  role: string;
  stake_amount: number | null;
  wallet_address?: string;
  avatar?: string;
  name?: string;
}

interface ActivityItem {
  id: number;
  user_id: string | null;
  title: string | null;
  timestamp: string;
  description: string | null;
  image_proof: string | null;
  user?: {
    name: string;
    avatar: string;
  };
}

const VillageDetail = () => {
  const { id } = useParams<{ id: string }>();
    console.log('Route ID param:', id);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [village, setVillage] = useState<Village | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    image: null as File | null
  });

  // Calculate days passed
  const getDaysPassed = () => {
    if (!village) return '0';
    
    const startDate = new Date(village.start_date);
    const endDate = new Date(village.end_date);
    const today = new Date();
    
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    const daysPassed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    
    return `${Math.max(0, Math.min(daysPassed, totalDays))} of ${totalDays}`;
  };

  // Fetch village data
  useEffect(() => {
    const fetchVillageData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch village details
        const { data: villageData, error: villageError } = await supabase
          .from('village')
          .select('*')
          .eq('id', id)
          .single();
          
          if (villageError) {
            console.error('Error fetching village data:', villageError);
            throw villageError;
          }
        
        // Fetch village members
        const { data: membersData, error: membersError } = await supabase
          .from('village_members')
          .select('*')
          .eq('village_id', id);
          
        if (membersError) throw membersError;
        
        // Fetch activity data
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('activities')
          .select('*')
          .eq('village_id', id)
          .order('timestamp', { ascending: false });
          
        if (activitiesError) throw activitiesError;
        
        // Process activities to add user info
        const processedActivities = activitiesData ? activitiesData.map((activity) => ({
          ...activity,
          user: {
            name: 'Member', // Placeholder - ideally fetch actual names
            avatar: '/placeholder.svg'
          }
        })) : [];
        
        if (villageData) {
          setVillage(villageData);
        }
        
        if (membersData) {
          setMembers(membersData);
        }
        
        setActivities(processedActivities);
      } catch (error) {
        console.error('Error fetching village data:', error);
        toast.error('Failed to load village data');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchVillageData();
    }
  }, [id]);
  
  const handleSubmitActivity = async () => {
    if (!newActivity.title) {
      toast.error('Please add a title for your activity');
      return;
    }
    
    try {
      let imageUrl = null;
      
      if (newActivity.image) {
        // Image upload logic would go here
        // For now, we'll skip actual upload
        imageUrl = URL.createObjectURL(newActivity.image);
      }
      
      // Insert activity to Supabase
      const { data, error } = await supabase
        .from('activities')
        .insert({
          title: newActivity.title,
          description: newActivity.description || null,
          image_proof: imageUrl,
          timestamp: new Date().toISOString(),
          user_id: 'current-user-id', // This should be the actual user ID
          village_id: id
        });
      
      if (error) throw error;
      
      // Add the new activity to the state
      const newActivityItem: ActivityItem = {
        id: Date.now(), // Temporary ID until we get the real one
        title: newActivity.title,
        description: newActivity.description || null,
        image_proof: imageUrl,
        timestamp: new Date().toISOString(),
        user_id: 'current-user-id',
        user: {
          name: 'You',
          avatar: '/placeholder.svg'
        }
      };
      
      setActivities([newActivityItem, ...activities]);
      setIsSubmitOpen(false);
      setNewActivity({ title: '', description: '', image: null });
      toast.success('Activity submitted successfully!');
    } catch (error) {
      console.error('Error submitting activity:', error);
      toast.error('Failed to submit activity');
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewActivity({ ...newActivity, image: e.target.files[0] });
    }
  };
  
  // Format relative time
  const getRelativeTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'unknown time';
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-village-rust" />
          <p className="text-muted-foreground">Loading village details...</p>
        </div>
      </div>
    );
  }
  
  if (!village) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Village not found</h2>
          <p className="text-muted-foreground mt-2">
            The village you're looking for doesn't exist or you don't have access to it.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Village Header */}
      <div className="bg-muted/50 py-8 border-b">
        <div className="village-container">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold">{village.name}</h1>
              <p className="text-muted-foreground mt-1">{village.goal}</p>
              
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Day {getDaysPassed()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{members.length} Members</span>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg shadow-sm">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Staked</div>
                  <div className="text-xl font-bold">{village.stake * members.length} FLOW</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Prize Pool</div>
                  <div className="text-xl font-bold text-village-mustard">{village.stake * members.length} FLOW</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wallet Addresses Section - Fixed the nesting issue here */}
      <div className="bg-background py-8">
        <div className="village-container">
          <h2 className="text-xl font-bold mb-6">Wallet Addresses</h2>
          <div className="flex flex-col space-y-2">
            {members.map((member) => (
              <div key={member.id || member.user_id} className="p-3 bg-muted rounded-lg">
                <div className="text-xs text-muted-foreground">{member.wallet_address || 'No wallet address'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Progress Tracker */}
      <div className="border-b">
        <div className="village-container py-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Your weekly progress</div>
                <div className="text-sm font-medium">3/4 complete</div>
              </div>
              <Progress value={75} className="h-2.5" />
            </div>
            <div className="md:text-right">
              <div className="text-sm text-muted-foreground">Current streak</div>
              <div className="font-bold text-village-rust">3 days 🔥</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Activity Feed */}
      <div className="village-container py-8">
        <h2 className="text-xl font-bold mb-6">Activity Feed</h2>
        
        {activities.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">No activities yet. Be the first to submit one!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="village-card flex gap-4">
                <Avatar>
                  <AvatarImage src={activity.user?.avatar} alt={activity.user?.name} />
                  <AvatarFallback>{activity.user?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-2">
                    <div>
                      <span className="font-medium">{activity.user?.name}</span>
                      <span className="text-muted-foreground"> completed </span>
                      <span className="font-medium">{activity.title}</span>
                    </div>
                    
                    <div className="text-sm text-muted-foreground flex items-center gap-1 sm:ml-auto">
                      <Clock className="h-3 w-3" />
                      {getRelativeTime(activity.timestamp)}
                    </div>
                  </div>
                  
                  {activity.description && (
                    <p className="text-muted-foreground text-sm mb-3">{activity.description}</p>
                  )}
                  
                  {activity.image_proof && (
                    <div className="mt-2">
                      <img 
                        src={activity.image_proof} 
                        alt="Proof" 
                        className="rounded-lg max-h-48 object-cover" 
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Submit Activity Button (Sticky) */}
      <div className="fixed bottom-6 left-6">
        <Button 
          onClick={() => setIsSubmitOpen(true)}
          className="h-14 w-14 rounded-full bg-village-rust hover:bg-village-rust/90 text-white shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Submit Activity Dialog */}
      <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Activity</DialogTitle>
            <DialogDescription>
              Provide proof of your activity to track your progress.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                placeholder="e.g., Morning Yoga" 
                value={newActivity.title}
                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea 
                id="description" 
                placeholder="Add details about your activity..." 
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="proof">Upload Proof (optional)</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                onClick={() => document.getElementById('proof')?.click()}>
                <ImagePlus className="h-8 w-8 mx-auto text-muted-foreground/60" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {newActivity.image ? newActivity.image.name : 'Click to upload an image'}
                </p>
                <input 
                  type="file" 
                  id="proof" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmitActivity}
              className="village-button-primary"
            >
              Submit Activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VillageDetail;
