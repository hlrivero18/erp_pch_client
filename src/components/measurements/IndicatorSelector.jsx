import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, List } from "lucide-react";

export default function IndicatorSelector({ indicators, selectedIndicatorId, onSelect }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredIndicators = indicators.filter(indicator =>
    indicator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    indicator.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <List className="w-5 h-5" />
          Seleccionar Indicador
        </CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar por nombre o área..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
          {filteredIndicators.map(indicator => (
            <div
              key={indicator.id}
              onClick={() => onSelect(indicator)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                selectedIndicatorId === indicator.id
                  ? "bg-blue-50 border-blue-500 shadow-md"
                  : "bg-slate-50 border-transparent hover:bg-blue-50 hover:border-blue-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-slate-800">{indicator.name}</h4>
                <Badge variant="outline">{indicator.frequency}</Badge>
              </div>
              <p className="text-sm text-slate-600 mt-1">{indicator.area}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}