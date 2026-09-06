export function Spinner({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`sl-spinner inline-block shrink-0 rounded-full ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
