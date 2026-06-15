import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import { streamText, UIMessage, convertToModelMessages, createUIMessageStreamResponse } from 'ai';
import { NextRequest } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  // Extract the UI messages and the requested model from the body
  const { messages, modelId } = await req.json() as {
    messages: UIMessage[];
    modelId?: string;
  };

  // Create the Bedrock provider using credentials from environment variables.
  const bedrock = createAmazonBedrock({
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  // Default to Sonnet if no model provided or an invalid one is sent
  const selectedModelId = modelId || 'anthropic.claude-3-5-sonnet-20240620-v1:0';

  // Convert UI messages to model messages
  const modelMessages = await convertToModelMessages(messages);

  // Call the language model with streaming
  const result = streamText({
    model: bedrock(selectedModelId),
    messages: modelMessages,
    system: "You are a helpful, concise, and intelligent AI assistant. Use markdown for formatting your responses. Be extremely accurate.",
  });

  // Return a UI message stream response for the DefaultChatTransport
  return createUIMessageStreamResponse({
    stream: result.toUIMessageStream(),
  });
}
