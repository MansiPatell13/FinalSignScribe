
import React from 'react';
import { Search } from 'lucide-react';
import { 
  Card, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const LearningPage: React.FC = () => {
  // Create placeholder data for future video content
  const placeholderVideos = [
    { id: 1, title: 'Greetings in ISL', category: 'Basics' },
    { id: 2, title: 'Common Phrases', category: 'Beginner' },
    { id: 3, title: 'Numbers and Counting', category: 'Basics' },
    { id: 4, title: 'Family Members', category: 'Intermediate' },
    { id: 5, title: 'Colors and Objects', category: 'Beginner' },
    { id: 6, title: 'Everyday Actions', category: 'Intermediate' },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow container px-4 mx-auto py-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold heading-gradient">
            Learn Indian Sign Language
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Explore our collection of video tutorials to learn Indian Sign Language at your own pace.
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search for signs..." 
              className="pl-10 py-6 text-lg" 
            />
          </div>
        </div>
        
        {/* Video Grid - Currently Placeholder */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {placeholderVideos.map((video) => (
            <Card key={video.id} className="overflow-hidden glass-card">
              <div className="aspect-video bg-muted/20 flex items-center justify-center">
                <div className="text-lg font-medium text-muted-foreground">Video Thumbnail</div>
              </div>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-1">{video.title}</h3>
                <p className="text-sm text-muted-foreground">{video.category}</p>
              </CardContent>
              <CardFooter className="border-t border-border/30 bg-muted/10 px-6 py-3">
                <p className="text-xs text-muted-foreground">Coming soon</p>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* Message about upcoming content */}
        <div className="text-center max-w-2xl mx-auto p-6 glass-card rounded-lg">
          <p className="text-lg font-medium">
            Learning resources will be available here soon. Videos are currently being prepared.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Check back regularly for new content or sign up for notifications.
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LearningPage;
