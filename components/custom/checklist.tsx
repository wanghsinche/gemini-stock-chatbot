"use client";
import cx from "classnames";
import { useState } from "react";
import { CheckCircle } from "lucide-react";

interface ChecklistOutput {
  checklist: string;
}

const SAMPLE = {
  checklist: `- [ ] Review investment portfolio
- [ ] Analyze market trends
- [ ] Execute stock trades
- [x] Update financial model
- [ ] Prepare quarterly report`,
};

export function Checklist({
  checklistOutput = SAMPLE,
}: {
  checklistOutput?: ChecklistOutput;
}) {
  const [checkedIndices, setCheckedIndices] = useState<Set<number>>(new Set());

  const items = checklistOutput.checklist
    .split("\n")
    .filter((line) => line.trim().startsWith("- ["))
    .map((line) => {
      const match = line.match(/^-\s*\[(.)\]\s*(.+)$/);
      if (match) {
        return {
          checked: match[1] === "x",
          text: match[2].trim(),
        };
      }
      return null;
    })
    .filter((item): item is { checked: boolean; text: string } => item !== null);

  const completedCount = items.filter((item, index) => checkedIndices.has(index) || item.checked).length;
  const totalCount = items.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div data-scroll-ignore="true" className="flex flex-col gap-4 rounded-2xl p-4 bg-zinc-900 border border-zinc-800 text-white">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-3 items-center">
          <div className="size-8 rounded-full flex items-center justify-center bg-zinc-800">
            <CheckCircle className="size-5 text-zinc-400" />
          </div>
          <div className="text-md font-semibold text-zinc-200">
            Tasks
          </div>
        </div>
        <div className="text-sm font-medium text-zinc-400">
          {completedCount} / {totalCount}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-zinc-800 rounded-full h-1.5">
        <div
          className="bg-primary h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Checklist Items */}
      <div className="flex flex-col gap-2">
        {items.map((item, index) => {
          const isChecked = checkedIndices.has(index) || item.checked;
          return (
            <div
              key={index}
              className={cx(
                "flex flex-row items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer",
                "bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50"
              )}
            >
              <div
                className={cx(
                  "size-5 rounded-md flex items-center justify-center transition-all duration-200 border-2",
                  isChecked
                    ? "bg-primary border-primary"
                    : "bg-transparent border-zinc-600"
                )}
              >
                {isChecked && (
                  <svg
                    className="size-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </div>
              <span
                className={cx(
                  "text-sm flex-1 transition-all duration-200",
                  isChecked
                    ? "text-zinc-500 line-through"
                    : "text-zinc-200"
                )}
              >
                {item.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* Completion Message */}
      {completedCount === totalCount && totalCount > 0 && (
        <div className="flex flex-row items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
          <div className="size-6 rounded-full bg-primary flex items-center justify-center">
            <CheckCircle className="size-4 text-white" />
          </div>
          <span className="text-sm font-medium text-primary/90">
            All tasks completed! Great job! 🎉
          </span>
        </div>
      )}
    </div>
  );
}