import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Minus
} from "lucide-react";

export default function IndicatorCard({ indicator, measurement, goal, status }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case "good":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          badge: "bg-green-100 text-green-800"
        };
      case "warning":
        return {
          icon: AlertTriangle,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          badge: "bg-yellow-100 text-yellow-800"
        };
      case "critical":
        return {
          icon: AlertTriangle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          badge: "bg-red-100 text-red-800"
        };
      default:
        return {
          icon: Minus,
          color: "text-slate-400",
          bgColor: "bg-slate-50",
          borderColor: "border-slate-200",
          badge: "bg-slate-100 text-slate-800"
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  const formatValue = (value) => {
    if (value === null || value === undefined) return "N/A";
    
    switch (indicator.unit) {
      case "percentage":
        return `${value}%`;
      case "currency":
        return `$${value.toLocaleString()}`;
      default:
        return value.toLocaleString();
    }
  };

  const getVarianceIcon = (variance) => {
    if (!variance) return null;
    return variance > 0 ? TrendingUp : TrendingDown;
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 ${statusConfig.bgColor} ${statusConfig.borderColor} border-2`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg text-slate-900">
                {indicator.name}
              </CardTitle>
              <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
            </div>
            <p className="text-sm text-slate-600 line-clamp-2">
              {indicator.description}
            </p>
          </div>
          <Badge className={`${statusConfig.badge} border-0`}>
            {indicator.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-slate-500 mb-1">Valor Actual</p>
            <p className="text-xl font-bold text-slate-900">
              {formatValue(measurement?.value)}
            </p>
          </div>
          
          <div>
            <p className="text-xs text-slate-500 mb-1">Meta</p>
            <p className="text-lg font-semibold text-slate-700">
              {formatValue(goal?.target_value)}
            </p>
          </div>
          
          <div>
            <p className="text-xs text-slate-500 mb-1">Variación</p>
            <div className="flex items-center gap-1">
              {measurement?.variance_vs_goal && (
                <>
                  {React.createElement(getVarianceIcon(measurement.variance_vs_goal), {
                    className: `w-4 h-4 ${
                      measurement.variance_vs_goal > 0 ? 'text-green-500' : 'text-red-500'
                    }`
                  })}
                  <span className={`text-sm font-medium ${
                    measurement.variance_vs_goal > 0 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {measurement.variance_vs_goal > 0 ? '+' : ''}
                    {measurement.variance_vs_goal.toFixed(1)}%
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-slate-200">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Área: {indicator.area}</span>
            <span>Frecuencia: {indicator.frequency}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}