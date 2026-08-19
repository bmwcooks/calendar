import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'
import Modal, { Field, btnDanger, btnGhost, btnPrimary, inputClass } from '../ui/Modal'

export default function HabitModal() {
  const { modal, closeModal, upsertItem, removeItem, habits } = useApp()
  const existing = habits.find((h) => h.id === modal?.payload?.id)
  const [title, setTitle] = useState(existing?.title ?? '')

  useEffect(() => {
    const found = habits.find((h) => h.id === modal?.payload?.id)
    setTitle(found?.title ?? modal?.payload?.title ?? '')
  }, [modal, habits])

  const save = () => {
    if (!title.trim()) return
    upsertItem('habits', {
      id: existing?.id,
      title: title.trim(),
      checks: existing?.checks ?? {},
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    })
    closeModal()
  }

  return (
    <Modal
      title={existing ? 'Edit habit' : 'New habit'}
      onClose={closeModal}
      footer={
        <>
          {existing ? (
            <button
              type="button"
              className={`${btnDanger} mr-auto`}
              onClick={() => {
                removeItem('habits', existing.id)
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
      <Field label="Habit">
        <input
          autoFocus
          className={inputClass}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && save()}
          placeholder="Something small you can repeat daily"
        />
      </Field>
    </Modal>
  )
}
