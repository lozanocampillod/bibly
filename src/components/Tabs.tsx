"use client";
import { useState, useRef, useEffect } from "react";
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
  const [indicatorStyle, setIndicatorStyle] = useState({ width: '0px', left: '0px' });
  const tabsRef = useRef<HTMLButtonElement[]>([]);

  useEffect(() => {
    const activeTab = tabsRef.current[active];
    if (activeTab) {
      const { width, left } = activeTab.getBoundingClientRect();
      const containerLeft = activeTab.parentElement?.getBoundingClientRect().left || 0;
      setIndicatorStyle({
        width: `${width}px`,
        left: `${left - containerLeft}px`
      });
    }
  }, [active]);
  return (
    <nav className="w-full flex flex-col items-center">
      <div className="relative flex gap-2 bg-muted rounded-full p-1 shadow-sm mt-2 mb-6 w-auto">
        <div 
          className="absolute bg-primary rounded-full shadow-md h-9 transition-all duration-300 ease-out"
          style={indicatorStyle}
        />
        {tabs.map((tab, i) => (
          <button
            key={tab.key}
            ref={el => {
              if (el) tabsRef.current[i] = el;
            }}
            className={`relative px-5 py-2 text-sm font-medium rounded-full z-10 transition-colors duration-200 focus:outline-none 
              ${
                active === i
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-primary'
              }`}
            onClick={() => setActive(i)}
            tabIndex={0}
            aria-selected={active === i}
            aria-controls={`tabpanel-${i}`}
            role="tab"
            style={{ minWidth: '100px' }}
          >
            <span className="relative">{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="pt-2 w-full max-w-4xl">
        <div 
          role="tabpanel" 
          id={`tabpanel-${active}`}
          className="w-full"
        >
          {children[active]}
        </div>
      </div>
    </nav>
  );
}
