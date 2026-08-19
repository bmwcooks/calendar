export default function SectionCard({
  title,
  icon: Icon,
  action,
  children,
  className = '',
}) {
  return (
    <section
      className={`rounded-2xl border border-line bg-panel p-4 ${className}`}
    >
      <header className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {Icon ? (
            <Icon size={16} className="text-gold" strokeWidth={1.75} />
          ) : null}
          <h3 className="text-[13px] font-medium uppercase tracking-[0.16em] text-muted">
            {title}
          </h3>
        </div>
        {action}
      </header>
      {children}
    </section>
  )
}

export function IconButton({ label, onClick, children, active = false }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`rounded-lg p-1.5 transition ${
        active
          ? 'bg-gold/15 text-gold'
          : 'text-muted hover:bg-raised hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}
