import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  text: string;
  fromUser: boolean;
}

interface ChatInterfaceProps {
  onSend?: (message: string, messages: Message[]) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onSend }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { id: Date.now(), text: input, fromUser: true }];
    setMessages(newMessages);
    setInput('');

    if (onSend) onSend(input, newMessages);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: 'This is a sample bot reply!',
          fromUser: false,
        },
      ]);
    }, 1000);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        color: '#222',
        padding: 0,
        backgroundColor: '#fff',
        borderRadius: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          marginBottom: 0,
          padding: '24px 16px 8px 16px',
          fontSize: 15,
        }}
      >
        {messages.map(({ id, text, fromUser }) => (
          <div
            key={id}
            style={{
              marginBottom: 14,
              textAlign: fromUser ? 'right' : 'left',
              display: 'flex',
              justifyContent: fromUser ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                backgroundColor: fromUser ? '#e6f0ff' : '#f7f7f8',
                color: '#222',
                padding: '10px 16px',
                borderRadius: 12,
                maxWidth: '80%',
                whiteSpace: 'pre-wrap',
                boxShadow: fromUser
                  ? '0 1px 4px rgba(0,123,255,0.07)'
                  : '0 1px 4px rgba(0,0,0,0.04)',
                border: fromUser ? '1px solid #b3d1ff' : '1px solid #ececec',
              }}
            >
              {text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div
        style={{
          borderTop: '1px solid #ececec',
          padding: '12px 16px',
          background: '#fff',
          borderRadius: '0 0 16px 16px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <textarea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type your message..."
          style={{
            width: '100%',
            resize: 'none',
            borderRadius: 8,
            padding: '10px 12px',
            fontSize: 15,
            fontFamily: 'Inter, Arial, sans-serif',
            backgroundColor: '#f7f7f8',
            color: '#222',
            border: '1px solid #ececec',
            boxShadow: 'none',
            outline: 'none',
            transition: 'border 0.2s',
          }}
        />
        <button
          onClick={handleSend}
          style={{
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 18px',
            fontSize: 15,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 0.2s',
            boxShadow: '0 1px 4px rgba(37,99,235,0.07)',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
