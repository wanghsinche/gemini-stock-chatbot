"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

import { BotIcon, UserIcon } from "./icons";
import { Markdown } from "./markdown";
import { PreviewAttachment } from "./preview-attachment";
import { ToolInvocationRenderer } from "./tool-invocation-renderer";
import { Weather } from "./weather";

// AI SDK 5.0 message part types based on UIMessagePart
export type MessagePart =
  | { type: 'text'; text: string; state?: 'streaming' | 'done'; providerMetadata?: any }
  | { type: 'reasoning'; text: string; state?: 'streaming' | 'done'; providerMetadata?: any }
  | { type: `tool-${string}`; toolCallId: string; toolName: string; state: 'input-streaming' | 'input-available' | 'output-available' | 'output-error'; input?: any; output?: any; errorText?: string; providerExecuted?: boolean; providerMetadata?: any }
  | { type: 'dynamic-tool'; toolCallId: string; toolName: string; state: 'input-streaming' | 'input-available' | 'output-available' | 'output-error'; input?: any; output?: any; errorText?: string; providerExecuted?: boolean; providerMetadata?: any; title?: string }
  | { type: 'source-url'; sourceId: string; url: string; title?: string; providerMetadata?: any }
  | { type: 'source-document'; sourceId: string; mediaType: string; title: string; filename?: string; providerMetadata?: any }
  | { type: 'file'; url: string; mediaType: string; filename?: string; providerMetadata?: any }
  | { type: `data-${string}`; id?: string; data: any }
  | { type: 'step-start' };

export const Message = ({
  chatId,
  role,
  parts,
  isLoading = false,
}: {
  chatId: string;
  role: string;
  parts: Array<MessagePart>;
  isLoading?: boolean;
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
        {parts.map((part, index) => {
          switch (part.type) {
            case 'text':
              return (
                <div key={index} className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
                  <Markdown>{part.text}</Markdown>
                </div>
              );
            
            case 'reasoning':
              return (
                <div key={index} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                    Reasoning
                  </div>
                  <div className="text-zinc-700 dark:text-zinc-300 italic">
                    <Markdown>{part.text}</Markdown>
                  </div>
                </div>
              );
            
            case 'step-start':
              return <div key={index} className="border-t border-zinc-200 dark:border-zinc-700 my-4" />;
            
            case 'file':
              return (
                <div key={index} className="flex flex-row gap-2">
                  <PreviewAttachment
                    attachment={{
                      type: 'file',
                      url: part.url,
                      name: part.filename || 'File',
                      mediaType: part.mediaType
                    }}
                  />
                </div>
              );
            
            case 'source-url':
              return (
                <div key={index} className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3 border border-zinc-200 dark:border-zinc-700">
                  <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Source
                  </div>
                  <a
                    href={part.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm break-all"
                  >
                    {part.title || part.url}
                  </a>
                </div>
              );
            
            case 'source-document':
              return (
                <div key={index} className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3 border border-zinc-200 dark:border-zinc-700">
                  <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Document
                  </div>
                  <div className="text-zinc-800 dark:text-zinc-200 text-sm">
                    {part.title} <span className="text-zinc-500 dark:text-zinc-400">({part.mediaType})</span>
                  </div>
                </div>
              );
            
            case 'dynamic-tool':
            default:
              // Handle tool invocations (both dynamic-tool and tool-{name} types)
              // Handle tool invocations with modular components
              if (part.type.startsWith('tool-') || part.type === 'dynamic-tool') {
                const toolPart = part as any;
                const { toolName, toolCallId, state } = toolPart;

                const realToolName = part.type === 'dynamic-tool' ? toolPart.toolName : part.type.replace('tool-', '');

                return (
                  <ToolInvocationRenderer
                    key={toolCallId}
                    toolName={realToolName}
                    toolCallId={toolCallId}
                    state={state}
                    input={toolPart.input}
                    output={toolPart.output}
                    errorText={toolPart.errorText}
                    providerExecuted={toolPart.providerExecuted}
                  />
                );
              }
              
              // Handle data parts
              if (part.type.startsWith('data-')) {
                return (
                  <div key={index} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                      Data: {part.type.replace('data-', '')}
                    </div>
                    <pre className="text-sm text-zinc-700 dark:text-zinc-300 overflow-x-auto whitespace-pre-wrap break-words">
                      {JSON.stringify((part as any).data, null, 2)}
                    </pre>
                  </div>
                );
              }
              
              return null;
          }
        })}
        
        {/* Show loading indicator if message is still being streamed */}
        {isLoading && (
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-sm mt-2">
            <div className="animate-pulse flex space-x-1">
              <div className="size-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="size-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="size-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span>{role === 'assistant' ? ' Thinking...' : ' Sending...'}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
