"use client";
import cx from "classnames";
import { ChevronDown, Loader } from "lucide-react";
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

// Generates a consistent grayscale color scheme based on the tool name
function getGrayscaleScheme(name: string) {
  const schemes = [
    {
      bg: "bg-zinc-900",
      border: "border-zinc-800",
      iconBg: "bg-zinc-800",
      iconText: "text-zinc-400",
      titleText: "text-zinc-500",
      headerText: "text-zinc-200",
      contentBg: "bg-zinc-950",
    },
    {
      bg: "bg-slate-900",
      border: "border-slate-800",
      iconBg: "bg-slate-800",
      iconText: "text-slate-400",
      titleText: "text-slate-500",
      headerText: "text-slate-200",
      contentBg: "bg-slate-950",
    },
    {
      bg: "bg-neutral-900",
      border: "border-neutral-800",
      iconBg: "bg-neutral-800",
      iconText: "text-neutral-400",
      titleText: "text-neutral-500",
      headerText: "text-neutral-200",
      contentBg: "bg-neutral-950",
    },
  ];

  // Simple hash function to deterministically pick a scheme
  const hashCode = Array.from(name).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );
  const schemeIndex = hashCode % schemes.length;
  return schemes[schemeIndex];
}

export function DynamicToolOutput({
  toolName,
  output,
  state,
}: DynamicToolOutputProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (state === "input-streaming" || state === "input-available") {
    return (
      <div className="flex flex-col gap-4 rounded-2xl p-4 bg-zinc-900 border border-zinc-800">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-3 items-center">
            <Loader className="size-5 text-zinc-500 animate-spin" />
            <div className="text-md font-medium text-zinc-400">
              Executing: <span className="font-semibold text-zinc-300">{toolName}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const colors = getGrayscaleScheme(toolName);

  return (
    <div
      data-scroll-ignore="true"
      className={cx(
        "flex flex-col gap-4 rounded-2xl p-4",
        colors.bg,
        colors.border,
        "border"
      )}
    >
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-3 items-center">
          <div className={cx("size-8 rounded-full flex items-center justify-center", colors.iconBg)}>
            <div className={cx("text-md font-bold", colors.iconText)}>
              {toolName.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <div className={cx("text-sm font-medium", colors.titleText)}>
              Tool Result
            </div>
            <div className={cx("text-md font-semibold", colors.headerText)}>
              {toolName}
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded-full hover:bg-zinc-800 transition-colors"
        >
          <ChevronDown
            className={cx("size-4 text-zinc-400 transition-transform", {
              "rotate-180": isExpanded,
            })}
          />
        </button>
      </div>
      {isExpanded && (
        <div className={cx("rounded-xl p-4 border", colors.contentBg, colors.border)}>
          <pre className="text-xs text-zinc-300 overflow-x-auto whitespace-pre-wrap break-words font-mono">
            {JSON.stringify(output, null, 2)}
          </pre>
        </div>
      )}
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
        "bg-red-900/20 border border-red-500/30"
      )}
    >
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-3 items-center">
          <div className="size-8 rounded-full flex items-center justify-center bg-red-900/30">
            <div className="text-red-400 text-lg font-bold">!</div>
          </div>
          <div>
            <div className="text-sm font-medium text-red-500/80">
              Tool Error
            </div>
            <div className="text-md font-semibold text-red-400">
              {toolName}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-red-900/20 rounded-xl p-4 border border-red-500/30">
        <div className="text-sm text-red-400 font-medium">{errorText}</div>
      </div>
    </div>
  );
}