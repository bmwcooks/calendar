import { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { useNow } from '../../hooks/useNow'
import {
  HOUR_START,
  PX_PER_HOUR,
  WEEKDAYS,
  hoursList,
  pad2,
} from '../../utils/constants'
import {
  addDays,
  endOfWeek,
  formatHourLabel,
  formatMediumDate,
  formatTime,
  isSameDay,
  minutesFromMidnight,
  parseISODate,
  startOfWeek,
  toISODate,
  weekDates,
} from '../../utils/dates'
import ViewChrome from './ViewChrome'

const COL_MIN = 118

function geometry(event) {
  const start = minutesFromMidnight(event.startTime)
  const end = Math.max(
    minutesFromMidnight(event.endTime || event.startTime),
    start + 30,
  )
  return {
    top: ((start - HOUR_START * 60) / 60) * PX_PER_HOUR,
    height: Math.max(((end - start) / 60) * PX_PER_HOUR, 26),
  }
}

export default function WeekView() {
  const now = useNow(30_000)
  const { viewDate, events, dispatch, openModal, patchItem } = useApp()
  const anchor = parseISODate(viewDate)
  const days = useMemo(() => weekDates(anchor), [viewDate])
  const hours = hoursList()
  const todayIso = toISODate(now)

  const onDrop = (e, date, hour) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/event-id')
    if (!id) return
    const startTime = `${pad2(hour)}:00`
    const endTime = `${pad2(Math.min(hour + 1, 23))}:00`
    patchItem('events', id, { date, startTime, endTime, allDay: false })
  }

  return (
    <div>
      <ViewChrome
        eyebrow="This week"
        title={`${formatMediumDate(startOfWeek(anchor))} – ${formatMediumDate(endOfWeek(anchor))}`}
        onPrev={() =>
          dispatch({
            type: 'SET_VIEW_DATE',
            date: toISODate(addDays(anchor, -7)),
          })
        }
        onNext={() =>
          dispatch({
            type: 'SET_VIEW_DATE',
            date: toISODate(addDays(anchor, 7)),
          })
        }
        onToday={() =>
          dispatch({ type: 'SET_VIEW_DATE', date: toISODate(now) })
        }
      />

      <div className="overflow-x-auto rounded-2xl border border-line bg-panel">
        <div style={{ minWidth: 7 * COL_MIN + 56 }}>
          <div
            className="grid border-b border-line"
            style={{ gridTemplateColumns: `56px repeat(7, minmax(${COL_MIN}px, 1fr))` }}
          >
            <div />
            {days.map((day) => {
              const iso = toISODate(day)
              const isToday = iso === todayIso
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() =>
                    openModal('event', { date: iso, allDay: true })
                  }
                  className={`border-l border-line px-2 py-3 text-center ${isToday ? 'bg-gold/10' : ''}`}
                >
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
                    {WEEKDAYS[(day.getDay() + 6) % 7]}
                  </p>
                  <p
                    className={`mt-1 font-display text-2xl ${isToday ? 'text-gold' : 'text-ink'}`}
                  >
                    {day.getDate()}
                  </p>
                </button>
              )
            })}
          </div>

          <div
            className="grid border-b border-line"
            style={{ gridTemplateColumns: `56px repeat(7, minmax(${COL_MIN}px, 1fr))` }}
          >
            <div className="px-1 py-2 text-[10px] uppercase tracking-wider text-muted">
              All day
            </div>
            {days.map((day) => {
              const iso = toISODate(day)
              const items = events.filter((e) => e.date === iso && e.allDay)
              return (
                <div
                  key={iso}
                  className="min-h-[44px] space-y-1 border-l border-line p-1"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    const id = e.dataTransfer.getData('text/event-id')
                    if (id) patchItem('events', id, { date: iso, allDay: true, startTime: '', endTime: '' })
                  }}
                >
                  {items.map((event) => (
                    <button
                      key={event.id}
                      draggable
                      onDragStart={(e) =>
                        e.dataTransfer.setData('text/event-id', event.id)
                      }
                      type="button"
                      onClick={() => openModal('event', { id: event.id })}
                      className={`block w-full truncate rounded-md border px-1.5 py-0.5 text-left text-[11px] event-${event.color || 'gold'}`}
                    >
                      {event.title}
                    </button>
                  ))}
                </div>
              )
            })}
          </div>

          <div className="relative">
            <div
              className="grid"
              style={{ gridTemplateColumns: `56px repeat(7, minmax(${COL_MIN}px, 1fr))` }}
            >
              <div>
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="border-t border-line pr-1 pt-1 text-right text-[10px] text-muted tabular-nums"
                    style={{ height: PX_PER_HOUR }}
                  >
                    {formatHourLabel(hour)}
                  </div>
                ))}
              </div>
              {days.map((day) => {
                const iso = toISODate(day)
                const timed = events.filter(
                  (e) => e.date === iso && !e.allDay && e.startTime,
                )
                return (
                  <div
                    key={iso}
                    className="relative border-l border-line"
                    style={{ height: hours.length * PX_PER_HOUR }}
                  >
                    {hours.map((hour, i) => (
                      <div
                        key={hour}
                        className="absolute right-0 left-0 border-t border-line/80 hover:bg-gold/5"
                        style={{ top: i * PX_PER_HOUR, height: PX_PER_HOUR }}
                        onClick={() =>
                          openModal('event', {
                            date: iso,
                            startTime: `${pad2(hour)}:00`,
                            endTime: `${pad2(Math.min(hour + 1, 23))}:00`,
                          })
                        }
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => onDrop(e, iso, hour)}
                      />
                    ))}
                    {timed.map((event) => {
                      const { top, height } = geometry(event)
                      return (
                        <button
                          key={event.id}
                          type="button"
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/event-id', event.id)
                            e.stopPropagation()
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            openModal('event', { id: event.id })
                          }}
                          className={`absolute right-1 left-1 z-10 overflow-hidden rounded-lg border px-1.5 py-1 text-left event-${event.color || 'gold'}`}
                          style={{ top, height }}
                        >
                          <p className="truncate text-[11px] font-medium leading-tight">
                            {event.title}
                          </p>
                          <p className="text-[10px] opacity-80">
                            {formatTime(event.startTime)}
                          </p>
                        </button>
                      )
                    })}
                    {isSameDay(day, now) ? <NowLine now={now} /> : null}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted">
        Click a slot to schedule. Drag a block onto another day or hour to
        move it.
      </p>
    </div>
  )
}

function NowLine({ now }) {
  const mins = now.getHours() * 60 + now.getMinutes()
  if (mins < HOUR_START * 60) return null
  const top = ((mins - HOUR_START * 60) / 60) * PX_PER_HOUR
  return (
    <div
      className="pointer-events-none absolute right-0 left-0 z-20"
      style={{ top }}
    >
      <div className="h-px bg-gold" />
    </div>
  )
}
