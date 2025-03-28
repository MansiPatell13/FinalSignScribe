
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2, Shield, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Hero: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative pt-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[30%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute top-[40%] -left-[5%] w-[40%] h-[40%] rounded-full bg-signscribe-blue/30 blur-[90px]" />
      </div>
      
      <div className="container px-4 mx-auto py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Making Indian Sign Language 
              <span className="heading-gradient block">Accessible to All</span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground">
              SignScribe translates Indian Sign Language to text in real-time using advanced AI technology, 
              breaking down communication barriers for the deaf and hard of hearing community.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              {isAuthenticated ? (
                <Button size="lg" asChild>
                  <Link to="/translate" className="gap-2">
                    Start Translating <ArrowRight size={16} />
                  </Link>
                </Button>
              ) : (
                <Button size="lg" asChild>
                  <Link to="/signup" className="gap-2">
                    Sign Up Free <ArrowRight size={16} />
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="lg" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
            
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="p-3 rounded-full bg-primary/10 mb-3">
                  <Video className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">Real-time Recognition</h3>
                <p className="text-sm text-muted-foreground mt-1">Instant translation with no lag</p>
              </div>
              
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="p-3 rounded-full bg-primary/10 mb-3">
                  <BarChart2 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">High Accuracy</h3>
                <p className="text-sm text-muted-foreground mt-1">Powered by TensorFlow LSTM</p>
              </div>
              
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="p-3 rounded-full bg-primary/10 mb-3">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">Secure & Private</h3>
                <p className="text-sm text-muted-foreground mt-1">Your data stays on your device</p>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-hero opacity-20 blur-2xl rounded-full transform scale-110"></div>
              <div className="relative glass-card rounded-3xl overflow-hidden aspect-[4/3] animate-pulse-slow">
                {/* This would be a video or animation showing SignScribe in action */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-xl font-medium text-muted-foreground">Live Demo Video</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
