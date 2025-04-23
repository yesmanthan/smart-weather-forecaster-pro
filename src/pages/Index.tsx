
import React from "react";
import { WeatherDashboard } from "@/components/WeatherDashboard";
import { CloudSun } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#19192c] dark:to-[#1a1f2c] transition-colors">
      <header className="bg-gradient-to-r from-weather-purple to-weather-blue py-4 px-6 shadow-md dark:from-black dark:to-[#2a225a]">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <CloudSun className="text-white h-7 w-7 mr-2 animate-[spin_20s_linear_infinite]" />
            <h1 className="text-white text-xl font-bold tracking-tight drop-shadow-md">MRSAC Weather</h1>
            <span className="ml-2 text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
              Beta
            </span>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-white/80 text-sm hidden sm:block">
              Intelligent Weather Forecasting
            </p>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="py-6 px-4">
        <WeatherDashboard />
      </main>
      <footer className="mt-10 py-6 bg-gray-100/80 border-t border-gray-200 dark:bg-gray-800/90 dark:text-gray-300">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm">
          <p>
            MRSAC Weather combines data from multiple sources with ML models for
            accurate predictions.
          </p>
          <p className="mt-2">
            © 2025 MRSAC Weather - Powered by OpenWeather API and machine learning
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
