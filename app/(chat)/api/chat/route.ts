import { convertToModelMessages, UIMessage, streamText, validateUIMessages, stepCountIs } from "ai";
import { z } from 'zod/v4';

import { geminiFlashModel } from "@/ai";
import { auth } from "@/app/(auth)/auth";
import {
  deleteChatById,
  getChatById,
  saveChat,
} from "@/db/queries";
import { getMCPTools, closeMCPClient } from "@/ai/mcp-tools";

export async function POST(request: Request) {
  const { id, messages }: { id: string; messages: Array<UIMessage> } =
    await request.json();

  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Get MCP tools from the server
  const mcpTools = await getMCPTools();

  // Validate messages to ensure they match the expected format
  const validatedMessages = await validateUIMessages({
    messages,
    // Add tool definitions here if you have any
    // tools: tools,
  });

  const coreMessages = convertToModelMessages(validatedMessages).filter(
    (message) => message.content.length > 0,
  );

  const result = streamText({
    model: geminiFlashModel,
    system: `\n
        - today's date is ${new Date().toLocaleDateString()}.
        - you are a helpful financial assistant that helps users with stock market information and trading.
        - when providing stock information, always cite your sources.
        - if you don't know the answer, just say you don't know.
        - never make up answers.
        - be concise and to the point.
        - always think step by step before answering.
        - use the tools provided to get accurate and up-to-date information.
        - ask for any details you don't know, etc.'
        '
      `,
    messages: coreMessages,
    stopWhen: [stepCountIs(5)],
    tools: {
      getWeather: {
        description: "Get the current weather at a location",
        inputSchema: z.object({
          latitude: z.number().describe("Latitude coordinate"),
          longitude: z.number().describe("Longitude coordinate"),
        }),
        execute: async ({ latitude, longitude }: { latitude: number; longitude: number }) => {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`,
          );

          const weatherData = await response.json();
          return weatherData;
        },
      },
      // Include MCP tools from the server
      ...mcpTools,
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: "stream-text",
    },
  });

  return result.toUIMessageStreamResponse({
    originalMessages: validatedMessages,
    onFinish: async ({ messages }) => {
      try {
        
        // Close MCP client after chat is complete
        await closeMCPClient();
        await saveChat({
          id,
          messages,
          userId: session.user?.id!,
        });
      } catch (error) {
        console.error('Failed to save chat:', error);
      }
    },
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await deleteChatById({ id });

    return new Response("Chat deleted", { status: 200 });
  } catch (error) {
    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}
