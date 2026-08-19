import { useEffect, useRef } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { useDayKey, useNow } from './hooks/useNow'
import { toISODate } from './utils/dates'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import PriorityDrawer from './components/layout/PriorityDrawer'
import ModalHost from './components/modals/ModalHost'
import TodayView from './components/views/TodayView'
import WeekView from './components/views/WeekView'
import MonthView from './components/views/MonthView'
import YearView from './components/views/YearView'

function Shell() {
  const { view, dispatch, openModal, notice } = useApp()
  const now = useNow(30_000)
  const dayKey = useDayKey(now)
  const lastDayKey = useRef(dayKey)

  useEffect(() => {
    if (lastDayKey.current === dayKey) return
    lastDayKey.current = dayKey
    dispatch({ type: 'SET_VIEW_DATE', date: toISODate(new Date()) })
  }, [dayKey, dispatch])

  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.key === 'n') {
        e.preventDefault()
        openModal('event', { date: toISODate(new Date()) })
      }
      if (e.key === 't') {
        dispatch({ type: 'SET_VIEW', view: 'today' })
        dispatch({ type: 'SET_VIEW_DATE', date: toISODate(new Date()) })
      }
      if (e.key === ',') {
        e.preventDefault()
        openModal('settings')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dispatch, openModal])

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Header />
      <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <Sidebar />
        <main className="min-w-0">
          {view === 'today' && <TodayView />}
          {view === 'week' && <WeekView />}
          {view === 'month' && <MonthView />}
          {view === 'year' && <YearView />}
        </main>
      </div>
      <PriorityDrawer />
      <ModalHost />
      {notice ? (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full border border-line bg-panel px-4 py-2 text-sm text-ink shadow-lg">
          {notice.message}
        </div>
      ) : null}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
