export default function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}) {
  const variants = {
    primary:
      "bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700",
    secondary:
      "bg-white/90 text-slate-900 shadow-lg shadow-slate-200/70 ring-1 ring-white/70 hover:bg-white",
    ghost:
      "bg-slate-100 text-slate-700 hover:bg-slate-200",
    dark: "bg-slate-950 text-white hover:bg-slate-800",
  };

  return (
    <button
      type={type}
      className={`inline-flex min-h-10 items-center justify-center rounded-full px-4 py-2.5 text-sm font-bold transition duration-200 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
