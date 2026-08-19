import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'
import Modal, { Field, btnDanger, btnGhost, btnPrimary, inputClass } from '../ui/Modal'

export default function NoteModal() {
  const { modal, closeModal, upsertItem, removeItem, notes } = useApp()
  const existing = notes.find((n) => n.id === modal?.payload?.id)
  const [form, setForm] = useState({
    title: '',
    content: '',
    pinned: false,
    ...existing,
    ...modal?.payload,
  })

  useEffect(() => {
    const found = notes.find((n) => n.id === modal?.payload?.id)
    setForm({
      title: '',
      content: '',
      pinned: false,
      ...found,
      ...modal?.payload,
    })
  }, [modal, notes])

  const save = () => {
    if (!form.title.trim() && !form.content.trim()) return
    upsertItem('notes', {
      ...form,
      title: form.title.trim() || 'Untitled',
      updatedAt: new Date().toISOString(),
    })
    closeModal()
  }

  return (
    <Modal
      title={form.id ? 'Edit note' : 'New note'}
      onClose={closeModal}
      footer={
        <>
          {form.id ? (
            <button
              type="button"
              className={`${btnDanger} mr-auto`}
              onClick={() => {
                removeItem('notes', form.id)
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
          placeholder="Wifi, codes, a reminder…"
        />
      </Field>
      <Field label="Details">
        <textarea
          className={`${inputClass} min-h-[160px] resize-y`}
          value={form.content}
          onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
        />
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="accent-gold"
          checked={form.pinned}
          onChange={(e) => setForm((p) => ({ ...p, pinned: e.target.checked }))}
        />
        Pin to the top
      </label>
    </Modal>
  )
}
