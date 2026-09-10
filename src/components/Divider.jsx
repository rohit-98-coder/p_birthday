export default function Divider() {
  return (
    <div className="flex items-center gap-3 max-w-[280px] mx-auto opacity-70">
      <span className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--color-rose-soft)] to-transparent" />
      <span className="text-[var(--color-rose)] text-sm">✦</span>
      <span className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--color-rose-soft)] to-transparent" />
    </div>
  );
}
