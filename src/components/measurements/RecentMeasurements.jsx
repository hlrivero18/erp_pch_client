import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function RecentMeasurements({ measurements, indicator }) {
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
          <Clock className="w-5 h-5" />
          Mediciones Recientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Registrado por</TableHead>
                <TableHead>Comentarios</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {measurements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No hay mediciones para este indicador.
                  </TableCell>
                </TableRow>
              ) : (
                measurements.map(m => (
                  <TableRow key={m.id}>
                    <TableCell>
                      {format(new Date(m.measurement_date), "dd MMM yyyy", { locale: es })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{m.period}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {m.value}{getUnitDisplay(indicator.unit, indicator.custom_unit)}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {m.created_by.split('@')[0]}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 max-w-xs truncate">
                      {m.comments}
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