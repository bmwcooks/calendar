import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { EVENT_COLORS, hourToTime } from '../../utils/constants'
import { toISODate } from '../../utils/dates'
import Modal, { Field, btnDanger, btnGhost, btnPrimary, inputClass } from '../ui/Modal'

const blank = (payload = {}) => ({
  id: payload.id,
  title: payload.title ?? '',
  date: payload.date ?? toISODate(new Date()),
  startTime: payload.startTime ?? hourToTime(9),
  endTime: payload.endTime ?? hourToTime(10),
  color: payload.color ?? 'gold',
  notes: payload.notes ?? '',
  priority: payload.priority ?? false,
  allDay: payload.allDay ?? false,
})

export default function EventModal() {
  const { modal, closeModal, upsertItem, removeItem, events } = useApp()
  const existing = events.find((e) => e.id === modal?.payload?.id)
  const [form, setForm] = useState(() => blank({ ...existing, ...modal?.payload }))

  useEffect(() => {
    const found = events.find((e) => e.id === modal?.payload?.id)
    setForm(blank({ ...found, ...modal?.payload }))
  }, [modal, events])

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const save = () => {
    if (!form.title.trim()) return
    upsertItem('events', {
      ...form,
      title: form.title.trim(),
      endTime: form.allDay ? '' : form.endTime,
      startTime: form.allDay ? '' : form.startTime,
    })
    closeModal()
  }

  return (
    <Modal
      title={form.id ? 'Edit block' : 'New time block'}
      onClose={closeModal}
      footer={
        <>
          {form.id ? (
            <button
              type="button"
              className={`${btnDanger} mr-auto`}
              onClick={() => {
                removeItem('events', form.id)
                closeModal()
              }}
            >
              Delete
            </button>
          ) : null}
          <button type="button" className={btnGhost} onClick={closeModal}>
            Cancel
          </button>
          <button type="button" className={btnPrimary} onClick={save}>
            Save
          </button>
        </>
      }
    >
      <Field label="Title">
        <input
          autoFocus
          className={inputClass}
          value={form.title}
          onChange={set('title')}
          placeholder="What are you protecting time for?"
          onKeyDown={(e) => e.key === 'Enter' && save()}
        />
      </Field>
      <Field label="Date">
        <input
          type="date"
          className={inputClass}
          value={form.date}
          onChange={set('date')}
        />
      </Field>
      <label className="mb-3 flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          checked={form.allDay}
          onChange={set('allDay')}
          className="accent-gold"
        />
        All day / untimed
      </label>
      {!form.allDay ? (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Starts">
            <input
              type="time"
              className={inputClass}
              value={form.startTime}
              onChange={set('startTime')}
            />
          </Field>
          <Field label="Ends">
            <input
              type="time"
              className={inputClass}
              value={form.endTime}
              onChange={set('endTime')}
            />
          </Field>
        </div>
      ) : null}
      <Field label="Color">
        <div className="flex flex-wrap gap-2">
          {EVENT_COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, color: c.id }))}
              className={`h-8 w-8 rounded-full border-2 event-${c.id} ${
                form.color === c.id ? 'border-ink' : 'border-transparent'
              }`}
              aria-label={c.label}
              title={c.label}
            />
          ))}
        </div>
      </Field>
      <Field label="Notes">
        <textarea
          className={`${inputClass} min-h-[84px] resize-y`}
          value={form.notes}
          onChange={set('notes')}
          placeholder="Optional context"
        />
      </Field>
      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          checked={form.priority}
          onChange={set('priority')}
          className="accent-gold"
        />
        Flag as top priority
      </label>
    </Modal>
  )
}
