
import React from "react";
import { CloudSun, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WeatherHeaderProps {
  location: string;
  currentTemp: number;
  description: string;
  feelsLike: number;
  highTemp: number;
  lowTemp: number;
}

export const WeatherHeader: React.FC<WeatherHeaderProps> = ({
  location,
  currentTemp,
  description,
  feelsLike,
  highTemp,
  lowTemp,
}) => {
  return (
    <Card className="bg-gradient-to-br from-weather-purple-light to-weather-blue-light border-none shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="text-weather-purple mr-2" size={20} />
            <h2 className="text-xl font-semibold text-gray-800">{location}</h2>
          </div>
          <CloudSun className="text-weather-blue h-10 w-10" />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <div className="flex items-end">
              <span className="text-6xl font-bold text-gray-800">{currentTemp}</span>
              <span className="text-2xl text-gray-700 ml-1">°C</span>
            </div>
            <p className="text-gray-600 mt-1 capitalize">{description}</p>
          </div>
          
          <div className="text-right">
            <p className="text-gray-600">Feels like {feelsLike}°C</p>
            <div className="flex gap-2 mt-1">
              <span className="text-gray-700">H: {highTemp}°</span>
              <span className="text-gray-700">L: {lowTemp}°</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
