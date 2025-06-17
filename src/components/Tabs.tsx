"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Tab {
  label: string;
  key: string;
}

interface Props {
  tabs: Tab[];
  children: React.ReactNode[];
}

export function Tabs({ tabs, children }: Props) {
  const [active, setActive] = useState(0);
  return (
    <nav className="w-full flex flex-col items-center">
      <div className="flex gap-2 bg-muted rounded-full p-1 shadow-sm mt-2 mb-6 w-auto">
        {tabs.map((tab, i) => (
          <button
            key={tab.key}
            className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-150 focus:outline-none 
              ${active === i
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-transparent text-muted-foreground hover:bg-accent hover:text-primary'}
            `}
            onClick={() => setActive(i)}
            tabIndex={0}
            aria-selected={active === i}
            aria-controls={`tabpanel-${i}`}
            role="tab"
            style={{ minWidth: '100px' }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-2 w-full max-w-xl" role="tabpanel" id={`tabpanel-${active}`}>{children[active]}</div>
    </nav>
  );
}
