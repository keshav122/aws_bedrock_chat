'use client';

import { useChat, type UIMessage } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Send, Loader2, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState, useMemo } from 'react';
import { Message } from './Message';
import { ModelSelector, MODELS } from './ModelSelector';

export function Chat() {
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [input, setInput] = useState('');
  
  const transport = useMemo(() => {
    return new DefaultChatTransport({
      api: '/api/chat',
      body: {
        modelId: selectedModel,
      },
    });
  }, [selectedModel]);

  const { messages, sendMessage, setMessages, stop, status, error } = useChat({
    transport,
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="header-title">Bedrock Chat</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              aria-label="Clear chat"
              title="Clear chat"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '0.5rem',
                color: '#888',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
            >
              <Trash2 size={16} />
            </button>
          )}
          <ModelSelector 
            selectedModel={selectedModel} 
            onModelChange={setSelectedModel} 
          />
        </div>
      </header>

      <div className="chat-scroll-area" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div style={{ 
            display: 'flex', 
            height: '100%', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#666',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <p>Ready to chat! I am powered by Amazon Bedrock.</p>
          </div>
        ) : (
          messages.map((message) => (
            <Message key={message.id} message={message} />
          ))
        )}

        {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
          <div className="message-wrapper assistant">
            <div className="message-bubble" style={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }}>
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div style={{ color: 'var(--error)', textAlign: 'center', fontSize: '0.875rem' }}>
            An error occurred: {error.message}
          </div>
        )}
      </div>

      <div className="input-container">
        <form 
          className="input-form" 
          onSubmit={async (e) => {
            e.preventDefault();
            if (!input.trim()) return;
            const currentInput = input;
            setInput('');
            await sendMessage({ text: currentInput });
          }}
        >
          <textarea
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!input.trim()) return;
                const formEvent = new Event('submit', { cancelable: true, bubbles: true });
                e.currentTarget.form?.dispatchEvent(formEvent);
              }
            }}
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            {isLoading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
}
