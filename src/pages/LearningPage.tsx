
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink } from 'lucide-react';

interface VideoData {
  id: string;
  file_name: string;
  relative_path: string | null;
  file_id: string;
  preview_url: string;
}

const LearningPage: React.FC = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch videos from Supabase
  useEffect(() => {
    async function fetchVideos() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('isl_videos')
          .select('*');
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setVideos(data);
          setFilteredVideos(data);
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchVideos();
  }, []);
  
  // Filter videos when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredVideos(videos);
    } else {
      const filtered = videos.filter(video => 
        video.file_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredVideos(filtered);
    }
  }, [searchQuery, videos]);
  
  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
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
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="text-center mb-8 p-4 bg-red-100/20 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}
        
        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden glass-card">
                <div className="aspect-video bg-muted/20">
                  <Skeleton className="w-full h-full" />
                </div>
                <CardContent className="pt-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Videos Grid */}
        {!isLoading && filteredVideos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden glass-card flex flex-col">
                <div className="aspect-video bg-muted/20">
                  <iframe 
                    src={`https://drive.google.com/file/d/${video.file_id}/preview`} 
                    width="100%" 
                    height="100%" 
                    allow="autoplay" 
                    title={video.file_name}
                    style={{ border: 'none' }}
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{video.file_name}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2 pt-0">
                  <p className="text-sm text-muted-foreground">Indian Sign Language</p>
                </CardContent>
                <div className="flex-grow"></div>
                <CardFooter className="border-t border-border/30 bg-muted/10 px-6 py-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-primary flex items-center gap-1"
                    onClick={() => window.open(video.preview_url, '_blank')}
                  >
                    <ExternalLink size={14} />
                    Open in Drive
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        {/* No videos found message */}
        {!isLoading && filteredVideos.length === 0 && (
          <div className="text-center max-w-2xl mx-auto p-6 glass-card rounded-lg">
            <p className="text-lg font-medium">
              {videos.length === 0 
                ? 'No videos available yet. Please check back later.' 
                : 'No videos found matching your search.'}
            </p>
            {videos.length > 0 && searchQuery && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
        
        {/* Instructions for uploading videos */}
        <div className="mt-12 p-6 glass-card rounded-lg max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold mb-4">How to Upload Videos</h3>
          <p className="mb-4">
            To add videos to this collection, you'll need to:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Have administrator access to the Supabase project</li>
            <li>Upload your video to Google Drive</li>
            <li>Make sure the video is set to "Anyone with the link can view"</li>
            <li>Insert a new row in the isl_videos table with the file name, file ID, and preview URL</li>
          </ol>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LearningPage;
