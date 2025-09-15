import React, { useState } from "react";
import { format, getWeek, getMonth, getQuarter, getYear, subDays, subWeeks, subMonths, subQuarters, subYears, /*startOfPeriod, endOfPeriod*/ } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, FileText, Loader2 } from "lucide-react";
import { Measurement } from "@/api/entities";

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

export default function MeasurementForm({ indicator, goals, allMeasurements, onMeasurementAdded }) {
  const [formData, setFormData] = useState({
    value: "",
    measurement_date: format(new Date(), 'yyyy-MM-dd'),
    comments: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const value = parseFloat(formData.value);
    if (isNaN(value)) {
      setError("El valor debe ser un número.");
      setIsSubmitting(false);
      return;
    }

    const measurementDate = new Date(formData.measurement_date);
    const period = getPeriod(measurementDate, indicator.frequency);

    // Find goal for the period
    const currentGoal = goals.find(g => g.indicator_id === indicator.id && g.period === period);
    
    // Find previous period measurement
    let prevPeriodDate;
    if (indicator.frequency === 'daily') prevPeriodDate = subDays(measurementDate, 1);
    else if (indicator.frequency === 'weekly') prevPeriodDate = subWeeks(measurementDate, 1);
    else if (indicator.frequency === 'monthly') prevPeriodDate = subMonths(measurementDate, 1);
    else if (indicator.frequency === 'quarterly') prevPeriodDate = subQuarters(measurementDate, 1);
    else if (indicator.frequency === 'yearly') prevPeriodDate = subYears(measurementDate, 1);
    const prevPeriod = getPeriod(prevPeriodDate, indicator.frequency);
    const prevMeasurement = allMeasurements.find(m => m.indicator_id === indicator.id && m.period === prevPeriod);
    
    // Find same period last year measurement
    const yearAgoDate = subYears(measurementDate, 1);
    const yearAgoPeriod = getPeriod(yearAgoDate, indicator.frequency);
    const yearAgoMeasurement = allMeasurements.find(m => m.indicator_id === indicator.id && m.period === yearAgoPeriod);

    // Calculate variances
    let variance_vs_goal = null;
    if (currentGoal?.target_value) {
        variance_vs_goal = ((value - currentGoal.target_value) / currentGoal.target_value) * 100;
        if(indicator.execution_grade === 'lower_better') variance_vs_goal *= -1;
    }
    
    let variance_vs_previous = null;
    if (prevMeasurement?.value) {
        variance_vs_previous = ((value - prevMeasurement.value) / prevMeasurement.value) * 100;
    }
    
    let variance_vs_year_ago = null;
    if (yearAgoMeasurement?.value) {
        variance_vs_year_ago = ((value - yearAgoMeasurement.value) / yearAgoMeasurement.value) * 100;
    }
    
    const measurementData = {
      indicator_id: indicator.id,
      value,
      measurement_date: formData.measurement_date,
      comments: formData.comments,
      period,
      variance_vs_goal: variance_vs_goal ? parseFloat(variance_vs_goal.toFixed(2)) : null,
      variance_vs_previous: variance_vs_previous ? parseFloat(variance_vs_previous.toFixed(2)) : null,
      variance_vs_year_ago: variance_vs_year_ago ? parseFloat(variance_vs_year_ago.toFixed(2)) : null,
    };

    try {
      await Measurement.create(measurementData);
      setFormData({ value: "", measurement_date: format(new Date(), 'yyyy-MM-dd'), comments: "" });
      onMeasurementAdded();
    } catch (err) {
      console.error("Error creating measurement:", err);
      setError("No se pudo guardar la medición.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span>Registrar Medición para: <span className="text-blue-700">{indicator.name}</span></span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value">Valor *</Label>
              <Input
                id="value"
                type="number"
                step="any"
                value={formData.value}
                onChange={(e) => handleChange("value", e.target.value)}
                placeholder={`Ej: ${indicator.unit === 'percentage' ? '85.5' : '1200'}`}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="measurement_date">Fecha de Medición *</Label>
              <Input
                id="measurement_date"
                type="date"
                value={formData.measurement_date}
                onChange={(e) => handleChange("measurement_date", e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="comments">Comentarios</Label>
            <Textarea
              id="comments"
              value={formData.comments}
              onChange={(e) => handleChange("comments", e.target.value)}
              placeholder="Añada notas o comentarios relevantes sobre esta medición..."
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Medición
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}