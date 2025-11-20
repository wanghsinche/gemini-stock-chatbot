"use client";
import cx from "classnames";
import { useState } from "react";
interface ChecklistOutput {
  checklist: string;
}
const SAMPLE = {
  checklist: `- [ ] Review investment portfolio
- [ ] Analyze market trends
- [ ] Execute stock trades
- [ ] Update financial model
- [ ] Prepare quarterly report
- [ ] Consult with financial advisor
- [ ] Rebalance assets
- [ ] Set new investment goals`,
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
    .filter(Boolean);
  const handleClick = (index: number) => {
    const newCheckedItems = new Set(checkedIndices);
    if (newCheckedItems.has(index)) {
      newCheckedItems.delete(index);
    } else {
      newCheckedItems.add(index);
    }
    setCheckedIndices(newCheckedItems);
  };
  const completedCount =
    Array.from(checkedIndices).length +
    items.filter((item, index) => item?.checked && !checkedIndices.has(index))
      .length;
  const totalCount = items.length;
  const progressPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  return (
    <div data-scroll-ignore="true" className="flex flex-col gap-4 rounded-2xl p-4 bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-3 items-center">
          <div className="size-10 rounded-full flex items-center justify-center bg-primary/20">
            <div className="text-primary text-lg font-bold">✓</div>
          </div>
          <div>
            <div className="text-sm font-medium text-primary/80">
              Tasks
            </div>
          </div>
        </div>
        <div className="text-primary font-medium">
          {completedCount}/{totalCount}
        </div>
      </div>
      {/* Progress Bar */}
      <div className="w-full bg-primary/20 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      {/* Checklist Items */}
      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className={cx(
              "flex flex-row items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer",
              "bg-card/50 border border-border",
              "hover:bg-accent/50"
            )}
          >
            <div
              className={cx(
                "size-5 rounded border-2 flex items-center justify-center transition-all duration-200",
                checkedIndices.has(index) || item?.checked
                  ? "bg-primary border-primary"
                  : "bg-transparent border-primary/50"
              )}
            >
              {(checkedIndices.has(index) || item?.checked) && (
                <svg
                  className="size-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <span
              className={cx(
                "text-sm flex-1 transition-all duration-200",
                checkedIndices.has(index) || item?.checked
                  ? "text-muted-foreground line-through opacity-70"
                  : "text-foreground"
              )}
            >
              {item?.text}
            </span>
          </div>
        ))}
      </div>
      {/* Completion Message */}
      {completedCount === totalCount && totalCount > 0 && (
        <div className="flex flex-row items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
          <div className="size-6 rounded-full bg-primary flex items-center justify-center">
            <svg
              className="size-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-primary font-medium">
            All tasks completed! Great job! 🎉
          </span>
        </div>
      )}
    </div>
  );
}