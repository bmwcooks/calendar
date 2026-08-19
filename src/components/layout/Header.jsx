import {
  Compass,
  CalendarDays,
  CalendarRange,
  LayoutGrid,
  Star,
  Settings,
  Menu,
  Plus,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useNow } from '../../hooks/useNow'
import { formatClock, formatLongDate } from '../../utils/dates'

const VIEWS = [
  { id: 'today', label: 'Today', icon: CalendarDays },
  { id: 'week', label: 'Week', icon: CalendarRange },
  { id: 'month', label: 'Month', icon: LayoutGrid },
  { id: 'year', label: 'Year', icon: Compass },
]

function LiveClock() {
  const now = useNow(1000)
  return (
    <div className="hidden text-right sm:block">
      <p className="font-display text-lg leading-none tracking-tight text-ink tabular-nums">
        {formatClock(now)}
      </p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-muted">
        {formatLongDate(now)}
      </p>
    </div>
  )
}

export default function Header() {
  const {
    view,
    dispatch,
    openModal,
    events,
    tasks,
    goals,
    prioritiesOpen,
  } = useApp()

  const priorityCount =
    events.filter((e) => e.priority && !e.completed).length +
    tasks.filter((t) => t.priority && !t.completed).length +
    goals.filter((g) => g.priority && !g.completed).length

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-3">
        <button
          type="button"
          className="rounded-lg p-2 text-muted hover:bg-raised hover:text-ink lg:hidden"
          aria-label="Open sidebar"
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-gold">
            <Compass size={18} strokeWidth={1.6} />
          </span>
          <div className="leading-tight">
            <p className="font-display text-xl italic text-ink">Harbor</p>
            <p className="hidden text-[10px] uppercase tracking-[0.18em] text-muted sm:block">
              Life organizer
            </p>
          </div>
        </div>

        <nav className="mx-auto hidden items-center rounded-full border border-line bg-panel p-1 md:flex">
          {VIEWS.map(({ id, label, icon: Icon }) => {
            const active = view === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => dispatch({ type: 'SET_VIEW', view: id })}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm transition ${
                  active
                    ? 'bg-gold text-[#1c1608] shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LiveClock />
          <button
            type="button"
            onClick={() => openModal('event', {})}
            className="hidden items-center gap-1.5 rounded-full border border-line bg-panel px-3 py-2 text-sm text-ink hover:border-gold/50 sm:inline-flex"
          >
            <Plus size={15} />
            Block
          </button>
          <button
            type="button"
            onClick={() =>
              dispatch({ type: 'SET_PRIORITIES', open: !prioritiesOpen })
            }
            className={`relative rounded-full border p-2 ${
              prioritiesOpen
                ? 'border-gold bg-gold/15 text-gold'
                : 'border-line text-muted hover:text-ink'
            }`}
            aria-label="Top priorities"
          >
            <Star size={16} fill={priorityCount ? 'currentColor' : 'none'} />
            {priorityCount ? (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-[#1c1608]">
                {priorityCount}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => openModal('settings')}
            className="rounded-full border border-line p-2 text-muted hover:text-ink"
            aria-label="Settings and data"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-t border-line px-3 py-2 md:hidden">
        {VIEWS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => dispatch({ type: 'SET_VIEW', view: id })}
            className={`rounded-full px-3 py-1 text-sm ${
              view === id ? 'bg-gold text-[#1c1608]' : 'bg-panel text-muted'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </header>
  )
}
