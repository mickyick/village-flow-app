
import { useState } from 'react';
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
import { Calendar, Clock, ImagePlus, Plus, Users } from 'lucide-react';

interface ActivityItem {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  title: string;
  timestamp: Date;
  description?: string;
  imageProof?: string;
}

const VillageDetail = () => {
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: 1,
      user: { name: 'Alex', avatar: '/placeholder.svg' },
      title: 'Morning run',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      description: 'Completed a 5k run around the park',
      imageProof: '/placeholder.svg'
    },
    {
      id: 2,
      user: { name: 'Taylor', avatar: '/placeholder.svg' },
      title: 'Yoga session',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      description: 'Hour-long yoga session focusing on flexibility',
    },
    {
      id: 3,
      user: { name: 'Jordan', avatar: '/placeholder.svg' },
      title: 'Weight training',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      imageProof: '/placeholder.svg'
    }
  ]);
  
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    image: null as File | null
  });
  
  const handleSubmitActivity = () => {
    if (!newActivity.title) {
      toast.error('Please add a title for your activity');
      return;
    }
    
    const newActivityItem: ActivityItem = {
      id: Date.now(),
      user: { name: 'You', avatar: '/placeholder.svg' },
      title: newActivity.title,
      timestamp: new Date(),
      description: newActivity.description || undefined,
      imageProof: newActivity.image ? URL.createObjectURL(newActivity.image) : undefined
    };
    
    setActivities([newActivityItem, ...activities]);
    setIsSubmitOpen(false);
    setNewActivity({ title: '', description: '', image: null });
    toast.success('Activity submitted successfully!');
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewActivity({ ...newActivity, image: e.target.files[0] });
    }
  };
  
  // Format relative time
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };
  
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Village Header */}
      <div className="bg-muted/50 py-8 border-b">
        <div className="village-container">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold">Morning Exercise Club</h1>
              <p className="text-muted-foreground mt-1">Exercise 4x per week</p>
              
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Day 7 of 30</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">4 Members</span>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg shadow-sm">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Staked</div>
                  <div className="text-xl font-bold">40 FLOW</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Prize Pool</div>
                  <div className="text-xl font-bold text-village-mustard">40 FLOW</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap -space-x-2 mt-6">
            <Avatar className="border-2 border-background">
              <AvatarImage src="/placeholder.svg" alt="Alex" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <Avatar className="border-2 border-background">
              <AvatarImage src="/placeholder.svg" alt="Taylor" />
              <AvatarFallback>T</AvatarFallback>
            </Avatar>
            <Avatar className="border-2 border-background">
              <AvatarImage src="/placeholder.svg" alt="Jordan" />
              <AvatarFallback>J</AvatarFallback>
            </Avatar>
            <Avatar className="border-2 border-background">
              <AvatarImage src="/placeholder.svg" alt="You" />
              <AvatarFallback>Y</AvatarFallback>
            </Avatar>
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
        
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="village-card flex gap-4">
              <Avatar>
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-2">
                  <div>
                    <span className="font-medium">{activity.user.name}</span>
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
                
                {activity.imageProof && (
                  <div className="mt-2">
                    <img 
                      src={activity.imageProof} 
                      alt="Proof" 
                      className="rounded-lg max-h-48 object-cover" 
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
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
