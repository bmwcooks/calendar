import { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { useNow } from '../../hooks/useNow'
import { MONTHS, WEEKDAYS } from '../../utils/constants'
import {
  countdownLabel,
  daysUntil,
  isSameMonth,
  monthGrid,
  startOfMonth,
  toISODate,
} from '../../utils/dates'
import ViewChrome from './ViewChrome'

const QUARTERS = [
  { id: 'Q1', months: [0, 1, 2], label: 'Q1 · Groundwork' },
  { id: 'Q2', months: [3, 4, 5], label: 'Q2 · Momentum' },
  { id: 'Q3', months: [6, 7, 8], label: 'Q3 · Midyear' },
  { id: 'Q4', months: [9, 10, 11], label: 'Q4 · Close' },
]

function occurrenceInYear(item, year) {
  if (item.recurring === 'yearly' && item.date?.length >= 10) {
    return `${year}${item.date.slice(4)}`
  }
  if (item.date?.startsWith(String(year))) return item.date
  return null
}

function MiniMonth({ year, month, events, milestones, today, onOpen }) {
  const anchor = new Date(year, month, 1)
  const cells = monthGrid(anchor)
  const eventDays = new Set(events.map((e) => e.date))
  const mileDays = new Set(
    milestones.map((m) => occurrenceInYear(m, year)).filter(Boolean),
  )

  return (
    <button
      type="button"
      onClick={() => onOpen(anchor)}
      className="rounded-2xl border border-line bg-panel p-3 text-left hover:border-gold/40"
    >
      <p className="mb-2 font-display text-lg italic">{MONTHS[month]}</p>
      <div className="grid grid-cols-7 gap-px text-center">
        {WEEKDAYS.map((d) => (
          <span key={d} className="text-[9px] text-muted">
            {d[0]}
          </span>
        ))}
        {cells.map((day) => {
          const iso = toISODate(day)
          const inMonth = isSameMonth(day, anchor)
          const hasEvent = eventDays.has(iso)
          const hasMile = mileDays.has(iso)
          const isToday = iso === toISODate(today)
          return (
            <span
              key={iso}
              className={`flex h-6 items-center justify-center rounded-full text-[10px] ${
                !inMonth
                  ? 'text-transparent'
                  : isToday
                    ? 'bg-gold text-[#1c1608]'
                    : hasMile
                      ? 'text-terracotta'
                      : hasEvent
                        ? 'text-gold'
                        : 'text-muted'
              }`}
            >
              {inMonth ? day.getDate() : ''}
              {inMonth && (hasEvent || hasMile) && !isToday ? (
                <span className="sr-only">has items</span>
              ) : null}
            </span>
          )
        })}
      </div>
    </button>
  )
}

export default function YearView() {
  const now = useNow(60_000)
  const { viewDate, events, importantDates, goals, dispatch } = useApp()
  const year = parseInt(viewDate.slice(0, 4), 10) || now.getFullYear()

  const yearEvents = events.filter((e) => e.date.startsWith(String(year)))
  const roadmap = useMemo(() => {
    const fromDates = importantDates
      .map((item) => {
        const date = occurrenceInYear(item, year)
        if (!date) return null
        return {
          id: item.id,
          title: item.title,
          date,
          kind: 'milestone',
        }
      })
      .filter(Boolean)
    const fromGoals = goals
      .filter((g) => g.targetDate?.startsWith(String(year)))
      .map((g) => ({
        id: g.id,
        title: g.title,
        date: g.targetDate,
        kind: 'goal',
      }))
    return [...fromDates, ...fromGoals].sort((a, b) =>
      a.date.localeCompare(b.date),
    )
  }, [importantDates, goals, year])

  const openMonth = (date) => {
    dispatch({ type: 'SET_VIEW_DATE', date: toISODate(startOfMonth(date)) })
    dispatch({ type: 'SET_VIEW', view: 'month' })
  }

  return (
    <div>
      <ViewChrome
        eyebrow="Year at a glance"
        title={String(year)}
        onPrev={() =>
          dispatch({
            type: 'SET_VIEW_DATE',
            date: `${year - 1}-01-01`,
          })
        }
        onNext={() =>
          dispatch({
            type: 'SET_VIEW_DATE',
            date: `${year + 1}-01-01`,
          })
        }
        onToday={() =>
          dispatch({ type: 'SET_VIEW_DATE', date: toISODate(now) })
        }
      />

      <div className="space-y-6">
        {QUARTERS.map((q) => {
          const qItems = roadmap.filter((item) =>
            q.months.includes(parseInt(item.date.slice(5, 7), 10) - 1),
          )
          return (
            <section key={q.id}>
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <h2 className="text-[11px] uppercase tracking-[0.18em] text-gold">
                  {q.label}
                </h2>
                <span className="text-xs text-muted">
                  {qItems.length} milestone{qItems.length === 1 ? '' : 's'}
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {q.months.map((m) => (
                  <MiniMonth
                    key={m}
                    year={year}
                    month={m}
                    today={now}
                    events={yearEvents.filter((e) =>
                      e.date.startsWith(`${year}-${String(m + 1).padStart(2, '0')}`),
                    )}
                    milestones={importantDates}
                    onOpen={openMonth}
                  />
                ))}
              </div>
              {qItems.length ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {qItems.map((item) => (
                    <li
                      key={`${item.kind}-${item.id}`}
                      className="rounded-full border border-line bg-raised px-3 py-1 text-xs text-ink"
                    >
                      <span className="text-muted">
                        {item.date.slice(5)} · {item.kind} ·{' '}
                      </span>
                      {item.title}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          )
        })}
      </div>

      <section className="mt-8 rounded-2xl border border-line bg-panel p-4">
        <h2 className="mb-3 font-display text-xl italic">Roadmap</h2>
        {roadmap.length === 0 ? (
          <p className="text-sm text-muted">
            Add important dates and goal target dates to populate this year’s
            high-level plan.
          </p>
        ) : (
          <ol className="space-y-2">
            {roadmap.map((item) => (
              <li
                key={`${item.kind}-${item.id}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2 text-sm"
              >
                <span>
                  <span className="mr-2 text-muted">{item.date}</span>
                  {item.title}
                </span>
                <span className="text-xs text-gold">
                  {countdownLabel(daysUntil(item.date, now))}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}
