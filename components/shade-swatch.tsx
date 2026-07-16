"use client";

import { cn } from "@/lib/utils";
import { Swatch } from "@/lib/types";
import { Check } from "lucide-react";

interface ShadeSwatchProps {
  swatches: Swatch[];
  selected: string;
  onSelect: (name: string) => void;
  size?: "sm" | "md";
}

export function ShadeSwatch({ swatches, selected, onSelect, size = "md" }: ShadeSwatchProps) {
  const dim = size === "sm" ? "h-5 w-5" : "h-8 w-8";
  return (
    <div className="flex flex-wrap items-center gap-2">
      {swatches.map((s) => {
        const isSelected = s.name === selected;
        const isLight = ["#F7F1E8", "#D4A65E"].includes(s.hex);
        return (
          <button
            key={s.name}
            type="button"
            title={s.name}
            aria-label={s.name}
            aria-pressed={isSelected}
            onClick={() => onSelect(s.name)}
            className={cn(
              dim,
              "relative rounded-full ring-1 ring-espresso/15 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze",
              isSelected && "ring-2 ring-espresso ring-offset-2 ring-offset-ivory"
            )}
            style={{ backgroundColor: s.hex }}
          >
            {isSelected && (
              <Check
                className={cn("absolute inset-0 m-auto h-3.5 w-3.5", isLight ? "text-espresso" : "text-ivory")}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
