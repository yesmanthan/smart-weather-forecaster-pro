
import React, { useEffect, useRef } from "react";
import { MapPin, Map } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WeatherMapProps {
  location: string;
  latitude?: number;
  longitude?: number;
}

export const WeatherMap: React.FC<WeatherMapProps> = ({ 
  location,
  latitude = 19.076, // Default to Mumbai
  longitude = 72.8777
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const API_KEY = "2362a88743bcb0546a5097e063aa68ab";

  useEffect(() => {
    if (!mapRef.current) return;

    // Create iframe with OpenWeatherMap layer
    const iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '0.5rem';
    
    // Use OpenWeatherMap's iframe widget - this is the easiest way to show weather on a map
    iframe.src = `https://openweathermap.org/weathermap?basemap=map&cities=true&layer=temperature&lat=${latitude}&lon=${longitude}&zoom=10`;
    
    // Clear the container and add the iframe
    if (mapRef.current) {
      mapRef.current.innerHTML = '';
      mapRef.current.appendChild(iframe);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, [latitude, longitude]);

  return (
    <Card className="h-full border border-weather-blue/20 overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-weather-blue-light to-weather-purple-light">
        <CardTitle className="text-lg flex items-center text-gray-800">
          <Map className="mr-2 h-5 w-5 text-weather-purple" />
          Weather Map - {location}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div ref={mapRef} className="w-full h-[300px] bg-gray-50 rounded-md shadow-inner overflow-hidden">
          <div className="flex items-center justify-center h-full text-gray-500">
            <span className="animate-pulse">Loading map...</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-md">
          <div className="flex items-center mb-1">
            <MapPin className="h-3 w-3 mr-1 text-weather-purple" />
            <p>Map shows real-time temperature data for {location}</p>
          </div>
          <p className="text-xs text-gray-400">Use map controls to change layers and zoom level</p>
        </div>
      </CardContent>
    </Card>
  );
};
