import { experimental_createMCPClient, experimental_MCPClient } from '@ai-sdk/mcp';

// MCP Server configuration from environment variable
const MCP_SERVER_URL_PLUSE = process.env.MCP_SERVER_URL_PLUSE!;
const MCP_SERVER_URL_TAVILY = process.env.MCP_SERVER_URL_TAVILY!;

let mcpClientPluse: experimental_MCPClient|null = null;
let mcpClientTavily: experimental_MCPClient|null = null;

// Initialize PlusE MCP client
async function getMCPClientPluse() {
  if (!mcpClientPluse) {
    mcpClientPluse = await experimental_createMCPClient({
      transport: {
        type: 'http',
        url: MCP_SERVER_URL_PLUSE,
      },
      name: 'PlusE-mcp-client',
      onUncaughtError: (error) => {
        console.error('PlusE MCP Client uncaught error:', error);
      },
    });
  }
  return mcpClientPluse;
}

// Initialize Tavily MCP client
async function getMCPClientTavily() {
  if (!mcpClientTavily) {
    mcpClientTavily = await experimental_createMCPClient({
      transport: {
        type: 'http',
        url: MCP_SERVER_URL_TAVILY,
      },
      name: 'Tavily-mcp-client',
      onUncaughtError: (error) => {
        console.error('Tavily MCP Client uncaught error:', error);
      },
    });
  }
  return mcpClientTavily;
}

// Get tools from all MCP servers and convert to AI SDK format
export async function getMCPTools() {
  try {
    const [pluseClient, tavilyClient] = await Promise.all([
      getMCPClientPluse(),
      getMCPClientTavily()
    ]);
    
    const [pluseTools, tavilyTools] = await Promise.all([
      pluseClient.tools(),
      tavilyClient.tools()
    ]);
    
    const allTools = { ...pluseTools, ...tavilyTools };
    console.log('Retrieved MCP tools from all servers:', Object.keys(allTools));
    return allTools;
  } catch (error) {
    console.error('Failed to get MCP tools:', error);
    // Return empty tools object on error
    return {};
  }
}

// Close all MCP clients
export async function closeMCPClient() {
  const closePromises = [];
  
  if (mcpClientPluse) {
    closePromises.push(mcpClientPluse.close());
    mcpClientPluse = null;
  }
  
  if (mcpClientTavily) {
    closePromises.push(mcpClientTavily.close());
    mcpClientTavily = null;
  }
  
  await Promise.all(closePromises);
}