export function CurrencyCell({ value, currency = "$", fallback = "—" }) {
  if (value == null || value === "") {
    return <span className="text-slate-400">{fallback}</span>;
  }

  const amount = Number(value);
  const formatted = Number.isNaN(amount)
    ? value
    : amount.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return <span className="font-semibold text-slate-900">{currency}{formatted}</span>;
}
