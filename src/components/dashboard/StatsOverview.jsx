import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Target, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp
} from "lucide-react";

export default function StatsOverview({ stats, loading }) {
  const statsData = [
    {
      title: "Total Indicadores",
      value: stats.totalIndicators,
      icon: BarChart3,
      color: "bg-blue-500",
      description: "Indicadores registrados"
    },
    {
      title: "Indicadores Activos",
      value: stats.activeIndicators,
      icon: CheckCircle,
      color: "bg-green-500",
      description: "En seguimiento"
    },
    {
      title: "Alertas",
      value: stats.alertCount,
      icon: AlertTriangle,
      color: "bg-red-500",
      description: "Requieren atención"
    },
    {
      title: "Cumplimiento",
      value: `${Math.round(stats.completionRate)}%`,
      icon: Target,
      color: "bg-purple-500",
      description: "Datos actualizados"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-slate-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300">
          <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 ${stat.color} rounded-full opacity-10`} />
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                <CardTitle className="text-3xl font-bold text-slate-900 mt-2">
                  {stat.value}
                </CardTitle>
              </div>
              <div className={`p-3 rounded-xl ${stat.color} bg-opacity-20`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-slate-500">{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}