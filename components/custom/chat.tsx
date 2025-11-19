"use client";

import { useChat } from '@ai-sdk/react';
import { UIMessage } from "ai";
import { useState } from "react";

import { Message as PreviewMessage, MessagePart } from "@/components/custom/message";
import { useScrollToBottom } from "@/components/custom/use-scroll-to-bottom";

import { MultimodalInput } from "./multimodal-input";
import { Overview } from "./overview";

// Helper to convert UIMessage parts to MessagePart format
function convertMessageParts(message: UIMessage): MessagePart[] {
  // Handle messages with parts property (AI SDK format)
  if (message.parts) {
    return message.parts.map(part => {
      // Handle different part types and convert to our MessagePart format
      switch (part.type) {
        case 'text':
        case 'reasoning':
        case 'step-start':
        case 'file':
        case 'source-url':
        case 'source-document':
          return part as MessagePart;
        
        case 'dynamic-tool':
          return part as MessagePart;
        
        default:
          // Handle tool-{name} parts
          if (part.type.startsWith('tool-')) {
            return part as MessagePart;
          }
          
          // Handle data-{name} parts
          if (part.type.startsWith('data-')) {
            return {
              type: part.type as `data-${string}`,
              id: (part as any).id,
              data: (part as any).data
            } as MessagePart;
          }
          
          return part as MessagePart;
      }
    });
  }
  
  // Handle legacy messages with content property (from database)
  if ('content' in message && Array.isArray(message.content)) {
    return message.content.map(part => {
      if (part.type === 'text') {
        return {
          type: 'text' as const,
          text: part.text
        } as MessagePart;
      }
      // Handle other legacy content types if needed
      return part as MessagePart;
    });
  }
  
  // Fallback for messages without parts or content
  return [];
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

          {messages.map((message, index) => {
            // Check if this is the last message and we're currently streaming
            const isLastMessage = index === messages.length - 1;
            const isLoading = status === 'streaming' && isLastMessage && message.role === 'assistant';
            
            return (
              <PreviewMessage
                key={message.id}
                chatId={id}
                role={message.role}
                parts={convertMessageParts(message)}
                isLoading={isLoading}
              />
            );
          })}

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
