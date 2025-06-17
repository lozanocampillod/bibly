import React from "react";

interface ReviewStatsProps {
  stats: any;
}

export function ReviewStats({ stats }: ReviewStatsProps) {
  return (
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
      <div className="bg-background rounded-lg px-5 py-4 flex flex-col justify-between min-h-[82px] border border-muted-foreground/10 col-span-1 sm:col-span-2 lg:col-span-3">
        <span className="text-xs text-muted-foreground mb-1">Recent accuracy</span>
        <span className="flex items-center justify-between">
          <span className="font-semibold text-lg">{stats.accuracy !== null ? `${stats.accuracy}%` : 'N/A'}</span>
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ml-2 ${stats.accuracy !== null && stats.accuracy >= 80 ? 'bg-green-100 text-green-800' : stats.accuracy !== null && stats.accuracy >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-destructive/10 text-destructive'}`}>{stats.accuracy !== null ? (stats.accuracy >= 80 ? 'great' : stats.accuracy >= 50 ? 'ok' : 'low') : ''}</span>
        </span>
      </div>
    </div>
  );
}
