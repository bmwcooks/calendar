import { STORAGE_KEY } from './constants'

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}

export function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        resolve(JSON.parse(String(reader.result)))
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}

export function persistableSlice(state) {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    events: state.events,
    tasks: state.tasks,
    importantDates: state.importantDates,
    notes: state.notes,
    goals: state.goals,
    habits: state.habits,
    theme: state.theme,
  }
}

export function normalizeImported(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid backup file.')
  }
  return {
    events: Array.isArray(payload.events) ? payload.events : [],
    tasks: Array.isArray(payload.tasks) ? payload.tasks : [],
    importantDates: Array.isArray(payload.importantDates)
      ? payload.importantDates
      : [],
    notes: Array.isArray(payload.notes) ? payload.notes : [],
    goals: Array.isArray(payload.goals) ? payload.goals : [],
    habits: Array.isArray(payload.habits) ? payload.habits : [],
    theme: payload.theme === 'light' ? 'light' : 'dark',
  }
}
