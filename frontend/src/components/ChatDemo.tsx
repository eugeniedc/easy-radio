import React, { useState } from 'react';
import './PlayerControls.css'; // Reuse the chat styles we added

interface ChatMessage {
  id: string;
  text: string;
  timestamp: Date;
  sender: 'user' | 'system';
}

export const ChatDemo: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Welcome to Easy Radio HK! 🎵',
      timestamp: new Date(Date.now() - 60000),
      sender: 'system'
    },
    {
      id: '2', 
      text: 'Now playing: RTHK Radio 1',
      timestamp: new Date(Date.now() - 30000),
      sender: 'system'
    },
    {
      id: '3',
      text: 'Great music selection! 👍',
      timestamp: new Date(),
      sender: 'user'
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: inputValue.trim(),
        timestamp: new Date(),
        sender: 'user'
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`chat-message ${message.sender === 'user' ? 'chat-message--sent' : 'chat-message--received'}`}
          >
            <div className={`chat-bubble ${message.sender === 'user' ? 'chat-bubble--sent' : 'chat-bubble--received'}`}>
              <p className="chat-message__text">{message.text}</p>
              <span className="chat-message__time">
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button 
          className="chat-send-button"
          onClick={handleSendMessage}
          disabled={!inputValue.trim()}
        >
          ➤
        </button>
      </div>
    </div>
  );
};