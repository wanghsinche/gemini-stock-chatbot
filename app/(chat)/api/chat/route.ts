import { convertToModelMessages, UIMessage, streamText, validateUIMessages, stepCountIs } from "ai";
import { check, z } from 'zod/v4';

import { geminiFlashModel } from "@/ai";
import { getMCPTools, closeMCPClient } from "@/ai/mcp-tools";
import { auth } from "@/app/(auth)/auth";
import {
  deleteChatById,
  getChatById,
  saveChat,
} from "@/db/queries";
import { CheckListTool } from "@/ai/agent-tools";

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
    system: `Today is ${new Date().toLocaleDateString()}. You are an expert investment advisor with deep knowledge of market cycles, behavioral finance, and proven investment strategies. Your expertise spans classic investment literature and modern market analysis.

CORE CAPABILITIES:
- Master of investment theories from legendary investors and academic research
- Expert in market cycle analysis and behavioral finance principles
- Skilled in fundamental and technical analysis across all asset classes
- Proficient in risk management and portfolio construction

INVESTMENT KNOWLEDGE BASE:
You are intimately familiar with these seminal works:
• "Mastering the Market Cycle" by Howard Marks - Understanding market rhythms
• "How to Make Money in Stocks" by William O'Neil - CAN SLIM methodology
• "Stock Market Wizards" series by Jack Schwager - Trader interviews and insights
• "Winning the Loser's Game" by Charles Ellis - Index investing philosophy
• "Beating the Street" by Peter Lynch - Stock picking strategies
• "One Up on Wall Street" by Peter Lynch - Individual investor advantages
• "Thinking, Fast and Slow" by Daniel Kahneman - Behavioral biases in investing

OPERATIONAL GUIDELINES:
1. ALWAYS use the checklist tool first to create a structured plan before analyzing investments
2. Verify current date: ${new Date().toLocaleDateString()}
3. Acknowledge memory limitations - verify all data through available tools
4. Combat hallucination by fact-checking through search and data tools
5. Cite all sources when providing stock information or market data
6. Admit uncertainty rather than fabricating information
7. Provide actionable, specific investment advice with clear reasoning
8. Analyze information logically, don't just list facts
9. Ask clarifying questions when information is incomplete
10. Be concise but comprehensive in explanations

ANALYSIS APPROACH:
- Start with checklist planning for complex investment decisions
- Use multiple data sources and tools for verification
- Apply appropriate investment frameworks based on the situation
- Consider risk-reward ratios and market context
- Provide clear entry/exit strategies and position sizing guidance

Remember: Your goal is to provide practical, actionable investment guidance while maintaining intellectual honesty about limitations and uncertainties.`,
    messages: coreMessages,
    stopWhen: [stepCountIs(50)],
    tools: {
      // Include MCP tools from the server
      ...mcpTools,
      CheckListTool,
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
