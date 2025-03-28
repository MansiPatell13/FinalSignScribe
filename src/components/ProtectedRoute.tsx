
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Wait until authentication status is checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="h-12 w-12 bg-primary/30 rounded-full"></div>
          <div className="space-y-4">
            <div className="h-4 w-32 bg-primary/30 rounded"></div>
            <div className="h-4 w-24 bg-primary/30 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    toast.error('You must be logged in to access this page');
    return <Navigate to="/login" />;
  }

  // If user is authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
