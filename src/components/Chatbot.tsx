'use client';

import { useState } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, text: 'Hello! I\'m your study assistant. How can I help you today?', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Bot always responds with "provide AI key" placeholder
    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now() + 1,
        text: '🔑 Please provide an AI key to enable the chatbot. You can add your API key in the settings to unlock AI-powered study assistance.',
        sender: 'bot',
      };
      setMessages(prev => [...prev, botMsg]);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`chatbot ${isOpen ? 'chatbot-open' : 'chatbot-closed'}`}>
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        <span className="chatbot-toggle-icon">{isOpen ? '✕' : '💬'}</span>
        {!isOpen && <span className="chatbot-toggle-label">Study Assistant</span>}
      </button>

      {isOpen && (
        <div className="chatbot-body">
          <div className="chatbot-header">
            <span className="chatbot-header-icon">🤖</span>
            <span>Study Assistant</span>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message chat-${msg.sender}`}>
                <div className="chat-bubble">{msg.text}</div>
              </div>
            ))}
          </div>

          <div className="chatbot-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className="chatbot-input"
            />
            <button onClick={sendMessage} className="chatbot-send">
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
