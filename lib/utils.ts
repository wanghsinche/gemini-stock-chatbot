import { generateId, UIMessage } from "ai";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { Chat } from "@/db/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ApplicationError extends Error {
  info: string;
  status: number;
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error(
      "An error occurred while fetching the data.",
    ) as ApplicationError;

    error.info = await res.json();
    error.status = res.status;

    throw error;
  }

  return res.json();
};

export function getLocalStorage(key: string) {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem(key) || "[]");
  }
  return [];
}

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// No longer needed - use validateUIMessages and convertToModelMessages from AI SDK instead

export function getTitleFromChat(chat: Chat) {
  // Get first message text for chat title
  const firstMessage = chat.messages[0] as any;
  
  if (!firstMessage) {
    return "Untitled";
  }

  // Handle both content and parts properties
  const messageParts = firstMessage.content || firstMessage.parts || [];
  if (Array.isArray(messageParts)) {
    const textPart = messageParts.find((part: any) => part.type === 'text');
    return textPart?.text || 'Untitled';
  }

  // Fallback for string content
  if (typeof firstMessage.content === 'string') {
    return firstMessage.content.substring(0, 50) || 'Untitled';
  }

  return 'Untitled';
}
