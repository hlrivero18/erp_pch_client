import React, { useState, useEffect } from "react";
import { Indicator, Measurement, Goal, User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Users,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import StatsOverview from "../components/dashboard/StatsOverview";
import IndicatorCard from "../components/dashboard/IndicatorCard";
import AlertsPanel from "../components/dashboard/AlertsPanel";
import RecentActivity from "../components/dashboard/RecentActivity";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function Dashboard() {
  const [indicators, setIndicators] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalIndicators: 0,
    activeIndicators: 0,
    alertCount: 0,
    completionRate: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if user is authenticated first
      await localStorage.getItem("auth");
      
      const [indicatorsData, measurementsData, goalsData] = await Promise.all([
        Indicator.filter({ status: "active" }).catch(() => []),
        Measurement.list("-created_date", 20).catch(() => []),
        Goal.filter({ status: "active" }).catch(() => [])
      ]);

      setIndicators(indicatorsData);
      setMeasurements(measurementsData);
      setGoals(goalsData);

      // Calculate stats
      const alertCount = measurementsData.filter(m => 
        Math.abs(m.variance_vs_goal || 0) > 10
      ).length;

      setStats({
        totalIndicators: indicatorsData.length,
        activeIndicators: indicatorsData.filter(i => i.status === "active").length,
        alertCount,
        completionRate: measurementsData.length > 0 ? 
          (measurementsData.filter(m => m.variance_vs_goal !== null).length / measurementsData.length) * 100 : 0
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("Error al cargar los datos del dashboard");
    }
    
    setLoading(false);
  };

  const getIndicatorStatus = (indicator) => {
    const latestMeasurement = measurements.find(m => m.indicator_id === indicator.id);
    if (!latestMeasurement) return "no_data";
    
    const variance = Math.abs(latestMeasurement.variance_vs_goal || 0);
    const tolerance = indicator.tolerance_percentage || 5;
    
    if (variance <= tolerance) return "good";
    if (variance <= tolerance * 2) return "warning";
    return "critical";
  };

  if (loading) {
    return <LoadingSpinner message="Cargando dashboard..." />;
  }

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="max-w-md mx-auto mt-20">
          <Card className="text-center">
            <CardContent className="p-8">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Error al cargar los datos
              </h3>
              <p className="text-slate-600 mb-4">{error}</p>
              <Button onClick={loadDashboardData} className="bg-blue-600 hover:bg-blue-700">
                Reintentar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">
              Vista general del sistema de indicadores
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock className="w-4 h-4" />
            <span>Actualizado: {format(new Date(), "HH:mm", { locale: es })}</span>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview stats={stats} loading={false} />

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Indicators Grid */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-900">
                Indicadores Principales
              </h2>
              <Button variant="outline" size="sm">
                Ver todos
              </Button>
            </div>
            
            <div className="grid gap-4">
              {indicators.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      No hay indicadores disponibles
                    </h3>
                    <p className="text-slate-600">
                      Cree indicadores para comenzar a visualizar datos
                    </p>
                  </CardContent>
                </Card>
              ) : (
                indicators.slice(0, 6).map((indicator) => (
                  <IndicatorCard
                    key={indicator.id}
                    indicator={indicator}
                    measurement={measurements.find(m => m.indicator_id === indicator.id)}
                    goal={goals.find(g => g.indicator_id === indicator.id)}
                    status={getIndicatorStatus(indicator)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <AlertsPanel 
              measurements={measurements}
              indicators={indicators}
              loading={false}
            />
            
            <RecentActivity 
              measurements={measurements}
              indicators={indicators}
              loading={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}