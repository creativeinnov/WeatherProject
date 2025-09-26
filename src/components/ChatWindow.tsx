import React, { useEffect, useRef } from 'react';
import { Message as MessageType } from '../types';
import MessageComponent from './Message';
import TypingIndicator from './TypingIndicator';

interface ChatWindowProps {
  messages: MessageType[];
  isTyping: boolean;
  onAddReaction: (messageId: string, emoji: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isTyping, onAddReaction }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-1 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-2xl">🌤️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Welcome to Weather Assistant!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              I'm here to help you get weather information for any location around the world. 
              Just ask me about the weather in any city!
            </p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageComponent
              key={message.id}
              message={message}
              onAddReaction={onAddReaction}
            />
          ))}
          {isTyping && <TypingIndicator />}
        </>
      )}
    </div>
  );
};

export default ChatWindow;