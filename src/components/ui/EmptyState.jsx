export default function EmptyState({ icon: Icon, title, body, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line px-4 py-8 text-center">
      {Icon ? (
        <Icon className="mb-2 text-muted" size={22} strokeWidth={1.5} />
      ) : null}
      <p className="text-sm font-medium text-ink">{title}</p>
      {body ? <p className="mt-1 max-w-[220px] text-xs text-muted">{body}</p> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  )
}
