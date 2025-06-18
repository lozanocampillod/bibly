import { useState, useEffect } from "react";
import { pickNextReferenceField, updateFieldProgress, FieldKey, pickFieldToGuess, SM2Reference } from "@/lib/spacedRepetition";
import { getReviewStats, loadReviewHistory, addReviewHistory, ReviewHistoryItem } from "@/lib/reviewStats";
import { shuffle } from "@/utils/shuffle";
import { Reference } from "@/components/ReferenceList";

interface UseReviewSessionProps {
  list: SM2Reference[];
  onUpdate: (list: SM2Reference[]) => void;
}

export function useReviewSession({ list, onUpdate }: UseReviewSessionProps) {
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

  useEffect(() => {
    const dueNow = !!pickNextReferenceField(list);
    if (done && dueNow) {
      setDone(false);
    }
  }, [list, done]);

  const startReview = () => {
    setModoLibre(false);
    const next = pickNextReferenceField(list);
    if (!next) {
      setDone(true);
      setReviewing(false);
      setCurrent(null);
      setFieldToGuess(null);
      return;
    }
    setReviewing(true);
    setCurrent(next.ref);
    setFieldToGuess(next.field);
    setAnswer("");
    setShowResult(false);
    setLastCorrect(null);
    setDone(false);
  };

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
      r.id === current.id ? updateFieldProgress(r, fieldToGuess, grade) : r
    );
    onUpdate(updatedList);
    if (modoLibre) {
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
    const nextRef = pickNextReferenceField(updatedList);
    if (!nextRef) {
      setDone(true);
      setReviewing(false);
      setCurrent(null);
      setFieldToGuess(null);
      return;
    }
    
    setCurrent(nextRef.ref);
    setFieldToGuess(nextRef.field);
    setAnswer("");
    setShowResult(false);
    setLastCorrect(null);
  };

  return {
    reviewing,
    modoLibre,
    current,
    fieldToGuess,
    answer,
    setAnswer,
    showResult,
    lastCorrect,
    done,
    libreQueue,
    history,
    startReview,
    startLibre,
    handleCheck,
    handleGrade,
    setShowResult,
    setLastCorrect,
  };
}
