import { useEffect, useMemo } from 'react'
import { Check, Plus } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useDayKey, useNow } from '../../hooks/useNow'
import {
  HOUR_END,
  HOUR_START,
  PX_PER_HOUR,
  hoursList,
} from '../../utils/constants'
import {
  formatClockShort,
  formatHourLabel,
  formatTime,
  greeting,
  minutesFromMidnight,
  toISODate,
} from '../../utils/dates'
import ViewChrome from './ViewChrome'

function timedEventsForDay(events, iso) {
  return events
    .filter((e) => e.date === iso && !e.allDay && e.startTime)
    .sort(
      (a, b) =>
        minutesFromMidnight(a.startTime) - minutesFromMidnight(b.startTime),
    )
}

function eventGeometry(event) {
  const start = minutesFromMidnight(event.startTime)
  const end = Math.max(
    minutesFromMidnight(event.endTime || event.startTime),
    start + 30,
  )
  const top = ((start - HOUR_START * 60) / 60) * PX_PER_HOUR
  const height = ((end - start) / 60) * PX_PER_HOUR
  return { top: Math.max(top, 0), height: Math.max(height, 28) }
}

function CurrentTimeLine({ now, todayIso }) {
  if (toISODate(now) !== todayIso) return null
  const mins = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60
  if (mins < HOUR_START * 60 || mins > HOUR_END * 60 + 59) return null
  const top = ((mins - HOUR_START * 60) / 60) * PX_PER_HOUR
  return (
    <div
      id="now-marker"
      className="pointer-events-none absolute right-2 left-14 z-20"
      style={{ top }}
    >
      <div className="flex items-center">
        <span className="now-dot mr-1 h-2.5 w-2.5 rounded-full bg-gold" />
        <div className="h-px flex-1 bg-gold" />
        <span className="ml-2 rounded-full bg-gold px-1.5 py-0.5 text-[10px] font-semibold text-[#1c1608] tabular-nums">
          {formatClockShort(now)}
        </span>
      </div>
    </div>
  )
}

export default function TodayView() {
  const now = useNow(1000)
  const dayKey = useDayKey(now)
  const todayIso = toISODate(now)
  const { events, tasks, openModal, patchItem } = useApp()

  const dayEvents = useMemo(
    () => timedEventsForDay(events, todayIso),
    [events, todayIso],
  )
  const allDay = events.filter((e) => e.date === todayIso && e.allDay)
  const dayTasks = tasks.filter((t) => t.date === todayIso)
  const remaining = dayTasks.filter((t) => !t.completed).length
  const hours = hoursList()

  useEffect(() => {
    const marker = document.getElementById('now-marker')
    marker?.scrollIntoView({ block: 'center', behavior: 'instant' })
  }, [dayKey])

  return (
    <div>
      <ViewChrome
        eyebrow={greeting(now)}
        title={now.toLocaleDateString(undefined, {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}
      />
      <p className="mb-5 text-sm text-muted">
        {dayEvents.length} timed block{dayEvents.length === 1 ? '' : 's'} ·{' '}
        {remaining} open task{remaining === 1 ? '' : 's'}
        {now.getHours() >= 23 ? ' · Day rolls over at midnight' : ''}
      </p>

      {allDay.length ? (
        <div className="mb-3 flex flex-wrap gap-2">
          {allDay.map((event) => (
            <button
              key={event.id}
              type="button"
              onClick={() => openModal('event', { id: event.id })}
              className={`rounded-full border px-3 py-1 text-xs event-${event.color || 'gold'}`}
            >
              {event.title}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
        <div className="relative max-h-[min(72vh,820px)] overflow-y-auto rounded-2xl border border-line bg-panel">
          <div
            className="relative"
            style={{ height: hours.length * PX_PER_HOUR }}
          >
            {hours.map((hour, i) => (
              <button
                key={hour}
                type="button"
                onClick={() =>
                  openModal('event', {
                    date: todayIso,
                    startTime: `${String(hour).padStart(2, '0')}:00`,
                    endTime: `${String(Math.min(hour + 1, 23)).padStart(2, '0')}:00`,
                  })
                }
                className="absolute right-0 left-0 flex border-t border-line/80 text-left hover:bg-gold/5"
                style={{ top: i * PX_PER_HOUR, height: PX_PER_HOUR }}
              >
                <span className="w-14 shrink-0 pt-1 pr-2 text-right text-[11px] text-muted tabular-nums">
                  {formatHourLabel(hour)}
                </span>
                <span className="sr-only">Add block at {formatHourLabel(hour)}</span>
              </button>
            ))}

            {dayEvents.map((event) => {
              const { top, height } = eventGeometry(event)
              return (
                <button
                  key={event.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    openModal('event', { id: event.id })
                  }}
                  className={`absolute right-3 left-16 z-10 overflow-hidden rounded-xl border px-3 py-2 text-left event-${event.color || 'gold'}`}
                  style={{ top, height }}
                >
                  <p className="truncate text-sm font-medium">{event.title}</p>
                  <p className="text-[11px] opacity-80">
                    {formatTime(event.startTime)}
                    {event.endTime ? ` – ${formatTime(event.endTime)}` : ''}
                  </p>
                </button>
              )
            })}

            <CurrentTimeLine now={now} todayIso={todayIso} />
          </div>
        </div>

        <section className="rounded-2xl border border-line bg-panel p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[13px] font-medium uppercase tracking-[0.16em] text-muted">
              Today’s list
            </h2>
            <button
              type="button"
              onClick={() => openModal('task', { date: todayIso })}
              className="rounded-lg p-1.5 text-muted hover:bg-raised hover:text-ink"
              aria-label="Add task"
            >
              <Plus size={16} />
            </button>
          </div>
          {dayTasks.length === 0 ? (
            <p className="text-sm text-muted">
              No loose to-dos for this date. Add anything that isn’t on the
              clock.
            </p>
          ) : (
            <ul className="space-y-2">
              {dayTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-start gap-2 rounded-xl border border-line bg-raised/40 px-3 py-2"
                >
                  <button
                    type="button"
                    onClick={() =>
                      patchItem('tasks', task.id, {
                        completed: !task.completed,
                      })
                    }
                    className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-md border ${
                      task.completed
                        ? 'border-gold bg-gold text-[#1c1608]'
                        : 'border-line'
                    }`}
                    aria-label="Toggle task"
                  >
                    <Check size={12} />
                  </button>
                  <button
                    type="button"
                    className="flex-1 text-left text-sm"
                    onClick={() => openModal('task', { id: task.id })}
                  >
                    <span
                      className={
                        task.completed ? 'text-muted line-through' : 'text-ink'
                      }
                    >
                      {task.title}
                    </span>
                    {task.priority ? (
                      <span className="ml-2 text-[10px] uppercase tracking-wider text-gold">
                        priority
                      </span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
