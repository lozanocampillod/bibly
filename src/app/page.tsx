"use client";
import { useEffect, useState } from "react";
import { ReferenceForm, ReferenceFormData } from "@/components/ReferenceForm";
import { ReferenceList, Reference } from "@/components/ReferenceList";
import { ReviewTab } from "@/components/ReviewTab";
import { Tabs } from "@/components/Tabs";
import ImportExportTab from "@/components/ImportExportTab";

function nextReviewDate(interval: number) {
  return Date.now() + interval * 24 * 60 * 60 * 1000;
}

export default function Home() {
  const [list, setList] = useState<Reference[]>([]);

  // Cargar desde localStorage
  useEffect(() => {
    const data = localStorage.getItem("bibly");
    if (data) setList(JSON.parse(data));
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem("bibly", JSON.stringify(list));
  }, [list]);

  // Añadir nueva referencia
  const handleAdd = (form: ReferenceFormData) => {
    const newRef: Reference = {
      ...form,
      id: crypto.randomUUID(),
      nextReview: nextReviewDate(1),
      interval: 1,
    };
    setList([newRef, ...list]);
  };

  // Actualizar lista (usado por ReviewTab)
  const handleUpdate = (newList: Reference[]) => {
    setList(newList);
  };

  // Eliminar una referencia
  const handleDelete = (id: string) => {
    setList(list.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start py-12 px-2">
      <Tabs
        tabs={[
          { label: "References", key: "references" },
          { label: "Review", key: "review" },
          { label: "Import/Export", key: "importexport" },
        ]}
      >
        {/* References Tab */}
        <div className="flex flex-col gap-4">
          <ReferenceForm onAdd={handleAdd} />
          <ReferenceList list={list} onDelete={handleDelete} />
        </div>
        {/* Review Tab */}
        <ReviewTab list={list} onUpdate={handleUpdate} />
        {/* Import/Export Tab */}
        <ImportExportTab bibliography={list} onImport={setList} />
      </Tabs>
    </div>
  );
}

