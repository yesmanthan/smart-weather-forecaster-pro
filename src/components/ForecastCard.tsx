
import React from "react";
import { CloudRain, CloudSun } from "lucide-react";
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
        return <CloudRain className="h-8 w-8 text-weather-rain" />;
      case "sunny":
      case "partlyCloudy":
      default:
        return <CloudSun className="h-8 w-8 text-weather-blue" />;
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-4 flex flex-col items-center">
        <p className="text-sm font-medium mb-2">{day}</p>
        {renderWeatherIcon()}
        <div className="mt-3 flex justify-between space-x-4">
          <p className="font-medium">{highTemp}°</p>
          <p className="text-gray-500">{lowTemp}°</p>
        </div>
        {rainChance > 0 && (
          <div className="mt-2 flex items-center text-xs text-gray-600">
            <CloudRain className="h-3 w-3 mr-1 text-weather-rain" />
            <span>{rainChance}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
