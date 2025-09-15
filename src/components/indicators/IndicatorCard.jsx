import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  Trash2, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Clock,
  Target
} from "lucide-react";

export default function IndicatorCard({ indicator, onEdit, onDelete }) {
  const getUnitDisplay = (unit, customUnit) => {
    switch (unit) {
      case "percentage": return "%";
      case "currency": return "$";
      case "units": return "unidades";
      case "days": return "días";
      case "hours": return "horas";
      case "custom": return customUnit || "personalizada";
      default: return unit;
    }
  };

  const getFrequencyDisplay = (frequency) => {
    switch (frequency) {
      case "daily": return "Diaria";
      case "weekly": return "Semanal";
      case "monthly": return "Mensual";
      case "quarterly": return "Trimestral";
      case "yearly": return "Anual";
      default: return frequency;
    }
  };

  const getTypeDisplay = (type) => {
    switch (type) {
      case "performance": return "Rendimiento";
      case "financial": return "Financiero";
      case "quality": return "Calidad";
      case "process": return "Proceso";
      case "other": return "Otro";
      default: return type;
    }
  };

  const getExecutionGradeIcon = (grade) => {
    return grade === "higher_better" ? TrendingUp : TrendingDown;
  };

  const ExecutionIcon = getExecutionGradeIcon(indicator.execution_grade);

  return (
    <Card className="hover:shadow-lg transition-all duration-300 bg-white/70 backdrop-blur-sm border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-slate-900">
                {indicator.name}
              </h3>
              <Badge 
                variant={indicator.status === "active" ? "default" : "secondary"}
                className={indicator.status === "active" ? "bg-green-100 text-green-800" : ""}
              >
                {indicator.status === "active" ? "Activo" : "Inactivo"}
              </Badge>
            </div>
            <p className="text-sm text-slate-600 line-clamp-2">
              {indicator.description}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(indicator)}
              className="hover:bg-blue-50 hover:text-blue-600"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(indicator.id)}
              className="hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-slate-500" />
            <div>
              <p className="text-xs text-slate-500">Unidad</p>
              <p className="text-sm font-medium">
                {getUnitDisplay(indicator.unit, indicator.custom_unit)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <div>
              <p className="text-xs text-slate-500">Frecuencia</p>
              <p className="text-sm font-medium">
                {getFrequencyDisplay(indicator.frequency)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-slate-500" />
            <div>
              <p className="text-xs text-slate-500">Tipo</p>
              <p className="text-sm font-medium">
                {getTypeDisplay(indicator.type)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ExecutionIcon className="w-4 h-4 text-slate-500" />
            <div>
              <p className="text-xs text-slate-500">Ejecución</p>
              <p className="text-sm font-medium">
                {indicator.execution_grade === "higher_better" ? "↑ Mejor" : "↓ Mejor"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-slate-200">
          <div className="flex gap-2">
            {indicator.category && (
              <Badge variant="outline" className="text-xs">
                {indicator.category}
              </Badge>
            )}
            {indicator.area && (
              <Badge variant="outline" className="text-xs">
                {indicator.area}
              </Badge>
            )}
          </div>
          
          {indicator.tolerance_percentage && (
            <div className="text-xs text-slate-500">
              Tolerancia: ±{indicator.tolerance_percentage}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}