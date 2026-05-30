import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  BarChart3,
  AlertTriangle
} from "lucide-react";

import MenuItemsForm from "../components/menuItemsCom/menuItemsForm";
import FilterPanel from "../components/menuItemsCom/FilterPanel";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { DataTable } from "@/components/data-table/data-table";
import { getMenuItemsColumns } from "../components/menuItemsCom/menuItemsColumns";
import { getMenuItems } from "@/service/menu-items";

function parseMenuItemsResponse(response) {
  if (Array.isArray(response)) {
    return { items: response, total: response.length };
  }
  const payload = response?.data;
  if (Array.isArray(payload?.data)) {
    const meta = payload.meta ?? {};
    return {
      items: payload.data,
      total: meta.total ?? payload.data.length,
      page: meta.page,
      limit: meta.limit,
      totalPages: meta.totalPages,
    };
  }
  if (Array.isArray(payload)) {
    return {
      items: payload,
      total: response.total ?? payload.length,
    };
  }
  return { items: [], total: 0 };
}

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
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const loadMenuItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getMenuItems(page, limit);
      const { items, total: totalItems, totalPages } = parseMenuItemsResponse(response);
      setMenuItems(items);
      setTotalPage(totalPages);
      setTotal(totalItems);
    } catch (e) {
      const mensajeDeError = e?.response?.data?.errorCode ?? "Error al cargar los menu-items";
      setError(mensajeDeError);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  const upsertMenuItem = (updatedItem) => {
    setMenuItems((prev) => {
      const index = prev.findIndex((item) => item.id === updatedItem.id);

      if (index === -1) {
        return [updatedItem, ...prev]
      }

      const next = [...prev];
      next[index] = { ...prev[index], ...updatedItem };
      return next;
    })
  }

  useEffect(() => {
    loadMenuItems();
  }, [loadMenuItems]);

  const showModalUpdate = (indicator) => {
    setShowForm(true);
    setEditingIndicator(indicator);
  }

  const handleSubmit = async () => {
    // TODO: implementar guardado
  };

  const handleEdit = useCallback(() => {
    // TODO: implementar edición
  }, []);

  const handleDelete = useCallback(async () => {
    // TODO: implementar eliminación
  }, []);

  const columns = useMemo(
    () => getMenuItemsColumns(showModalUpdate, handleDelete),
    [showModalUpdate, handleDelete]
  );

  const filteredMenuItems = useMemo(() => {
    const list = Array.isArray(menuItems) ? menuItems : [];

    return list.filter((mi) => {
      const description = mi.descripcion ?? mi.description ?? "";
      const matchesSearch =
        !searchTerm ||
        mi.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = !filters.category || mi.category === filters.category;
      const matchesType = !filters.type || mi.type === filters.type;
      const matchesStatus =
        !filters.status ||
        !mi.status ||
        mi.status === filters.status;
      const matchesArea = !filters.area || mi.area === filters.area;

      return matchesSearch && matchesCategory && matchesType && matchesStatus && matchesArea;
    });
  }, [menuItems, searchTerm, filters]);

  if (loading) {
    return <LoadingSpinner message="Cargando menu-items..." />;
  }

  if (error && menuItems.length === 0) {
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

  const hasFilters = searchTerm || Object.entries(filters).some(
    ([key, value]) => value && !(key === "status" && value === "active")
  );

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
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
                  placeholder="Buscar menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            {/* <FilterPanel filters={filters} onFiltersChange={setFilters} /> */}
          </CardContent>
        </Card>

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

        {filteredMenuItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No se encontraron menu items
              </h3>
              <p className="text-slate-600 mb-4">
                {hasFilters
                  ? "Intente ajustar los filtros de búsqueda"
                  : "Cree su primer menu item para comenzar"}
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Menu-Item
              </Button>
            </CardContent>
          </Card>
        ) : (
          <DataTable
            columns={columns}
            data={filteredMenuItems}
            showModalUpdate={showModalUpdate}
            page={page}
            pageSize={limit}
            total={hasFilters ? filteredMenuItems.length : total}
            onPageChange={hasFilters ? undefined : setPage}
            emptyMessage="No se encontraron menu items"
          />
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <MenuItemsForm
                indicator={editingIndicator}
                upsertMenuItem={upsertMenuItem}
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
