import { createId } from '../utils/constants'
import { addDays, addMonths, toISODate } from '../utils/dates'

function iso(date) {
  return toISODate(date)
}

export function createSeedData(now = new Date()) {
  const today = new Date(now)
  const t = iso(today)
  const tomorrow = iso(addDays(today, 1))
  const inThree = iso(addDays(today, 3))
  const nextWeek = iso(addDays(today, 7))

  return {
    events: [
      {
        id: createId(),
        title: 'Morning planning',
        date: t,
        startTime: '07:00',
        endTime: '07:30',
        color: 'gold',
        notes: 'Review priorities and pick the one thing that matters today.',
        priority: true,
        allDay: false,
      },
      {
        id: createId(),
        title: 'Deep work block',
        date: t,
        startTime: '09:00',
        endTime: '12:00',
        color: 'sea',
        notes: 'Phone on Do Not Disturb. One project only.',
        priority: true,
        allDay: false,
      },
      {
        id: createId(),
        title: 'Walk + reset',
        date: t,
        startTime: '13:00',
        endTime: '13:40',
        color: 'sage',
        notes: '',
        priority: false,
        allDay: false,
      },
      {
        id: createId(),
        title: 'Weekly review',
        date: inThree,
        startTime: '16:00',
        endTime: '17:00',
        color: 'terracotta',
        notes: 'Close loops. Plan next week. Archive what is done.',
        priority: true,
        allDay: false,
      },
      {
        id: createId(),
        title: 'Friends dinner',
        date: tomorrow,
        startTime: '19:00',
        endTime: '21:00',
        color: 'rose',
        notes: '',
        priority: false,
        allDay: false,
      },
    ],
    tasks: [
      {
        id: createId(),
        title: 'Inbox to zero',
        date: t,
        completed: false,
        priority: false,
      },
      {
        id: createId(),
        title: 'Prep tomorrow’s first block',
        date: t,
        completed: false,
        priority: true,
      },
      {
        id: createId(),
        title: 'Water plants / tidy desk',
        date: t,
        completed: true,
        priority: false,
      },
      {
        id: createId(),
        title: 'Send the lingering message',
        date: tomorrow,
        completed: false,
        priority: false,
      },
    ],
    importantDates: [
      {
        id: createId(),
        title: 'Passport renewal',
        date: iso(addMonths(today, 2)),
        recurring: 'none',
        notes: 'Allow 8 weeks. Check photo requirements.',
      },
      {
        id: createId(),
        title: 'Birthday — Mom',
        date: `${today.getFullYear()}-04-12`,
        recurring: 'yearly',
        notes: '',
      },
      {
        id: createId(),
        title: 'Lease / insurance review',
        date: nextWeek,
        recurring: 'none',
        notes: 'Gather statements before the call.',
      },
    ],
    notes: [
      {
        id: createId(),
        title: 'Wifi & house codes',
        content:
          'Guest network: Harbor-Guest\nGarage: 4591\nSpare key: planter, left of the steps.',
        pinned: true,
        updatedAt: new Date().toISOString(),
      },
      {
        id: createId(),
        title: 'Doctors & accounts',
        content:
          'Primary: Dr. Ellis — Fridays\nDentist: every 6 months\nPharmacy: corner of Oak & 3rd.',
        pinned: false,
        updatedAt: new Date().toISOString(),
      },
    ],
    goals: [
      {
        id: createId(),
        title: 'Ship a personal site',
        horizon: 'short',
        progress: 40,
        targetDate: iso(addDays(today, 21)),
        notes: 'One page. Ship ugly, then refine.',
        completed: false,
        priority: true,
      },
      {
        id: createId(),
        title: 'Read 12 books this year',
        horizon: 'medium',
        progress: 33,
        targetDate: `${today.getFullYear()}-12-31`,
        notes: 'Alternate fiction and a craft book.',
        completed: false,
        priority: false,
      },
      {
        id: createId(),
        title: 'Build a calmer money system',
        horizon: 'long',
        progress: 15,
        targetDate: iso(addMonths(today, 10)),
        notes: 'Automate savings. Quarterly review.',
        completed: false,
        priority: true,
      },
    ],
    habits: [
      {
        id: createId(),
        title: 'Move for 20 minutes',
        checks: { [t]: true },
        createdAt: new Date().toISOString(),
      },
      {
        id: createId(),
        title: 'Read 10 pages',
        checks: {},
        createdAt: new Date().toISOString(),
      },
      {
        id: createId(),
        title: 'No phone first hour',
        checks: { [t]: true },
        createdAt: new Date().toISOString(),
      },
    ],
  }
}
