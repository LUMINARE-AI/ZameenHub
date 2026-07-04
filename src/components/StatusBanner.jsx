export default function StatusBanner({ tone = "info", message }) {
  if (!message) {
    return null;
  }

  const tones = {
    info: "border-brand/20 bg-brand-light text-brand-dark",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    error: "border-rose-200 bg-rose-50 text-rose-700",
  };

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${tones[tone]}`}>{message}</div>
  );
}
