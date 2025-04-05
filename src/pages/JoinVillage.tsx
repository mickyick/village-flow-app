
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

const JoinVillage = () => {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [village, setVillage] = useState<any>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode) {
      toast.error('Please enter an invite code');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      // Simulate a found village for demo purposes
      setVillage({
        id: 'demo',
        name: 'Morning Exercise Club',
        description: 'A group committed to working out in the morning 4 times per week',
        goal: 'Exercise 4x per week',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        stakeAmount: '10',
        members: [
          { id: 1, name: 'Alex', avatar: '/placeholder.svg' },
          { id: 2, name: 'Taylor', avatar: '/placeholder.svg' },
          { id: 3, name: 'Jordan', avatar: '/placeholder.svg' },
        ]
      });
      
      setIsLoading(false);
    }, 1500);
  };
  
  const handleJoin = () => {
    toast.success('Successfully joined village!');
    navigate('/village/demo');
  };
  
  return (
    <div className="village-container py-12">
      {!village ? (
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Join a Village</CardTitle>
            <CardDescription>
              Enter the invite code or link you received to join an existing accountability village.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input 
                  placeholder="Enter invite code or paste invite link" 
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
                  <div className="text-sm">30 days</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">Members ({village.members.length})</span>
              </div>
              
              <div className="flex -space-x-2">
                {village.members.map((member: any) => (
                  <Avatar key={member.id} className="border-2 border-background">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
            
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Required Stake</span>
                <span className="font-bold">{village.stakeAmount} FLOW</span>
              </div>
              
              <p className="text-sm text-muted-foreground">
                By joining, you agree to stake {village.stakeAmount} FLOW tokens. You'll earn rewards by meeting the village goal.
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button 
              onClick={handleJoin}
              className="village-button-primary w-full"
            >
              Join & Stake {village.stakeAmount} FLOW
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
