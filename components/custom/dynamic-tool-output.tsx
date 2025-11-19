"use client";

import cx from "classnames";

interface DynamicToolOutputProps {
  toolName: string;
  output: any;
  state: 'input-streaming' | 'input-available' | 'output-available' | 'output-error';
}

interface DynamicToolErrorProps {
  toolName: string;
  errorText: string;
}

// Generate consistent colors based on tool name
function getToolColors(name: string) {
  const firstChar = name.charAt(0).toLowerCase();
  const charCode = firstChar.charCodeAt(0);
  
  // Create different color schemes based on first character
  const colorSchemes = [
    {
      bg: "from-slate-50 to-slate-100 dark:from-slate-900/20 dark:to-slate-900/10",
      border: "border-slate-200 dark:border-slate-700",
      iconBg: "bg-slate-200 dark:bg-slate-700",
      iconText: "text-slate-600 dark:text-slate-300",
      titleText: "text-slate-500 dark:text-slate-400",
      headerText: "text-slate-700 dark:text-slate-300"
    },
    {
      bg: "from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10",
      border: "border-emerald-200 dark:border-emerald-700",
      iconBg: "bg-emerald-200 dark:bg-emerald-700",
      iconText: "text-emerald-600 dark:text-emerald-300",
      titleText: "text-emerald-500 dark:text-emerald-400",
      headerText: "text-emerald-700 dark:text-emerald-300"
    },
    {
      bg: "from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10",
      border: "border-indigo-200 dark:border-indigo-700",
      iconBg: "bg-indigo-200 dark:bg-indigo-700",
      iconText: "text-indigo-600 dark:text-indigo-300",
      titleText: "text-indigo-500 dark:text-indigo-400",
      headerText: "text-indigo-700 dark:text-indigo-300"
    },
    {
      bg: "from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10",
      border: "border-amber-200 dark:border-amber-700",
      iconBg: "bg-amber-200 dark:bg-amber-700",
      iconText: "text-amber-600 dark:text-amber-300",
      titleText: "text-amber-500 dark:text-amber-400",
      headerText: "text-amber-700 dark:text-amber-300"
    },
    {
      bg: "from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-900/10",
      border: "border-gray-200 dark:border-gray-700",
      iconBg: "bg-gray-200 dark:bg-gray-700",
      iconText: "text-gray-600 dark:text-gray-300",
      titleText: "text-gray-500 dark:text-gray-400",
      headerText: "text-gray-700 dark:text-gray-300"
    }
  ];
  
  // Use char code to consistently map to a color scheme
  const schemeIndex = charCode % colorSchemes.length;
  return colorSchemes[schemeIndex];
}

export function DynamicToolOutput({ toolName, output, state }: DynamicToolOutputProps) {
  // Loading state
  if (state === 'input-streaming' || state === 'input-available') {
    return (
      <div className={cx(
        "flex flex-col gap-4 rounded-2xl p-4 skeleton-bg",
        "bg-zinc-100 dark:bg-zinc-800",
        "border border-zinc-200 dark:border-zinc-700"
      )}>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-3 items-center">
            <div className="size-8 rounded-full skeleton-div bg-zinc-300 dark:bg-zinc-600" />
            <div className="text-lg font-medium text-zinc-600 dark:text-zinc-400">
              Executing {toolName}
            </div>
          </div>
        </div>
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4 animate-pulse"></div>
      </div>
    );
  }

  const colors = getToolColors(toolName);

  // Success state with polished UI similar to Weather component
  return (
    <div className={cx(
      "flex flex-col gap-4 rounded-2xl p-4 skeleton-bg",
      `bg-gradient-to-br ${colors.bg}`,
      colors.border,
      "border"
    )}>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-3 items-center">
          <div className={cx(
            "size-10 rounded-full flex items-center justify-center",
            colors.iconBg
          )}>
            <div className={cx("text-lg font-bold", colors.iconText)}>
              {toolName.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <div className={cx("text-sm font-medium", colors.titleText)}>
              Tool Result
            </div>
            <div className={cx("text-xl font-semibold", colors.headerText)}>
              {toolName}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
        <pre className="text-sm text-zinc-700 dark:text-zinc-300 overflow-y-auto max-h-40 whitespace-pre-wrap break-words font-mono">
          {JSON.stringify(output, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export function DynamicToolError({ toolName, errorText }: DynamicToolErrorProps) {
  return (
    <div className={cx(
      "flex flex-col gap-4 rounded-2xl p-4 skeleton-bg",
      "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10",
      "border border-red-200 dark:border-red-800"
    )}>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-3 items-center">
          <div className={cx(
            "size-10 rounded-full flex items-center justify-center",
            "bg-red-200 dark:bg-red-800"
          )}>
            <div className="text-red-600 dark:text-red-300 text-lg font-bold">
              !
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-red-500 dark:text-red-400">
              Tool Error
            </div>
            <div className="text-xl font-semibold text-red-700 dark:text-red-300">
              {toolName}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 rounded-xl p-4 border border-red-200 dark:border-red-800">
        <div className="text-sm text-red-700 dark:text-red-300 font-medium">
          {errorText}
        </div>
      </div>
    </div>
  );
}