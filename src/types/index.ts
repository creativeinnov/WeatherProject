export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  status: 'sending' | 'sent' | 'error';
  reactions?: Reaction[];
  weatherData?: WeatherData;
}

export interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  searchQuery: string;
  theme: 'light' | 'dark';
}

export interface ApiResponse {
  message: string;
  weatherData?: WeatherData;
  error?: string;
}