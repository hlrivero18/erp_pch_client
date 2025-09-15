import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Calendar } from "lucide-react";

export default function ReportFilters({ indicators, filters, onFiltersChange }) {
  const categories = [...new Set(indicators.map(i => i.category).filter(Boolean))];
  const areas = [...new Set(indicators.map(i => i.area).filter(Boolean))];

  const handleIndicatorToggle = (indicatorId, checked) => {
    const newSelected = checked 
      ? [...filters.selectedIndicators, indicatorId]
      : filters.selectedIndicators.filter(id => id !== indicatorId);
    
    onFiltersChange(prev => ({
      ...prev,
      selectedIndicators: newSelected
    }));
  };

  const handleSelectAll = (checked) => {
    onFiltersChange(prev => ({
      ...prev,
      selectedIndicators: checked ? indicators.map(i => i.id) : []
    }));
  };

  const handleDateChange = (field, value) => {
    onFiltersChange(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value
      }
    }));
  };

  const handleCategoryToggle = (category, checked) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    onFiltersChange(prev => ({
      ...prev,
      categories: newCategories
    }));
  };

  const handleAreaToggle = (area, checked) => {
    const newAreas = checked
      ? [...filters.areas, area]
      : filters.areas.filter(a => a !== area);
    
    onFiltersChange(prev => ({
      ...prev,
      areas: newAreas
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Período
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="start_date">Fecha Inicio</Label>
            <Input
              id="start_date"
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleDateChange('start', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">Fecha Fin</Label>
            <Input
              id="end_date"
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleDateChange('end', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Tipo de Reporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            value={filters.reportType} 
            onValueChange={(value) => onFiltersChange(prev => ({...prev, reportType: value}))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summary">Resumen Ejecutivo</SelectItem>
              <SelectItem value="detailed">Análisis Detallado</SelectItem>
              <SelectItem value="comparative">Comparativo</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Indicadores</CardTitle>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select_all"
              checked={filters.selectedIndicators.length === indicators.length}
              onCheckedChange={handleSelectAll}
            />
            <Label htmlFor="select_all" className="text-sm">Seleccionar todos</Label>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {indicators.map(indicator => (
              <div key={indicator.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`indicator_${indicator.id}`}
                  checked={filters.selectedIndicators.includes(indicator.id)}
                  onCheckedChange={(checked) => handleIndicatorToggle(indicator.id, checked)}
                />
                <Label htmlFor={`indicator_${indicator.id}`} className="text-sm flex-1">
                  {indicator.name}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Categorías</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categories.map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category_${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={(checked) => handleCategoryToggle(category, checked)}
                  />
                  <Label htmlFor={`category_${category}`} className="text-sm">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {areas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Áreas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {areas.map(area => (
                <div key={area} className="flex items-center space-x-2">
                  <Checkbox
                    id={`area_${area}`}
                    checked={filters.areas.includes(area)}
                    onCheckedChange={(checked) => handleAreaToggle(area, checked)}
                  />
                  <Label htmlFor={`area_${area}`} className="text-sm">
                    {area}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}