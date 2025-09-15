import React, { useState, useEffect } from "react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, getWeek, getMonth, getQuarter, getYear } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, X, Loader2, Calendar } from "lucide-react";
import { Goal } from "@/api/entities";

// Helper to get period string
const getPeriod = (date, frequency) => {
  const year = getYear(date);
  switch (frequency) {
    case 'daily': return format(date, 'yyyy-MM-dd');
    case 'weekly': return `${year}-W${getWeek(date, { weekStartsOn: 1 })}`;
    case 'monthly': return `${year}-${String(getMonth(date) + 1).padStart(2, '0')}`;
    case 'quarterly': return `${year}-Q${getQuarter(date)}`;
    case 'yearly': return `${year}`;
    default: return `${year}`;
  }
};

const getPeriodDates = (date, frequency) => {
    switch (frequency) {
        case 'daily': return { start: date, end: date };
        case 'weekly': return { start: startOfWeek(date, { weekStartsOn: 1 }), end: endOfWeek(date, { weekStartsOn: 1 }) };
        case 'monthly': return { start: startOfMonth(date), end: endOfMonth(date) };
        case 'quarterly': return { start: startOfQuarter(date), end: endOfQuarter(date) };
        case 'yearly': return { start: startOfYear(date), end: endOfYear(date) };
        default: return { start: date, end: date };
    }
}

export default function GoalForm({ indicator, goal, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    target_value: "",
    period: "",
    start_date: "",
    end_date: "",
    is_cumulative: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [periodDate, setPeriodDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    if (goal) {
      setFormData({
        target_value: goal.target_value || "",
        period: goal.period || "",
        start_date: goal.start_date || "",
        end_date: goal.end_date || "",
        is_cumulative: goal.is_cumulative || false
      });
      setPeriodDate(goal.start_date);
    } else {
      updatePeriodData(new Date());
    }
  }, [goal, indicator]);
  
  const updatePeriodData = (date) => {
      const dates = getPeriodDates(date, indicator.frequency);
      setFormData(prev => ({
          ...prev,
          period: getPeriod(date, indicator.frequency),
          start_date: format(dates.start, 'yyyy-MM-dd'),
          end_date: format(dates.end, 'yyyy-MM-dd')
      }))
  }

  const handleDateChange = (dateString) => {
      const date = new Date(dateString + 'T12:00:00'); // Use midday to avoid timezone issues
      setPeriodDate(dateString);
      updatePeriodData(date);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const value = parseFloat(formData.target_value);
    if (isNaN(value)) {
      setError("El valor objetivo debe ser un número.");
      setIsSubmitting(false);
      return;
    }

    const goalData = {
      indicator_id: indicator.id,
      target_value: value,
      period: formData.period,
      start_date: formData.start_date,
      end_date: formData.end_date,
      is_cumulative: formData.is_cumulative,
      status: 'active'
    };

    try {
      if (goal) {
        await Goal.update(goal.id, goalData);
      } else {
        await Goal.create(goalData);
      }
      onSubmit();
    } catch (err) {
      console.error("Error saving goal:", err);
      setError("No se pudo guardar la meta. Verifique los datos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <CardTitle>{goal ? "Editar Meta" : "Nueva Meta"}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-sm text-slate-700">
                Indicador: <span className="font-semibold text-blue-700">{indicator.name}</span>
            </p>
          
          <div className="space-y-2">
            <Label htmlFor="period_date">Seleccionar Fecha del Período</Label>
            <div className="flex items-center gap-2 p-2 border rounded-md">
                <Calendar className="w-4 h-4 text-slate-500" />
                <Input
                    id="period_date"
                    type="date"
                    value={periodDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="border-0 p-0 h-auto focus-visible:ring-0"
                />
            </div>
            <p className="text-xs text-slate-500">
                Período calculado ({indicator.frequency}): <span className="font-semibold">{formData.period}</span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_value">Valor Objetivo *</Label>
            <Input
              id="target_value"
              type="number"
              step="any"
              value={formData.target_value}
              onChange={(e) => setFormData(p => ({ ...p, target_value: e.target.value }))}
              placeholder={`Ej: ${indicator.execution_grade === 'higher_better' ? '100' : '5'}`}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_cumulative"
              checked={formData.is_cumulative}
              onCheckedChange={(checked) => setFormData(p => ({ ...p, is_cumulative: checked }))}
            />
            <Label htmlFor="is_cumulative">Meta Acumulativa</Label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {goal ? "Actualizar Meta" : "Guardar Meta"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}