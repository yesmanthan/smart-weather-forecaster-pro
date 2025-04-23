
import React, { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Map, MapPin } from "lucide-react";

interface Props {
  latitude: number;
  longitude: number;
  location: string;
  temp?: number;
}

export const LiveWeatherMap: React.FC<Props> = ({
  latitude,
  longitude,
  location,
  temp
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
    }
    const map = L.map(mapRef.current).setView([latitude, longitude], 11);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);
    const marker = L.marker([latitude, longitude]).addTo(map);
    marker.bindTooltip(
      `<strong>${location}</strong>${temp != null ? `<br/>${temp}°C` : ""}`,
      { permanent: true }
    );
    leafletMapRef.current = map;
    return () => {
      map.remove();
    };
  }, [latitude, longitude, location, temp]);

  return (
    <Card className="border border-weather-blue/20 overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-weather-blue-light to-weather-purple-light">
        <CardTitle className="text-lg flex items-center text-gray-800">
          <Map className="mr-2 h-5 w-5 text-weather-purple" />
          Live Weather Map - {location}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div
          ref={mapRef}
          className="w-full h-[320px] rounded-b-md"
          style={{ minHeight: 250, borderRadius: 8, overflow: "hidden" }}
        />
      </CardContent>
    </Card>
  );
};
