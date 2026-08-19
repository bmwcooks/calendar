import { X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import TopPriorities from '../priorities/TopPriorities'
import ImportantDates from '../vault/ImportantDates'
import QuickNotes from '../vault/QuickNotes'
import GoalTracker from '../goals/GoalTracker'

export default function Sidebar() {
  const { sidebarOpen, dispatch } = useApp()

  return (
    <>
      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          aria-label="Close sidebar"
          onClick={() => dispatch({ type: 'SET_SIDEBAR', open: false })}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[min(100%,360px)] overflow-y-auto border-r border-line bg-canvas p-4 transition-transform lg:static lg:z-0 lg:w-auto lg:translate-x-0 lg:border-r-0 lg:bg-transparent lg:p-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-3 flex items-center justify-between lg:hidden">
          <p className="font-display text-lg italic">Harbor</p>
          <button
            type="button"
            className="rounded-lg p-1.5 text-muted hover:bg-raised"
            onClick={() => dispatch({ type: 'SET_SIDEBAR', open: false })}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4">
          <TopPriorities />
          <GoalTracker />
          <ImportantDates />
          <QuickNotes />
        </div>
      </aside>
    </>
  )
}
