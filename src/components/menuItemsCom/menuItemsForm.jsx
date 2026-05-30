import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Save } from "lucide-react";
import { createMenuItem, updateMenuItem } from "@/service/menu-items";
import { useToast } from "../ui/use-toast";

function toSelectAvailability(value) {
  if (value === true || value === "activo") return "activo";
  if (value === false || value === "inactivo") return "inactivo";
  return undefined; // vacío → muestra placeholder
}

export default function MenuItemsForm({ indicator, onSubmit, onCancel, upsertMenuItem }) {

  const getInitialFormData = (indicator) => {
    if (indicator) {
      return {
        id: indicator.id ?? "",
        name: indicator.name ?? "",
        description: indicator.description ?? indicator.descripcion ?? "",
        price: indicator.price ?? "",
        isAvailable: toSelectAvailability(indicator.isAvailable),
      };
    }
    return {
      id: "",
      name: "",
      description: "",
      price: "",
      isAvailable: toSelectAvailability(true),
    };
  };

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(() => getInitialFormData(indicator));

  const resetState = () => {
    setFormData(getInitialFormData(null));
  };

  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const { data } = indicator ? await updateMenuItem(formData) : await createMenuItem(formData)
      upsertMenuItem({
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
        isAvailable: data.isAvailable
      })
      setIsLoading(false)
      onCancel()
      resetState()
      toast({
        variant: "success",
        title: indicator ? `Menu-item ${data.name} actualizado con exito` : `Menu-item ${data.name} creado con exito`,
        description: `Se registro el menu-item ${formData.name}`,
        duration: 5000
      })

    } catch (e) {
      setIsLoading(false)
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

  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">
            {indicator ? "Editar Menu-item" : "Nuevo Menu-Item"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Menu-item *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Ej: Pabellón"
                required
              />
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                placeholder="Ej: Operaciones, Financiero"
              />
            </div> */}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Breve descripción del menu-item"
              className="h-24"
            />
          </div>
          {/* Configuration */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.unit === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="custom_unit">Unidad Personalizada</Label>
                <Input
                  id="custom_unit"
                  value={formData.custom_unit}
                  onChange={(e) => handleChange("custom_unit", e.target.value)}
                  placeholder="Ej: casos, reportes"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="frequency">Frecuencia *</Label>
              <Select value={formData.frequency} onValueChange={(value) => handleChange("frequency", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diaria</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensual</SelectItem>
                  <SelectItem value="quarterly">Trimestral</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div> */}

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Indicador *</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="performance">Rendimiento</SelectItem>
                  <SelectItem value="financial">Financiero</SelectItem>
                  <SelectItem value="quality">Calidad</SelectItem>
                  <SelectItem value="process">Proceso</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="execution_grade">Grado de Ejecución *</Label>
              <Select value={formData.execution_grade} onValueChange={(value) => handleChange("execution_grade", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione grado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="higher_better">Valor alto es mejor</SelectItem>
                  <SelectItem value="lower_better">Valor bajo es mejor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label htmlFor="price">Precio (ARG)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange("price", parseFloat(e.target.value))}
                placeholder="Ejem. 23000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="isAvailable">Estado</Label>
              <Select value={formData.isAvailable} onValueChange={(value) => handleChange("isAvailable", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>



          {/* <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600">
              <Save className="w-4 h-4 mr-2" />
              {indicator ? "Actualizar" : "Crear"} menu-item
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}