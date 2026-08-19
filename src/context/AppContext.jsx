import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import { createSeedData } from '../data/seed'
import { createId } from '../utils/constants'
import {
  loadState,
  normalizeImported,
  persistableSlice,
  saveState,
} from '../utils/storage'
import { toISODate } from '../utils/dates'

const AppContext = createContext(null)

const emptyCollections = {
  events: [],
  tasks: [],
  importantDates: [],
  notes: [],
  goals: [],
  habits: [],
}

function initialState() {
  const stored = loadState()
  const seed = stored ? null : createSeedData()
  const collections = stored
    ? {
        events: stored.events ?? [],
        tasks: stored.tasks ?? [],
        importantDates: stored.importantDates ?? [],
        notes: stored.notes ?? [],
        goals: stored.goals ?? [],
        habits: stored.habits ?? [],
      }
    : seed

  return {
    ...collections,
    theme: stored?.theme === 'light' ? 'light' : 'dark',
    view: stored?.view ?? 'today',
    viewDate: toISODate(new Date()),
    sidebarOpen: false,
    prioritiesOpen: false,
    modal: null,
    notice: null,
  }
}

function upsert(list, item) {
  const idx = list.findIndex((row) => row.id === item.id)
  if (idx === -1) return [...list, item]
  const next = list.slice()
  next[idx] = item
  return next
}

function removeById(list, id) {
  return list.filter((row) => row.id !== id)
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.view, sidebarOpen: false }
    case 'SET_VIEW_DATE':
      return { ...state, viewDate: action.date }
    case 'SET_THEME':
      return { ...state, theme: action.theme }
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen }
    case 'SET_SIDEBAR':
      return { ...state, sidebarOpen: action.open }
    case 'TOGGLE_PRIORITIES':
      return { ...state, prioritiesOpen: !state.prioritiesOpen }
    case 'SET_PRIORITIES':
      return { ...state, prioritiesOpen: action.open }
    case 'OPEN_MODAL':
      return { ...state, modal: action.modal }
    case 'CLOSE_MODAL':
      return { ...state, modal: null }
    case 'NOTICE':
      return { ...state, notice: action.toast }
    case 'UPSERT':
      return { ...state, [action.key]: upsert(state[action.key], action.item) }
    case 'REMOVE':
      return { ...state, [action.key]: removeById(state[action.key], action.id) }
    case 'PATCH':
      return {
        ...state,
        [action.key]: state[action.key].map((row) =>
          row.id === action.id ? { ...row, ...action.patch } : row,
        ),
      }
    case 'IMPORT':
      return {
        ...state,
        ...action.payload,
        modal: null,
      }
    case 'RESET':
      return {
        ...state,
        ...action.payload,
        viewDate: toISODate(new Date()),
        modal: null,
      }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)

  useEffect(() => {
    document.documentElement.classList.toggle('light', state.theme === 'light')
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', state.theme === 'light' ? '#f3eee4' : '#0b0a09')
  }, [state.theme])

  useEffect(() => {
    saveState({
      ...persistableSlice(state),
      view: state.view,
    })
  }, [
    state.events,
    state.tasks,
    state.importantDates,
    state.notes,
    state.goals,
    state.habits,
    state.theme,
    state.view,
  ])

  const openModal = useCallback((type, payload = {}) => {
    dispatch({ type: 'OPEN_MODAL', modal: { type, payload } })
  }, [])

  const closeModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL' })
  }, [])

  const toast = useCallback((message) => {
    dispatch({ type: 'NOTICE', toast: { id: createId(), message } })
    window.setTimeout(() => {
      dispatch({ type: 'NOTICE', toast: null })
    }, 2400)
  }, [])

  const upsertItem = useCallback((key, item) => {
    const row = item.id ? item : { ...item, id: createId() }
    dispatch({ type: 'UPSERT', key, item: row })
    return row
  }, [])

  const removeItem = useCallback((key, id) => {
    dispatch({ type: 'REMOVE', key, id })
  }, [])

  const patchItem = useCallback((key, id, patch) => {
    dispatch({ type: 'PATCH', key, id, patch })
  }, [])

  const importData = useCallback(
    (raw) => {
      const payload = normalizeImported(raw)
      dispatch({ type: 'IMPORT', payload })
      toast('Data imported.')
    },
    [toast],
  )

  const resetData = useCallback(
    (mode) => {
      const payload =
        mode === 'sample' ? createSeedData() : { ...emptyCollections }
      dispatch({ type: 'RESET', payload })
      toast(mode === 'sample' ? 'Sample data loaded.' : 'All data cleared.')
    },
    [toast],
  )

  const value = useMemo(
    () => ({
      ...state,
      dispatch,
      openModal,
      closeModal,
      toast,
      upsertItem,
      removeItem,
      patchItem,
      importData,
      resetData,
    }),
    [
      state,
      openModal,
      closeModal,
      toast,
      upsertItem,
      removeItem,
      patchItem,
      importData,
      resetData,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
