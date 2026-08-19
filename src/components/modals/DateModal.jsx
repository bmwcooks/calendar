import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { toISODate } from '../../utils/dates'
import Modal, { Field, btnDanger, btnGhost, btnPrimary, inputClass } from '../ui/Modal'

export default function DateModal() {
  const { modal, closeModal, upsertItem, removeItem, importantDates } = useApp()
  const existing = importantDates.find((d) => d.id === modal?.payload?.id)
  const [form, setForm] = useState({
    title: '',
    date: toISODate(new Date()),
    recurring: 'none',
    notes: '',
    ...existing,
    ...modal?.payload,
  })

  useEffect(() => {
    const found = importantDates.find((d) => d.id === modal?.payload?.id)
    setForm({
      title: '',
      date: toISODate(new Date()),
      recurring: 'none',
      notes: '',
      ...found,
      ...modal?.payload,
    })
  }, [modal, importantDates])

  const save = () => {
    if (!form.title.trim()) return
    upsertItem('importantDates', { ...form, title: form.title.trim() })
    closeModal()
  }

  return (
    <Modal
      title={form.id ? 'Edit important date' : 'New important date'}
      onClose={closeModal}
      footer={
        <>
          {form.id ? (
            <button
              type="button"
              className={`${btnDanger} mr-auto`}
              onClick={() => {
                removeItem('importantDates', form.id)
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
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          onKeyDown={(e) => e.key === 'Enter' && save()}
          placeholder="Renewal, birthday, deadline…"
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
      <Field label="Repeats">
        <select
          className={inputClass}
          value={form.recurring}
          onChange={(e) => setForm((p) => ({ ...p, recurring: e.target.value }))}
        >
          <option value="none">Does not repeat</option>
          <option value="yearly">Every year</option>
        </select>
      </Field>
      <Field label="Notes">
        <textarea
          className={`${inputClass} min-h-[80px] resize-y`}
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
        />
      </Field>
    </Modal>
  )
}
