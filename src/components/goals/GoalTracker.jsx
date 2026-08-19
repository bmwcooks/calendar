import { Flag, Plus, Flame } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { GOAL_HORIZONS } from '../../utils/constants'
import { addDays, toISODate } from '../../utils/dates'
import { useNow } from '../../hooks/useNow'
import ProgressBar from '../ui/ProgressBar'
import EmptyState from '../ui/EmptyState'
import SectionCard, { IconButton } from '../ui/SectionCard'

function streakCount(checks, todayIso) {
  let streak = 0
  let cursor = todayIso
  if (!checks[cursor]) {
    cursor = toISODate(addDays(new Date(cursor + 'T12:00:00'), -1))
  }
  while (checks[cursor]) {
    streak += 1
    cursor = toISODate(addDays(new Date(cursor + 'T12:00:00'), -1))
  }
  return streak
}

export default function GoalTracker() {
  const { goals, habits, openModal, patchItem } = useApp()
  const now = useNow(60_000)
  const today = toISODate(now)
  const week = Array.from({ length: 7 }, (_, i) =>
    toISODate(addDays(now, i - 6)),
  )

  return (
    <div className="space-y-4">
      <SectionCard
        title="Goals"
        icon={Flag}
        action={
          <IconButton label="Add goal" onClick={() => openModal('goal', {})}>
            <Plus size={14} />
          </IconButton>
        }
      >
        {goals.length === 0 ? (
          <EmptyState
            icon={Flag}
            title="No goals yet"
            body="Short, medium, and long horizons with a target date and a progress bar."
          />
        ) : (
          <div className="space-y-3">
            {GOAL_HORIZONS.map((horizon) => {
              const group = goals.filter((g) => g.horizon === horizon.id)
              if (!group.length) return null
              return (
                <div key={horizon.id}>
                  <p className="mb-1.5 text-[10px] uppercase tracking-[0.16em] text-muted">
                    {horizon.label}
                  </p>
                  <ul className="space-y-2">
                    {group.map((goal) => (
                      <li key={goal.id}>
                        <button
                          type="button"
                          onClick={() => openModal('goal', { id: goal.id })}
                          className="w-full rounded-xl border border-line bg-raised/40 p-3 text-left hover:border-gold/40"
                        >
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <p
                              className={`text-sm ${goal.completed ? 'text-muted line-through' : 'text-ink'}`}
                            >
                              {goal.title}
                            </p>
                            <span className="text-xs tabular-nums text-gold">
                              {goal.progress}%
                            </span>
                          </div>
                          <ProgressBar
                            value={goal.progress}
                            color={
                              horizon.id === 'short'
                                ? 'gold'
                                : horizon.id === 'medium'
                                  ? 'sea'
                                  : 'sage'
                            }
                          />
                          <p className="mt-1.5 text-[11px] text-muted">
                            Target {goal.targetDate}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Habits"
        icon={Flame}
        action={
          <IconButton label="Add habit" onClick={() => openModal('habit', {})}>
            <Plus size={14} />
          </IconButton>
        }
      >
        {habits.length === 0 ? (
          <EmptyState
            icon={Flame}
            title="No habits yet"
            body="Tap a day to check it off. Streaks build from consecutive days."
          />
        ) : (
          <ul className="space-y-3">
            {habits.map((habit) => {
              const streak = streakCount(habit.checks || {}, today)
              return (
                <li
                  key={habit.id}
                  className="rounded-xl border border-line bg-raised/40 p-3"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      className="truncate text-left text-sm text-ink"
                      onClick={() => openModal('habit', { id: habit.id })}
                    >
                      {habit.title}
                    </button>
                    <span className="flex items-center gap-1 text-[11px] text-terracotta">
                      <Flame size={12} />
                      {streak}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {week.map((iso) => {
                      const on = Boolean(habit.checks?.[iso])
                      const isToday = iso === today
                      return (
                        <button
                          key={iso}
                          type="button"
                          title={iso}
                          onClick={() => {
                            const checks = { ...(habit.checks || {}) }
                            if (checks[iso]) delete checks[iso]
                            else checks[iso] = true
                            patchItem('habits', habit.id, { checks })
                          }}
                          className={`h-7 flex-1 rounded-md border text-[10px] ${
                            on
                              ? 'border-gold bg-gold text-[#1c1608]'
                              : isToday
                                ? 'border-gold/50 text-muted'
                                : 'border-line text-muted'
                          }`}
                        >
                          {iso.slice(-2)}
                        </button>
                      )
                    })}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </SectionCard>
    </div>
  )
}
