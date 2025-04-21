
import React from "react";
import { WeatherDashboard } from "@/components/WeatherDashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-weather-purple to-weather-blue py-4 px-6 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-white text-xl font-bold">SmartWeather</h1>
            <span className="ml-2 text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
              Beta
            </span>
          </div>
          <p className="text-white/80 text-sm hidden sm:block">
            Intelligent Weather Forecasting
          </p>
        </div>
      </header>
      
      <main className="py-6 px-4">
        <WeatherDashboard />
      </main>
      
      <footer className="mt-10 py-6 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>SmartWeather combines data from multiple APIs with ML models for accurate rainfall predictions.</p>
          <p className="mt-2">© 2025 SmartWeather - Weather data is for demonstration purposes only</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
