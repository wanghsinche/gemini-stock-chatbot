"use client";

import cx from "classnames";
import { useState } from "react";

interface ChecklistOutput {
  checklist: string;
}

const SAMPLE = {
  checklist: `- [ ] Review project requirements
- [ ] Set up development environment
- [ ] Create database schema
- [ ] Implement authentication
- [ ] Build API endpoints
- [ ] Create frontend components
- [ ] Write tests
- [ ] Deploy to production`
};

export function Checklist({
  checklistOutput = SAMPLE,
}: {
  checklistOutput?: ChecklistOutput;
}) {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  // Parse the checklist string into individual items
  const items = checklistOutput.checklist
    .split('\n')
    .filter(line => line.trim().startsWith('- ['))
    .map(line => {
      const match = line.match(/^-\s*\[(.)\]\s*(.+)$/);
      if (match) {
        return {
          checked: match[1] === 'x',
          text: match[2].trim()
        };
      }
      return null;
    })
    .filter(Boolean);


  const completedCount = Array.from(checkedItems).length;
  const totalCount = items.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="flex flex-col gap-4 rounded-2xl p-4 skeleton-bg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 border border-emerald-200 dark:border-emerald-700">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-3 items-center">
          <div className="size-10 rounded-full flex items-center justify-center bg-emerald-200 dark:bg-emerald-700">
            <div className="text-emerald-600 dark:text-emerald-300 text-lg font-bold">
              ✓
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-emerald-500 dark:text-emerald-400">
              Task Progress
            </div>
            <div className="text-xl font-semibold text-emerald-700 dark:text-emerald-300">
              Checklist
            </div>
          </div>
        </div>
        <div className="text-emerald-600 dark:text-emerald-300 font-medium">
          {completedCount}/{totalCount}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-full h-2">
        <div 
          className="bg-emerald-500 dark:bg-emerald-400 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Checklist Items */}
      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <div 
            key={index}
            className={cx(
              "flex flex-row items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer",
              "bg-white dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800",
              "hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
            )}
          >
            <div className={cx(
              "size-5 rounded border-2 flex items-center justify-center transition-all duration-200",
              checkedItems.has(index) || item?.checked
                ? "bg-emerald-500 border-emerald-500 dark:bg-emerald-600 dark:border-emerald-600"
                : "bg-transparent border-emerald-300 dark:border-emerald-600"
            )}>
              {(checkedItems.has(index) || item?.checked) && (
                <svg className="size-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className={cx(
              "text-sm flex-1 transition-all duration-200",
              checkedItems.has(index) || item?.checked
                ? "text-emerald-600 dark:text-emerald-400 line-through opacity-70"
                : "text-emerald-800 dark:text-emerald-200"
            )}>
              {item?.text}
            </span>
          </div>
        ))}
      </div>

      {/* Completion Message */}
      {completedCount === totalCount && totalCount > 0 && (
        <div className="flex flex-row items-center gap-2 p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700">
          <div className="size-6 rounded-full bg-emerald-500 dark:bg-emerald-600 flex items-center justify-center">
            <svg className="size-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-emerald-700 dark:text-emerald-300 font-medium">
            All tasks completed! Great job! 🎉
          </span>
        </div>
      )}
    </div>
  );
}