import React, { useState, useEffect } from "react";
import { Indicator, Goal, User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

import IndicatorSelector from "../components/measurements/IndicatorSelector"; // Reusing this component
import GoalForm from "../components/goals/GoalForm";
import GoalsList from "../components/goals/GoalsList";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function Metas() {
  const [indicators, setIndicators] = useState([]);
  const [goals, setGoals] = useState([]);
  
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [goalsForSelected, setGoalsForSelected] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

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
      await localStorage.getItem("auth"); // Check auth
      const [indicatorsData, goalsData] = await Promise.all([
        Indicator.filter({ status: "active" }),
        Goal.list("-start_date"),
      ]);
      setIndicators(indicatorsData);
      setGoals(goalsData);

      if (indicatorsData.length > 0) {
        handleSelectIndicator(indicatorsData[0], goalsData);
      }
    } catch (err) {
      console.error("Error loading data for Metas page:", err);
      setError("No se pudieron cargar los datos necesarios. Por favor, reintente.");
    }
    setLoading(false);
  };
  
  const handleSelectIndicator = (indicator, allGoals = goals) => {
    setSelectedIndicator(indicator);
    const relatedGoals = allGoals
      .filter(g => g.indicator_id === indicator.id)
      .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
    setGoalsForSelected(relatedGoals);
  };

  const reloadGoals = async () => {
    try {
      const goalsData = await Goal.list("-start_date");
      setGoals(goalsData);
      if (selectedIndicator) {
        handleSelectIndicator(selectedIndicator, goalsData);
      }
    } catch (err) {
      setError("Error al actualizar la lista de metas.");
    }
  };
  
  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleDelete = async (goalId) => {
    if (window.confirm("¿Está seguro de que desea eliminar esta meta?")) {
      try {
        await Goal.delete(goalId);
        await reloadGoals();
      } catch (err) {
        setError("Error al eliminar la meta.");
        console.error("Error deleting goal:", err);
      }
    }
  };

  const handleFormSubmit = async () => {
    setShowForm(false);
    setEditingGoal(null);
    await reloadGoals();
  };

  if (loading && !selectedIndicator) {
    return <LoadingSpinner message="Cargando configuración de metas..." />;
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
              <Button onClick={loadInitialData} className="bg-blue-600 hover:bg-blue-700">Reintentar</Button>
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
            <h1 className="text-3xl font-bold text-slate-900">Gestión de Metas</h1>
            <p className="text-slate-600 mt-1">Defina y administre los objetivos para cada indicador.</p>
          </div>
          <Button onClick={() => { setEditingGoal(null); setShowForm(true); }} disabled={!selectedIndicator} className="bg-blue-600 hover:bg-blue-700">
            <Target className="w-4 h-4 mr-2" />
            Nueva Meta
          </Button>
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
              <GoalsList
                goals={goalsForSelected}
                indicator={selectedIndicator}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <Card className="flex items-center justify-center h-full">
                <CardContent className="text-center py-12">
                  <Target className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-semibold text-slate-900">Seleccione un Indicador</h3>
                  <p className="text-slate-500 mt-2">Elija un indicador para gestionar sus metas.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {showForm && selectedIndicator && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
              <GoalForm
                indicator={selectedIndicator}
                goal={editingGoal}
                onSubmit={handleFormSubmit}
                onCancel={() => { setShowForm(false); setEditingGoal(null); }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}