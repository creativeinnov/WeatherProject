import React from 'react';
import { Message as MessageType } from '../types';
import { CheckCheck, Clock, AlertCircle } from 'lucide-react';
import WeatherCard from './WeatherCard';
import MessageReactions from './MessageReactions';

interface MessageProps {
  message: MessageType;
  onAddReaction: (messageId: string, emoji: string) => void;
}

const MessageComponent: React.FC<MessageProps> = ({ message, onAddReaction }) => {
  const isUser = message.sender === 'user';
  
  const getStatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-gray-400 animate-spin" />;
      case 'sent':
        return <CheckCheck className="w-3 h-3 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex items-start gap-3 mb-6 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm ${
        isUser ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-to-r from-emerald-500 to-teal-600'
      }`}>
        {isUser ? 'U' : 'W'}
      </div>
      
      <div className={`flex-1 max-w-sm sm:max-w-md lg:max-w-lg ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block px-4 py-3 rounded-2xl shadow-sm ${
          isUser 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-sm' 
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-sm'
        }`}>
          {message.content && (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          )}
          
          {message.weatherData && (
            <WeatherCard data={message.weatherData} />
          )}
        </div>
        
        <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400 ${
          isUser ? 'justify-end' : 'justify-start'
        }`}>
          <span>{message.timestamp.toLocaleTimeString()}</span>
          {getStatusIcon()}
        </div>
        
        {!isUser && (
          <MessageReactions
            reactions={message.reactions}
            onAddReaction={(emoji) => onAddReaction(message.id, emoji)}
          />
        )}
      </div>
    </div>
  );
};

export default MessageComponent;