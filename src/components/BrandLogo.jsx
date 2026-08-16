export default function BrandLogo({ className = "h-11 w-auto", alt = "Asli Patta" }) {
  return (
    <img
      src="/logo.png"
      alt={alt}
      className={`object-contain ${className}`}
    />
  );
}
