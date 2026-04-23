import { BUY_CATEGORIES, RENT_CATEGORIES } from "../utils/property";
import Button from "./ui/Button";
import Input from "./ui/Input";

export default function HeroSearch({ filters, onChange, onSearch }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_22px_70px_-38px_rgba(15,23,42,0.5)]">
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
        <Input
          value={filters.location}
          onChange={(event) => onChange("location", event.target.value)}
          placeholder="Search by city, locality, plot society"
        />
        <select
          value={filters.category}
          onChange={(event) => onChange("category", event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        >
          <option value="">All categories</option>
          <optgroup label="Buy">
            {BUY_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </optgroup>
          <optgroup label="Rent">
            {RENT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </optgroup>
        </select>
        <select
          value={filters.maxPrice}
          onChange={(event) => onChange("maxPrice", Number(event.target.value))}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        >
          <option value={50000000}>Any budget</option>
          <option value={2500000}>Up to INR 25 Lac</option>
          <option value={5000000}>Up to INR 50 Lac</option>
          <option value={10000000}>Up to INR 1 Cr</option>
          <option value={50000000}>Up to INR 5 Cr</option>
        </select>
        <Button onClick={onSearch} className="h-full min-w-[140px]">
          Search
        </Button>
      </div>
    </div>
  );
}
