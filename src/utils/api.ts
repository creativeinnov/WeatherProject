import { WeatherData, ApiResponse } from '../types';

// Mock weather data
const mockWeatherData: WeatherData[] = [
  { location: 'New York, NY', temperature: 22, condition: 'Sunny', humidity: 65, windSpeed: 12, icon: '☀️' },
  { location: 'London, UK', temperature: 15, condition: 'Cloudy', humidity: 78, windSpeed: 8, icon: '☁️' },
  { location: 'Tokyo, Japan', temperature: 28, condition: 'Rainy', humidity: 85, windSpeed: 15, icon: '🌧️' }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const weatherApi = {
  async streamWeatherQuery(
    query: string,
    onChunk: (chunk: string) => void,
    onWeatherData: (data: WeatherData) => void,
    signal?: AbortSignal
  ): Promise<void> {
    // First, try the real API
    try {
      const response = await fetch(
        'https://brief-thousands-sunset-9fcb1c78-485f-4967-ac042759a8fa1462.mastra.cloud/api/agents/weatherAgent/stream',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
          signal,
        }
      );

      if (!response.ok || !response.body) throw new Error('API response not ok');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        onChunk(chunk); // streaming partial text
      }

      try {
        const json = JSON.parse(fullText) as ApiResponse;
        if (json.weatherData) {
          onWeatherData(json.weatherData); // structured weather data
          return; // success, exit
        }
      } catch {
        console.warn('No JSON weather data returned, only text streamed.');
      }
    } catch (err) {
      console.warn('Real API failed, using mock data:', err);
    }

    // --- FALLBACK TO MOCK DATA (keep existing functionality) ---
    await delay(500); // simulate processing

    if (signal?.aborted) throw new Error('Request aborted');

    const isWeatherQuery = /weather|temperature|forecast|climate|rain|sun|cloud|wind|humidity/i.test(query);

    let response: string;
    let weatherData: WeatherData | undefined;

    if (isWeatherQuery) {
      const locationMatch = query.match(/(?:in|for|at)\s+([A-Za-z\s,]+)/i);
      const location = locationMatch ? locationMatch[1].trim() : 'New York, NY';

      weatherData = mockWeatherData.find(w => 
        w.location.toLowerCase().includes(location.toLowerCase())
      ) || mockWeatherData[0];

      response = `The current weather in ${weatherData.location} is ${weatherData.condition.toLowerCase()} with a temperature of ${weatherData.temperature}°C. Humidity is at ${weatherData.humidity}% and wind speed is ${weatherData.windSpeed} km/h.`;
    } else {
      response = "I'm a weather assistant. I can help you get weather information for any location. Try asking about the weather in a specific city!";
    }

    // Simulate streaming response (mock)
    const words = response.split(' ');
    for (let i = 0; i < words.length; i++) {
      if (signal?.aborted) throw new Error('Request aborted');

      const chunk = i === 0 ? words[i] : ' ' + words[i];
      onChunk(chunk);
      await delay(50 + Math.random() * 100);
    }

    if (weatherData) {
      onWeatherData(weatherData);
    }
  }
};
