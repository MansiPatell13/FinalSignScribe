
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TranslationResultProps {
  results: string[];
}

const TranslationResult: React.FC<TranslationResultProps> = ({ results }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to the bottom when new results are added
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [results]);
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle>Translation Results</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] rounded-md border p-4" ref={scrollRef}>
          {results.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No translations yet.</p>
              <p className="text-sm mt-2">Start the webcam to begin translating.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg ${
                    index === results.length - 1 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-lg">{result}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date().toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TranslationResult;
