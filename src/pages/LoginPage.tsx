
import React from 'react';
import { Link } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold heading-gradient">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">
              Log in to continue your translation journey
            </p>
          </div>
          
          <div className="glass-card rounded-lg p-8">
            <AuthForm type="login" />
            
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Demo Account: <span className="font-medium">demo@example.com</span>
            </p>
            <p>
              Password: <span className="font-medium">password</span>
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LoginPage;
