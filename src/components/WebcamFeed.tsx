import React, { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import { AlertTriangle, Camera, Loader2, ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface WebcamFeedProps {
  onTranslationResult: (text: string) => void;
}

const API_URL = "http://localhost:8000/predict";
const FRAME_INTERVAL_MS = 150;
const SENTENCE_HISTORY_LENGTH = 10;
const PREDICTION_THRESHOLD = 0.6;

const WebcamFeed: React.FC<WebcamFeedProps> = ({ onTranslationResult }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [predictionStatus, setPredictionStatus] =
    useState<string>("Initializing...");
  const [currentSentence, setCurrentSentence] = useState<string[]>([]);
  const [predictionHistory, setPredictionHistory] = useState<string[]>([]);
  const [apiError, setApiError] = useState<boolean>(false);

  const captureFrame = useCallback((): string | null => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        try {
          return canvas.toDataURL("image/jpeg", 0.8);
        } catch (e) {
          console.error("Error converting canvas to data URL:", e);
          setError("Failed to capture frame image.");
          return null;
        }
      }
    }
    return null;
  }, []);

  const sendFrameToBackend = useCallback(
    async (frameDataUrl: string) => {
      if (!frameDataUrl) return;

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: frameDataUrl }),
        });

        setApiError(false);

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ detail: "Unknown server error" }));
          throw new Error(
            `Server error: ${response.status} - ${
              errorData.detail || "Failed to get prediction"
            }`
          );
        }

        const result = await response.json();

        if (result.status === "predicted" && result.prediction) {
          setPredictionStatus(
            `Predicted: ${result.prediction} (${(
              result.confidence * 100
            ).toFixed(0)}%)`
          );

          setPredictionHistory((prevHistory) => {
            const newHistory = [...prevHistory, result.prediction].slice(
              -SENTENCE_HISTORY_LENGTH
            );
            if (
              newHistory.length === SENTENCE_HISTORY_LENGTH &&
              new Set(newHistory).size === 1
            ) {
              const stablePrediction = newHistory[0];
              if (result.confidence > PREDICTION_THRESHOLD) {
                setCurrentSentence((prevSentence) => {
                  if (
                    prevSentence.length === 0 ||
                    prevSentence[prevSentence.length - 1] !== stablePrediction
                  ) {
                    const updatedSentence = [...prevSentence, stablePrediction];
                    onTranslationResult(stablePrediction);
                    return updatedSentence;
                  }
                  return prevSentence;
                });
              }
            }
            return newHistory;
          });
        } else if (result.status === "collecting") {
          setPredictionStatus("Collecting frames...");
        } else {
          setPredictionStatus("No sign detected");
          setPredictionHistory([]);
        }
      } catch (err) {
        setApiError(true);
        console.error("API Error:", err);
        if (err instanceof Error) {
          setPredictionStatus(`API Error: ${err.message}`);
        } else {
          setPredictionStatus("API Error: Failed to connect to backend.");
        }
      }
    },
    [onTranslationResult]
  );

  useEffect(() => {
    const startWebcam = async () => {
      try {
        setIsInitializing(true);
        setError(null);
        setPredictionStatus("Initializing Camera...");

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Webcam access not supported by this browser.");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setIsInitializing(false);
            setPredictionStatus("Ready. Point hands at camera.");
            intervalRef.current = setInterval(() => {
              const frame = captureFrame();
              if (frame) {
                sendFrameToBackend(frame);
              }
            }, FRAME_INTERVAL_MS);
          };
        } else {
          throw new Error("Video element not available.");
        }
      } catch (err) {
        console.error("Webcam Error:", err);
        let message = "Failed to initialize webcam.";
        if (err instanceof Error) {
          if (
            err.name === "NotAllowedError" ||
            err.name === "PermissionDeniedError"
          ) {
            message =
              "Camera permission denied. Please allow camera access in your browser settings.";
          } else if (
            err.name === "NotFoundError" ||
            err.name === "DevicesNotFoundError"
          ) {
            message = "No camera detected on your device.";
          } else {
            message = err.message;
          }
        }
        setError(message);
        setIsInitializing(false);
        setPredictionStatus("Camera Error");
        toast.error(message);
      }
    };

    startWebcam();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [captureFrame, sendFrameToBackend]);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 relative">
        {error ? (
          <div className="aspect-video bg-muted flex flex-col items-center justify-center p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-medium mb-2">Camera Error</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Reloading Page
            </Button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full aspect-video bg-black"
              autoPlay
              playsInline
              muted
            />
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

            {isInitializing && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="flex flex-col items-center text-center p-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-lg font-medium">{predictionStatus}</p>
                </div>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 z-20">
              <p
                className={`text-center text-lg font-semibold ${
                  apiError ? "text-red-400" : "text-white"
                } flex items-center justify-center gap-2`}
              >
                {apiError && <ServerCrash className="h-5 w-5 inline-block" />}
                {predictionStatus}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WebcamFeed;
