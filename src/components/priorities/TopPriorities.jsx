import { Check, Star } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import ProgressBar from '../ui/ProgressBar'
import EmptyState from '../ui/EmptyState'
import SectionCard, { IconButton } from '../ui/SectionCard'

export default function TopPriorities({ compact = false }) {
  const { events, tasks, goals, patchItem, openModal } = useApp()

  const items = [
    ...tasks
      .filter((t) => t.priority)
      .map((t) => ({
        kind: 'task',
        id: t.id,
        title: t.title,
        done: t.completed,
        meta: t.date,
      })),
    ...events
      .filter((e) => e.priority)
      .map((e) => ({
        kind: 'event',
        id: e.id,
        title: e.title,
        done: Boolean(e.completed),
        meta: e.date,
      })),
    ...goals
      .filter((g) => g.priority)
      .map((g) => ({
        kind: 'goal',
        id: g.id,
        title: g.title,
        done: g.completed,
        progress: g.progress,
        meta: g.targetDate,
      })),
  ]

  const open = (item) => {
    if (item.kind === 'task') openModal('task', { id: item.id })
    if (item.kind === 'event') openModal('event', { id: item.id })
    if (item.kind === 'goal') openModal('goal', { id: item.id })
  }

  const toggle = (item) => {
    if (item.kind === 'task') {
      patchItem('tasks', item.id, { completed: !item.done })
    } else if (item.kind === 'event') {
      patchItem('events', item.id, { completed: !item.done })
    } else {
      patchItem('goals', item.id, {
        completed: !item.done,
        progress: item.done ? item.progress : 100,
      })
    }
  }

  const list = (
    <ul className="space-y-2">
      {items.length === 0 ? (
        <EmptyState
          icon={Star}
          title="Nothing starred yet"
          body="Flag a task, time block, or goal as high priority and it will live here."
        />
      ) : (
        items.map((item) => (
          <li
            key={`${item.kind}-${item.id}`}
            className="rounded-xl border border-line bg-raised/50 px-3 py-2.5"
          >
            <div className="flex items-start gap-2">
              <button
                type="button"
                onClick={() => toggle(item)}
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                  item.done
                    ? 'border-gold bg-gold text-[#1c1608]'
                    : 'border-line text-transparent hover:border-gold'
                }`}
                aria-label={item.done ? 'Mark incomplete' : 'Mark complete'}
              >
                <Check size={12} />
              </button>
              <button
                type="button"
                onClick={() => open(item)}
                className="min-w-0 flex-1 text-left"
              >
                <p
                  className={`text-sm ${item.done ? 'text-muted line-through' : 'text-ink'}`}
                >
                  {item.title}
                </p>
                <p className="mt-0.5 text-[11px] uppercase tracking-wider text-muted">
                  {item.kind}
                  {item.meta ? ` · ${item.meta}` : ''}
                </p>
                {item.kind === 'goal' ? (
                  <div className="mt-2">
                    <ProgressBar value={item.progress} />
                  </div>
                ) : null}
              </button>
            </div>
          </li>
        ))
      )}
    </ul>
  )

  if (compact) return list

  return (
    <SectionCard
      title="Top priorities"
      icon={Star}
      action={
        <IconButton
          label="Add priority task"
          onClick={() => openModal('task', { priority: true })}
        >
          <Star size={14} />
        </IconButton>
      }
    >
      {list}
    </SectionCard>
  )
}
