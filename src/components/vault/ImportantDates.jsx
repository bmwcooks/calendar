import { CalendarClock, Plus } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import {
  countdownLabel,
  daysUntil,
  nextOccurrence,
  toISODate,
} from '../../utils/dates'
import { useNow } from '../../hooks/useNow'
import EmptyState from '../ui/EmptyState'
import SectionCard, { IconButton } from '../ui/SectionCard'

export default function ImportantDates() {
  const { importantDates, openModal } = useApp()
  const now = useNow(60_000)

  const ranked = importantDates
    .map((item) => {
      const next = nextOccurrence(item.date, item.recurring, now)
      const iso = toISODate(next)
      return { ...item, next, iso, days: daysUntil(iso, now) }
    })
    .sort((a, b) => a.days - b.days)

  return (
    <SectionCard
      title="Important dates"
      icon={CalendarClock}
      action={
        <IconButton label="Add date" onClick={() => openModal('date', {})}>
          <Plus size={14} />
        </IconButton>
      }
    >
      {ranked.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No milestones yet"
          body="Birthdays, renewals, and non-negotiable dates live here with a countdown."
        />
      ) : (
        <ul className="space-y-2">
          {ranked.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => openModal('date', { id: item.id })}
                className="flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-raised/40 px-3 py-2.5 text-left hover:border-gold/40"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-ink">{item.title}</p>
                  <p className="text-[11px] text-muted">
                    {item.iso}
                    {item.recurring === 'yearly' ? ' · yearly' : ''}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-medium ${
                    item.days <= 7
                      ? 'bg-terracotta/20 text-terracotta'
                      : 'bg-gold/15 text-gold'
                  }`}
                >
                  {countdownLabel(item.days)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  )
}
