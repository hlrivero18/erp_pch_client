import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, FileText, TrendingUp } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function RecentActivity({ measurements, indicators, loading }) {
  const getRecentActivity = () => {
    return measurements
      .slice(0, 5)
      .map(measurement => {
        const indicator = indicators.find(i => i.id === measurement.indicator_id);
        return {
          ...measurement,
          indicatorName: indicator?.name || "Indicador desconocido",
          indicatorCategory: indicator?.category || "Sin categoría"
        };
      });
  };

  const recentActivity = getRecentActivity();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array(4).fill(0).map((_, i) => (
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
          <Activity className="w-5 h-5 text-blue-500" />
          Actividad Reciente
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentActivity.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No hay actividad reciente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-slate-900 text-sm">
                      {activity.indicatorName}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {activity.indicatorCategory}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 mb-1">
                    Nuevo valor: {activity.value}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDistanceToNow(new Date(activity.created_date), { 
                      addSuffix: true, 
                      locale: es 
                    })}
                  </p>
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}