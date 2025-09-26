import React from 'react';
import { WeatherData } from '../types';
import { Thermometer, Droplets, Wind } from 'lucide-react';

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white mt-3 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold">{data.location}</h3>
          <p className="text-sm opacity-90">{data.condition}</p>
        </div>
        <div className="text-3xl">{data.icon}</div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-center">
          <div className="flex items-center gap-1 mb-1">
            <Thermometer className="w-4 h-4" />
            <span className="text-sm">Temp</span>
          </div>
          <div className="text-xl font-bold">{data.temperature}°C</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center gap-1 mb-1">
            <Droplets className="w-4 h-4" />
            <span className="text-sm">Humidity</span>
          </div>
          <div className="text-xl font-bold">{data.humidity}%</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center gap-1 mb-1">
            <Wind className="w-4 h-4" />
            <span className="text-sm">Wind</span>
          </div>
          <div className="text-xl font-bold">{data.windSpeed} km/h</div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;