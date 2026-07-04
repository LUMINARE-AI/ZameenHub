export default function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}) {
  const variants = {
    primary:
      "bg-brand text-white shadow-lg shadow-brand/20 hover:bg-brand-dark",
    secondary:
      "bg-white/90 text-brand-ink shadow-lg shadow-slate-200/70 ring-1 ring-brand-light hover:bg-brand-light",
    ghost: "bg-slate-100 text-slate-700 hover:bg-brand-light hover:text-brand-dark",
    dark: "bg-brand-dark text-white hover:bg-brand-ink",
    accent:
      "bg-brand-accent text-brand-dark shadow-lg shadow-brand-accent/25 hover:bg-brand-accent-dark",
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
