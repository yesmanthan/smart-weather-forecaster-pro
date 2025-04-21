
import React, { useState, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";

interface LocationCoordinates {
  lat: number;
  lon: number;
}

interface LocationSearchProps {
  onSelectLocation: (location: string, coordinates?: LocationCoordinates) => void;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  onSelectLocation,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [recentLocations] = useState([
    "Mumbai, India",
    "Pune, India",
    "Nagpur, India",
  ]);
  const [loading, setLoading] = useState(false);

  // Function to get user's current location
  const getCurrentLocation = () => {
    setLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocoding to get location name
            const API_KEY = "2362a88743bcb0546a5097e063aa68ab";
            const response = await fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
            );
            
            if (!response.ok) {
              throw new Error('Could not get location name');
            }
            
            const data = await response.json();
            if (data && data.length > 0) {
              const locationName = `${data[0].name}, ${data[0].country}`;
              onSelectLocation(locationName, { lat: latitude, lon: longitude });
              toast.success(`Location set to ${locationName}`);
            }
          } catch (error) {
            console.error('Error getting location name:', error);
            toast.error('Could not determine your location name');
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Could not get your current location");
          setLoading(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSelectLocation(searchInput);
      setSearchInput("");
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex w-full">
        <Input
          type="text"
          placeholder="Search location..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="rounded-r-none focus-visible:ring-weather-purple-light"
        />
        <Button 
          type="submit"
          className="rounded-l-none rounded-r-none bg-weather-purple hover:bg-weather-purple-dark"
        >
          <Search className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={getCurrentLocation}
          className="rounded-l-none bg-weather-blue hover:bg-weather-blue-dark ml-px"
          disabled={loading}
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </form>

      {recentLocations.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-500 mb-1">Recent locations:</p>
          <div className="flex flex-wrap gap-2">
            {recentLocations.map((location) => (
              <Button
                key={location}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => onSelectLocation(location)}
              >
                {location}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
