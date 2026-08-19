import { useMemo, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { useNow } from '../../hooks/useNow'
import { WEEKDAYS } from '../../utils/constants'
import {
  addMonths,
  formatTime,
  isSameMonth,
  monthGrid,
  monthName,
  parseISODate,
  toISODate,
} from '../../utils/dates'
import ViewChrome from './ViewChrome'

export default function MonthView() {
  const now = useNow(60_000)
  const { viewDate, events, importantDates, dispatch, openModal } = useApp()
  const anchor = parseISODate(viewDate)
  const cells = useMemo(() => monthGrid(anchor), [viewDate])
  const todayIso = toISODate(now)
  const [selected, setSelected] = useState(todayIso)

  const selectedEvents = events
    .filter((e) => e.date === selected)
    .sort((a, b) => String(a.startTime).localeCompare(String(b.startTime)))
  const selectedMilestones = importantDates.filter((d) => d.date === selected)

  return (
    <div>
      <ViewChrome
        eyebrow="Month"
        title={`${monthName(anchor)} ${anchor.getFullYear()}`}
        onPrev={() =>
          dispatch({
            type: 'SET_VIEW_DATE',
            date: toISODate(addMonths(anchor, -1)),
          })
        }
        onNext={() =>
          dispatch({
            type: 'SET_VIEW_DATE',
            date: toISODate(addMonths(anchor, 1)),
          })
        }
        onToday={() => {
          const t = toISODate(now)
          dispatch({ type: 'SET_VIEW_DATE', date: t })
          setSelected(t)
        }}
      />

      <div className="overflow-x-auto rounded-2xl border border-line bg-panel">
        <div className="grid grid-cols-7 border-b border-line">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="px-2 py-2 text-center text-[10px] uppercase tracking-[0.16em] text-muted"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day) => {
            const iso = toISODate(day)
            const inMonth = isSameMonth(day, anchor)
            const dayEvents = events.filter((e) => e.date === iso)
            const marks = importantDates.filter((d) => d.date === iso)
            const isToday = iso === todayIso
            const isSel = iso === selected
            return (
              <button
                key={iso}
                type="button"
                onClick={() => setSelected(iso)}
                onDoubleClick={() => openModal('event', { date: iso, allDay: true })}
                className={`min-h-[92px] border-t border-l border-line p-1.5 text-left sm:min-h-[110px] ${
                  inMonth ? 'bg-transparent' : 'bg-raised/40'
                } ${isSel ? 'ring-1 ring-inset ring-gold/70' : ''} ${
                  isToday ? 'bg-gold/8' : ''
                }`}
              >
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                    isToday
                      ? 'bg-gold text-[#1c1608]'
                      : inMonth
                        ? 'text-ink'
                        : 'text-muted'
                  }`}
                >
                  {day.getDate()}
                </span>
                <div className="mt-1 space-y-0.5">
                  {dayEvents.slice(0, 3).map((event) => (
                    <span
                      key={event.id}
                      className={`block truncate rounded px-1 text-[10px] leading-4 event-${event.color || 'gold'}`}
                    >
                      {event.title}
                    </span>
                  ))}
                  {dayEvents.length > 3 ? (
                    <span className="text-[10px] text-muted">
                      +{dayEvents.length - 3} more
                    </span>
                  ) : null}
                  {marks.length ? (
                    <span className="mt-0.5 flex gap-0.5">
                      {marks.slice(0, 3).map((m) => (
                        <span
                          key={m.id}
                          className="h-1.5 w-1.5 rounded-full bg-terracotta"
                          title={m.title}
                        />
                      ))}
                    </span>
                  ) : null}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <section className="mt-4 rounded-2xl border border-line bg-panel p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl italic">
            {parseISODate(selected).toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </h2>
          <button
            type="button"
            onClick={() => openModal('event', { date: selected })}
            className="rounded-full border border-line px-3 py-1.5 text-xs uppercase tracking-wider text-muted hover:text-ink"
          >
            Add to this day
          </button>
        </div>
        {selectedEvents.length === 0 && selectedMilestones.length === 0 ? (
          <p className="text-sm text-muted">
            Nothing scheduled. Double-click a cell or use the button to add a
            block.
          </p>
        ) : (
          <ul className="space-y-2">
            {selectedMilestones.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => openModal('date', { id: m.id })}
                  className="w-full rounded-xl border border-terracotta/40 bg-terracotta/10 px-3 py-2 text-left text-sm"
                >
                  Milestone · {m.title}
                </button>
              </li>
            ))}
            {selectedEvents.map((event) => (
              <li key={event.id}>
                <button
                  type="button"
                  onClick={() => openModal('event', { id: event.id })}
                  className={`w-full rounded-xl border px-3 py-2 text-left text-sm event-${event.color || 'gold'}`}
                >
                  {event.allDay ? 'All day' : formatTime(event.startTime)} ·{' '}
                  {event.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
