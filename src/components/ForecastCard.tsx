
import React from "react";
import { CloudRain, CloudSun, Sun, ThermometerSun, ThermometerSnowflake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type WeatherIconType = "sunny" | "cloudy" | "rainy" | "stormy" | "partlyCloudy";

interface ForecastCardProps {
  day: string;
  highTemp: number;
  lowTemp: number;
  weatherType: WeatherIconType;
  rainChance: number;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({
  day,
  highTemp,
  lowTemp,
  weatherType,
  rainChance,
}) => {
  // Function to determine which icon to show based on weather type
  const renderWeatherIcon = () => {
    switch (weatherType) {
      case "rainy":
        return <CloudRain className="h-9 w-9 text-weather-rain" />;
      case "sunny":
        return <Sun className="h-9 w-9 text-yellow-400" />;
      case "partlyCloudy":
        return <CloudSun className="h-9 w-9 text-weather-blue" />;
      default:
        return <CloudSun className="h-9 w-9 text-weather-blue" />;
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border-t-4 border-t-weather-blue overflow-hidden">
      <CardContent className="p-3 flex flex-col items-center">
        <p className="text-sm font-medium mb-2">{day}</p>
        {renderWeatherIcon()}
        <div className="mt-3 flex justify-between items-center w-full">
          <div className="flex items-center">
            <ThermometerSun className="h-4 w-4 mr-1 text-weather-blue" />
            <p className="font-medium">{highTemp}°</p>
          </div>
          <div className="flex items-center">
            <ThermometerSnowflake className="h-4 w-4 mr-1 text-weather-purple" />
            <p className="text-gray-500">{lowTemp}°</p>
          </div>
        </div>
        {rainChance > 0 && (
          <div className="mt-2 flex items-center text-xs bg-weather-blue/10 w-full justify-center py-1 rounded-sm">
            <CloudRain className="h-3 w-3 mr-1 text-weather-rain" />
            <span>{rainChance}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
