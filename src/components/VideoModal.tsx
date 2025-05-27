import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  title: string;
}

const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  videoId,
  title,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader className="flex flex-row items-center justify-between pr-8">
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute right-4 top-4"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="aspect-video w-full">
          <iframe
            src={`https://drive.google.com/file/d/${videoId}/preview`}
            width="100%"
            height="100%"
            allow="autoplay"
            className="rounded-md"
            title={title}
            style={{ border: "none" }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
