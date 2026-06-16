import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import { streamText, UIMessage, convertToModelMessages, createUIMessageStreamResponse } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    // Extract the UI messages and the requested model from the body
    const { messages, modelId } = await req.json() as {
      messages: UIMessage[];
      modelId?: string;
    };

    // Create the Bedrock provider using credentials from environment variables.
    // It supports either standard AWS credentials or a direct Bearer token.
    // Build configuration object dynamically so we don't accidentally override the default AWS credential chain with undefined values
    const config: any = {
      region: process.env.AWS_REGION || 'us-east-1',
    };
    
    if (process.env.AWS_ACCESS_KEY_ID) config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    if (process.env.AWS_SECRET_ACCESS_KEY) config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    if (process.env.AWS_BEARER_TOKEN_BEDROCK) config.apiKey = process.env.AWS_BEARER_TOKEN_BEDROCK;

    const bedrock = createAmazonBedrock(config);

    // Default to Claude 3.5 Sonnet if no model provided
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
      stream: result.toUIMessageStream({
        error: {
          getErrorMessage: (err) => {
            // Unmask the error so you can see exactly why AWS rejected the request
            if (err instanceof Error) return err.message;
            return String(err);
          }
        }
      }),
    });
  } catch (error: unknown) {
    // Log the full error server-side for debugging
    console.error('[Bedrock Chat Error]', error);

    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
