export function StackedText({ primary, secondary, fallback = "—" }) {
  if (!primary && !secondary) {
    return <span className="text-slate-400">{fallback}</span>;
  }

  return (
    <div>
      <div className="font-medium text-slate-900">{primary || fallback}</div>
      {secondary && <div className="text-xs text-slate-500">{secondary}</div>}
    </div>
  );
}
