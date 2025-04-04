import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
const taglines = ["become a healthier you", "finish a project", "build better relationships"];
const Home = () => {
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTaglineIndex(prevIndex => (prevIndex + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="village-container text-center">
          <div className="inline-block bg-village-mustard/10 px-4 py-2 rounded-full text-village-mustard mb-6 animate-fade-in">
            Web3-Powered Social Accountability
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            It takes a village to...
          </h1>
          
          <div className="h-12 md:h-16 mb-8 ">
            {taglines.map((tagline, index) => <h2 key={tagline} className={`text-2xl md:text-3xl lg:text-4xl font-semibold text-village-rust transition-all duration-500 ${index === currentTaglineIndex ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                {tagline}
              </h2>)}
          </div>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in">
            Join accountability groups, stake tokens, and achieve your goals together with the power of community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link to="/create" className="village-button-primary flex items-center justify-center gap-2 text-lg">
              Create a Village <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/join" className="village-button-secondary flex items-center justify-center gap-2 text-lg">
              Join a Village <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="village-container">
          <h2 className="text-3xl font-bold mb-12 text-center">How Village Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="village-card animate-fade-in">
              <div className="bg-village-rust/10 p-3 rounded-full w-fit mb-4">
                <span className="text-xl font-bold text-village-rust">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Create or Join</h3>
              <p className="text-muted-foreground">
                Start your own accountability group or join an existing one with friends or colleagues.
              </p>
            </div>
            
            <div className="village-card animate-fade-in" style={{
            animationDelay: '0.2s'
          }}>
              <div className="bg-village-olive/10 p-3 rounded-full w-fit mb-4">
                <span className="text-xl font-bold text-village-olive">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Stake & Commit</h3>
              <p className="text-muted-foreground">
                Set a shared goal, stake your tokens, and define reward rules for your accountability journey.
              </p>
            </div>
            
            <div className="village-card animate-fade-in" style={{
            animationDelay: '0.4s'
          }}>
              <div className="bg-village-mustard/10 p-3 rounded-full w-fit mb-4">
                <span className="text-xl font-bold text-village-mustard">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Track & Earn</h3>
              <p className="text-muted-foreground">
                Submit proof of your activities, track progress, and earn rewards for achieving your goals.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default Home;