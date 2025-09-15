import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Save } from "lucide-react";

export default function IndicatorForm({ indicator, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(indicator || {
    name: "",
    description: "",
    unit: "units",
    custom_unit: "",
    frequency: "monthly",
    type: "performance",
    execution_grade: "higher_better",
    category: "",
    area: "",
    status: "active",
    tolerance_percentage: 5
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">
            {indicator ? "Editar Indicador" : "Nuevo Indicador"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Indicador *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Ej: Efectividad Operacional"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                placeholder="Ej: Operaciones, Financiero"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Explique el propósito del indicador y cómo se calcula"
              className="h-24"
              required
            />
          </div>

          {/* Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit">Unidad de Medida *</Label>
              <Select value={formData.unit} onValueChange={(value) => handleChange("unit", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione unidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Porcentaje (%)</SelectItem>
                  <SelectItem value="currency">Moneda ($)</SelectItem>
                  <SelectItem value="units">Unidades</SelectItem>
                  <SelectItem value="days">Días</SelectItem>
                  <SelectItem value="hours">Horas</SelectItem>
                  <SelectItem value="custom">Personalizada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.unit === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="custom_unit">Unidad Personalizada</Label>
                <Input
                  id="custom_unit"
                  value={formData.custom_unit}
                  onChange={(e) => handleChange("custom_unit", e.target.value)}
                  placeholder="Ej: casos, reportes"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="frequency">Frecuencia *</Label>
              <Select value={formData.frequency} onValueChange={(value) => handleChange("frequency", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diaria</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensual</SelectItem>
                  <SelectItem value="quarterly">Trimestral</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Indicador *</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="performance">Rendimiento</SelectItem>
                  <SelectItem value="financial">Financiero</SelectItem>
                  <SelectItem value="quality">Calidad</SelectItem>
                  <SelectItem value="process">Proceso</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="execution_grade">Grado de Ejecución *</Label>
              <Select value={formData.execution_grade} onValueChange={(value) => handleChange("execution_grade", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione grado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="higher_better">Valor alto es mejor</SelectItem>
                  <SelectItem value="lower_better">Valor bajo es mejor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">Área/Departamento</Label>
              <Input
                id="area"
                value={formData.area}
                onChange={(e) => handleChange("area", e.target.value)}
                placeholder="Ej: Operaciones, Prevención"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tolerance_percentage">Tolerancia (%)</Label>
              <Input
                id="tolerance_percentage"
                type="number"
                min="0"
                max="100"
                value={formData.tolerance_percentage}
                onChange={(e) => handleChange("tolerance_percentage", parseFloat(e.target.value))}
                placeholder="5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              {indicator ? "Actualizar" : "Crear"} Indicador
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}