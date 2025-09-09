import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you with your timetable or academic queries?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand your query. Let me help you with that.",
        "Based on your timetable, I can suggest some optimal study times.",
        "I can help you find available rooms for your classes.",
        "Would you like me to check for any scheduling conflicts?",
        "I can provide insights about your workload distribution.",
        "Let me analyze your current schedule and provide recommendations."
      ];

      const botResponse = {
        id: messages.length + 2,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
            zIndex: 1000,
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 12px 30px rgba(59, 130, 246, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
          }}
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '350px',
          height: '500px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Chat Header */}
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            color: 'white',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={18} />
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>AI Assistant</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Online</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '8px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}
              >
                {message.sender === 'bot' && (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Bot size={14} color="white" />
                  </div>
                )}
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '12px 16px',
                    borderRadius: message.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: message.sender === 'user' ? '#3b82f6' : '#f3f4f6',
                    color: message.sender === 'user' ? 'white' : '#374151',
                    fontSize: '14px',
                    lineHeight: '1.4'
                  }}
                >
                  {message.text}
                </div>
                {message.sender === 'user' && (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <User size={14} color="#6b7280" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{
            padding: '16px',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              style={{
                padding: '10px',
                background: inputMessage.trim() ? '#3b82f6' : '#d1d5db',
                border: 'none',
                borderRadius: '50%',
                color: 'white',
                cursor: inputMessage.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
