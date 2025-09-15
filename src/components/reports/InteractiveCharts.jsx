import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BarChart3, PieChart as PieIcon, Activity } from "lucide-react";

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

export default function InteractiveCharts({ reportData }) {
  const { processed } = reportData;

  // Prepare data for different chart types
  const prepareBarChartData = () => {
    return processed.summary.map(item => ({
      name: item.indicator.name.substring(0, 20) + (item.indicator.name.length > 20 ? '...' : ''),
      valor: item.latestValue,
      meta: item.goalValue || 0,
      promedio: item.averageValue,
      area: item.indicator.area
    }));
  };

  const prepareTrendData = () => {
    // Create trend data by indicator over time (using dummy data for demonstration)
    return processed.summary.slice(0, 5).map((item, index) => ({
      indicador: item.indicator.name.substring(0, 15) + '...',
      enero: item.latestValue * (0.8 + Math.random() * 0.4),
      febrero: item.latestValue * (0.85 + Math.random() * 0.3),
      marzo: item.latestValue * (0.9 + Math.random() * 0.2),
      abril: item.latestValue,
    }));
  };

  const preparePieChartData = () => {
    const areaData = {};
    processed.summary.forEach(item => {
      const area = item.indicator.area || 'Sin área';
      areaData[area] = (areaData[area] || 0) + 1;
    });

    return Object.entries(areaData).map(([area, count]) => ({
      name: area,
      value: count,
      percentage: ((count / processed.summary.length) * 100).toFixed(1)
    }));
  };

  const preparePerformanceData = () => {
    return processed.summary.map(item => {
      const variance = item.variance || 0;
      return {
        name: item.indicator.name.substring(0, 15) + '...',
        cumplimiento: Math.max(0, Math.min(150, 100 + variance)),
        categoria: item.indicator.category || 'General'
      };
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Performance Comparison Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Comparación de Indicadores: Valor Actual vs Meta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prepareBarChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  fontSize={12}
                  stroke="#64748B"
                />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="valor" fill="#3B82F6" name="Valor Actual" radius={[2, 2, 0, 0]} />
                <Bar dataKey="meta" fill="#10B981" name="Meta" radius={[2, 2, 0, 0]} />
                <Bar dataKey="promedio" fill="#F59E0B" name="Promedio" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Trend Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Evolución Temporal de Indicadores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prepareTrendData()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="indicador" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="enero" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="febrero" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="marzo" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="abril" stroke="#EF4444" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Area Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-purple-600" />
              Distribución por Área
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={preparePieChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {preparePieChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance Area Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Nivel de Cumplimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={preparePerformanceData()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                  <YAxis stroke="#64748B" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="cumplimiento" 
                    stroke="#6366F1" 
                    fill="#6366F1" 
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold">
              {processed.summary.filter(item => (item.variance || 0) > 0).length}
            </div>
            <div className="text-blue-100 text-sm mt-1">Indicadores Sobre Meta</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold">
              {processed.summary.filter(item => Math.abs(item.variance || 0) <= 5).length}
            </div>
            <div className="text-green-100 text-sm mt-1">En Rango de Meta</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold">
              {processed.summary.filter(item => (item.variance || 0) < -5 && (item.variance || 0) > -15).length}
            </div>
            <div className="text-yellow-100 text-sm mt-1">Requieren Atención</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold">
              {processed.summary.filter(item => (item.variance || 0) <= -15).length}
            </div>
            <div className="text-red-100 text-sm mt-1">Críticos</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}