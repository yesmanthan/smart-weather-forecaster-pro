
import React, { useState } from "react";
import { MapPin, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { WeatherHeader } from "./WeatherHeader";
import { ForecastCard } from "./ForecastCard";
import { RainfallPrediction } from "./RainfallPrediction";
import { LocationSearch } from "./LocationSearch";

// This would normally be fetched from an API, but we'll use mock data for now
const MOCK_FORECAST_DATA = [
  { day: "Today", highTemp: 32, lowTemp: 24, weatherType: "partlyCloudy", rainChance: 20 },
  { day: "Tue", highTemp: 30, lowTemp: 23, weatherType: "rainy", rainChance: 60 },
  { day: "Wed", highTemp: 29, lowTemp: 22, weatherType: "rainy", rainChance: 70 },
  { day: "Thu", highTemp: 28, lowTemp: 22, weatherType: "rainy", rainChance: 30 },
  { day: "Fri", highTemp: 31, lowTemp: 23, weatherType: "sunny", rainChance: 10 },
  { day: "Sat", highTemp: 33, lowTemp: 25, weatherType: "sunny", rainChance: 0 },
] as const;

export const WeatherDashboard = () => {
  const [currentLocation, setCurrentLocation] = useState("Mumbai, India");
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  const handleLocationChange = (location: string) => {
    setCurrentLocation(location);
    // In a real app, this would trigger a new API call to get weather data for the selected location
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col space-y-4">
        {/* Location Search */}
        <div className="mb-2">
          <LocationSearch onSelectLocation={handleLocationChange} />
        </div>

        {/* Current Weather */}
        <WeatherHeader
          location={currentLocation}
          currentTemp={31}
          description="partly cloudy"
          feelsLike={33}
          highTemp={32}
          lowTemp={24}
        />

        {/* Alert Banner - show this when there's an important weather alert */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start">
          <AlertTriangle className="text-weather-alert h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-800">
              Moderate to heavy rainfall expected tomorrow
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Our models predict 70% chance of significant rainfall in your area. 
              Consider adjusting outdoor plans.
            </p>
          </div>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="forecast" className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
            <TabsTrigger value="rainfall">Rainfall</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          {/* Forecast Tab */}
          <TabsContent value="forecast" className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {MOCK_FORECAST_DATA.map((forecast) => (
                <ForecastCard
                  key={forecast.day}
                  day={forecast.day}
                  highTemp={forecast.highTemp}
                  lowTemp={forecast.lowTemp}
                  weatherType={forecast.weatherType}
                  rainChance={forecast.rainChance}
                />
              ))}
            </div>
          </TabsContent>
          
          {/* Rainfall Tab */}
          <TabsContent value="rainfall" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-3">Next 24 Hours</h3>
                <RainfallPrediction
                  chance={20}
                  amount={2.5}
                  confidenceScore={85}
                />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">Tomorrow</h3>
                <RainfallPrediction
                  chance={70}
                  amount={15.8}
                  confidenceScore={75}
                />
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">6-Day Rainfall Outlook</h3>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Cumulative Expected Rainfall</p>
                      <p className="text-2xl font-bold">42.3 mm</p>
                    </div>
                    <Badge variant="outline" className="bg-weather-purple-light text-weather-purple-dark">
                      Above Average
                    </Badge>
                  </div>
                  
                  <div className="h-40 flex items-end justify-between space-x-1">
                    {MOCK_FORECAST_DATA.map((day) => (
                      <div key={day.day} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-weather-blue rounded-t-sm" 
                          style={{ 
                            height: `${day.rainChance}%`,
                            backgroundColor: day.rainChance > 50 
                              ? 'rgba(14, 165, 233, 0.8)' 
                              : 'rgba(14, 165, 233, 0.4)'
                          }}
                        ></div>
                        <p className="text-xs mt-2">{day.day}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Details Tab */}
          <TabsContent value="details" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Today's Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Humidity</span>
                      <span>65%</span>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-gray-500">Wind</span>
                      <span>12 km/h</span>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-gray-500">UV Index</span>
                      <span>6 (High)</span>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-gray-500">Sunrise</span>
                      <span>06:12 AM</span>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-gray-500">Sunset</span>
                      <span>06:53 PM</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Alerts & Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Rainfall Alerts</p>
                        <p className="text-sm text-gray-500">Get notified about rain forecasts</p>
                      </div>
                      <Switch 
                        checked={alertsEnabled} 
                        onCheckedChange={setAlertsEnabled} 
                      />
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-sm text-gray-500 mb-2">Data Sources</p>
                      <div className="flex space-x-2">
                        <Badge variant="outline">OpenWeather</Badge>
                        <Badge variant="outline">ML Model v2.1</Badge>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <MapPin className="h-4 w-4 mr-2" />
                        Save This Location
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
