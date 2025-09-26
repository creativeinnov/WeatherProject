import React from 'react';
import { Reaction } from '../types';

interface MessageReactionsProps {
  reactions?: Reaction[];
  onAddReaction: (emoji: string) => void;
}

const availableEmojis = ['👍', '👎', '❤️', '😊', '😮', '🎉'];

const MessageReactions: React.FC<MessageReactionsProps> = ({ reactions, onAddReaction }) => {
  return (
    <div className="flex items-center gap-1 mt-2">
      {reactions?.map((reaction) => (
        <button
          key={reaction.emoji}
          onClick={() => onAddReaction(reaction.emoji)}
          className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-xs transition-colors"
        >
          <span>{reaction.emoji}</span>
          <span className="text-gray-600 dark:text-gray-400">{reaction.count}</span>
        </button>
      ))}
      
      <div className="group relative">
        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span className="text-sm">+</span>
        </button>
        
        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 gap-1">
          {availableEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onAddReaction(emoji)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageReactions;