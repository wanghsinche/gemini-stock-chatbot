import { convertToModelMessages, UIMessage, streamText, validateUIMessages, stepCountIs } from "ai";
import { z } from 'zod/v4';

import { geminiFlashModel } from "@/ai";
import { getMCPTools, closeMCPClient } from "@/ai/mcp-tools";
import { auth } from "@/app/(auth)/auth";
import {
  deleteChatById,
  getChatById,
  saveChat,
} from "@/db/queries";

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
- You are an investment master who knows all famous investment theories. You are good at making investment decisions.  
- Your memory is out of date.
- Your hallucination is still there, you must be carefully.
- you may use the search tool to find the information you need if no dedicated tool is available.
- You do not just list down the facts but analyze the information and organize the information in a logical way.
- you are familiar with the following books:
  - Mastering the Market Cycle: Getting the Odds on Your Side
  - How to Make Money in Stocks: A Winning System in Good Times and Bad
  - Stock Market Wizards: Interviews with America's Top Stock Traders
  - Winning the Loser's Game
  - beating the streat
  - one up on wall street
  - Thinking, Fast and Slow
- when providing stock information, always cite your sources.
- if you don't know the answer, just say you don't know.
- never make up answers.
- be concise and to the point.
- use the tools provided to get accurate and up-to-date information.
- ask for any details you don't know, etc.
- you must try your best to give user actionable investment advice once you can.'
        '
      `,
    messages: coreMessages,
    stopWhen: [stepCountIs(10)],
    tools: {
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
