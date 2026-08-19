import { NotebookPen, Plus, Pin } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import EmptyState from '../ui/EmptyState'
import SectionCard, { IconButton } from '../ui/SectionCard'

export default function QuickNotes() {
  const { notes, openModal } = useApp()
  const sorted = [...notes].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return String(b.updatedAt).localeCompare(String(a.updatedAt))
  })

  return (
    <SectionCard
      title="Quick notes"
      icon={NotebookPen}
      action={
        <IconButton label="Add note" onClick={() => openModal('note', {})}>
          <Plus size={14} />
        </IconButton>
      }
    >
      {sorted.length === 0 ? (
        <EmptyState
          icon={NotebookPen}
          title="Memory vault is empty"
          body="Codes, addresses, and anything you should not have to remember twice."
        />
      ) : (
        <div className="grid gap-2">
          {sorted.map((note) => (
            <button
              key={note.id}
              type="button"
              onClick={() => openModal('note', { id: note.id })}
              className="rounded-xl border border-line bg-raised/40 p-3 text-left hover:border-gold/40"
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-ink">
                  {note.title}
                </p>
                {note.pinned ? (
                  <Pin size={12} className="shrink-0 text-gold" />
                ) : null}
              </div>
              <p className="line-clamp-3 whitespace-pre-wrap text-xs leading-relaxed text-muted">
                {note.content}
              </p>
            </button>
          ))}
        </div>
      )}
    </SectionCard>
  )
}
