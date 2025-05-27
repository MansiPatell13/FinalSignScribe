import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WebcamFeed from "@/components/WebcamFeed";
import TranslationResult from "@/components/TranslationResult";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const TranslatePage: React.FC = () => {
  const [translationResults, setTranslationResults] = useState<string[]>([]);

  const handleTranslationResult = (text: string) => {
    setTranslationResults((prev) => [...prev, text]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow container px-4 mx-auto py-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold heading-gradient">
            ISL to Text Translation
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Use your webcam to translate Indian Sign Language to text in
            real-time. Position your hands in the frame and start signing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <WebcamFeed onTranslationResult={handleTranslationResult} />
          </div>

          <div>
            <TranslationResult results={translationResults} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TranslatePage;
