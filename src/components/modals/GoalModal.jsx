import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { GOAL_HORIZONS } from '../../utils/constants'
import { toISODate } from '../../utils/dates'
import Modal, { Field, btnDanger, btnGhost, btnPrimary, inputClass } from '../ui/Modal'

export default function GoalModal() {
  const { modal, closeModal, upsertItem, removeItem, goals } = useApp()
  const existing = goals.find((g) => g.id === modal?.payload?.id)
  const [form, setForm] = useState({
    title: '',
    horizon: 'short',
    progress: 0,
    targetDate: toISODate(new Date()),
    notes: '',
    completed: false,
    priority: false,
    ...existing,
    ...modal?.payload,
  })

  useEffect(() => {
    const found = goals.find((g) => g.id === modal?.payload?.id)
    setForm({
      title: '',
      horizon: 'short',
      progress: 0,
      targetDate: toISODate(new Date()),
      notes: '',
      completed: false,
      priority: false,
      ...found,
      ...modal?.payload,
    })
  }, [modal, goals])

  const save = () => {
    if (!form.title.trim()) return
    const progress = Number(form.progress) || 0
    upsertItem('goals', {
      ...form,
      title: form.title.trim(),
      progress,
      completed: progress >= 100 || form.completed,
    })
    closeModal()
  }

  return (
    <Modal
      title={form.id ? 'Edit goal' : 'New goal'}
      onClose={closeModal}
      footer={
        <>
          {form.id ? (
            <button
              type="button"
              className={`${btnDanger} mr-auto`}
              onClick={() => {
                removeItem('goals', form.id)
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
      <Field label="Goal">
        <input
          autoFocus
          className={inputClass}
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          placeholder="What will be true when this is done?"
        />
      </Field>
      <Field label="Horizon">
        <select
          className={inputClass}
          value={form.horizon}
          onChange={(e) => setForm((p) => ({ ...p, horizon: e.target.value }))}
        >
          {GOAL_HORIZONS.map((h) => (
            <option key={h.id} value={h.id}>
              {h.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label={`Progress · ${form.progress}%`}>
        <input
          type="range"
          min="0"
          max="100"
          value={form.progress}
          onChange={(e) => setForm((p) => ({ ...p, progress: e.target.value }))}
          className="w-full accent-gold"
        />
      </Field>
      <Field label="Target date">
        <input
          type="date"
          className={inputClass}
          value={form.targetDate}
          onChange={(e) => setForm((p) => ({ ...p, targetDate: e.target.value }))}
        />
      </Field>
      <Field label="Notes">
        <textarea
          className={`${inputClass} min-h-[80px] resize-y`}
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
        />
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="accent-gold"
          checked={form.priority}
          onChange={(e) => setForm((p) => ({ ...p, priority: e.target.checked }))}
        />
        Flag as top priority
      </label>
    </Modal>
  )
}
