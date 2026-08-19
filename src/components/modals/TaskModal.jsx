import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { toISODate } from '../../utils/dates'
import Modal, { Field, btnDanger, btnGhost, btnPrimary, inputClass } from '../ui/Modal'

export default function TaskModal() {
  const { modal, closeModal, upsertItem, removeItem, tasks } = useApp()
  const existing = tasks.find((t) => t.id === modal?.payload?.id)
  const [form, setForm] = useState({
    title: '',
    date: toISODate(new Date()),
    priority: false,
    completed: false,
    ...existing,
    ...modal?.payload,
  })

  useEffect(() => {
    const found = tasks.find((t) => t.id === modal?.payload?.id)
    setForm({
      title: '',
      date: toISODate(new Date()),
      priority: false,
      completed: false,
      ...found,
      ...modal?.payload,
    })
  }, [modal, tasks])

  const save = () => {
    if (!form.title.trim()) return
    upsertItem('tasks', { ...form, title: form.title.trim() })
    closeModal()
  }

  return (
    <Modal
      title={form.id ? 'Edit task' : 'New task'}
      onClose={closeModal}
      footer={
        <>
          {form.id ? (
            <button
              type="button"
              className={`${btnDanger} mr-auto`}
              onClick={() => {
                removeItem('tasks', form.id)
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
      <Field label="Task">
        <input
          autoFocus
          className={inputClass}
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          onKeyDown={(e) => e.key === 'Enter' && save()}
          placeholder="A non-timed to-do for the day"
        />
      </Field>
      <Field label="Date">
        <input
          type="date"
          className={inputClass}
          value={form.date}
          onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
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
