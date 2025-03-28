
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactPage: React.FC = () => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });
  
  const onSubmit = (values: ContactFormValues) => {
    // This would typically send the form data to your backend
    console.log('Form submitted:', values);
    
    // For demo purposes, we'll just show a success message
    toast.success('Message sent successfully! We will get back to you soon.');
    form.reset();
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow container px-4 mx-auto py-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold heading-gradient">Contact Us</h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Have questions or suggestions? We'd love to hear from you. Fill out the form below
            and we'll get back to you as soon as possible.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="glass-card rounded-xl p-8">
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
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="What's this about?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Your message..." 
                          className="min-h-[150px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </Form>
          </div>
          
          <div>
            <div className="glass-card rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
              <p className="text-muted-foreground mb-6">
                We're here to answer any questions you may have about SignScribe,
                including technical support, partnership opportunities, or feedback.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-muted-foreground">info@signscribe.com</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Office</h3>
                  <p className="text-muted-foreground">
                    123 Innovation Street<br />
                    Tech Hub, Bangalore 560001<br />
                    India
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Social Media</h3>
                  <p className="text-muted-foreground">
                    Follow us on Twitter, LinkedIn, and GitHub
                  </p>
                </div>
              </div>
            </div>
            
            <div className="glass-card rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4">FAQ</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Is SignScribe free to use?</h3>
                  <p className="text-muted-foreground">
                    Yes, the basic features of SignScribe are free to use. We also offer premium plans for advanced features.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold">How accurate is the translation?</h3>
                  <p className="text-muted-foreground">
                    Our LSTM model achieves over 90% accuracy on the most common Indian Sign Language gestures.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Can I contribute to the project?</h3>
                  <p className="text-muted-foreground">
                    Absolutely! We welcome contributions from developers, sign language experts, and users.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
