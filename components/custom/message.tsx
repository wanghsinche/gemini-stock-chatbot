"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

import { BotIcon, UserIcon } from "./icons";
import { Markdown } from "./markdown";
import { PreviewAttachment } from "./preview-attachment";
import { Weather } from "./weather";

// File attachment type for AI SDK 5.0 - matches file parts structure
export type FileAttachment = {
  type: 'file';
  url: string;
  name: string;
  mediaType: string;
};

// Tool invocation type for AI SDK 5.0 - use proper UIMessage parts
export type ToolInvocation = {
  type: `tool-${string}`;
  toolCallId: string;
  toolName: string;
  state: 'input-available' | 'output-available' | 'output-error';
  input?: any;
  output?: any;
  errorText?: string;
};

export const Message = ({
  chatId,
  role,
  content,
  toolInvocations,
  attachments,
}: {
  chatId: string;
  role: string;
  content: string | ReactNode;
  toolInvocations?: Array<ToolInvocation>;
  attachments?: Array<FileAttachment>;
}) => {
  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-20`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] border rounded-sm p-1 flex flex-col justify-center items-center shrink-0 text-zinc-500">
        {role === "assistant" ? <BotIcon /> : <UserIcon />}
      </div>

      <div className="flex flex-col gap-2 w-full">
        {content && typeof content === "string" && (
          <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
            <Markdown>{content}</Markdown>
          </div>
        )}

        {toolInvocations && (
          <div className="flex flex-col gap-4">
            {toolInvocations.map((toolInvocation) => {
              const { toolName, toolCallId, state } = toolInvocation;

              if (state === "output-available" && toolInvocation.output) {
                return (
                  <div key={toolCallId}>
                    {toolName === "getWeather" ? (
                      <Weather weatherAtLocation={toolInvocation.output} />
                    ) : (
                      <div>{JSON.stringify(toolInvocation.output, null, 2)}</div>
                    )}
                  </div>
                );
              } else if (state === "output-error" && toolInvocation.errorText) {
                return (
                  <div key={toolCallId} className="text-red-500">
                    Error: {toolInvocation.errorText}
                  </div>
                );
              } else {
                return (
                  <div key={toolCallId} className="skeleton">
                    {toolName === "getWeather" ? (
                      <Weather />
                    ) : 'LOADING'}
                  </div>
                );
              }
            })}
          </div>
        )}

        {attachments && (
          <div className="flex flex-row gap-2">
            {attachments.map((attachment) => (
              <PreviewAttachment key={attachment.url} attachment={attachment} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
