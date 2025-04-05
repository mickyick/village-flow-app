
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Users } from 'lucide-react';
import { useFlowAuth } from '@/integrations/flow/useFlowAuth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isConnected, connectWallet, disconnectWallet, isLoading } = useFlowAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Check if user is in a village
  const { data: isInVillage } = useQuery({
    queryKey: ['userInVillage', user?.addr],
    queryFn: async () => {
      if (!user?.addr) return false;
      
      const { data, error } = await supabase
        .from('village_members' as any)
        .select('id')
        .eq('user_id', user.addr);
      
      if (error) {
        console.error('Error checking village membership:', error);
        return false;
      }
      
      return data && data.length > 0;
    },
    enabled: !!isConnected && !!user?.addr,
  });

  const handleWalletConnection = async () => {
    try {
      if (isConnected) {
        await disconnectWallet();
        toast.success('Wallet disconnected');
      } else {
        await connectWallet();
        toast.success('Wallet connected');
      }
    } catch (error) {
      toast.error('Failed to connect wallet');
      console.error(error);
    }
  };

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b">
      <div className="village-container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
         <Link to="/" className="flex items-center gap-2">
         <img src="/village-logo.png" alt="Village Logo" className="h-8 w-auto" />
         <span className="font-nunito font-bold text-xl">Village</span>
        </Link>
        </div>
        
        {/* Mobile menu button */}
        <button
          className="block md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
        
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {isConnected && (
            <Link 
              to="/my-village" 
              className={`font-medium ${isActive('/my-village') ? 'text-village-rust' : 'text-foreground hover:text-village-rust transition-colors'}`}
            >
              My Village
            </Link>
          )}
          
          {/* Only show Create/Join Village links if user is not already in a village */}
          {isConnected && !isInVillage && (
            <>
              <Link 
                to="/create" 
                className={`font-medium ${isActive('/create') ? 'text-village-rust' : 'text-foreground hover:text-village-rust transition-colors'}`}
              >
                Create Village
              </Link>
              <Link 
                to="/join" 
                className={`font-medium ${isActive('/join') ? 'text-village-rust' : 'text-foreground hover:text-village-rust transition-colors'}`}
              >
                Join Village
              </Link>
            </>
          )}
          
          <Button 
            className="village-button-primary"
            onClick={handleWalletConnection}
            disabled={isLoading}
          >
            {isLoading 
              ? "Connecting..." 
              : isConnected 
                ? `Connected: ${user.addr?.substring(0, 6)}...${user.addr?.substring(user.addr.length - 4)}`
                : "Connect Wallet"
            }
          </Button>
        </nav>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t animate-fade-in">
          <div className="village-container py-4 space-y-4">
            {isConnected && (
              <Link 
                to="/my-village" 
                className={`block py-2 font-medium ${isActive('/my-village') ? 'text-village-rust' : 'text-foreground'}`}
                onClick={() => setIsOpen(false)}
              >
                My Village
              </Link>
            )}
            
            {/* Only show Create/Join Village links if user is not already in a village */}
            {isConnected && !isInVillage && (
              <>
                <Link 
                  to="/create" 
                  className={`block py-2 font-medium ${isActive('/create') ? 'text-village-rust' : 'text-foreground'}`}
                  onClick={() => setIsOpen(false)}
                >
                  Create Village
                </Link>
                <Link 
                  to="/join" 
                  className={`block py-2 font-medium ${isActive('/join') ? 'text-village-rust' : 'text-foreground'}`}
                  onClick={() => setIsOpen(false)}
                >
                  Join Village
                </Link>
              </>
            )}
            
            <Button 
              className="village-button-primary w-full"
              onClick={handleWalletConnection}
              disabled={isLoading}
            >
              {isLoading 
                ? "Connecting..." 
                : isConnected 
                  ? `Connected: ${user.addr?.substring(0, 6)}...${user.addr?.substring(user.addr.length - 4)}`
                  : "Connect Wallet"
              }
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
