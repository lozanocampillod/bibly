"use client";
import React from "react";
import { Reference } from "./ReferenceList";
import { SM2Reference } from "@/lib/spacedRepetition";
import { useReviewSession } from "@/hooks/useReviewSession";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewStats } from "@/components/ReviewStats";
import { ReviewHistory } from "@/components/ReviewHistory";
import { ReviewControls } from "@/components/ReviewControls";
import { getReviewStats } from "@/lib/reviewStats";

interface Props {
  list: Reference[];
  onUpdate: (list: SM2Reference[]) => void;
}

export function ReviewTab({ list, onUpdate }: { list: Reference[]; onUpdate: (list: SM2Reference[]) => void }) {
  const {
    reviewing,
    current,
    fieldToGuess,
    answer,
    setAnswer,
    showResult,
    lastCorrect,
    done,
    history,
    startReview,
    startLibre,
    handleCheck,
    handleGrade,
  } = useReviewSession({ list, onUpdate });

  const stats = getReviewStats(list, history);

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] w-full gap-8">
      {!reviewing && (
        <ReviewControls onStartReview={startReview} onStartLibre={startLibre} dueCount={stats.due} />
      )}
      {reviewing && current && fieldToGuess && (
        <ReviewCard
          current={current}
          fieldToGuess={fieldToGuess}
          answer={answer}
          setAnswer={setAnswer}
          showResult={showResult}
          lastCorrect={lastCorrect}
          handleCheck={handleCheck}
          handleGrade={handleGrade}
        />
      )}
      {!reviewing && (
        <div className="w-full max-w-2xl mb-10">
          <ReviewStats stats={stats} />
          <div className="mb-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Reviewed: {stats.reviewed}</span>
              <span>Never reviewed: {stats.total - stats.reviewed}</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary/80 rounded-full transition-all" style={{ width: `${stats.total ? Math.round(100 * stats.reviewed / stats.total) : 0}%` }} />
            </div>
          </div>
          <ReviewHistory history={stats.last10} />
        </div>
      )}
    </div>
  );
}
