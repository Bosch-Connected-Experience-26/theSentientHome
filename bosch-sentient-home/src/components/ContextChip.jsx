export default function ContextChip({ children, tone = 'blue' }) {
  const tones = {
    blue: 'bg-sky-50 text-sky-700 border-sky-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    red: 'bg-red-50 text-red-700 border-red-100',
    dark: 'bg-white/10 text-white border-white/15'
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold ${tones[tone]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current pulse-dot" />
      {children}
    </span>
  );
}
