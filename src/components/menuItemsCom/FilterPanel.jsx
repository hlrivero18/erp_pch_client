import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function FilterPanel({ filters, onFiltersChange }) {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    onFiltersChange({
      category: "",
      type: "",
      status: "active",
      area: ""
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value && value !== "active");

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex gap-4">
        <div className="min-w-[150px]">
          <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>Todos los tipos</SelectItem>
              <SelectItem value="performance">Rendimiento</SelectItem>
              <SelectItem value="financial">Financiero</SelectItem>
              <SelectItem value="quality">Calidad</SelectItem>
              <SelectItem value="process">Proceso</SelectItem>
              <SelectItem value="other">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[150px]">
          <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>Todos los estados</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[150px]">
          <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>Todas las categorías</SelectItem>
              <SelectItem value="Operaciones">Operaciones</SelectItem>
              <SelectItem value="Financiero">Financiero</SelectItem>
              <SelectItem value="Prevención">Prevención</SelectItem>
              <SelectItem value="Capacitación">Capacitación</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[150px]">
          <Select value={filters.area} onValueChange={(value) => handleFilterChange("area", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Área" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>Todas las áreas</SelectItem>
              <SelectItem value="Dirección">Dirección</SelectItem>
              <SelectItem value="Operaciones">Operaciones</SelectItem>
              <SelectItem value="Administración">Administración</SelectItem>
              <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}