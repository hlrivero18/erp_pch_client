import React, { useState, useEffect } from "react";
import { Indicator, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  TrendingUp,
  BarChart3,
  AlertTriangle
} from "lucide-react";

import MenuItemsForm from "../components/menuItemsCom/menuItemsForm";
import MenuItemsCard from "../components/menuItemsCom/menuItemsCard";
import FilterPanel from "../components/menuItemsCom/FilterPanel";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { getMenuItems } from "@/service/menu-items";

export default function MenuItems() {
  const [menuItems, setMenuItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    type: "",
    status: "active",
    area: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await getMenuItems(page, limit)
      if(data.page > 1){
        setPage(page + 1);
      }
      setMenuItems(data?.data)

    } catch (e) {
      setLoading(false)
      if (axios.isAxiosError(e)) {

        const mensajeDeError = e.response?.data?.errorCode ?? `Error al crear ${formData.name}`;

        setError(mensajeDeError);

        toast({
          variant: "destructive",
          title: "Error al crear el menu-item",
          description: mensajeDeError,
          duration: 3000
        })
      }
    }
    
    setLoading(false);
  };

  const handleSubmit = async (indicatorData) => {
    // try {
    //   if (editingIndicator) {
    //     await Indicator.update(editingIndicator.id, indicatorData);
    //   } else {
    //     await Indicator.create(indicatorData);
    //   }
    //   setShowForm(false);
    //   setEditingIndicator(null);
    //   loadMenuItems();
    // } catch (error) {
    //   console.error("Error saving indicator:", error);
    //   setError("Error al guardar el indicador");
    // }
  };

  const handleEdit = (indicator) => {
    // setEditingIndicator(indicator);
    // setShowForm(true);
  };

  const handleDelete = async (indicatorId) => {
    // if (window.confirm("¿Está seguro de eliminar este indicador?")) {
    //   try {
    //     await Indicator.delete(indicatorId);
    //     loadMenuItems();
    //   } catch (error) {
    //     console.error("Error deleting indicator:", error);
    //     setError("Error al eliminar el indicador");
    //   }
    // }
  };

  // const filteredIndicators = menuItems.filter(mi => {
  //   const matchesSearch = mi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        mi.description.toLowerCase().includes(searchTerm.toLowerCase());
    
  //   const matchesCategory = !filters.category || mi.category === filters.category;
  //   const matchesType = !filters.type || mi.type === filters.type;
  //   const matchesStatus = !filters.status || mi.status === filters.status;
  //   const matchesArea = !filters.area || mi.area === filters.area;
    
  //   return matchesSearch && matchesCategory && matchesType && matchesStatus && matchesArea;
  // });

  if (loading) {
    return <LoadingSpinner message="Cargando menu-items..." />;
  }

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="max-w-md mx-auto mt-20">
          <Card className="text-center">
            <CardContent className="p-8">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Error al cargar los menu-items
              </h3>
              <p className="text-slate-600 mb-4">{error}</p>
              <Button onClick={loadMenuItems} className="bg-blue-600 hover:bg-blue-700">
                Reintentar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Menu</h1>
            <p className="text-slate-600 mt-1">
              Gestión y configuración de Menu-Items
            </p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Menu-Item
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="w-5 h-5" />
              Búsqueda y Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar indicadores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            <FilterPanel filters={filters} onFiltersChange={setFilters} />
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Indicators Grid */}
        <div className="grid gap-6">
          {menuItems.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No se encontraron menuItems
                </h3>
                <p className="text-slate-600 mb-4">
                  {searchTerm || Object.values(filters).some(f => f) 
                    ? "Intente ajustar los filtros de búsqueda"
                    : "Cree su primer indicador para comenzar"
                  }
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Menu-Item
                </Button>
              </CardContent>
            </Card>
          ) : (
            menuItems.map((mi) => (
              // <p>{mi.name}</p>
              <MenuItemsCard
                key={mi.id}
                menuItem={mi}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <MenuItemsForm
                indicator={editingIndicator}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingIndicator(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}