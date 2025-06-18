// Minimalist review stats and history utilities for ReviewTab
import { SM2Reference } from "./spacedRepetition";

export interface ReviewHistoryItem {
  date: number;
  refId: string;
  refTitle: string;
  field: string;
  userAnswer: string;
  correct: boolean;
  grade: number;
}

export interface ReviewStats {
  total: number;
  reviewed: number;
  due: number;
  avgInterval: number;
  avgEF: number;
  avgReps: number;
  accuracy: number | null;
  last20: ReviewHistoryItem[];
  last10: ReviewHistoryItem[];
}

export function getReviewStats(list: SM2Reference[], history: ReviewHistoryItem[]): ReviewStats {
  // Flatten all fieldProgress values
  const allFields = list.flatMap(ref => Object.values(ref.fieldProgress || {}));
  const total = allFields.length;
  const reviewed = allFields.filter(f => (f.repetition ?? 0) > 0).length;
  const due = allFields.filter(f => (f.nextReview ?? 0) <= Date.now()).length;
  const avg = (arr: number[]) => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
  const avgInterval = avg(allFields.map(f => f.interval ?? 0));
  const avgEF = avg(allFields.map(f => f.easeFactor ?? 2.5));
  const avgReps = avg(allFields.map(f => f.repetition ?? 0));
  const last20 = history.slice(-20);
  const accuracy = last20.length ? Math.round(100 * last20.filter(h => h.correct).length / last20.length) : null;
  const last10 = history.slice(-10).reverse();
  return { total, reviewed, due, avgInterval, avgEF, avgReps, accuracy, last20, last10 };
}

export function getRecentHistory(history: ReviewHistoryItem[], count: number): ReviewHistoryItem[] {
  return history.slice(-count).reverse();
}

export function loadReviewHistory(): ReviewHistoryItem[] {
  if (typeof window !== "undefined") {
    try {
      const data = localStorage.getItem("reviewHistory");
      if (data) return JSON.parse(data);
    } catch {}
  }
  return [];
}

export function saveReviewHistory(hist: ReviewHistoryItem[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("reviewHistory", JSON.stringify(hist));
    } catch {}
  }
}

export function addReviewHistory(history: ReviewHistoryItem[], item: ReviewHistoryItem): ReviewHistoryItem[] {
  const newHistory = [...history, item].slice(-200);
  saveReviewHistory(newHistory);
  return newHistory;
}

export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
