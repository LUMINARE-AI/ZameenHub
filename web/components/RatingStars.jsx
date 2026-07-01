export default function RatingStars({ rating = 0, className = "" }) {
  const fullStars = Math.round(rating || 0);
  return (
    <div className={`inline-flex items-center gap-1 text-amber-500 ${className}`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={index < fullStars ? "opacity-100" : "opacity-40"}>
          ★
        </span>
      ))}
    </div>
  );
}
