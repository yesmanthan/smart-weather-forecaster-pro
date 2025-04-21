
import React from "react";
import { WeatherDashboard } from "@/components/WeatherDashboard";
import { Sun, CloudSun } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-weather-purple to-weather-blue py-4 px-6 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <CloudSun className="text-white h-7 w-7 mr-2" />
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
      
      <footer className="mt-10 py-6 bg-gray-100/80 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>SmartWeather combines data from multiple sources with ML models for accurate predictions.</p>
          <p className="mt-2">© 2025 SmartWeather - Powered by OpenWeather API and machine learning</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
