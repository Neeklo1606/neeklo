export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[40vh] w-full items-center justify-center" role="status" aria-live="polite" aria-label={label}>
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
