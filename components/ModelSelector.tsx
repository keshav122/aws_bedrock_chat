'use client';

// Models are organized by quality tier. Add or remove models
// based on what is enabled in your Bedrock account.
export const MODELS = [
  // Claude — Anthropic
  { id: 'anthropic.claude-opus-4-6-v1', name: 'Claude Opus 4.6' },
  { id: 'anthropic.claude-sonnet-4-6-v1', name: 'Claude Sonnet 4.6' },
  { id: 'anthropic.claude-sonnet-4-20250514-v1:0', name: 'Claude Sonnet 4' },
  { id: 'anthropic.claude-opus-4-20250514-v1:0', name: 'Claude Opus 4' },
  { id: 'anthropic.claude-sonnet-4-5-20250929-v1:0', name: 'Claude Sonnet 4.5' },
  { id: 'anthropic.claude-opus-4-5-20251101-v1:0', name: 'Claude Opus 4.5' },
  { id: 'anthropic.claude-3-7-sonnet-20250219-v1:0', name: 'Claude 3.7 Sonnet' },
  { id: 'anthropic.claude-3-5-sonnet-20241022-v2:0', name: 'Claude 3.5 Sonnet v2' },
  { id: 'anthropic.claude-3-5-sonnet-20240620-v1:0', name: 'Claude 3.5 Sonnet' },
  { id: 'anthropic.claude-3-5-haiku-20241022-v1:0', name: 'Claude 3.5 Haiku' },
  { id: 'anthropic.claude-3-opus-20240229-v1:0', name: 'Claude 3 Opus' },
  { id: 'anthropic.claude-3-haiku-20240307-v1:0', name: 'Claude 3 Haiku' },

  // Amazon Nova
  { id: 'us.amazon.nova-pro-v1:0', name: 'Nova Pro' },
  { id: 'us.amazon.nova-lite-v1:0', name: 'Nova Lite' },
  { id: 'us.amazon.nova-micro-v1:0', name: 'Nova Micro' },

  // Meta Llama
  { id: 'meta.llama3-1-405b-instruct-v1:0', name: 'Llama 3.1 405B' },
  { id: 'meta.llama3-1-70b-instruct-v1:0', name: 'Llama 3.1 70B' },
  { id: 'us.meta.llama3-3-70b-instruct-v1:0', name: 'Llama 3.3 70B' },
  { id: 'meta.llama3-70b-instruct-v1:0', name: 'Llama 3 70B' },

  // Mistral
  { id: 'mistral.mistral-large-2402-v1:0', name: 'Mistral Large' },

  // DeepSeek
  { id: 'us.deepseek.r1-v1:0', name: 'DeepSeek R1' },
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  return (
    <select 
      className="model-selector"
      value={selectedModel}
      onChange={(e) => onModelChange(e.target.value)}
      aria-label="Select Model"
    >
      {MODELS.map((model) => (
        <option key={model.id} value={model.id}>
          {model.name}
        </option>
      ))}
    </select>
  );
}
