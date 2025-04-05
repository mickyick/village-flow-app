
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { CalendarDays, Trophy, Users } from 'lucide-react';
import { useFlowAuth } from '@/integrations/flow/useFlowAuth';
import { supabase } from '@/integrations/supabase/client';

const JoinVillage = () => {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [village, setVillage] = useState<any>(null);
  const { user, isConnected, connectWallet, isLoading: isAuthLoading } = useFlowAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode) {
      toast.error('Please enter an invite code');
      return;
    }
    
    setIsLoading(true);
    
    try {
    // Query Supabase to find the village based on the invite code
    const { data: villageData, error } = await supabase
      .from('village') 
      .select('*')
      .eq('invite_code', inviteCode) 
      .single(); 
    
    if (error) {
      toast.error('Failed to find village');
      setIsLoading(false);
      return;
    }

    if (villageData) {
      // Set the village data into the state
      // Initialize members as an empty array if not present
      setVillage({
        ...villageData,
        members: [] // Initialize with empty array
      });
    } else {
      toast.error('Village not found');
    }

    } catch (error) {
      toast.error('An error occurred while fetching village data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleJoin = async () => {
    if (!isConnected) {
      try {
        await connectWallet();
        toast.success('Wallet connected!');
        // Wait a moment before proceeding with join
        setTimeout(() => {
          toast.success('Successfully joined village!');
          navigate(`/village/${village.id}`);
        }, 1000);
      } catch (error) {
        toast.error('Please connect your wallet to join');
      }
    } else {
      toast.success('Successfully joined village!');
      navigate(`/village/${village.id}`);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      toast.success('Wallet connected!');
    } catch (error) {
      toast.error('Failed to connect wallet');
      console.error(error);
    }
  };
  
  return (
    <div className="village-container py-12">
      {!village ? (
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Join a Village</CardTitle>
            <CardDescription>
              Enter the invite code or link you received to join an existing village.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input 
                  placeholder="Enter invite code" 
                  value={inviteCode} 
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="text-center"
                />
              </div>
              
              <Button 
                type="submit" 
                className="village-button-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Find Village'}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="justify-center border-t pt-6">
            <CardDescription>
              Don't have an invite? <a href="/create" className="text-village-rust hover:underline">Create your own village</a>
            </CardDescription>
          </CardFooter>
        </Card>
      ) : (
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{village.name}</CardTitle>
              <div className="bg-village-mustard/10 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-village-mustard">Active</span>
              </div>
            </div>
            <CardDescription>
              {village.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="bg-background p-2 rounded-full">
                  <Trophy className="h-5 w-5 text-village-rust" />
                </div>
                <div>
                  <div className="text-sm font-medium">Goal</div>
                  <div className="text-sm">{village.goal}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="bg-background p-2 rounded-full">
                  <CalendarDays className="h-5 w-5 text-village-olive" />
                </div>
                <div>
                  <div className="text-sm font-medium">Duration</div>
                  <div className="text-sm">
                    {new Date(village.start_date).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })} - {new Date(village.end_date).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">Members</span>
              </div>
              
              <div className="flex -space-x-2">
                {village.members && village.members.map((member: any) => (
                  <div key={member.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">{member.wallet_address}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Required Stake</span>
                <span className="font-bold">{village.stake} FLOW</span>
              </div>
              
              <p className="text-sm text-muted-foreground">
                By joining, you agree to stake {village.stake} FLOW tokens. You'll earn rewards by meeting the village goal.
              </p>
            </div>

            {!isConnected && (
              <Button 
                onClick={handleConnectWallet}
                className="w-full bg-village-olive hover:bg-village-olive/90"
                disabled={isAuthLoading}
              >
                {isAuthLoading ? 'Connecting...' : 'Connect Wallet First'}
              </Button>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button 
              onClick={handleJoin}
              className="village-button-primary w-full"
              disabled={isAuthLoading}
            >
              {isConnected 
                ? `Join & Stake ${village.stake} FLOW` 
                : `Connect & Stake ${village.stake} FLOW`
              }
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => setVillage(null)}
              className="text-muted-foreground"
            >
              Cancel
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default JoinVillage;
