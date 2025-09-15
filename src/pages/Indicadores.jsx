import React, { useState, useEffect } from "react";
import { Indicator, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  TrendingUp,
  BarChart3,
  AlertTriangle
} from "lucide-react";

import IndicatorForm from "../components/indicators/IndicatorForm";
import IndicatorCard from "../components/indicators/IndicatorCard";
import FilterPanel from "../components/indicators/FilterPanel";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function Indicadores() {
  const [indicators, setIndicators] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    type: "",
    status: "active",
    area: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    //loadIndicators();
    setLoading(false)
  }, []);

  const loadIndicators = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if user is authenticated first
      await localStorage.getItem("auth");
      
      //const data = await Indicator.list("-created_date");
      //setIndicators(data);
    } catch (error) {
      console.error("Error loading indicators:", error);
      setError("Error al cargar los indicadores");
    }
    
    setLoading(false);
  };

  const handleSubmit = async (indicatorData) => {
    try {
      if (editingIndicator) {
        await Indicator.update(editingIndicator.id, indicatorData);
      } else {
        await Indicator.create(indicatorData);
      }
      setShowForm(false);
      setEditingIndicator(null);
      loadIndicators();
    } catch (error) {
      console.error("Error saving indicator:", error);
      setError("Error al guardar el indicador");
    }
  };

  const handleEdit = (indicator) => {
    setEditingIndicator(indicator);
    setShowForm(true);
  };

  const handleDelete = async (indicatorId) => {
    if (window.confirm("¿Está seguro de eliminar este indicador?")) {
      try {
        await Indicator.delete(indicatorId);
        loadIndicators();
      } catch (error) {
        console.error("Error deleting indicator:", error);
        setError("Error al eliminar el indicador");
      }
    }
  };

  const filteredIndicators = indicators.filter(indicator => {
    const matchesSearch = indicator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         indicator.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filters.category || indicator.category === filters.category;
    const matchesType = !filters.type || indicator.type === filters.type;
    const matchesStatus = !filters.status || indicator.status === filters.status;
    const matchesArea = !filters.area || indicator.area === filters.area;
    
    return matchesSearch && matchesCategory && matchesType && matchesStatus && matchesArea;
  });

  if (loading) {
    return <LoadingSpinner message="Cargando indicadores..." />;
  }

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="max-w-md mx-auto mt-20">
          <Card className="text-center">
            <CardContent className="p-8">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Error al cargar los indicadores
              </h3>
              <p className="text-slate-600 mb-4">{error}</p>
              <Button onClick={loadIndicators} className="bg-blue-600 hover:bg-blue-700">
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Indicadores</h1>
            <p className="text-slate-600 mt-1">
              Gestión y configuración de indicadores
            </p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Indicador
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="w-5 h-5" />
              Búsqueda y Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar indicadores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            <FilterPanel filters={filters} onFiltersChange={setFilters} />
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Indicators Grid */}
        <div className="grid gap-6">
          {filteredIndicators.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No se encontraron indicadores
                </h3>
                <p className="text-slate-600 mb-4">
                  {searchTerm || Object.values(filters).some(f => f) 
                    ? "Intente ajustar los filtros de búsqueda"
                    : "Cree su primer indicador para comenzar"
                  }
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Indicador
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredIndicators.map((indicator) => (
              <IndicatorCard
                key={indicator.id}
                indicator={indicator}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <IndicatorForm
                indicator={editingIndicator}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingIndicator(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}