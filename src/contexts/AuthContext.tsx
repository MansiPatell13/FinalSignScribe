
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('signscribe-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('signscribe-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // For demo purposes, we'll simulate the API call
      // In production, this would be a real API call to your Flask backend
      /*
      const response = await fetch('https://your-api-url/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
      
      const userData = await response.json();
      */
      
      // Simulated response for demo
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Demo login (replace with actual API integration)
      if (email === 'demo@example.com' && password === 'password') {
        const userData = {
          id: '1',
          name: 'Demo User',
          email: 'demo@example.com',
          token: 'simulated-jwt-token',
        };
        
        setUser(userData);
        localStorage.setItem('signscribe-user', JSON.stringify(userData));
        toast.success('Logged in successfully');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed. Please try again.';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // For demo purposes, we'll simulate the API call
      // In production, this would be a real API call to your Flask backend
      /*
      const response = await fetch('https://your-api-url/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }
      
      const userData = await response.json();
      */
      
      // Simulated response for demo
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Demo signup (replace with actual API integration)
      const userData = {
        id: '1',
        name,
        email,
        token: 'simulated-jwt-token',
      };
      
      setUser(userData);
      localStorage.setItem('signscribe-user', JSON.stringify(userData));
      toast.success('Signed up successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed. Please try again.';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('signscribe-user');
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user,
        isLoading,
        login, 
        signup, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
