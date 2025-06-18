"use client";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, BookOpen, User, BookMarked, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

import { FieldProgress, FieldKey } from "@/lib/spacedRepetition";
export interface Reference {
  id: string;
  area: string;
  authors: string;
  year: string;
  title: string;
  publisher: string;
  fieldProgress: Partial<Record<FieldKey, FieldProgress>>;
}

interface Props {
  list: Reference[];
  onDelete?: (id: string) => void;
}

export function ReferenceList({ list, onDelete }: Props) {
  const [filters, setFilters] = useState<Record<string, string>>({
    title: "",
    authors: "",
    year: "",
    publisher: "",
    area: "",
    // nextReview filter removed
  });

  const filteredList = useMemo(() => {
    return list.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const itemValue = String(item[key as keyof Reference] || '').toLowerCase();
        return itemValue.includes(value.toLowerCase());
      });
    });
  }, [list, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilter = (key: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: ""
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      title: "",
      authors: "",
      year: "",
      publisher: "",
      area: ""
      // nextReview filter removed
    });
  };

  // Format Unix timestamp to readable date
  const formatDate = (timestamp: number): string => {
    if (!timestamp) return 'Not set';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (list.length === 0) {
    return (
      <div className="mt-2 text-muted-foreground text-sm">
        No references saved.
      </div>
    );
  }

  return (
    <div className="mt-2">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border rounded-lg overflow-hidden">
          <thead className="bg-muted">
            {/* Filter row */}
            <tr className="h-10">
              <th className="px-1.5 py-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Filter title..."
                    value={filters.title}
                    onChange={(e) => handleFilterChange('title', e.target.value)}
                    className="h-8 pl-8 text-xs"
                  />
                  {filters.title && (
                    <X
                      className="absolute right-2 top-2 h-3.5 w-3.5 cursor-pointer text-muted-foreground hover:text-foreground"
                      onClick={() => clearFilter('title')}
                    />
                  )}
                </div>
              </th>
              <th className="px-1.5 py-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Filter authors..."
                    value={filters.authors}
                    onChange={(e) => handleFilterChange('authors', e.target.value)}
                    className="h-8 pl-8 text-xs"
                  />
                  {filters.authors && (
                    <X
                      className="absolute right-2 top-2 h-3.5 w-3.5 cursor-pointer text-muted-foreground hover:text-foreground"
                      onClick={() => clearFilter('authors')}
                    />
                  )}
                </div>
              </th>
              <th className="px-1.5 py-1 w-[100px]">
                <div className="relative">
                  <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Year..."
                    value={filters.year}
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                    className="h-8 pl-8 text-xs"
                  />
                  {filters.year && (
                    <X
                      className="absolute right-2 top-2 h-3.5 w-3.5 cursor-pointer text-muted-foreground hover:text-foreground"
                      onClick={() => clearFilter('year')}
                    />
                  )}
                </div>
              </th>
              <th className="px-1.5 py-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Filter publisher..."
                    value={filters.publisher}
                    onChange={(e) => handleFilterChange('publisher', e.target.value)}
                    className="h-8 pl-8 text-xs"
                  />
                  {filters.publisher && (
                    <X
                      className="absolute right-2 top-2 h-3.5 w-3.5 cursor-pointer text-muted-foreground hover:text-foreground"
                      onClick={() => clearFilter('publisher')}
                    />
                  )}
                </div>
              </th>
              <th className="px-1.5 py-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Filter area..."
                    value={filters.area}
                    onChange={(e) => handleFilterChange('area', e.target.value)}
                    className="h-8 pl-8 text-xs"
                  />
                  {filters.area && (
                    <X
                      className="absolute right-2 top-2 h-3.5 w-3.5 cursor-pointer text-muted-foreground hover:text-foreground"
                      onClick={() => clearFilter('area')}
                    />
                  )}
                </div>
              </th>
              <th className="px-1.5 py-1 w-[120px]">
                <div className="relative">
                  <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Filter date..."
                    value={filters.nextReview}
                    onChange={(e) => handleFilterChange('nextReview', e.target.value)}
                    className="h-8 pl-8 text-xs"
                  />
                  {filters.nextReview && (
                    <X
                      className="absolute right-2 top-2 h-3.5 w-3.5 cursor-pointer text-muted-foreground hover:text-foreground"
                      onClick={() => clearFilter('nextReview')}
                    />
                  )}
                </div>
              </th>
              <th className="w-[70px] px-1.5 py-1"></th>
            </tr>
            {/* Header row */}
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Title</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Authors</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Year</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Publisher</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Area</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">Next Review</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-4 text-center text-sm text-muted-foreground">
                  No references found matching the filters
                </td>
              </tr>
            ) : (
              filteredList.map((r) => (
                <tr
                  key={r.id}
                  className="transition-colors hover:bg-accent border-b border-muted-foreground/10"
                >
                  <td className="px-3 py-2 max-w-[200px] truncate" title={r.title}>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span className="truncate">{r.title}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 max-w-[150px] truncate" title={r.authors}>
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{r.authors}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      {r.year}
                    </div>
                  </td>
                  <td className="px-3 py-2 max-w-[120px] truncate" title={r.publisher}>
                    <div className="flex items-center gap-1">
                      <BookMarked className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{r.publisher}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                      {r.area}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="text-xs">
                        {(() => {
                          if (!('fieldProgress' in r)) return "—";
                          const allDates = Object.values((r as any).fieldProgress || {})
                            .map((f: any) => f?.nextReview)
                            .filter((d: any) => typeof d === "number" && d > 0);
                          if (!allDates.length) return "—";
                          const soonest = Math.min(...allDates);
                          return formatDate(soonest);
                        })()}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center">
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(r.id);
                        }}
                        className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600"
                        title="Delete reference"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-sm text-muted-foreground text-right">
        Showing {filteredList.length} of {list.length} reference{list.length !== 1 ? 's' : ''}
        {Object.values(filters).some(Boolean) && (
          <button
            onClick={clearAllFilters}
            className="ml-2 text-primary hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}
