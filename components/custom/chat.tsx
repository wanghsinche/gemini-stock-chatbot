"use client";

import { UIMessage } from "ai";
import { useChat } from '@ai-sdk/react';
import { useState } from "react";

import { Message as PreviewMessage } from "@/components/custom/message";
import { useScrollToBottom } from "@/components/custom/use-scroll-to-bottom";

import { MultimodalInput } from "./multimodal-input";
import { Overview } from "./overview";

// File attachment type for AI SDK 5.0
type FileAttachment = {
  url: string;
  name: string;
  contentType: string;
};

// Helper to extract text content from UIMessage parts
function extractTextFromMessage(message: UIMessage): string {
  const textParts = message.parts?.filter(part => part.type === 'text');
  return textParts?.map(part => part.text).join('') || '';
}

// Helper to extract attachments from UIMessage parts
function extractAttachmentsFromMessage(message: UIMessage): Array<FileAttachment> {
  return message.parts?.filter(part => part.type === 'file').map(part => ({
    url: part.url,
    name: (part as any).name || 'unnamed',
    contentType: part.mediaType || 'application/octet-stream',
  })) || [];
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

  const [attachments, setAttachments] = useState<Array<FileAttachment>>([]);

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
              attachments={extractAttachmentsFromMessage(message)}
              toolInvocations={message.parts?.filter(part => part.type.startsWith('tool-')) as any}
            />
          ))}

          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>

        <form className="flex flex-row gap-2 relative items-end w-full md:max-w-[500px] max-w-[calc(100dvw-32px) px-4 md:px-0">
          <MultimodalInput
            input={input}
            setInput={setInput}
            handleSubmit={() => {
              // MultimodalInput handles its own submission
            }}
            isLoading={status === 'streaming'}
            stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
            messages={messages}
            append={async (message) => {
              const text = message.parts?.find(p => p.type === 'text')?.text || '';
              await sendMessage({ text });
              return null;
            }}
          />
        </form>
      </div>
    </div>
  );
}
