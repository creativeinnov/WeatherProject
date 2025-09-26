import { useState, useCallback, useRef } from 'react';
import { Message } from '../types';
import { weatherApi } from '../utils/api';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  }, []);

  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, ...updates } : msg
    ));
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessageId = addMessage({
      content: content.trim(),
      sender: 'user',
      status: 'sent',
    });

    // Add placeholder agent message
    const agentMessageId = addMessage({
      content: '',
      sender: 'agent',
      status: 'sending',
    });

    setIsTyping(true);

    try {
      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      let accumulatedContent = '';
      
      await weatherApi.streamWeatherQuery(
        content,
        (chunk) => {
          accumulatedContent += chunk;
          updateMessage(agentMessageId, {
            content: accumulatedContent,
            status: 'sent',
          });
        },
        (weatherData) => {
          updateMessage(agentMessageId, {
            weatherData,
          });
        },
        abortControllerRef.current.signal
      );

    } catch (error) {
      console.error('Chat error:', error);
      if (error instanceof Error && error.name !== 'AbortError') {
        updateMessage(agentMessageId, {
          content: 'Sorry, I encountered an error processing your request. Please try again.',
          status: 'error',
        });
      }
    } finally {
      setIsTyping(false);
    }
  }, [addMessage, updateMessage]);

  const addReaction = useCallback((messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id !== messageId) return msg;
      
      const reactions = msg.reactions || [];
      const existingReaction = reactions.find(r => r.emoji === emoji);
      
      if (existingReaction) {
        return {
          ...msg,
          reactions: reactions.map(r => 
            r.emoji === emoji 
              ? { ...r, count: r.count + 1, users: [...r.users, 'user'] }
              : r
          )
        };
      } else {
        return {
          ...msg,
          reactions: [...reactions, { emoji, count: 1, users: ['user'] }]
        };
      }
    }));
  }, []);

  const filteredMessages = searchQuery
    ? messages.filter(msg => 
        msg.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages: filteredMessages,
    isTyping,
    searchQuery,
    setSearchQuery,
    sendMessage,
    addReaction,
    clearMessages,
  };
};