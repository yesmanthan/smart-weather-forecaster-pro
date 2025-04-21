
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LocationSearchProps {
  onSelectLocation: (location: string) => void;
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
          className="rounded-l-none bg-weather-purple hover:bg-weather-purple-dark"
        >
          <Search className="h-4 w-4" />
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
