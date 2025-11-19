"use client";

import { ChatRequestOptions, UIMessage } from "ai";
import { motion } from "framer-motion";
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";

import { ArrowUpIcon, StopIcon } from "./icons";
import useWindowSize from "./use-window-size";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const suggestedActions = [
  {
    title: "Analyze market cycle",
    label: "current phase and opportunities",
    action: "Analyze the current market cycle phase using Mastering the Market Cycle principles. What are the key indicators suggesting and where are the best opportunities now?",
  },
  {
    title: "Build a winning portfolio",
    label: "using CAN SLIM methodology",
    action: "Help me build a winning portfolio using the CAN SLIM methodology from 'How to Make Money in Stocks'. What stocks currently meet the criteria and what's the optimal allocation?",
  },
  {
    title: "Value vs Growth",
    label: "which strategy works now?",
    action: "Based on current market conditions, should I focus on value or growth investing? Analyze using Warren Buffett's principles and provide specific stock examples with entry points.",
  },
  {
    title: "Market sentiment analysis",
    label: "fear vs greed index",
    action: "Analyze current market sentiment using fear vs greed indicators. What does this tell us about potential market moves and how should I position my portfolio?",
  },
  {
    title: "Dollar-cost averaging",
    label: "best candidates for DCA",
    action: "Identify the best stocks for dollar-cost averaging right now. Consider blue-chip companies with strong fundamentals that are trading at reasonable valuations.",
  },
  {
    title: "Risk management",
    label: "position sizing and stop losses",
    action: "Help me implement proper risk management for my portfolio. How should I determine position sizes and set stop losses based on current market volatility?",
  },
];
export function MultimodalInput({
  input,
  setInput,
  isLoading,
  stop,
  messages,
  append,
  handleSubmit,
}: {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  messages: Array<UIMessage>;
  append: (
    message: UIMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  handleSubmit?: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 0}px`;
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const submitForm = useCallback(async () => {
    // Submit text message only
    await append({
      id: `user-${Date.now()}`,
      role: "user",
      parts: [{ type: 'text' as const, text: input }],
    });

    setInput('');
    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [input, append, setInput, width]);

  return (
    <div className="relative w-full flex flex-col gap-4">
      {messages.length === 0 && (
        <div className="grid sm:grid-cols-2 gap-4 w-full md:px-0 mx-auto md:max-w-[500px]">
          {suggestedActions.map((suggestedAction, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.05 * index }}
              key={index}
              className={index > 1 ? "hidden sm:block" : "block"}
            >
              <button
                onClick={async () => {
                  await append({
                    id: `suggested-${Date.now()}`,
                    role: "user",
                    parts: [{ type: "text" as const, text: suggestedAction.action }],
                  });
                }}
                className="border-none bg-muted/50 w-full text-left border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg p-3 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col"
              >
                <span className="font-medium">{suggestedAction.title}</span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {suggestedAction.label}
                </span>
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <Textarea
        ref={textareaRef}
        placeholder="Send a message..."
        value={input}
        onChange={handleInput}
        className="min-h-[24px] overflow-hidden resize-none rounded-lg text-base bg-muted border-none"
        rows={3}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (isLoading) return;
            submitForm();
          }
        }}
      />

      {isLoading ? (
        <Button
          className="rounded-full p-1.5 h-fit absolute bottom-2 right-2 m-0.5 text-white"
          onClick={(event) => {
            event.preventDefault();
            stop();
          }}
        >
          <StopIcon size={14} />
        </Button>
      ) : (
        <Button
          className="rounded-full p-1.5 h-fit absolute bottom-2 right-2 m-0.5 text-white"
          onClick={(event) => {
            event.preventDefault();
            submitForm();
          }}
          disabled={!input.trim()}
        >
          <ArrowUpIcon size={14} />
        </Button>
      )}
    </div>
  );
}
