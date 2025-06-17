import { Reference } from "@/components/ReferenceList";

export interface SM2Reference extends Reference {
  repetition?: number;
  easeFactor?: number;
}

export type FieldKey = "year" | "publisher" | "area" | "authors" | "title";

export const FIELDS: { key: FieldKey; label: string }[] = [
  { key: "year", label: "Year" },
  { key: "publisher", label: "Publisher" },
  { key: "area", label: "Area/Topic" },
  { key: "authors", label: "Authors" },
  { key: "title", label: "Title" },
];

export function calcSM2(ref: SM2Reference, grade: number): SM2Reference {
  let repetition = ref.repetition ?? 0;
  let interval = ref.interval ?? 1;
  let easeFactor = ref.easeFactor ?? 2.5;
  if (grade >= 3) {
    if (repetition === 0) interval = 1;
    else if (repetition === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetition += 1;
  } else {
    repetition = 0;
    interval = 1;
  }
  easeFactor = Math.max(1.3, (easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))));
  const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;
  return { ...ref, repetition, interval, easeFactor, nextReview };
}

export function getDueReferences(list: SM2Reference[]): SM2Reference[] {
  const now = Date.now();
  return list.filter(r => !r.nextReview || r.nextReview <= now);
}

export function pickNextReference(list: SM2Reference[]): SM2Reference | null {
  // Elige la referencia más antigua pendiente (más urgente)
  const due = getDueReferences(list);
  if (due.length === 0) return null;
  return due.reduce((a, b) => (a.nextReview ?? 0) < (b.nextReview ?? 0) ? a : b);
}

export function pickFieldToGuess(ref: SM2Reference): FieldKey {
  // Elige campo aleatorio, nunca title
  const options = FIELDS.map(f => f.key).filter(k => k !== "title");
  return options[Math.floor(Math.random() * options.length)];
}
