import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

export function ActionsCell({ onEdit, onDelete, editLabel = "Editar", deleteLabel = "Eliminar" }) {
  return (
    <div className="flex justify-end gap-1">
      {onEdit && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
          aria-label={editLabel}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
          aria-label={deleteLabel}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
