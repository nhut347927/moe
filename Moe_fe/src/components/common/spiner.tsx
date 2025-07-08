export default function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-t-transparent border-gray-500 w-6 h-6 ${className}`}
      role="status"
      aria-label="Loading spinner"
    />
  );
}
