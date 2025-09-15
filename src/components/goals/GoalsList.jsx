import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, Edit, Trash2, CheckCircle, Repeat } from "lucide-react";

export default function GoalsList({ goals, indicator, onEdit, onDelete }) {
  const getUnitDisplay = (unit, customUnit) => {
    switch (unit) {
      case "percentage": return "%";
      case "currency": return "$";
      default: return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="w-5 h-5 text-slate-700" />
          Metas para: <span className="text-blue-700">{indicator.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Período</TableHead>
                <TableHead>Valor Objetivo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {goals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No hay metas definidas para este indicador.
                  </TableCell>
                </TableRow>
              ) : (
                goals.map(goal => (
                  <TableRow key={goal.id}>
                    <TableCell>
                      <Badge variant="secondary">{goal.period}</Badge>
                      <p className="text-xs text-slate-500 mt-1">
                        {format(new Date(goal.start_date + 'T12:00:00'), 'dd MMM yyyy', { locale: es })} - {format(new Date(goal.end_date + 'T12:00:00'), 'dd MMM yyyy', { locale: es })}
                      </p>
                    </TableCell>
                    <TableCell className="font-semibold text-lg text-slate-800">
                      {goal.target_value}{getUnitDisplay(indicator.unit, indicator.custom_unit)}
                    </TableCell>
                    <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1">
                            {goal.is_cumulative ? <Repeat className="w-3 h-3"/> : <CheckCircle className="w-3 h-3"/>}
                            {goal.is_cumulative ? 'Acumulativa' : 'Normal'}
                        </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={goal.status === 'active' ? "bg-green-100 text-green-800" : ""}>
                        {goal.status === 'active' ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(goal)} className="hover:text-blue-600">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(goal.id)} className="hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}