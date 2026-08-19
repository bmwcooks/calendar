export default function ProgressBar({ value, color = 'gold' }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0))
  const tones = {
    gold: 'bg-gold',
    terracotta: 'bg-terracotta',
    sage: 'bg-sage',
    sea: 'bg-sea',
    rose: 'bg-rose',
  }
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
      <div
        className={`h-full rounded-full transition-all duration-500 ${tones[color] || tones.gold}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
