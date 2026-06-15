'use client';

export const MODELS = [
  { id: 'anthropic.claude-3-5-sonnet-20240620-v1:0', name: 'Claude 3.5 Sonnet' },
  { id: 'anthropic.claude-3-haiku-20240307-v1:0', name: 'Claude 3 Haiku' },
  { id: 'amazon.nova-lite-v1:0', name: 'Nova Lite' },
  { id: 'meta.llama3-70b-instruct-v1:0', name: 'Llama 3 70B' },
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
