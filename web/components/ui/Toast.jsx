export default function Toast({ message, tone = "info", onClose }) {
  if (!message) return null;

  const tones = {
    info: "bg-slate-950 text-white",
    success: "bg-emerald-600 text-white",
    error: "bg-rose-600 text-white",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-3xl px-5 py-4 shadow-2xl shadow-slate-900/20 ${tones[tone]}`}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm leading-6">{message}</p>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 transition hover:text-white"
            aria-label="Close notification"
          >
            ×
          </button>
        ) : null}
      </div>
    </div>
  );
}
