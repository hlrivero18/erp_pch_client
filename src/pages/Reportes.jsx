import React, { useState, useEffect } from "react";
import { Indicator, Measurement, Goal, User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

import ReportFilters from "../components/reports/ReportFilters";
import ReportPreview from "../components/reports/ReportPreview";
import ReportExport from "../components/reports/ReportExport";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function Reportes() {
  const [indicators, setIndicators] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [goals, setGoals] = useState([]);
  
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({
    selectedIndicators: [],
    dateRange: {
      start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Start of year
      end: new Date().toISOString().split('T')[0] // Today
    },
    categories: [],
    areas: [],
    reportType: 'summary'
  });

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    //loadInitialData();
    setLoading(false)
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      await User.me(); // Check auth
      const [indicatorsData, measurementsData, goalsData] = await Promise.all([
        Indicator.filter({ status: "active" }),
        Measurement.list("-measurement_date"),
        Goal.filter({ status: "active" })
      ]);
      
      setIndicators(indicatorsData);
      setMeasurements(measurementsData);
      setGoals(goalsData);

      // Auto-select all indicators initially
      setFilters(prev => ({
        ...prev,
        selectedIndicators: indicatorsData.map(i => i.id)
      }));
    } catch (err) {
      console.error("Error loading data for Reportes page:", err);
      setError("No se pudieron cargar los datos necesarios. Por favor, reintente.");
    }
    setLoading(false);
  };

  const generateReport = async () => {
    setGenerating(true);
    setError(null);
    
    try {
      // Filter data based on selected criteria
      const filteredIndicators = indicators.filter(ind => 
        filters.selectedIndicators.includes(ind.id) &&
        (filters.categories.length === 0 || filters.categories.includes(ind.category)) &&
        (filters.areas.length === 0 || filters.areas.includes(ind.area))
      );

      const filteredMeasurements = measurements.filter(measurement => {
        const measurementDate = new Date(measurement.measurement_date);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        
        return filters.selectedIndicators.includes(measurement.indicator_id) &&
               measurementDate >= startDate &&
               measurementDate <= endDate;
      });

      const filteredGoals = goals.filter(goal => 
        filters.selectedIndicators.includes(goal.indicator_id)
      );

      // Process and compile report data
      const processedData = processReportData(filteredIndicators, filteredMeasurements, filteredGoals);
      
      setReportData({
        indicators: filteredIndicators,
        measurements: filteredMeasurements,
        goals: filteredGoals,
        processed: processedData,
        filters: filters,
        generatedAt: new Date()
      });
    } catch (err) {
      console.error("Error generating report:", err);
      setError("Error al generar el reporte. Por favor, intente nuevamente.");
    }
    
    setGenerating(false);
  };

  const processReportData = (indicators, measurements, goals) => {
    const summary = indicators.map(indicator => {
      const indicatorMeasurements = measurements.filter(m => m.indicator_id === indicator.id);
      const indicatorGoals = goals.filter(g => g.indicator_id === indicator.id);
      
      const latestMeasurement = indicatorMeasurements.sort((a, b) => 
        new Date(b.measurement_date) - new Date(a.measurement_date)
      )[0];

      const avgValue = indicatorMeasurements.length > 0 
        ? indicatorMeasurements.reduce((sum, m) => sum + m.value, 0) / indicatorMeasurements.length
        : 0;

      const activeGoal = indicatorGoals.find(g => g.status === 'active') || indicatorGoals[0];

      return {
        indicator,
        latestValue: latestMeasurement?.value || 0,
        latestDate: latestMeasurement?.measurement_date,
        averageValue: avgValue,
        goalValue: activeGoal?.target_value || null,
        variance: latestMeasurement?.variance_vs_goal || null,
        measurementCount: indicatorMeasurements.length,
        measurements: indicatorMeasurements,
        goals: indicatorGoals
      };
    });

    return {
      summary,
      totalIndicators: indicators.length,
      totalMeasurements: measurements.length,
      periodCovered: {
        start: filters.dateRange.start,
        end: filters.dateRange.end
      }
    };
  };

  if (loading) {
    return <LoadingSpinner message="Cargando datos para reportes..." />;
  }

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="max-w-md mx-auto mt-20">
          <Card className="text-center">
            <CardContent className="p-8">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Error</h3>
              <p className="text-slate-600 mb-4">{error}</p>
              <Button onClick={loadInitialData} className="bg-blue-600 hover:bg-blue-700">
                Reintentar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Reportes e Informes</h1>
            <p className="text-slate-600 mt-1">
              Genere reportes personalizados y análisis de indicadores
            </p>
          </div>
          <div className="flex gap-3">
            {reportData && (
              <ReportExport reportData={reportData} />
            )}
            <Button 
              onClick={generateReport}
              disabled={generating || filters.selectedIndicators.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Generando...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Generar Reporte
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ReportFilters
              indicators={indicators}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          <div className="lg:col-span-3">
            {reportData ? (
              <ReportPreview reportData={reportData} />
            ) : (
              <Card className="flex items-center justify-center h-96">
                <CardContent className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-semibold text-slate-900">Genere un Reporte</h3>
                  <p className="text-slate-500 mt-2">
                    Configure los filtros y genere un reporte para visualizar los datos
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}