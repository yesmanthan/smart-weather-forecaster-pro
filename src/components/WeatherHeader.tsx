
import React from "react";
import { CloudSun, MapPin, Thermometer } from "lucide-react";
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
    <Card className="bg-gradient-to-br from-weather-purple-light to-weather-blue-light border-none shadow-md overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Left side with temperature */}
          <div className="p-6 flex-1">
            <div className="flex items-center">
              <MapPin className="text-weather-purple mr-2" size={20} />
              <h2 className="text-xl font-semibold text-gray-800">{location}</h2>
            </div>

            <div className="mt-6 flex items-start">
              <div>
                <div className="flex items-end">
                  <span className="text-6xl font-bold text-gray-800">{currentTemp}</span>
                  <span className="text-2xl text-gray-700 ml-1">°C</span>
                </div>
                <p className="text-gray-600 mt-1 capitalize">{description}</p>
                <p className="text-gray-600 mt-2">Feels like {feelsLike}°C</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-gray-700 flex items-center">
                    <Thermometer className="h-4 w-4 text-weather-blue mr-1" />
                    <span>H: {highTemp}°</span>
                  </span>
                  <span className="text-gray-700 flex items-center ml-3">
                    <Thermometer className="h-4 w-4 text-weather-purple mr-1" />
                    <span>L: {lowTemp}°</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side with weather icon */}
          <div className="bg-gradient-to-br from-weather-blue/20 to-weather-purple/20 p-6 flex items-center justify-center">
            <div className="text-center">
              <CloudSun className="text-weather-blue h-24 w-24 mx-auto" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
