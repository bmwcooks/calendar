import EventModal from './EventModal'
import SettingsModal from './SettingsModal'
import TaskModal from './TaskModal'
import DateModal from './DateModal'
import NoteModal from './NoteModal'
import GoalModal from './GoalModal'
import HabitModal from './HabitModal'
import { useApp } from '../../context/AppContext'

export default function ModalHost() {
  const { modal } = useApp()
  if (!modal) return null
  switch (modal.type) {
    case 'event':
      return <EventModal />
    case 'settings':
      return <SettingsModal />
    case 'task':
      return <TaskModal />
    case 'date':
      return <DateModal />
    case 'note':
      return <NoteModal />
    case 'goal':
      return <GoalModal />
    case 'habit':
      return <HabitModal />
    default:
      return null
  }
}
