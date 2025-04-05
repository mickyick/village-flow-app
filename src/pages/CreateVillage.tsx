import { supabase } from '@/integrations/supabase/client'; // adjust the path as needed
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Copy, Share } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const CreateVillage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [stake, setStake] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [step, setStep] = useState(1);
  
  const handleNext = () => {
    if (step === 1) {
      if (!name || !goal) {
        toast.error('Please fill in all required fields');
        return;
      }
    } else if (step === 2) {
      if (!startDate || !endDate) {
        toast.error('Please select both start and end dates');
        return;
      }
      if (startDate >= endDate) {
        toast.error('End date must be after start date');
        return;
      }
    } else if (step === 3) {
      if (!stake) {
        toast.error('Please enter a stake amount');
        return;
      }
      // Generate a dummy invite link
      setInviteLink(`village.app/join/${Math.random().toString(36).substring(2, 8)}`);
    }
    
    if (step < 4) {
      setStep(step + 1);
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success('Invite link copied to clipboard!');
  };
  
  const handleFinish = async () => {
    // Generate unique slug or invite ID
    const inviteSlug = Math.random().toString(36).substring(2, 8);
  
    try {
      const { data, error } = await supabase
        .from('village')
        .insert([
          {
            name,
            description,
            goal,
            start_date: startDate?.toISOString(),
            end_date: endDate?.toISOString(),
            stake: parseFloat(stake),
            invite_link: inviteSlug,
            reward_type: 'winner_takes_all'
          }
        ]);
    
      if (error) {
        toast.error(`Failed to create village: ${error.message}`);
        return;
      }
    
      toast.success('Village created successfully!');
      navigate(`/village/${inviteSlug}`);
    } catch (err) {
      console.error('Error creating village:', err);
      toast.error('Failed to create village');
    }
  };
  
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Village Name*</Label>
              <Input 
                id="name" 
                placeholder="e.g., Morning Exercise Club" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Village Description (optional)</Label>
              <Textarea 
                id="description" 
                placeholder="Tell others what this village is about..." 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goal">Goal Criteria*</Label>
              <Input 
                id="goal" 
                placeholder="e.g., Exercise 4x per week" 
                value={goal} 
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Start Date*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Select start date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="rounded-md border pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>End Date*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Select end date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => {
                      if (!startDate) return false;
                      return date < startDate;
                    }}
                    initialFocus
                    className="rounded-md border pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="pt-4 border-t">
              <CardDescription>
                Your village will run for {startDate && endDate ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : '0'} days.
              </CardDescription>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="stake">Stake Amount (FLOW)*</Label>
              <Input 
                id="stake" 
                type="number" 
                placeholder="e.g., 10" 
                value={stake} 
                onChange={(e) => setStake(e.target.value)}
              />
              <CardDescription>
                Each member will stake this amount to join your village.
              </CardDescription>
            </div>
            
            <div className="pt-6 border-t space-y-4">
              <h4 className="font-medium">Reward Rules</h4>
              
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <input type="radio" id="rule1" name="rule" className="mt-1" defaultChecked />
                  <div>
                    <Label htmlFor="rule1" className="font-medium">Winners take all</Label>
                    <CardDescription>
                      Members who complete all goals split the entire pool.
                    </CardDescription>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <input type="radio" id="rule2" name="rule" className="mt-1" />
                  <div>
                    <Label htmlFor="rule2" className="font-medium">Proportional rewards</Label>
                    <CardDescription>
                      Rewards distributed based on percentage of goals completed.
                    </CardDescription>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6 text-center">
            <div className="mx-auto bg-village-mustard/10 p-4 rounded-full w-20 h-20 flex items-center justify-center">
              <Share className="h-8 w-8 text-village-mustard" />
            </div>
            
            <h3 className="font-bold text-xl">Your Village is Ready!</h3>
            
            <p className="text-muted-foreground">
              Share this invite link with friends to join your village.
            </p>
            
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium truncate flex-1">
                {inviteLink}
              </span>
              <Button size="sm" variant="ghost" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="pt-6">
              <Button 
                onClick={handleFinish}
                className="village-button-primary w-full"
              >
                Go to Village Dashboard
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="village-container py-12">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Create Your Village</CardTitle>
          <CardDescription>
            {step === 1 && "Define your village and set a shared goal"}
            {step === 2 && "Set the timeframe for your challenge"}
            {step === 3 && "Configure stakes and rewards"}
            {step === 4 && "Invite members to your village"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {renderStepContent()}
        </CardContent>
        
        {step < 4 && (
          <CardFooter className="flex justify-between">
            {step > 1 ? (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            ) : (
              <div></div>
            )}
            
            <Button 
              onClick={handleNext}
              className="village-button-primary"
            >
              {step === 3 ? "Create Village" : "Next"}
            </Button>
          </CardFooter>
        )}
      </Card>
      
      <div className="flex justify-center mt-8">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full ${
                i === step ? 'bg-village-rust' : 'bg-muted-foreground/30'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateVillage;
