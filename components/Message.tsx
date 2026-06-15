'use client';

import { User, Bot } from 'lucide-react';
import type { UIMessage } from '@ai-sdk/react';

interface MessageProps {
  message: UIMessage;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';

  // Extract text content from parts
  const textContent = message.parts
    .filter((part): part is Extract<typeof part, { type: 'text' }> => part.type === 'text')
    .map((part) => part.text)
    .join('');

  return (
    <div className={`message-wrapper ${isUser ? 'user' : 'assistant'}`}>
      {!isUser && (
        <div style={{ marginRight: '8px', marginTop: '4px', color: '#888' }}>
          <Bot size={20} />
        </div>
      )}
      
      <div className="message-bubble">
        <div className="message-content">
          {textContent.split('\n').map((line, i) => (
            <p key={i}>{line || <br />}</p>
          ))}
        </div>
      </div>

      {isUser && (
        <div style={{ marginLeft: '8px', marginTop: '4px', color: '#3b82f6' }}>
          <User size={20} />
        </div>
      )}
    </div>
  );
}
