
import React from 'react';
import { 
  Fingerprint, 
  LineChart, 
  ShieldCheck, 
  Zap, 
  Cloud, 
  Smartphone 
} from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="p-6 rounded-xl glass-card">
      <div className="p-3 rounded-full bg-primary/10 w-fit mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const Features: React.FC = () => {
  return (
    <section className="py-20 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-signscribe-purple/10 blur-[80px]" />
        <div className="absolute bottom-[10%] -left-[5%] w-[25%] h-[25%] rounded-full bg-signscribe-blue/10 blur-[60px]" />
      </div>
      
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Advanced Features</h2>
          <p className="text-muted-foreground text-lg">
            SignScribe combines cutting-edge AI technology with a seamless user experience
            to make sign language translation accessible to everyone.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Feature 
            icon={<Fingerprint className="h-6 w-6 text-primary" />}
            title="Precise Landmark Detection"
            description="MediaPipe's hand landmark detection captures even the most subtle hand movements for accurate sign recognition."
          />
          
          <Feature 
            icon={<LineChart className="h-6 w-6 text-primary" />}
            title="LSTM Neural Network"
            description="Our TensorFlow-based LSTM model has been trained on thousands of Indian Sign Language samples for high accuracy."
          />
          
          <Feature 
            icon={<ShieldCheck className="h-6 w-6 text-primary" />}
            title="Secure Authentication"
            description="JWT-based authentication ensures your data is protected and only accessible to you."
          />
          
          <Feature 
            icon={<Zap className="h-6 w-6 text-primary" />}
            title="Real-time Processing"
            description="Experience near-instant translation with our optimized processing pipeline, ensuring no lag or delays."
          />
          
          <Feature 
            icon={<Cloud className="h-6 w-6 text-primary" />}
            title="Cloud-based Architecture"
            description="Our Flask API backend handles the heavy lifting, making SignScribe accessible on any device."
          />
          
          <Feature 
            icon={<Smartphone className="h-6 w-6 text-primary" />}
            title="Responsive Design"
            description="Access SignScribe on any device with our fully responsive design, from desktop to mobile."
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
