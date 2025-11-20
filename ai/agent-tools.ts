import { tool } from 'ai'
import { z } from 'zod';

export const CheckListTool = tool({
  name: 'check_list',
  description: 'Use this tool to create an interactive checklist of items.',
  inputSchema: z.object({
    items: z.array(z.string()).min(1).describe('List of items to include in the checklist'),
  }),
  outputSchema: z.object({
    checklist: z.string().describe('Formatted checklist as a string'),
    items: z.array(z.object({
      text: z.string(),
      checked: z.boolean().default(false)
    })).describe('Structured checklist items for UI rendering'),
    total: z.number().describe('Total number of items in the checklist')
  }),
  execute: (input) => {
    const checklist = input.items.map((item, index) => `- [ ] ${item}`).join('\n');
    const structuredItems = input.items.map(item => ({
      text: item,
      checked: false
    }));
    
    return {
      checklist,
      items: structuredItems,
      total: input.items.length
    };
  },
});
