import { MONTHS, WEEKDAYS, pad2 } from './constants'

export function toISODate(date) {
  const d = date instanceof Date ? date : new Date(date)
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

export function parseISODate(iso) {
  const [y, m, d] = String(iso).split('-').map(Number)
  return new Date(y, (m || 1) - 1, d || 1)
}

export function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

export function addMonths(date, n) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + n)
  return d
}

export function startOfWeek(date) {
  const d = startOfDay(date)
  const day = d.getDay()
  const diff = (day + 6) % 7
  d.setDate(d.getDate() - diff)
  return d
}

export function endOfWeek(date) {
  return addDays(startOfWeek(date), 6)
}

export function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function startOfYear(date) {
  return new Date(date.getFullYear(), 0, 1)
}

export function weekDates(date) {
  const start = startOfWeek(date)
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export function monthGrid(date) {
  const start = startOfWeek(startOfMonth(date))
  return Array.from({ length: 42 }, (_, i) => addDays(start, i))
}

export function isSameDay(a, b) {
  return toISODate(a) === toISODate(b)
}

export function isSameMonth(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

export function formatLongDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatMediumDate(date) {
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatWeekday(date) {
  return WEEKDAYS[(date.getDay() + 6) % 7]
}

export function monthName(dateOrIndex) {
  if (dateOrIndex instanceof Date) return MONTHS[dateOrIndex.getMonth()]
  return MONTHS[dateOrIndex]
}

export function formatClock(date) {
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function formatClockShort(date) {
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function parseTime(hhmm) {
  if (!hhmm) return { hours: 0, minutes: 0 }
  const [h, m] = String(hhmm).split(':').map(Number)
  return { hours: h || 0, minutes: m || 0 }
}

export function formatTime(hhmm) {
  if (!hhmm) return ''
  const { hours, minutes } = parseTime(hhmm)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

export function formatHourLabel(hour) {
  const date = new Date()
  date.setHours(hour, 0, 0, 0)
  return date.toLocaleTimeString(undefined, { hour: 'numeric' })
}

export function minutesFromMidnight(hhmm) {
  const { hours, minutes } = parseTime(hhmm)
  return hours * 60 + minutes
}

export function greeting(date) {
  const h = date.getHours()
  if (h < 5) return 'Late night'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 21) return 'Good evening'
  return 'Good night'
}

export function daysUntil(isoDate, now = new Date()) {
  const target = startOfDay(parseISODate(isoDate))
  const today = startOfDay(now)
  return Math.round((target - today) / 86400000)
}

export function nextOccurrence(isoDate, recurring, now = new Date()) {
  const orig = parseISODate(isoDate)
  if (recurring !== 'yearly') return orig
  const today = startOfDay(now)
  let next = new Date(today.getFullYear(), orig.getMonth(), orig.getDate())
  if (next < today) next.setFullYear(next.getFullYear() + 1)
  return next
}

export function countdownLabel(days) {
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days === -1) return 'Yesterday'
  if (days > 1) return `in ${days} days`
  return `${Math.abs(days)} days ago`
}

export function eventDurationMinutes(event) {
  if (event.allDay || !event.startTime) return 60
  const start = minutesFromMidnight(event.startTime)
  const end = minutesFromMidnight(event.endTime || event.startTime)
  return Math.max(end - start, 30)
}
