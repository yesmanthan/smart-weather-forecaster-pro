
import { toast } from "@/components/ui/sonner";

// Weather types
export type WeatherIconType = "sunny" | "cloudy" | "rainy" | "stormy" | "partlyCloudy";
export type WeatherCondition = "temperature" | "uv" | "rain" | "wind";

export interface WeatherData {
  location: string;
  currentTemp: number;
  feelsLike: number;
  highTemp: number;
  lowTemp: number;
  description: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  forecast: ForecastDay[];
}

export interface ForecastDay {
  day: string;
  highTemp: number;
  lowTemp: number;
  weatherType: WeatherIconType;
  rainChance: number;
  rainfall?: number;
  confidenceScore?: number;
}

// OpenWeather API key
const API_KEY = "2362a88743bcb0546a5097e063aa68ab";

// Function to convert OpenWeather icon to our weather type
const mapWeatherIcon = (icon: string): WeatherIconType => {
  if (icon.includes("01") || icon.includes("02")) return "sunny";
  if (icon.includes("03") || icon.includes("04")) return "partlyCloudy";
  if (icon.includes("09") || icon.includes("10")) return "rainy";
  if (icon.includes("11")) return "stormy";
  return "cloudy";
};

// Format time from unix timestamp
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Get day of week from date
const getDayOfWeek = (date: Date): string => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
};

// Fetch weather data from OpenWeather API
export const fetchWeatherData = async (location: string): Promise<WeatherData> => {
  try {
    // Geocoding API to get coordinates from location name
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${API_KEY}`
    );
    
    if (!geoResponse.ok) throw new Error('Failed to find location');
    
    const geoData = await geoResponse.json();
    if (!geoData.length) throw new Error('Location not found');
    
    const { lat, lon, name } = geoData[0];
    
    // Current weather API
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    
    if (!weatherResponse.ok) throw new Error('Failed to fetch weather data');
    
    const weatherData = await weatherResponse.json();
    
    // Forecast API for 5 days
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    
    if (!forecastResponse.ok) throw new Error('Failed to fetch forecast data');
    
    const forecastData = await forecastResponse.json();
    
    // Process forecast data - we need daily forecast
    const dailyForecasts: ForecastDay[] = [];
    const today = new Date();
    
    // Add today's forecast
    dailyForecasts.push({
      day: "Today",
      highTemp: Math.round(weatherData.main.temp_max),
      lowTemp: Math.round(weatherData.main.temp_min),
      weatherType: mapWeatherIcon(weatherData.weather[0].icon),
      rainChance: weatherData.rain ? 80 : weatherData.clouds.all,
      rainfall: weatherData.rain ? weatherData.rain["1h"] || 0 : 0,
      confidenceScore: 90
    });
    
    // Process next 5 days
    const processedDates = new Set<string>();
    
    for (let i = 0; i < forecastData.list.length; i++) {
      const forecast = forecastData.list[i];
      const forecastDate = new Date(forecast.dt * 1000);
      const dateString = forecastDate.toDateString();
      
      // Skip today and already processed dates
      if (forecastDate.getDate() === today.getDate() || processedDates.has(dateString)) {
        continue;
      }
      
      // Find all forecasts for this day
      const dayForecasts = forecastData.list.filter(item => {
        const itemDate = new Date(item.dt * 1000);
        return itemDate.toDateString() === dateString;
      });
      
      // Calculate high and low temps for the day
      const temps = dayForecasts.map(f => f.main.temp);
      const highTemp = Math.round(Math.max(...temps));
      const lowTemp = Math.round(Math.min(...temps));
      
      // Determine most common weather condition
      const weatherTypes = dayForecasts.map(f => f.weather[0].icon);
      const weatherType = mapWeatherIcon(weatherTypes[Math.floor(weatherTypes.length / 2)]);
      
      // Calculate rain chance
      const rainForecasts = dayForecasts.filter(f => f.rain && (f.rain["3h"] || 0) > 0);
      const rainChance = Math.round((rainForecasts.length / dayForecasts.length) * 100);
      
      // Calculate rainfall amount
      const rainfall = rainForecasts.reduce((total, f) => total + (f.rain ? (f.rain["3h"] || 0) : 0), 0);
      
      dailyForecasts.push({
        day: getDayOfWeek(forecastDate),
        highTemp,
        lowTemp,
        weatherType,
        rainChance: rainChance || dayForecasts[0].clouds.all / 2,
        rainfall: rainfall || 0,
        confidenceScore: 80 - dailyForecasts.length * 5 // Confidence decreases with time
      });
      
      processedDates.add(dateString);
      
      // Stop after 5 days (today + 5 more)
      if (dailyForecasts.length >= 6) break;
    }
    
    // Construct the final weather data object
    const result: WeatherData = {
      location: name,
      currentTemp: Math.round(weatherData.main.temp),
      feelsLike: Math.round(weatherData.main.feels_like),
      highTemp: Math.round(weatherData.main.temp_max),
      lowTemp: Math.round(weatherData.main.temp_min),
      description: weatherData.weather[0].description,
      humidity: weatherData.main.humidity,
      windSpeed: Math.round(weatherData.wind.speed),
      uvIndex: 6, // UV index is not directly available in the free tier, using placeholder
      sunrise: formatTime(weatherData.sys.sunrise),
      sunset: formatTime(weatherData.sys.sunset),
      forecast: dailyForecasts
    };
    
    return result;
  } catch (error) {
    console.error("Weather fetch error:", error);
    toast.error("Failed to fetch weather data");
    throw error;
  }
};

// Check and send weather notifications if needed
export const checkWeatherAlerts = (weatherData: WeatherData): void => {
  // Check for high temperature alert (above 35°C)
  if (weatherData.currentTemp > 35) {
    toast.warning("High Temperature Alert", {
      description: `Current temperature is ${weatherData.currentTemp}°C. Stay hydrated and avoid direct sun exposure.`
    });
  }
  
  // Check for high UV index alert
  if (weatherData.uvIndex >= 8) {
    toast.warning("High UV Alert", {
      description: `UV Index is high (${weatherData.uvIndex}). Use sunscreen and protective clothing.`
    });
  }
  
  // Check for rain alerts
  const tomorrowForecast = weatherData.forecast[1];
  if (tomorrowForecast && tomorrowForecast.rainChance > 60) {
    toast.info("Rain Alert", {
      description: `${tomorrowForecast.rainChance}% chance of rain tomorrow. Consider adjusting outdoor plans.`
    });
  }
  
  // Check for temperature drop
  if (weatherData.forecast[1] && 
      (weatherData.forecast[0].highTemp - weatherData.forecast[1].highTemp > 5)) {
    toast.info("Temperature Drop Alert", {
      description: `Temperature will drop by ${weatherData.forecast[0].highTemp - weatherData.forecast[1].highTemp}°C tomorrow.`
    });
  }
  
  // Check for high wind
  if (weatherData.windSpeed > 20) {
    toast.warning("High Wind Alert", {
      description: `Wind speeds of ${weatherData.windSpeed} km/h. Secure loose outdoor items.`
    });
  }
};
