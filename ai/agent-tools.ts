import { tool } from "ai";
import { z } from "zod";

export const CheckListTool = tool({
  name: "check_list",
  description:
    "Use this tool to create an interactive checklist of items. You can also mark items as completed by providing them in the 'completed' array.",
  inputSchema: z.object({
    items: z
      .array(z.string())
      .min(1)
      .describe("List of items to include in the checklist"),
    completed: z
      .array(z.string())
      .optional()
      .describe(
        "List of items that are already completed. The item text must be an exact match.",
      ),
  }),
  outputSchema: z.object({
    checklist: z.string().describe("Formatted checklist as a string"),
    items: z
      .array(
        z.object({
          text: z.string(),
          checked: z.boolean().default(false),
        }),
      )
      .describe("Structured checklist items for UI rendering"),
    total: z.number().describe("Total number of items in the checklist"),
  }),
  execute: (input) => {
    const completedSet = new Set(input.completed || []);

    const checklist = input.items
      .map((item) => {
        const isChecked = completedSet.has(item);
        return `- [${isChecked ? "x" : " "}] ${item}`;
      })
      .join("\n");

    const structuredItems = input.items.map((item) => ({
      text: item,
      checked: completedSet.has(item),
    }));

    return {
      checklist,
      items: structuredItems,
      total: input.items.length,
    };
  },
});
