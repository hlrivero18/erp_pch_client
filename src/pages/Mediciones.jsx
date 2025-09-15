import React, { useState, useEffect } from "react";
import { Indicator, Measurement, Goal, User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertTriangle } from "lucide-react";

import IndicatorSelector from "../components/measurements/IndicatorSelector";
import MeasurementForm from "../components/measurements/MeasurementForm";
import RecentMeasurements from "../components/measurements/RecentMeasurements";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";

export default function Mediciones() {
  const [indicators, setIndicators] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [goals, setGoals] = useState([]);
  
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [measurementsForSelected, setMeasurementsForSelected] = useState([]);

  const [loading, setLoading] = useState(true);
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

      if (indicatorsData.length > 0) {
        handleSelectIndicator(indicatorsData[0]);
      }
    } catch (err) {
      console.error("Error loading data for Mediciones page:", err);
      setError("No se pudieron cargar los datos necesarios. Por favor, reintente.");
    }
    setLoading(false);
  };
  
  const handleSelectIndicator = (indicator) => {
    setSelectedIndicator(indicator);
    const relatedMeasurements = measurements
      .filter(m => m.indicator_id === indicator.id)
      .sort((a, b) => new Date(b.measurement_date) - new Date(a.measurement_date));
    setMeasurementsForSelected(relatedMeasurements);
  };

  const handleMeasurementAdded = async () => {
    // Re-fetch measurements to get the latest data
    setLoading(true);
    try {
      const measurementsData = await Measurement.list("-measurement_date");
      setMeasurements(measurementsData);
      // After re-fetching, filter again for the currently selected indicator
      if (selectedIndicator) {
        const relatedMeasurements = measurementsData
          .filter(m => m.indicator_id === selectedIndicator.id)
          .sort((a, b) => new Date(b.measurement_date) - new Date(a.measurement_date));
        setMeasurementsForSelected(relatedMeasurements);
      }
    } catch (err) {
      setError("Error al actualizar la lista de mediciones.");
    }
    setLoading(false);
  };
  
  if (loading && !selectedIndicator) {
    return <LoadingSpinner message="Cargando datos de mediciones..." />;
  }

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="max-w-md mx-auto mt-20">
          <Card className="text-center">
            <CardContent className="p-8">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Error
              </h3>
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
            <h1 className="text-3xl font-bold text-slate-900">Ingreso de Mediciones</h1>
            <p className="text-slate-600 mt-1">
              Registre los valores para cada indicador según su frecuencia.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <IndicatorSelector
              indicators={indicators}
              selectedIndicatorId={selectedIndicator?.id}
              onSelect={handleSelectIndicator}
            />
          </div>

          <div className="lg:col-span-2 space-y-8">
            {selectedIndicator ? (
              <>
                <MeasurementForm
                  key={selectedIndicator.id} // Re-mount form on indicator change
                  indicator={selectedIndicator}
                  goals={goals}
                  allMeasurements={measurements}
                  onMeasurementAdded={handleMeasurementAdded}
                />
                <RecentMeasurements
                  measurements={measurementsForSelected}
                  indicator={selectedIndicator}
                />
              </>
            ) : (
               <Card className="flex items-center justify-center h-full">
                <CardContent className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-semibold text-slate-900">
                    Seleccione un Indicador
                  </h3>
                  <p className="text-slate-500 mt-2">
                    Elija un indicador de la lista para ingresar una nueva medición.
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