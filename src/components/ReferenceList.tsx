"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface Reference {
  id: string;
  area: string;
  authors: string;
  year: string;
  title: string;
  publisher: string;
  nextReview: number;
  interval: number;
}

interface Props {
  list: Reference[];
}

import { Button } from "@/components/ui/button";
import { Copy, Trash2, Calendar, BookOpen, User, BookMarked } from "lucide-react";
import { useState } from "react";

export interface Reference {
  id: string;
  area: string;
  authors: string;
  year: string;
  title: string;
  publisher: string;
  nextReview: number;
  interval: number;
  repetition?: number;
  easeFactor?: number;
}

interface Props {
  list: Reference[];
  onDelete?: (id: string) => void;
}

export function ReferenceList({ list, onDelete }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const handleCopy = (r: Reference) => {
    const text = `${r.authors} (${r.year}). ${r.title}. ${r.publisher}. (${r.area})`;
    navigator.clipboard.writeText(text);
    setCopiedId(r.id);
    setTimeout(() => setCopiedId(null), 1200);
  };
  return (
    <div className="flex flex-col gap-4">
      {list.length === 0 ? (
        <Card className="shadow-none border border-muted">
          <CardHeader>
            <CardTitle className="text-lg font-medium">References</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm">No references saved.</div>
          </CardContent>
        </Card>
      ) : (
        list.map((r) => (
          <Card key={r.id} className="border-muted/60 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="py-4 px-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <BookOpen className="w-5 h-5 text-primary" />
                <span>{r.title}</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground items-center">
                <span className="flex items-center gap-1"><User className="w-4 h-4" />{r.authors}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{r.year}</span>
                <span className="flex items-center gap-1"><BookMarked className="w-4 h-4" />{r.publisher}</span>
                <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" />{r.area}</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground items-center">
                <span>Interval: {r.interval ?? 1}d</span>
                <span>EF: {r.easeFactor?.toFixed(2) ?? '2.5'}</span>
                <span>Reps: {r.repetition ?? 0}</span>
                <span>Next: {r.nextReview ? new Date(r.nextReview).toLocaleDateString() : '-'}</span>
              </div>
              <div className="flex gap-2 mt-2">
                {onDelete && (
                  <Button size="icon" variant="ghost" onClick={() => onDelete(r.id)} title="Delete">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                )}
                {copiedId === r.id && <span className="text-xs text-primary ml-2">Copied!</span>}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
