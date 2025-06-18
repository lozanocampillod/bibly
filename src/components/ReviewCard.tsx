import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SM2Reference, FieldKey } from "@/lib/spacedRepetition";

const formatAPACitation = (
  reference: SM2Reference, 
  fieldToGuess: FieldKey, 
  answer: string, 
  setAnswer: (a: string) => void,
  handleCheck: () => void
) => {
  const { authors, year, title, publisher, area } = reference;
  
  // Format authors
  const formatAuthors = (authorsStr: string) => {
    const authorsList = authorsStr.split(' and ').map(a => a.trim());
    if (authorsList.length === 1) return authorsList[0];
    if (authorsList.length === 2) return authorsList.join(' & ');
    return authorsList.slice(0, -1).join(', ') + ', & ' + authorsList[authorsList.length - 1];
  };

  // Build citation parts
  const parts = [];
  
  // Author part
  if (fieldToGuess === 'authors') {
    parts.push(<span key="author-input" className="border-b-2 border-dashed border-primary">
      <Input
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
        className="inline-block w-48 h-6 px-1 py-0 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="Author(s)"
        autoFocus
      />
    </span>);
  } else {
    parts.push(<span key="author">{formatAuthors(authors)}</span>);
  }
  
  // Year part
  parts.push(' (', 
    fieldToGuess === 'year' ? 
      <span key="year-input" className="border-b-2 border-dashed border-primary">
        <Input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
          className="inline-block w-16 h-6 px-1 py-0 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Year"
          autoFocus
        />
      </span> : 
      <span key="year">{year}</span>, 
  '). ');
  
  // Title part (in italics for books)
  parts.push(fieldToGuess === 'title' ? 
    <span key="title-input" className="border-b-2 border-dashed border-primary">
      <Input
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
        className="inline-block w-full h-6 px-1 py-0 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="Title"
        autoFocus
      />
    </span> : 
    <span key="title" className="italic">{title}</span>
  );
  
  // Publisher part
  if (publisher) {
    parts.push('. ');
    parts.push(fieldToGuess === 'publisher' ? 
      <span key="publisher-input" className="border-b-2 border-dashed border-primary">
        <Input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
          className="inline-block w-48 h-6 px-1 py-0 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Publisher"
          autoFocus
        />
      </span> : 
      <span key="publisher">{publisher}</span>
    );
  }
  
  // Area/Topic (as location for books, e.g., "City, State: Publisher")
  if (area) {
    parts.push(', ');
    parts.push(fieldToGuess === 'area' ? 
      <span key="area-input" className="border-b-2 border-dashed border-primary">
        <Input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
          className="inline-block w-32 h-6 px-1 py-0 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Area"
          autoFocus
        />
      </span> : 
      <span key="area">{area}</span>
    );
  }
  
  return parts;
};

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
        <div className="bg-muted/60 rounded-lg p-4 border border-muted-foreground/10 mb-4">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Complete the missing field in this APA citation:</p>
            <div className="bg-white p-4 rounded border border-muted-foreground/20">
              <div className="space-y-2">
                <p className="text-sm leading-relaxed">
                  {formatAPACitation(current, fieldToGuess, answer, setAnswer, handleCheck)}
                </p>
              </div>
            </div>
          </div>
          <Button 
                  size="sm" 
                  className="w-full mt-2" 
                  onClick={handleCheck}
                >
                  Check
                </Button>
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
