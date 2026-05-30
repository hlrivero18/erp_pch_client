import { StatusBadge } from "@/components/data-table/cells/status-badge";
import { StackedText } from "@/components/data-table/cells/stacked-text";
import { TypeBadge } from "@/components/data-table/cells/type-badge";
import { CurrencyCell } from "@/components/data-table/cells/currency-cell";
import { ActionsCell } from "@/components/data-table/cells/actions-cell";

const TYPE_LABELS = {
  performance: "Rendimiento",
  financial: "Financiero",
  quality: "Calidad",
  process: "Proceso",
  other: "Otro",
};

function getDescription(item) {
  return item.descripcion ?? item.description ?? "";
}

export function getMenuItemsColumns(showModalUpdate, onDelete) {
  return [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => (
        <span className="font-semibold text-slate-900">{row.getValue("name")}</span>
      ),
    },
    {
      id: "description",
      header: "Descripción",
      cell: ({ row }) => (
        <span className="max-w-xs text-slate-600 line-clamp-2">
          {getDescription(row.original) || "—"}
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: "Precio",
      cell: ({ row }) => <CurrencyCell value={row.getValue("price")} />,
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.original?.isAvailable;
        const isActive = status
        return <StatusBadge active={isActive} />;
      },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Acciones</span>,
      cell: ({ row }) => (
        <ActionsCell
          onEdit={() => showModalUpdate(row.original)}
          // onDelete={() => onDelete?.(row.original.id)}
        />
      ),
    },
  ];
}
