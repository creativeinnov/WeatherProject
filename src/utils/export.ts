import { Message } from '../types';

export const exportChatHistory = (messages: Message[], format: 'json' | 'csv' = 'json') => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `chat-history-${timestamp}.${format}`;

  if (format === 'json') {
    const data = JSON.stringify(messages, null, 2);
    downloadFile(data, filename, 'application/json');
  } else if (format === 'csv') {
    const headers = ['Timestamp', 'Sender', 'Content', 'Status'];
    const rows = messages.map(msg => [
      msg.timestamp.toISOString(),
      msg.sender,
      `"${msg.content.replace(/"/g, '""')}"`,
      msg.status
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    downloadFile(csvContent, filename, 'text/csv');
  }
};

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};