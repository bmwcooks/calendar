import { Star, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import TopPriorities from '../priorities/TopPriorities'

export default function PriorityDrawer() {
  const { prioritiesOpen, dispatch } = useApp()
  if (!prioritiesOpen) return null

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label="Close priorities"
        onClick={() => dispatch({ type: 'SET_PRIORITIES', open: false })}
      />
      <aside className="relative flex h-full w-full max-w-md flex-col border-l border-line bg-panel shadow-2xl">
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-gold" fill="currentColor" />
            <h2 className="font-display text-xl">Top priorities</h2>
          </div>
          <button
            type="button"
            className="rounded-full p-1.5 text-muted hover:bg-raised"
            onClick={() => dispatch({ type: 'SET_PRIORITIES', open: false })}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-4">
          <p className="mb-4 text-sm text-muted">
            Starred work from every view — tasks, time blocks, and goals —
            collected in one place.
          </p>
          <TopPriorities compact />
        </div>
      </aside>
    </div>
  )
}
