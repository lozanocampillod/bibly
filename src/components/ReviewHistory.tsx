import React from "react";

interface ReviewHistoryProps {
  history: any[];
}

export function ReviewHistory({ history }: ReviewHistoryProps) {
  return (
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
            {history.length ? history.map((h, i) => (
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
  );
}
