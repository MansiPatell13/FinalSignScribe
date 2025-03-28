
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Auth,
  User, 
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GithubAuthProvider,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/integrations/firebase/client';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
      
      if (user) {
        console.log('User is signed in', user);
      } else {
        console.log('User is signed out');
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Signed in successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGithub = async () => {
    try {
      setIsLoading(true);
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Signed in with GitHub successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with GitHub');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's profile with their name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name
        });
        
        // Send email verification
        await sendEmailVerification(userCredential.user);
      }
      
      toast.success('Signup successful! Please check your email to confirm your account.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut(auth);
      toast.info('Signed out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent. Please check your inbox.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send password reset email');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signInWithGithub,
        signup,
        logout,
        resetPassword
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
