"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface ReferenceFormData {
  area: string;
  authors: string;
  year: string;
  title: string;
  publisher: string;
}

interface Props {
  onAdd: (data: ReferenceFormData) => void;
}

export function ReferenceForm({ onAdd }: Props) {
  const [form, setForm] = useState<ReferenceFormData>({ area: "", authors: "", year: "", title: "", publisher: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    onAdd(form);
    setForm({ area: "", authors: "", year: "", title: "", publisher: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-background border border-muted rounded-xl p-6 shadow-sm flex flex-col gap-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="e.g. Clean Code" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="authors">Authors</Label>
          <Input id="authors" value={form.authors} onChange={e => setForm(f => ({ ...f, authors: e.target.value }))} required placeholder="e.g. Robert C. Martin" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="year">Year</Label>
          <Input id="year" type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} required placeholder="e.g. 2008" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="publisher">Publisher</Label>
          <Input id="publisher" value={form.publisher} onChange={e => setForm(f => ({ ...f, publisher: e.target.value }))} required placeholder="e.g. Prentice Hall" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="area">Area/Topic</Label>
          <Input id="area" value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} required placeholder="e.g. Software Engineering" />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="w-full md:w-40">Save</Button>
      </div>
    </form>
  );
}
