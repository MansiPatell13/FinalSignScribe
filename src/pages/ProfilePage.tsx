
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { updateProfile } from 'firebase/auth';
import { auth } from '@/integrations/firebase/client';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get user name from Firebase user
  const userName = user?.displayName || '';
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: userName,
      email: user?.email || '',
    },
  });
  
  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setIsLoading(true);
      
      // Update profile in Firebase (only name can be updated this way)
      if (user && values.name !== user.displayName) {
        await updateProfile(user, {
          displayName: values.name
        });
      }
      
      // Email update requires re-authentication and is more complex
      // We'll just show a toast for now
      if (values.email !== user?.email) {
        toast.info('Email update requires re-authentication. Please contact support.');
      }
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow container px-4 mx-auto py-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold heading-gradient">Your Profile</h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Manage your account settings and view your translation history.
          </p>
        </div>
        
        <Tabs defaultValue="profile" className="max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="history">Translation History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="glass-card col-span-1">
                <CardHeader>
                  <CardTitle>User Info</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    {user?.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={userName || 'User'} 
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-primary" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold">{userName || 'User'}</h3>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <Button 
                    variant="outline" 
                    className="mt-6 w-full" 
                    onClick={logout}
                  >
                    Log Out
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="glass-card col-span-2">
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="your.email@example.com" {...field} disabled />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-muted-foreground mt-1">
                              Email changes require additional verification and cannot be done here.
                            </p>
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Translation History</CardTitle>
                <CardDescription>
                  Your recent sign language translations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-2">No translation history yet.</p>
                  <p className="text-sm text-muted-foreground">
                    Your translations will appear here once you start using the translation feature.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
