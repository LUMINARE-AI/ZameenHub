import { Star } from "lucide-react";

export default function RatingStars({ rating = 0, className = "" }) {
  const fullStars = Math.round(rating || 0);

  return (
    <div className={`inline-flex items-center gap-0.5 text-amber-500 ${className}`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-3.5 w-3.5 ${
            index < fullStars ? "fill-amber-500 text-amber-500" : "text-amber-500/35"
          }`}
          strokeWidth={2}
        />
      ))}
    </div>
  );
}
