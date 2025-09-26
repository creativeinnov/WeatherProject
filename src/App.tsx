import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { useChat } from './hooks/useChat';
import { exportChatHistory } from './utils/export';
import ChatHeader from './components/ChatHeader';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';

function App() {
  const {
    messages,
    isTyping,
    searchQuery,
    setSearchQuery,
    sendMessage,
    addReaction,
    clearMessages,
  } = useChat();

  const handleExport = () => {
    if (messages.length === 0) {
      alert('No messages to export');
      return;
    }

    const format = confirm('Export as JSON? (Cancel for CSV)') ? 'json' : 'csv';
    exportChatHistory(messages, format);
  };

  const handleClear = () => {
    if (messages.length === 0) return;
    
    if (confirm('Are you sure you want to clear all messages?')) {
      clearMessages();
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
        <div className="max-w-4xl mx-auto h-screen flex flex-col shadow-2xl bg-white dark:bg-gray-900">
          <ChatHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onExport={handleExport}
            onClear={handleClear}
          />
          
          <ChatWindow
            messages={messages}
            isTyping={isTyping}
            onAddReaction={addReaction}
          />
          
          <MessageInput
            onSendMessage={sendMessage}
            disabled={isTyping}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;