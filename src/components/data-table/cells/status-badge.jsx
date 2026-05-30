import { cn } from "@/lib/utils";

export function StatusBadge({ active, activeLabel = "Activo", inactiveLabel = "Inactivo" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        active ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          active ? "bg-green-500" : "bg-slate-400"
        )}
      />
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}
