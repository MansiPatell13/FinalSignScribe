
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const TechStack: React.FC = () => {
  const technologies = [
    {
      name: 'TensorFlow',
      description: 'Deep learning framework for the LSTM model',
      imagePlaceholder: 'TF'
    },
    {
      name: 'MediaPipe',
      description: 'Hand landmark detection library',
      imagePlaceholder: 'MP'
    },
    {
      name: 'Flask',
      description: 'Python backend for API and authentication',
      imagePlaceholder: 'FL'
    },
    {
      name: 'React',
      description: 'Frontend library for interactive UI',
      imagePlaceholder: 'RE'
    },
    {
      name: 'JWT',
      description: 'Secure authentication mechanism',
      imagePlaceholder: 'JWT'
    },
    {
      name: 'WebRTC',
      description: 'Real-time webcam access',
      imagePlaceholder: 'WR'
    }
  ];

  return (
    <section className="py-20">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Technology Stack</h2>
          <p className="text-muted-foreground text-lg">
            SignScribe leverages cutting-edge technologies to deliver a seamless and accurate 
            sign language translation experience.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {technologies.map((tech, index) => (
            <Card key={index} className="overflow-hidden border-0 glass-card">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mb-4 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">{tech.imagePlaceholder}</span>
                </div>
                <h3 className="font-semibold mb-2">{tech.name}</h3>
                <p className="text-xs text-muted-foreground">{tech.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
