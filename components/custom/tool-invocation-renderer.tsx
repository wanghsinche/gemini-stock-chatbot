"use client";

import { Weather } from "./weather";
import { DynamicToolOutput, DynamicToolError } from "./dynamic-tool-output";

interface ToolInvocationRendererProps {
  toolName: string;
  toolCallId: string;
  state: 'input-streaming' | 'input-available' | 'output-available' | 'output-error';
  input?: any;
  output?: any;
  errorText?: string;
  providerExecuted?: boolean;
}

export function ToolInvocationRenderer({
  toolName,
  toolCallId,
  state,
  input,
  output,
  errorText,
  providerExecuted
}: ToolInvocationRendererProps) {
  // Loading state
  if (state === 'input-streaming' || state === 'input-available') {
    return (
      <DynamicToolOutput toolName={toolName} output={null} state={state} />
    );
  }

  // Error state
  if (state === 'output-error' && errorText) {
    return <DynamicToolError toolName={toolName} errorText={errorText} />;
  }

  // Success state - render specific components based on tool name
  if (state === 'output-available' && output) {
    // Special handling for known tools with dedicated components
    switch (toolName) {
      case 'getWeather':
        return <Weather weatherAtLocation={output} />;
      
      // Add more specialized tool renderers here as needed
      // case 'getStock':
      //   return <Stock data={output} />;
      // case 'getNews':
      //   return <News articles={output} />;
      
      default:
        // Generic tool output renderer with polished UI
        return <DynamicToolOutput toolName={toolName} output={output} state={state} />;
    }
  }

  // Fallback for unknown states
  return (
    <DynamicToolOutput toolName={toolName} output={null} state={state} />
  );
}