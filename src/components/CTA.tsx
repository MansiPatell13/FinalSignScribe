
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const CTA: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-signscribe-purple/20 to-signscribe-blue/20 blur-3xl opacity-50" />
      </div>
      
      <div className="container px-4 mx-auto">
        <div className="glass-card rounded-3xl p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience SignScribe?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already breaking down communication barriers
            with our AI-powered Indian Sign Language translator.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
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
        </div>
      </div>
    </section>
  );
};

export default CTA;
