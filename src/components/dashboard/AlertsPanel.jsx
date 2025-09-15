import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, TrendingDown } from "lucide-react";

export default function AlertsPanel({ measurements, indicators, loading }) {
  const getAlerts = () => {
    const alerts = [];
    
    measurements.forEach(measurement => {
      const indicator = indicators.find(i => i.id === measurement.indicator_id);
      if (!indicator) return;
      
      const tolerance = indicator.tolerance_percentage || 5;
      const variance = Math.abs(measurement.variance_vs_goal || 0);
      
      if (variance > tolerance) {
        alerts.push({
          type: variance > tolerance * 2 ? "critical" : "warning",
          indicator: indicator.name,
          variance: measurement.variance_vs_goal,
          message: `Desviación del ${variance.toFixed(1)}% respecto a la meta`
        });
      }
    });
    
    return alerts.slice(0, 5);
  };

  const alerts = getAlerts();

  const getAlertConfig = (type) => {
    switch (type) {
      case "critical":
        return {
          icon: AlertTriangle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          badge: "bg-red-100 text-red-800"
        };
      case "warning":
        return {
          icon: Clock,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          badge: "bg-yellow-100 text-yellow-800"
        };
      default:
        return {
          icon: TrendingDown,
          color: "text-slate-600",
          bgColor: "bg-slate-50",
          badge: "bg-slate-100 text-slate-800"
        };
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Alertas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Alertas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No hay alertas pendientes</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert, index) => {
              const config = getAlertConfig(alert.type);
              const AlertIcon = config.icon;
              
              return (
                <div key={index} className={`p-3 rounded-lg ${config.bgColor} border border-slate-200`}>
                  <div className="flex items-start gap-3">
                    <AlertIcon className={`w-4 h-4 mt-0.5 ${config.color}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-slate-900 text-sm">
                          {alert.indicator}
                        </p>
                        <Badge className={`${config.badge} text-xs`}>
                          {alert.type === "critical" ? "Crítico" : "Atención"}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}