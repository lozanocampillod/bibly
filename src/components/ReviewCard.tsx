import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SM2Reference, FieldKey } from "@/lib/spacedRepetition";

interface ReviewCardProps {
  current: SM2Reference;
  fieldToGuess: FieldKey;
  answer: string;
  setAnswer: (a: string) => void;
  showResult: boolean;
  lastCorrect: boolean | null;
  handleCheck: () => void;
  handleGrade: (g: number) => void;
}

export function ReviewCard({
  current,
  fieldToGuess,
  answer,
  setAnswer,
  showResult,
  lastCorrect,
  handleCheck,
  handleGrade,
}: ReviewCardProps) {
  return (
    <Card className="w-full max-w-xl mt-8 bg-white/80 shadow-lg border border-muted-foreground/10 rounded-xl animate-in fade-in duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold tracking-tight">Spaced Repetition Study</CardTitle>
        <p className="text-sm text-muted-foreground font-normal mt-1">Active recall for long-term memory</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-muted/60 rounded-lg px-4 py-3 flex flex-col gap-1 border border-muted-foreground/10">
            <span className="text-xs text-muted-foreground mb-1">Reference</span>
            <span className="font-semibold text-base truncate" title={current.title}>{current.title}</span>
          </div>
          <div className="bg-muted/60 rounded-lg px-4 py-3 flex flex-col gap-1 border border-muted-foreground/10">
            <span className="text-xs text-muted-foreground mb-1">Field to guess</span>
            <span className="inline-block px-2 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium w-fit">{fieldToGuess}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-sm" htmlFor="review-answer">Your answer</label>
          <Input
            id="review-answer"
            className="mb-1"
            placeholder={`Type the ${fieldToGuess}...`}
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !showResult) handleCheck();
            }}
            disabled={showResult}
            autoFocus
          />
          {!showResult && (
            <Button className="mt-1 w-full" onClick={handleCheck}>
              Check
            </Button>
          )}
        </div>
        {showResult && (
          <div className="flex flex-col gap-4 items-center">
            <div className="flex flex-col items-center gap-2">
              <span className={`inline-block px-4 py-2 rounded-full text-base font-semibold ${lastCorrect ? "bg-green-100 text-green-800" : "bg-destructive/10 text-destructive"}`}>
                {lastCorrect ? "Correct!" : "Incorrect"}
              </span>
              {!lastCorrect && (
                <span className="text-sm text-muted-foreground text-center">Correct answer: <span className="font-semibold text-primary">{current[fieldToGuess]}</span></span>
              )}
            </div>
            <div className="flex flex-col items-center gap-2 w-full">
              <span className="text-xs text-muted-foreground">How easy was it?</span>
              <div className="flex gap-2 justify-center w-full">
                {[5, 4, 3, 2, 1, 0].map(g => (
                  <Button key={g} variant="outline" size="sm" className="flex-1 min-w-[38px]" onClick={() => handleGrade(g)}>
                    {g}
                  </Button>
                ))}
              </div>
              <span className="text-xs text-muted-foreground mt-1">5 = Perfect, 0 = Total blackout</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
