export const STORAGE_KEY = 'harbor-folio-v1'
export const HOUR_START = 6
export const HOUR_END = 23
export const PX_PER_HOUR = 72

export const EVENT_COLORS = [
  { id: 'gold', label: 'Gold' },
  { id: 'terracotta', label: 'Terracotta' },
  { id: 'sage', label: 'Sage' },
  { id: 'sea', label: 'Sea' },
  { id: 'rose', label: 'Rose' },
]

export const GOAL_HORIZONS = [
  { id: 'short', label: 'Short-term' },
  { id: 'medium', label: 'Medium-term' },
  { id: 'long', label: 'Long-term' },
]

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

export function hoursList() {
  return Array.from({ length: HOUR_END - HOUR_START + 1 }, (_, i) => HOUR_START + i)
}

export function pad2(n) {
  return String(n).padStart(2, '0')
}

export function hourToTime(hour, minute = 0) {
  return `${pad2(hour)}:${pad2(minute)}`
}
