import { useState } from 'react'
import { Download, Upload, RotateCcw, Sparkles } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import {
  downloadJson,
  persistableSlice,
  readJsonFile,
} from '../../utils/storage'
import { toISODate } from '../../utils/dates'
import Modal, { btnGhost, btnPrimary, inputClass } from '../ui/Modal'

export default function SettingsModal() {
  const { closeModal, importData, resetData, theme, dispatch, ...state } =
    useApp()
  const [error, setError] = useState('')

  const exportData = () => {
    downloadJson(
      persistableSlice(state),
      `harbor-backup-${toISODate(new Date())}.json`,
    )
  }

  const onImport = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const json = await readJsonFile(file)
      importData(json)
      setError('')
    } catch {
      setError('Could not read that file. Use a Harbor JSON backup.')
    }
  }

  return (
    <Modal title="Settings & data" onClose={closeModal} wide>
      <div className="space-y-6">
        <section>
          <h3 className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
            Appearance
          </h3>
          <div className="flex gap-2">
            {['dark', 'light'].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => dispatch({ type: 'SET_THEME', theme: mode })}
                className={`rounded-xl border px-4 py-2 text-sm capitalize ${
                  theme === mode
                    ? 'border-gold bg-gold/15 text-gold'
                    : 'border-line text-ink hover:bg-raised'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
            Portability
          </h3>
          <p className="mb-3 text-sm text-muted">
            Everything lives in this browser’s localStorage. Export a backup
            before clearing cache, switching machines, or changing browsers.
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btnPrimary} onClick={exportData}>
              <Download size={16} />
              Export to JSON
            </button>
            <label className={`${btnGhost} cursor-pointer`}>
              <Upload size={16} />
              Import from JSON
              <input
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={onImport}
              />
            </label>
          </div>
          {error ? <p className="mt-2 text-sm text-rose">{error}</p> : null}
        </section>

        <section>
          <h3 className="mb-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
            Reset
          </h3>
          <p className="mb-3 text-sm text-muted">
            Clearing data cannot be undone unless you have a JSON backup.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={btnGhost}
              onClick={() => {
                if (confirm('Replace everything with the sample dashboard?')) {
                  resetData('sample')
                }
              }}
            >
              <Sparkles size={16} />
              Load sample data
            </button>
            <button
              type="button"
              className={btnGhost}
              onClick={() => {
                if (confirm('Delete all events, notes, goals, and habits?')) {
                  resetData('empty')
                }
              }}
            >
              <RotateCcw size={16} />
              Clear all data
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-line bg-raised/60 p-4 text-sm text-muted">
          <p className="font-medium text-ink">Keyboard</p>
          <ul className="mt-2 space-y-1">
            <li>
              <kbd className={`${inputClass} inline w-auto px-2 py-0.5`}>n</kbd>{' '}
              new time block
            </li>
            <li>
              <kbd className={`${inputClass} inline w-auto px-2 py-0.5`}>t</kbd>{' '}
              jump to Today
            </li>
            <li>
              <kbd className={`${inputClass} inline w-auto px-2 py-0.5`}>,</kbd>{' '}
              settings
            </li>
          </ul>
        </section>
      </div>
    </Modal>
  )
}
