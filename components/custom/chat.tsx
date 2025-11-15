"use client";

import { useChat } from '@ai-sdk/react';
import { UIMessage } from "ai";
import { useState } from "react";

import { Message as PreviewMessage, ToolInvocation } from "@/components/custom/message";
import { useScrollToBottom } from "@/components/custom/use-scroll-to-bottom";

import { MultimodalInput } from "./multimodal-input";
import { Overview } from "./overview";

// Helper to extract text content from UIMessage - handle both content and parts
function extractTextFromMessage(message: UIMessage): string {
  // Handle messages with content property (from database)
  if ('content' in message && Array.isArray(message.content)) {
    const textParts = message.content.filter(part => part.type === 'text');
    return textParts.map(part => part.text).join('') || '';
  }
  
  // Handle messages with parts property (AI SDK format)
  const textParts = message.parts?.filter(part => part.type === 'text') || [];
  return textParts.map(part => part.text).join('') || '';
}

// Helper to extract tool invocations - handle both content and parts
function extractToolInvocationsFromMessage(message: UIMessage): ToolInvocation[] {
  // Handle messages with content property (from database)
  if ('content' in message && Array.isArray(message.content)) {
    return message.content.filter((part): part is any =>
      part.type.startsWith('tool-')
    ) as ToolInvocation[] || [];
  }
  
  // Handle messages with parts property (AI SDK format)
  return message.parts?.filter((part): part is any =>
    part.type.startsWith('tool-')
  ) as ToolInvocation[] || [];
}

export function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Array<UIMessage>;
}) {
  const [input, setInput] = useState('');
  const {
    messages,
    sendMessage,
    status,
    stop
  } = useChat({
    id,
    messages: initialMessages,
  });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div className="flex flex-row justify-center pb-4 md:pb-8 h-dvh bg-background">
      <div className="flex flex-col justify-between items-center gap-4">
        <div
          ref={messagesContainerRef}
          className="flex flex-col gap-4 h-full w-dvw items-center overflow-y-scroll"
        >
          {messages.length === 0 && <Overview />}

          {messages.map((message) => (
            <PreviewMessage
              key={message.id}
              chatId={id}
              role={message.role}
              content={extractTextFromMessage(message)}
              attachments={[]}
              toolInvocations={extractToolInvocationsFromMessage(message)}
            />
          ))}

          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>

        <div className="flex flex-row gap-2 relative items-end w-full md:max-w-[500px] max-w-[calc(100dvw-32px)] px-4 md:px-0">
          <MultimodalInput
            input={input}
            setInput={setInput}
            isLoading={status === 'streaming'}
            stop={stop}
            messages={messages}
            append={async (message) => {
              const text = message.parts?.find(p => p.type === 'text')?.text || '';
              await sendMessage({ text });
              return null;
            }}
          />
        </div>
      </div>
    </div>
  );
}
