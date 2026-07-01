export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/15 ${className}`}
      {...props}
    />
  );
}
