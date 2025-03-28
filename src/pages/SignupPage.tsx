
import React from 'react';
import { Link } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const SignupPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold heading-gradient">Join SignScribe</h1>
            <p className="text-muted-foreground mt-2">
              Create an account to start translating
            </p>
          </div>
          
          <div className="glass-card rounded-lg p-8">
            <AuthForm type="signup" />
            
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-primary hover:underline font-medium">
                Log in
              </Link>
            </div>
          </div>
          
          <Alert variant="default" className="mt-6">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              After signing up, you'll receive a verification email. Please check your inbox to activate your account.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SignupPage;
