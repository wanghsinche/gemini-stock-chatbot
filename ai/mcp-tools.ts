import { experimental_createMCPClient, experimental_MCPClient } from '@ai-sdk/mcp';

// MCP Server configuration from environment variable
const MCP_SERVER_URL = process.env.MCP_SERVER_URL!;

let mcpClient: experimental_MCPClient|null = null;

// Initialize MCP client
async function getMCPClient() {
  if (!mcpClient) {
    mcpClient = await experimental_createMCPClient({
      transport: {
        type: 'http',
        url: MCP_SERVER_URL,
      },
      name: 'PlusE-mcp-client',
      onUncaughtError: (error) => {
        console.error('MCP Client uncaught error:', error);
      },
    });
  }
  return mcpClient;
}

// Get tools from MCP server and convert to AI SDK format
export async function getMCPTools() {
  try {
    const client = await getMCPClient();
    const tools = await client.tools();
    console.log('Retrieved MCP tools:', Object.keys(tools));
    return tools;
  } catch (error) {
    console.error('Failed to get MCP tools:', error);
    // Return empty tools object on error
    return {};
  }
}

// Close MCP client
export async function closeMCPClient() {
  if (mcpClient) {
    await mcpClient.close();
    mcpClient = null;
  }
}