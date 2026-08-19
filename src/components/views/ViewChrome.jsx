import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function ViewChrome({ title, eyebrow, onPrev, onNext, onToday }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow ? (
          <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-gold">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-[2rem] italic leading-none text-ink sm:text-4xl">
          {title}
        </h1>
      </div>
      {onPrev && onNext ? (
        <div className="flex items-center gap-1 rounded-full border border-line bg-panel p-1">
          <button
            type="button"
            onClick={onPrev}
            className="rounded-full p-2 text-muted hover:bg-raised hover:text-ink"
            aria-label="Previous"
          >
            <ChevronLeft size={16} />
          </button>
          {onToday ? (
            <button
              type="button"
              onClick={onToday}
              className="rounded-full px-3 py-1.5 text-xs uppercase tracking-wider text-muted hover:text-ink"
            >
              Today
            </button>
          ) : null}
          <button
            type="button"
            onClick={onNext}
            className="rounded-full p-2 text-muted hover:bg-raised hover:text-ink"
            aria-label="Next"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      ) : null}
    </div>
  )
}
