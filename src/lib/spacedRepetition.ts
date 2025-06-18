import { Reference } from "@/components/ReferenceList";

export type FieldKey = "year" | "publisher" | "area" | "authors" | "title";

export interface FieldProgress {
  interval: number;
  repetition: number;
  easeFactor: number;
  nextReview: number;
}

export interface SM2Reference extends Reference {
  fieldProgress: Partial<Record<FieldKey, FieldProgress>>;
}

export const FIELDS: { key: FieldKey; label: string }[] = [
  { key: "year", label: "Year" },
  { key: "publisher", label: "Publisher" },
  { key: "authors", label: "Authors" },
  { key: "title", label: "Title" },
];

const initialFieldProgress: FieldProgress = {
  interval: 1,
  repetition: 0,
  easeFactor: 2.5,
  nextReview: Date.now(),
};

export function calcFieldSM2(prev: FieldProgress, grade: number): FieldProgress {
  let { repetition, interval, easeFactor } = prev;
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
  return { interval, repetition, easeFactor, nextReview };
}

export function updateFieldProgress(ref: SM2Reference, field: FieldKey, grade: number): SM2Reference {
  const prev = ref.fieldProgress[field] ?? { ...initialFieldProgress };
  const updated = calcFieldSM2(prev, grade);
  return {
    ...ref,
    fieldProgress: {
      ...ref.fieldProgress,
      [field]: updated,
    },
  };
}

// Returns a list of { ref, field } pairs that are due for review
export function getDueReferenceFields(list: SM2Reference[]): { ref: SM2Reference, field: FieldKey }[] {
  const now = Date.now();
  const due: { ref: SM2Reference, field: FieldKey }[] = [];
  for (const ref of list) {
    if (!ref.fieldProgress || typeof ref.fieldProgress !== "object") continue;
    for (const field of Object.keys(ref.fieldProgress) as FieldKey[]) {
      const progress = ref.fieldProgress[field];
      if (!progress || !progress.nextReview || progress.nextReview <= now) {
        due.push({ ref, field });
      }
    }
  }
  return due;
}

// Picks the most overdue (ref, field) pair
export function pickNextReferenceField(list: SM2Reference[]): { ref: SM2Reference, field: FieldKey } | null {
  const due = getDueReferenceFields(list);
  if (due.length === 0) return null;
  return due.reduce((a, b) => {
    const aTime = a.ref.fieldProgress[a.field]?.nextReview ?? 0;
    const bTime = b.ref.fieldProgress[b.field]?.nextReview ?? 0;
    return aTime < bTime ? a : b;
  });
}

export function pickFieldToGuess(ref: SM2Reference): FieldKey {
  // Choose a random field to review (all fields in FIELDS are eligible)
  const options = FIELDS.map(f => f.key);
  return options[Math.floor(Math.random() * options.length)];
}

export function initializeFieldProgress(): Partial<Record<FieldKey, FieldProgress>> {
  const progress: Partial<Record<FieldKey, FieldProgress>> = {};
  for (const field of FIELDS.map(f => f.key)) {
    progress[field] = { ...initialFieldProgress };
  }
  return progress;
}

