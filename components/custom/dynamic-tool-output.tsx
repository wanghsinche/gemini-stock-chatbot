"use client";
import cx from "classnames";
import { useState } from "react";
interface DynamicToolOutputProps {
  toolName: string;
  output: any;
  state: "input-streaming" | "input-available" | "output-available" | "output-error";
}
interface DynamicToolErrorProps {
  toolName: string;
  errorText: string;
}
// Generate consistent colors based on tool name
function getToolColors(name: string) {
  const charCode = name.charCodeAt(0) || 0;
  // Use a predefined set of chart colors from the theme, plus some professional tones
  const colorSchemes = [
    {
      // Chart color 1 (e.g., a professional blue)
      bg: "from-chart-1/10 to-chart-1/5",
      border: "border-chart-1/20",
      iconBg: "bg-chart-1/20",
      iconText: "text-chart-1",
      titleText: "text-chart-1/80",
      headerText: "text-foreground",
    },
    {
      // Chart color 2 (e.g., a calm green)
      bg: "from-chart-2/10 to-chart-2/5",
      border: "border-chart-2/20",
      iconBg: "bg-chart-2/20",
      iconText: "text-chart-2",
      titleText: "text-chart-2/80",
      headerText: "text-foreground",
    },
    {
      // Chart color 3 (e.g., a neutral teal)
      bg: "from-chart-3/10 to-chart-3/5",
      border: "border-chart-3/20",
      iconBg: "bg-chart-3/20",
      iconText: "text-chart-3",
      titleText: "text-chart-3/80",
      headerText: "text-foreground",
    },
    {
      // Chart color 4 (e.g., a warm orange)
      bg: "from-chart-4/10 to-chart-4/5",
      border: "border-chart-4/20",
      iconBg: "bg-chart-4/20",
      iconText: "text-chart-4",
      titleText: "text-chart-4/80",
      headerText: "text-foreground",
    },
    {
      // A professional purple/indigo
      bg: "from-indigo-500/10 to-indigo-500/5",
      border: "border-indigo-500/20",
      iconBg: "bg-indigo-500/20",
      iconText: "text-indigo-500",
      titleText: "text-indigo-500/80",
      headerText: "text-foreground",
    },
  ];
  const schemeIndex = charCode % colorSchemes.length;
  return colorSchemes[schemeIndex];
}
export function DynamicToolOutput({
  toolName,
  output,
  state,
}: DynamicToolOutputProps) {
  const [isExpanded, setIsExpanded] = useState(false); // Default to collapsed
  if (state === "input-streaming" || state === "input-available") {
    return (
      <div
        className={cx(
          "flex flex-col gap-4 rounded-2xl p-4",
          "bg-muted/50 border border-border"
        )}
      >
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-3 items-center">
            <div className="size-8 rounded-full bg-muted animate-pulse" />
            <div className="text-lg font-medium text-muted-foreground">
              Executing {toolName}
            </div>
          </div>
        </div>
        <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
      </div>
    );
  }
  const colors = getToolColors(toolName);
  return (
    <div
      className={cx(
        "flex flex-col gap-4 rounded-2xl p-4 bg-gradient-to-br",
        colors.bg,
        colors.border,
        "border"
      )}
    >
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-3 items-center">
          <div
            className={cx(
              "size-10 rounded-full flex items-center justify-center",
              colors.iconBg
            )}
          >
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
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cx(
            "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
            "bg-muted/50 hover:bg-muted",
            "text-muted-foreground"
          )}
        >
          {isExpanded ? "Hide" : "Show"}
        </button>
      </div>
      <div
        className={cx(
          "bg-card/50 rounded-xl p-4 border border-border",
          {
            hidden: !isExpanded,
            block: isExpanded,
          }
        )}
      >
        <pre className="text-sm text-foreground/80 overflow-y-auto max-h-60 whitespace-pre-wrap break-words font-mono">
          {JSON.stringify(output, null, 2)}
        </pre>
      </div>
    </div>
  );
}
export function DynamicToolError({
  toolName,
  errorText,
}: DynamicToolErrorProps) {
  return (
    <div
      className={cx(
        "flex flex-col gap-4 rounded-2xl p-4",
        "bg-destructive/10 border border-destructive/20"
      )}
    >
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-3 items-center">
          <div
            className={cx(
              "size-10 rounded-full flex items-center justify-center",
              "bg-destructive/20"
            )}
          >
            <div className="text-destructive text-lg font-bold">!</div>
          </div>
          <div>
            <div className="text-sm font-medium text-destructive/80">
              Tool Error
            </div>
            <div className="text-xl font-semibold text-destructive">
              {toolName}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-destructive/10 rounded-xl p-4 border border-destructive/20">
        <div className="text-sm text-destructive font-medium">{errorText}</div>
      </div>
    </div>
  );
}