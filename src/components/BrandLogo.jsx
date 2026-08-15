export default function BrandLogo({ className = "h-11 w-11", alt = "Asli Patta" }) {
  return (
    <img
      src="/logo.jpeg"
      alt={alt}
      className={`object-contain ${className}`}
    />
  );
}
