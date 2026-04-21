import Button from "./ui/Button";
import Input from "./ui/Input";

export default function HeroSearch({ filters, onChange, onSearch }) {
  return (
    <div className="rounded-[32px] border border-white/70 bg-white/95 p-4 shadow-[0_24px_70px_-30px_rgba(15,23,42,0.35)] backdrop-blur xl:p-5">
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
        <Input
          value={filters.location}
          onChange={(event) => onChange("location", event.target.value)}
          placeholder="Search city, locality, or landmark"
        />
        <select
          value={filters.maxPrice}
          onChange={(event) => onChange("maxPrice", Number(event.target.value))}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        >
          <option value={50000000}>Any budget</option>
          <option value={10000000}>Up to ₹1 Cr</option>
          <option value={20000000}>Up to ₹2 Cr</option>
          <option value={30000000}>Up to ₹3 Cr</option>
          <option value={50000000}>Up to ₹5 Cr</option>
        </select>
        <select
          value={filters.type}
          onChange={(event) => onChange("type", event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        >
          <option value="">Any property type</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Townhouse">Townhouse</option>
        </select>
        <Button onClick={onSearch} className="h-full min-w-[140px]">
          Search
        </Button>
      </div>
    </div>
  );
}
