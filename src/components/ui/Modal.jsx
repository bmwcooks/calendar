import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({
  title,
  onClose,
  children,
  wide = false,
  footer = null,
}) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} max-h-[min(92vh,880px)] overflow-y-auto rounded-2xl border border-line bg-panel shadow-2xl`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-panel/95 px-5 py-4 backdrop-blur">
          <h2 id="modal-title" className="font-display text-xl text-ink">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted hover:bg-raised hover:text-ink"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer ? (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line px-5 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function Field({ label, children }) {
  return (
    <label className="mb-3 block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
      {children}
    </label>
  )
}

export const inputClass =
  'w-full rounded-xl border border-line bg-raised px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-gold/70'

export const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-medium text-[#1c1608] transition hover:brightness-110'

export const btnGhost =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm text-ink transition hover:bg-raised'

export const btnDanger =
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm text-rose transition hover:bg-rose/10'
