import React from "react";
import { BarChart3 } from "lucide-react";

export default function LoadingSpinner({ message = "Cargando..." }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 font-medium">{message}</p>
      </div>
    </div>
  );
}