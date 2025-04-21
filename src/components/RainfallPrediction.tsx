
import React from "react";
import { CloudRain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface RainfallPredictionProps {
  chance: number;
  amount: number;
  confidenceScore: number;
}

export const RainfallPrediction: React.FC<RainfallPredictionProps> = ({
  chance,
  amount,
  confidenceScore,
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <CloudRain className="text-weather-rain mr-2" size={18} />
          Rainfall Prediction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500">Chance of Rain</span>
              <span className="text-sm font-medium">{chance}%</span>
            </div>
            <Progress value={chance} className="h-2 bg-weather-blue-light" />
          </div>
          
          {amount > 0 && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-500">Expected Amount</span>
                <span className="text-sm font-medium">{amount} mm</span>
              </div>
              <Progress value={amount * 5} max={50} className="h-2 bg-weather-blue-light" />
            </div>
          )}
          
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-xs text-gray-500">Prediction Confidence</span>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-1 ${
                confidenceScore > 70 ? "bg-green-500" : 
                confidenceScore > 40 ? "bg-yellow-500" : "bg-red-500"
              }`}></div>
              <span className="text-xs font-medium">{confidenceScore}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
