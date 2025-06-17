import React from "react";
import { Button } from "@/components/ui/button";

interface ReviewControlsProps {
  onStartReview: () => void;
  onStartLibre: () => void;
  dueCount: number;
}

export function ReviewControls({ onStartReview, onStartLibre, dueCount }: ReviewControlsProps) {
  return (
    <div className="flex gap-4 items-center">
      <Button
        size="lg"
        className="px-8 py-4 text-lg rounded-full shadow-md"
        onClick={onStartReview}
        disabled={dueCount === 0}
        aria-disabled={dueCount === 0}
      >
        Start review
      </Button>
      <Button
        size="lg"
        className="px-8 py-4 text-lg rounded-full shadow-md"
        variant="secondary"
        onClick={onStartLibre}
      >
        Review all
      </Button>
    </div>
  );
}
