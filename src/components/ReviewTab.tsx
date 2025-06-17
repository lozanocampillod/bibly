"use client";
import { useState } from "react";
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
    <div className="flex flex-col items-center justify-center min-h-[300px] w-full">
      {/* --- SUMMARY DASHBOARD --- */}
      {!reviewing && (
        <Card className="w-full max-w-2xl mb-10 bg-white/80 shadow-lg border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold tracking-tight">Bibliography Progress Summary</CardTitle>
            <p className="text-sm text-muted-foreground font-normal mt-1">Your spaced repetition and review stats</p>
          </CardHeader>
          <CardContent>
            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-6 mb-6 text-base">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Total</span>
                <span className="font-semibold text-right text-primary text-lg">{stats.total}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Reviewed</span>
                <span className="font-semibold text-right text-primary text-lg">{stats.reviewed}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Due</span>
                <span className="font-semibold text-right text-primary text-lg">{stats.due}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Avg. interval</span>
                <span className="font-semibold text-right">{stats.avgInterval.toFixed(1)}d</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Avg. EF</span>
                <span className="font-semibold text-right">{stats.avgEF.toFixed(2)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Avg. reps</span>
                <span className="font-semibold text-right">{stats.avgReps.toFixed(1)}</span>
              </div>
              <div className="flex flex-col col-span-2 sm:col-span-2">
                <span className="text-xs text-muted-foreground">Recent accuracy</span>
                <span className="font-semibold text-right">{stats.accuracy !== null ? `${stats.accuracy}%` : 'N/A'}</span>
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


      {/* --- REVIEW BUTTONS & FLOW --- */}
      {!reviewing && !done && (
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
      {done && (
        <div className="text-center text-green-700 font-semibold text-lg py-10">
          {modoLibre ? "Free review completed!" : "Review completed!"}
        </div>
      )}
      {reviewing && current && fieldToGuess && (
        <Card className="w-full max-w-xl shadow-lg border-primary animate-in fade-in duration-200 mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Spaced Repetition Study</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-base">
              <span className="font-semibold">{FIELDS.filter(f => f.key !== fieldToGuess).slice(0,2).map(f => `${f.label}: ${current[f.key as keyof SM2Reference]}`).join(" · ")}</span>
            </div>
            <div className="mb-2">Guess the <span className="font-bold text-primary">{FIELDS.find(f => f.key === fieldToGuess)?.label}</span>:</div>
            <div className="flex gap-2 mb-2">
              <Input
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder={`Type the ${FIELDS.find(f => f.key === fieldToGuess)?.label?.toLowerCase()}`}
                disabled={showResult}
                className="max-w-xs"
                onKeyDown={e => { if (e.key === 'Enter') handleCheck(); }}
              />
              {!showResult && (
                <Button onClick={handleCheck} variant="default">Check</Button>
              )}
            </div>
            {showResult && (
              <div className={lastCorrect ? "text-green-600 font-semibold mb-2" : "text-destructive font-semibold mb-2"}>
                {lastCorrect ? "Correct!" : `Incorrect. The answer was: "${current[fieldToGuess as keyof SM2Reference] ?? ""}"`}
              </div>
            )}
            {showResult && (
              <div className="flex gap-2 flex-wrap mt-2">
                <span className="text-xs text-muted-foreground mr-2">How hard was it?</span>
                {[5,4,3,2,1,0].map(grade => (
                  <Button key={grade} variant={grade >= 3 ? "default" : "destructive"} onClick={() => handleGrade(grade)}>
                    {grade} {grade===5?"(Perfect)":grade===0?"(Null)":""}
                  </Button>
                ))}
              </div>
            )}
            <div className="mt-4 text-xs text-muted-foreground">
              <span>Interval: {current.interval ?? 1} days</span> | <span>EF: {current.easeFactor?.toFixed(2) ?? '2.5'}</span> | <span>Next: {current.nextReview ? new Date(current.nextReview).toLocaleDateString() : '-'}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
