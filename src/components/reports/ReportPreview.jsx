import React, { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Calendar,
  FileText,
  Activity
} from "lucide-react";

import InteractiveCharts from "./InteractiveCharts";

export default function ReportPreview({ reportData }) {
  const { processed, filters, generatedAt } = reportData;

  const getUnitDisplay = (unit, customUnit) => {
    switch (unit) {
      case "percentage": return "%";
      case "currency": return "$";
      default: return "";
    }
  };

  const getVarianceIcon = (variance) => {
    if (!variance) return null;
    return variance > 0 ? TrendingUp : TrendingDown;
  };

  const getVarianceColor = (variance) => {
    if (!variance) return "text-slate-500";
    return variance > 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Reporte de Indicadores SEDRONAR
          </CardTitle>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                Período: {format(new Date(filters.dateRange.start), 'dd MMM yyyy', { locale: es })} - {format(new Date(filters.dateRange.end), 'dd MMM yyyy', { locale: es })}
              </span>
            </div>
            <div>
              Generado: {format(generatedAt, 'dd MMM yyyy HH:mm', { locale: es })}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">{processed.totalIndicators}</div>
              <div className="text-sm text-blue-700">Indicadores</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">{processed.totalMeasurements}</div>
              <div className="text-sm text-green-700">Mediciones</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-900">
                {Math.ceil((new Date(filters.dateRange.end) - new Date(filters.dateRange.start)) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-sm text-purple-700">Días Analizados</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Different Views */}
      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Gráficos Interactivos
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Vista Tabular
          </TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-6">
          <InteractiveCharts reportData={reportData} />
        </TabsContent>

        <TabsContent value="table" className="space-y-6">
          {/* Summary Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumen de Indicadores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Indicador</TableHead>
                      <TableHead>Área</TableHead>
                      <TableHead>Valor Actual</TableHead>
                      <TableHead>Promedio</TableHead>
                      <TableHead>Meta</TableHead>
                      <TableHead>Variación</TableHead>
                      <TableHead>Mediciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processed.summary.map((item, index) => {
                      const VarianceIcon = getVarianceIcon(item.variance);
                      
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <div>
                              <div className="font-medium text-slate-900">
                                {item.indicator.name}
                              </div>
                              <Badge variant="outline" className="text-xs mt-1">
                                {item.indicator.category}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {item.indicator.area}
                          </TableCell>
                          <TableCell className="font-semibold">
                            {item.latestValue.toFixed(2)}{getUnitDisplay(item.indicator.unit, item.indicator.custom_unit)}
                            {item.latestDate && (
                              <div className="text-xs text-slate-500">
                                {format(new Date(item.latestDate), 'dd MMM', { locale: es })}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {item.averageValue.toFixed(2)}{getUnitDisplay(item.indicator.unit, item.indicator.custom_unit)}
                          </TableCell>
                          <TableCell>
                            {item.goalValue 
                              ? `${item.goalValue}${getUnitDisplay(item.indicator.unit, item.indicator.custom_unit)}`
                              : "Sin meta"
                            }
                          </TableCell>
                          <TableCell>
                            {item.variance ? (
                              <div className={`flex items-center gap-1 ${getVarianceColor(item.variance)}`}>
                                {VarianceIcon && <VarianceIcon className="w-4 h-4" />}
                                <span className="font-medium">
                                  {item.variance > 0 ? '+' : ''}{item.variance.toFixed(1)}%
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {item.measurementCount}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis (if detailed report type) */}
          {filters.reportType === 'detailed' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Análisis Detallado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {processed.summary.map((item, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold text-slate-900 mb-2">
                        {item.indicator.name}
                      </h4>
                      <p className="text-sm text-slate-600 mb-3">
                        {item.indicator.description}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Frecuencia:</span>
                          <div className="font-medium">{item.indicator.frequency}</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Tipo:</span>
                          <div className="font-medium">{item.indicator.type}</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Unidad:</span>
                          <div className="font-medium">{item.indicator.unit}</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Tolerancia:</span>
                          <div className="font-medium">±{item.indicator.tolerance_percentage || 5}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}