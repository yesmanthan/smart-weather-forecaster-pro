
import React, { useState, useEffect } from "react";
import { MapPin, AlertTriangle, Sun, ArrowDown, Thermometer, ThermometerSun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { WeatherHeader } from "./WeatherHeader";
import { ForecastCard } from "./ForecastCard";
import { RainfallPrediction } from "./RainfallPrediction";
import { LocationSearch } from "./LocationSearch";
import { LiveWeatherMap } from "./LiveWeatherMap";
import { fetchWeatherData, checkWeatherAlerts, WeatherData } from "@/services/weatherService";

export const WeatherDashboard = () => {
  const [currentLocation, setCurrentLocation] = useState("Mumbai, India");
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | undefined>();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("forecast");
  const [darkBanner, setDarkBanner] = useState(false);

  // Add live location support
  const handleLiveLocation = () => {
    if (navigator.geolocation) {
      toast.info("Fetching your location...");
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Get location name via OpenWeather API
          const API_KEY = "2362a88743bcb0546a5097e063aa68ab";
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
          );
          const data = await response.json();
          const locationName =
            data && data.length > 0
              ? `${data[0].name}, ${data[0].country}`
              : "Your Location";
          setCoordinates({ lat: latitude, lon: longitude });
          setCurrentLocation(locationName);
          loadWeatherData(locationName, { lat: latitude, lon: longitude });
          toast.success(`Set to ${locationName}`);
        },
        (error) => {
          toast.error("Could not fetch live location");
        }
      );
    } else {
      toast.error("Geolocation not supported in your browser");
    }
  };

  const handleLocationChange = (location: string, coords?: { lat: number; lon: number }) => {
    setCurrentLocation(location);
    setCoordinates(coords);
    loadWeatherData(location, coords);
  };

  const loadWeatherData = async (location: string, coords?: { lat: number; lon: number }) => {
    setLoading(true);
    try {
      const data = await fetchWeatherData(location, coords);
      setWeatherData(data);

      // Check for weather alerts if enabled
      if (alertsEnabled) {
        checkWeatherAlerts(data);
      }
      // Animation banners for UV/heatwave, temp drop etc.
      setDarkBanner(data.uvIndex > 8 || (data.forecast[0]?.highTemp || 0) > 40);
    } catch (error) {
      console.error("Error loading weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData(currentLocation);
    // Add animation for dashboard loading
    document.body.classList.add("fade-in");
    setTimeout(() => {
      document.body.classList.remove("fade-in");
    }, 800);
  }, []);

  // Toggle alerts
  const handleAlertsToggle = (checked: boolean) => {
    setAlertsEnabled(checked);
    if (checked) {
      toast.success("Weather alerts enabled");
      if (weatherData) {
        checkWeatherAlerts(weatherData);
      }
    } else {
      toast.info("Weather alerts disabled");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="flex flex-col space-y-4">
        {/* Location Search & Live Location */}
        <div className="mb-2 flex gap-3 items-center">
          <LocationSearch onSelectLocation={handleLocationChange} />
          <Button
            type="button"
            size="icon"
            variant="secondary"
            onClick={handleLiveLocation}
            className="ml-2 border bg-gradient-to-br from-weather-blue-light to-weather-purple-light hover:scale-105 transition-transform"
            aria-label="Go to my current location"
          >
            <MapPin className="h-5 w-5 text-weather-purple" />
          </Button>
        </div>

        {/* Animated UV/Heatwave/Temp drop Banners */}
        {weatherData &&
          weatherData.uvIndex > 8 && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-300/60 to-orange-300/60 border border-yellow-200 rounded-lg px-4 py-2 animate-fade-in shadow-lg">
              <Sun className="text-yellow-700 h-6 w-6 animate-pulse" />
              <p className="text-sm font-semibold text-yellow-900">
                Extreme UV index: {weatherData.uvIndex} — Avoid direct sunlight!
              </p>
            </div>
          )}

        {weatherData && weatherData.forecast[0]?.highTemp > 40 && (
          <div className="flex items-center gap-2 bg-gradient-to-l from-orange-200 to-red-300 border border-orange-300 rounded-lg px-4 py-2 animate-pulse shadow-lg">
            <ThermometerSun className="h-6 w-6 text-orange-500 animate-pulse" />
            <p className="text-sm font-semibold text-orange-800">
              Possible Heatwave Warning: {weatherData.forecast[0]?.highTemp}°C today! Hydrate regularly.
            </p>
          </div>
        )}

        {weatherData && weatherData.forecast[0]?.lowTemp < 10 && (
          <div className="flex items-center gap-2 bg-gradient-to-l from-blue-200 to-purple-200 border border-blue-300 rounded-lg px-4 py-2 animate-pulse shadow-lg">
            <Thermometer className="h-6 w-6 text-blue-700 animate-pulse" />
            <p className="text-sm font-semibold text-blue-900">
              Sudden Temperature Drop: Low of {weatherData.forecast[0]?.lowTemp}°C. Dress warmly.
            </p>
          </div>
        )}

        {/* Current Weather */}
        {weatherData ? (
          <WeatherHeader
            location={weatherData.location}
            currentTemp={weatherData.currentTemp}
            description={weatherData.description}
            feelsLike={weatherData.feelsLike}
            highTemp={weatherData.highTemp}
            lowTemp={weatherData.lowTemp}
          />
        ) : (
          <Card className="bg-gradient-to-br from-weather-purple-light to-weather-blue-light border-none shadow-md p-6 animate-pulse animate-fade-in">
            <div className="flex flex-col space-y-3">
              <div className="h-6 bg-white/30 rounded w-1/3"></div>
              <div className="h-10 bg-white/30 rounded w-1/4"></div>
              <div className="h-4 bg-white/30 rounded w-1/2"></div>
            </div>
          </Card>
        )}

        {/* Alert Banner for Rainfall Tomorrow */}
        {weatherData && weatherData.forecast[1] && weatherData.forecast[1].rainChance > 50 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start animate-pulse shadow">
            <AlertTriangle className="text-weather-alert h-5 w-5 mt-0.5 mr-2 flex-shrink-0 animate-bounce" />
            <div>
              <p className="text-sm font-medium text-gray-800">
                {weatherData.forecast[1].rainChance}% chance of rainfall tomorrow
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Our models predict {weatherData.forecast[1].rainChance}% chance of significant rainfall in your area. 
                Consider adjusting outdoor plans.
              </p>
            </div>
          </div>
        )}

        {/* Tabs for different views */}
        <Tabs defaultValue="forecast" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
            <TabsTrigger value="rainfall">Rainfall</TabsTrigger>
            <TabsTrigger value="map">Live Map</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          {/* Forecast Tab */}
          <TabsContent value="forecast" className="mt-4">
            {weatherData ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 animate-fade-in">
                {weatherData.forecast.map((forecast) => (
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
            ) : (
              <div className="animate-pulse grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="shadow-sm">
                    <CardContent className="p-4 flex flex-col items-center">
                      <div className="h-4 bg-gray-200 rounded w-12 mb-2"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                      <div className="mt-3 flex justify-between space-x-4 w-full">
                        <div className="h-4 bg-gray-200 rounded w-6"></div>
                        <div className="h-4 bg-gray-200 rounded w-6"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Rainfall Tab */}
          <TabsContent value="rainfall" className="mt-4">
            {weatherData ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Next 24 Hours</h3>
                    <RainfallPrediction
                      chance={weatherData.forecast[0].rainChance}
                      amount={weatherData.forecast[0].rainfall || 0}
                      confidenceScore={weatherData.forecast[0].confidenceScore || 85}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-3">Tomorrow</h3>
                    <RainfallPrediction
                      chance={weatherData.forecast[1]?.rainChance || 0}
                      amount={weatherData.forecast[1]?.rainfall || 0}
                      confidenceScore={weatherData.forecast[1]?.confidenceScore || 75}
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
                          <p className="text-2xl font-bold">
                            {weatherData.forecast.reduce((total, day) => total + (day.rainfall || 0), 0).toFixed(1)} mm
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-weather-purple-light text-weather-purple-dark">
                          {weatherData.forecast.reduce((total, day) => total + (day.rainfall || 0), 0) > 20 ? 'Above Average' : 'Below Average'}
                        </Badge>
                      </div>
                      
                      <div className="h-40 flex items-end justify-between space-x-1">
                        {weatherData.forecast.map((day) => (
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
              </>
            ) : (
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-48"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
            )}
          </TabsContent>
          
          {/* Map Tab with Leaflet */}
          <TabsContent value="map" className="mt-4">
            {coordinates && weatherData ? (
              <LiveWeatherMap
                location={weatherData.location || currentLocation}
                latitude={coordinates.lat}
                longitude={coordinates.lon}
                temp={weatherData.currentTemp}
              />
            ) : (
              <Card className="shadow-sm animate-pulse">
                <CardContent className="p-8 text-center text-gray-400">
                  Loading map...
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Details Tab */}
          <TabsContent value="details" className="mt-4">
            {weatherData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Today's Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Humidity</span>
                        <span>{weatherData.humidity}%</span>
                      </div>
                      <Separator />
                      
                      <div className="flex justify-between">
                        <span className="text-gray-500">Wind</span>
                        <span>{weatherData.windSpeed} km/h</span>
                      </div>
                      <Separator />
                      
                      <div className="flex justify-between">
                        <span className="text-gray-500">UV Index</span>
                        <span>{weatherData.uvIndex} ({weatherData.uvIndex > 7 ? 'High' : weatherData.uvIndex > 4 ? 'Moderate' : 'Low'})</span>
                      </div>
                      <Separator />
                      
                      <div className="flex justify-between">
                        <span className="text-gray-500">Sunrise</span>
                        <span>{weatherData.sunrise}</span>
                      </div>
                      <Separator />
                      
                      <div className="flex justify-between">
                        <span className="text-gray-500">Sunset</span>
                        <span>{weatherData.sunset}</span>
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
                          <p className="font-medium">Weather Alerts</p>
                          <p className="text-sm text-gray-500">Get notified about important weather changes</p>
                        </div>
                        <Switch
                          checked={alertsEnabled}
                          onCheckedChange={handleAlertsToggle}
                        />
                      </div>
                      <div className="pt-2">
                        <p className="text-sm text-gray-500 mb-2">Data Sources</p>
                        <div className="flex space-x-2">
                          <Badge variant="outline">OpenWeather</Badge>
                          <Badge variant="outline">ML Model v2.1</Badge>
                          <Badge variant="outline">Comparison</Badge>
                        </div>
                        <p className="text-xs mt-1 text-gray-400">Forecasts combine ML and public weather APIs for accuracy.</p>
                      </div>
                      <div className="pt-2">
                        <Button variant="outline" size="sm" className="w-full" onClick={() => loadWeatherData(currentLocation)}>
                          <MapPin className="h-4 w-4 mr-2" />
                          Refresh Weather Data
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// NOTE: src/components/WeatherDashboard.tsx is now over 350 lines! Please consider refactoring this monolithic file into smaller components and files to improve maintainability and readability, and delete any unused imports/files after the operation.
