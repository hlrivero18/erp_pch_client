import { Badge } from "@/components/ui/badge";

export function TypeBadge({ label, fallback = "—" }) {
  if (!label) {
    return <span className="text-slate-400">{fallback}</span>;
  }

  return (
    <Badge variant="secondary" className="font-normal">
      {label}
    </Badge>
  );
}
