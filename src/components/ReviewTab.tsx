"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reference } from "./ReferenceList";
import { Input } from "@/components/ui/input";
import { pickNextReference, calcSM2, FieldKey, pickFieldToGuess, FIELDS, SM2Reference } from "@/lib/spacedRepetition";
import {
  getReviewStats,
  getRecentHistory,
  loadReviewHistory,
  addReviewHistory,
  shuffle,
  ReviewHistoryItem
} from "@/lib/reviewStats";

interface Props {
  list: Reference[];
  onUpdate: (list: SM2Reference[]) => void;
}

export function ReviewTab({ list, onUpdate }: Props) {
  const [reviewing, setReviewing] = useState(false);
  const [modoLibre, setModoLibre] = useState(false);
  const [current, setCurrent] = useState<SM2Reference | null>(null);
  const [fieldToGuess, setFieldToGuess] = useState<FieldKey | null>(null);
  const [answer, setAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [done, setDone] = useState(false);

  // Effect: If bibliography list changes and due items exist, reset 'done' so user can start review again
  React.useEffect(() => {
    const dueNow = !!pickNextReference(list);
    if (done && dueNow) {
      setDone(false);
    }
  }, [list, done]);
  const [libreQueue, setLibreQueue] = useState<SM2Reference[]>([]);
  const [history, setHistory] = useState<ReviewHistoryItem[]>(() => loadReviewHistory());

  // Minimalist summary stats
  const stats = getReviewStats(list, history);


  // Utilidad para mezclar array (Fisher-Yates)
  function shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const startReview = () => {
    setModoLibre(false);
    const next = pickNextReference(list);
    if (!next) {
      setDone(true);
      setReviewing(false);
      setCurrent(null);
      setFieldToGuess(null);
      return;
    }
    setReviewing(true);
    setCurrent(next);
    setFieldToGuess(pickFieldToGuess(next));
    setAnswer("");
    setShowResult(false);
    setLastCorrect(null);
    setDone(false);
  };

  // Nuevo: iniciar modo libre
  const startLibre = () => {
    setModoLibre(true);
    const shuffled = shuffle(list);
    setLibreQueue(shuffled);
    if (shuffled.length === 0) {
      setDone(true);
      setReviewing(false);
      setCurrent(null);
      setFieldToGuess(null);
      return;
    }
    setReviewing(true);
    setCurrent(shuffled[0]);
    setFieldToGuess(pickFieldToGuess(shuffled[0]));
    setAnswer("");
    setShowResult(false);
    setLastCorrect(null);
    setDone(false);
  };


  const handleCheck = () => {
    if (!current || !fieldToGuess) return;
    const correct = (current[fieldToGuess as keyof SM2Reference] || "").toString().trim().toLowerCase() === answer.trim().toLowerCase();
    setLastCorrect(correct);
    setShowResult(true);
  };

  const handleGrade = (grade: number) => {
    if (!current || !fieldToGuess) return;

    // Save to history using utility and always update state so UI re-renders
    const hist: ReviewHistoryItem = {
      date: Date.now(),
      refId: current.id,
      refTitle: current.title,
      field: fieldToGuess,
      userAnswer: answer,
      correct: lastCorrect === true,
      grade
    };
    const newHistory = addReviewHistory(history, hist);
    setHistory(newHistory);

    const updatedList = list.map(r =>
      r.id === current.id ? calcSM2(r, grade) : r
    );
    onUpdate(updatedList);

    if (modoLibre) {
      // Free mode: advance in queue
      const idx = libreQueue.findIndex(r => r.id === current.id);
      const nextQueue = libreQueue.slice(idx + 1);
      if (nextQueue.length === 0) {
        setDone(true);
        setReviewing(false);
        setCurrent(null);
        setFieldToGuess(null);
        setLibreQueue([]);
        return;
      }
      setLibreQueue(nextQueue);
      setCurrent(nextQueue[0]);
      setFieldToGuess(pickFieldToGuess(nextQueue[0]));
      setAnswer("");
      setShowResult(false);
      setLastCorrect(null);
      return;
    }

    // Normal review (only due)
    const next = pickNextReference(updatedList);
    if (!next) {
      setDone(true);
      setReviewing(false);
      setCurrent(null);
      setFieldToGuess(null);
      return;
    }
    setCurrent(next);
    setFieldToGuess(pickFieldToGuess(next));
    setAnswer("");
    setShowResult(false);
    setLastCorrect(null);
  };



  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] w-full gap-8">
        {!reviewing && (
        <div className="flex gap-4 items-center">
          <Button
            size="lg"
            className="px-8 py-4 text-lg rounded-full shadow-md"
            onClick={startReview}
            disabled={stats.due === 0}
            aria-disabled={stats.due === 0}
          >
            Start review
          </Button>
          <Button size="lg" className="px-8 py-4 text-lg rounded-full shadow-md" variant="secondary" onClick={startLibre}>
            Review all
          </Button>
        </div>
      )}
      {reviewing && current && fieldToGuess && (
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
                    <span className="text-sm text-muted-foreground text-center">Correct answer: <span className="font-semibold text-primary">{current[fieldToGuess as keyof SM2Reference]}</span></span>
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
      )}

      {!reviewing && (
        <Card className="w-full max-w-2xl mb-10 bg-white/80 shadow-lg border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold tracking-tight">Bibliography Progress Summary</CardTitle>
            <p className="text-sm text-muted-foreground font-normal mt-1">Your spaced repetition and review stats</p>
          </CardHeader>
          <CardContent>
            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              <div className="bg-muted/60 rounded-lg px-5 py-4 flex flex-col justify-between min-h-[82px] border border-muted-foreground/10">
                <span className="text-xs text-muted-foreground mb-1">Total</span>
                <span className="flex items-center justify-between">
                  <span className="font-semibold text-lg">{stats.total}</span>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium ml-2">refs</span>
                </span>
              </div>
              <div className="bg-muted/60 rounded-lg px-5 py-4 flex flex-col justify-between min-h-[82px] border border-muted-foreground/10">
                <span className="text-xs text-muted-foreground mb-1">Reviewed</span>
                <span className="flex items-center justify-between">
                  <span className="font-semibold text-lg">{stats.reviewed}</span>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-medium ml-2">done</span>
                </span>
              </div>
              <div className="bg-muted/60 rounded-lg px-5 py-4 flex flex-col justify-between min-h-[82px] border border-muted-foreground/10">
                <span className="text-xs text-muted-foreground mb-1">Due</span>
                <span className="flex items-center justify-between">
                  <span className="font-semibold text-lg">{stats.due}</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ml-2 ${stats.due > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-muted text-muted-foreground'}`}>{stats.due > 0 ? 'due' : 'none'}</span>
                </span>
              </div>
              <div className="bg-muted/60 rounded-lg px-5 py-4 flex flex-col justify-between min-h-[82px] border border-muted-foreground/10">
                <span className="text-xs text-muted-foreground mb-1">Avg. interval</span>
                <span className="flex items-center justify-between">
                  <span className="font-semibold text-lg">{stats.avgInterval.toFixed(1)}d</span>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium ml-2">days</span>
                </span>
              </div>
              <div className="bg-muted/60 rounded-lg px-5 py-4 flex flex-col justify-between min-h-[82px] border border-muted-foreground/10">
                <span className="text-xs text-muted-foreground mb-1">Avg. EF</span>
                <span className="flex items-center justify-between">
                  <span className="font-semibold text-lg">{stats.avgEF.toFixed(2)}</span>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-fuchsia-100 text-fuchsia-800 text-xs font-medium ml-2">EF</span>
                </span>
              </div>
              <div className="bg-muted/60 rounded-lg px-5 py-4 flex flex-col justify-between min-h-[82px] border border-muted-foreground/10">
                <span className="text-xs text-muted-foreground mb-1">Avg. reps</span>
                <span className="flex items-center justify-between">
                  <span className="font-semibold text-lg">{stats.avgReps.toFixed(1)}</span>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-medium ml-2">reps</span>
                </span>
              </div>
              {/* Recent accuracy as a summary row */}
              <div className="bg-background rounded-lg px-5 py-4 flex flex-col justify-between min-h-[82px] border border-muted-foreground/10 col-span-1 sm:col-span-2 lg:col-span-3">
                <span className="text-xs text-muted-foreground mb-1">Recent accuracy</span>
                <span className="flex items-center justify-between">
                  <span className="font-semibold text-lg">{stats.accuracy !== null ? `${stats.accuracy}%` : 'N/A'}</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ml-2 ${stats.accuracy !== null && stats.accuracy >= 80 ? 'bg-green-100 text-green-800' : stats.accuracy !== null && stats.accuracy >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-destructive/10 text-destructive'}`}>{stats.accuracy !== null ? (stats.accuracy >= 80 ? 'great' : stats.accuracy >= 50 ? 'ok' : 'low') : ''}</span>
                </span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Reviewed: {stats.reviewed}</span>
                <span>Never reviewed: {stats.total - stats.reviewed}</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary/80 rounded-full transition-all" style={{ width: `${stats.total ? Math.round(100 * stats.reviewed / stats.total) : 0}%` }} />
              </div>
            </div>
            {/* Recent answers table - shadcn style */}
            <div className="mt-6">
              <div className="font-semibold mb-2 text-sm">Recent answers</div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border rounded-lg overflow-hidden">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">Date</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">Reference</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">Field</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">Answer</th>
                      <th className="px-3 py-2 text-center font-medium text-muted-foreground">Correct</th>
                      <th className="px-3 py-2 text-center font-medium text-muted-foreground">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.last10.length ? stats.last10.map((h, i) => (
                      <tr
                        key={i}
                        className={
                          `transition-colors ${i % 2 === 0 ? 'bg-background' : 'bg-muted/50'} hover:bg-accent border-b border-muted-foreground/10`
                        }
                      >
                        <td className="px-3 py-2 whitespace-nowrap text-xs">{new Date(h.date).toLocaleString()}</td>
                        <td className="px-3 py-2 max-w-[140px] truncate text-xs" title={h.refTitle}>{h.refTitle}</td>
                        <td className="px-3 py-2 text-xs">{h.field}</td>
                        <td className="px-3 py-2 max-w-[90px] truncate text-xs" title={h.userAnswer}>{h.userAnswer}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${h.correct ? 'bg-green-100 text-green-800' : 'bg-destructive/10 text-destructive'}`}>
                            {h.correct ? '✔️' : '—'}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className="inline-block px-2 py-1 rounded-full bg-muted text-xs font-semibold">
                            {h.grade}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={6} className="text-center text-muted-foreground py-4">No history yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}


      
    </div>
  );
}
