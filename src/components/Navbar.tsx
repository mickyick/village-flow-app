
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Users } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b">
      <div className="village-container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-village-mustard rounded-full p-1.5">
              <Users className="h-6 w-6 text-white" />
            </div>
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
          <button className="village-button-primary">
            Connect Wallet
          </button>
        </nav>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t animate-fade-in">
          <div className="village-container py-4 space-y-4">
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
            <button className="village-button-primary w-full">
              Connect Wallet
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
