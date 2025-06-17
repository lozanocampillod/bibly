"use client";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Reference } from "./ReferenceList";
import * as XLSX from "xlsx";

interface Props {
  bibliography: Reference[];
  onImport: (refs: Reference[]) => void;
}

function toCSV(refs: Reference[]): string {
  if (!refs.length) return "";
  const keys = Object.keys(refs[0]);
  const rows = [keys.join(",")].concat(
    refs.map(r => keys.map(k => `"${(r as any)[k] ?? ""}`.replace(/"/g, '""') + '"').join(","))
  );
  return rows.join("\n");
}

function fromCSV(csv: string): Reference[] {
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const keys = lines[0].split(",").map(k => k.replace(/^"|"$/g, ""));
  return lines.slice(1).map(line => {
    const vals = line.match(/("[^"]*"|[^,]+)/g)?.map(v => v.replace(/^"|"$/g, "")) || [];
    const obj: any = {};
    keys.forEach((k, i) => obj[k] = vals[i] || "");
    return obj as Reference;
  });
}

function toXLSX(refs: Reference[]): XLSX.WorkBook {
  const ws = XLSX.utils.json_to_sheet(refs);
  return XLSX.utils.book_new();
}

function fromXLSX(data: ArrayBuffer): Reference[] {
  const wb = XLSX.read(data, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(ws) as Reference[];
}

export default function ImportExportTab({ bibliography, onImport }: Props) {
  const fileInput = useRef<HTMLInputElement>(null);

  const handleDownloadCSV = () => {
    const csv = toCSV(bibliography);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bibliography.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(bibliography);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bibliography");
    XLSX.writeFile(wb, "bibliography.xlsx");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.name.endsWith(".csv")) {
      const text = await file.text();
      const refs = fromCSV(text);
      onImport(refs);
    } else if (file.name.endsWith(".xls") || file.name.endsWith(".xlsx")) {
      const data = await file.arrayBuffer();
      const refs = fromXLSX(data);
      onImport(refs);
    }
    if (fileInput.current) fileInput.current.value = "";
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <h2 className="text-lg font-semibold mb-4">Import / Export Bibliography</h2>
      <div className="flex flex-col gap-4 mb-6">
        <Button variant="outline" onClick={handleDownloadCSV}>Download as CSV</Button>
        <Button variant="outline" onClick={handleDownloadXLSX}>Download as Excel (XLSX)</Button>
      </div>
      <div className="border-t pt-6 mt-6">
        <label className="block mb-2 font-medium">Upload CSV or Excel file</label>
        <input
          ref={fileInput}
          type="file"
          accept=".csv,.xls,.xlsx"
          className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-primary/10 file:text-primary"
          onChange={handleFileChange}
        />
        <div className="text-xs text-muted-foreground mt-2">Uploading will replace your current bibliography.</div>
      </div>
    </div>
  );
}
