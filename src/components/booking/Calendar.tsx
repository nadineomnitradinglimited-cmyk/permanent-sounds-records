"use client";

import { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isBefore,
  startOfDay,
  addMonths,
  subMonths,
} from "date-fns";
import { clsx } from "@/lib/clsx";

export function Calendar({
  selected,
  onSelect,
}: {
  selected: Date | null;
  onSelect: (date: Date) => void;
}) {
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const today = startOfDay(new Date());

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month)),
    end: endOfWeek(endOfMonth(month)),
  });

  return (
    <div className="rounded-md border border-border bg-surface p-4">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMonth((m) => subMonths(m, 1))}
          className="text-sm text-muted hover:text-foreground"
        >
          ← Prev
        </button>
        <p className="font-display text-sm font-semibold uppercase">
          {format(month, "MMMM yyyy")}
        </p>
        <button
          type="button"
          onClick={() => setMonth((m) => addMonths(m, 1))}
          className="text-sm text-muted hover:text-foreground"
        >
          Next →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const disabled = isBefore(day, today) || !isSameMonth(day, month);
          const isSelected = selected && isSameDay(day, selected);
          return (
            <button
              type="button"
              key={day.toISOString()}
              disabled={disabled}
              onClick={() => onSelect(day)}
              className={clsx(
                "aspect-square rounded-md text-sm transition-colors",
                disabled && "text-border",
                !disabled && "hover:bg-border",
                isSelected && "bg-brand text-white hover:bg-brand",
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
