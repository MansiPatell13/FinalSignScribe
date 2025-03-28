
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FlaskIntegration from '@/components/FlaskIntegration';
import { Card, CardContent } from '@/components/ui/card';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow">
        <div className="container px-4 mx-auto py-20">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold heading-gradient">About SignScribe</h1>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
              Bridging the communication gap between the deaf community and the hearing world
              through cutting-edge AI technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground mb-6">
                SignScribe aims to break down communication barriers for the deaf and hard of hearing community
                by leveraging advanced machine learning techniques to translate Indian Sign Language (ISL) to text in real-time.
              </p>
              <p className="text-muted-foreground mb-6">
                According to the World Health Organization, over 5% of the world's population has disabling hearing loss.
                Sign language is the primary means of communication for many of these individuals, yet there's a significant
                communication gap with the hearing population.
              </p>
              <p className="text-muted-foreground">
                Our goal is to create technology that empowers the deaf community and fosters inclusion in all aspects of life,
                from education and employment to social interactions.
              </p>
            </div>
            
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="aspect-video bg-black flex items-center justify-center">
                <p className="text-lg text-muted-foreground">About Video</p>
              </div>
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3">1. Hand Landmark Detection</h3>
                  <p className="text-muted-foreground">
                    Using MediaPipe's hand tracking technology, SignScribe detects and tracks 21 3D landmarks
                    on each hand from the webcam feed in real-time.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3">2. LSTM Neural Network</h3>
                  <p className="text-muted-foreground">
                    The extracted landmarks are processed by a Long Short-Term Memory (LSTM) neural network
                    that has been trained on thousands of Indian Sign Language gestures.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3">3. Text Translation</h3>
                  <p className="text-muted-foreground">
                    The LSTM model interprets the hand movements and gestures, translating them into text
                    which is displayed in real-time on the screen.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <FlaskIntegration />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
