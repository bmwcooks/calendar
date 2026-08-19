# Harbor — Personal Dashboard & Life Organizer

A local-first planner for the day, week, month, and year. Built with React (Vite), Tailwind CSS, and Lucide icons. All data stays in your browser and can be exported as JSON.

Live site (after GitHub Pages is enabled): `https://bmwcooks.github.io/calendar/`

## Features

- **Today** — live clock, automatic midnight rollover, 6:00 AM–11:00 PM time blocks, a current-time marker, and an untimed checklist
- **Week** — seven-column planner; click a slot to schedule, drag a block to move it
- **Month** — interactive grid of events, deadlines, and milestones
- **Year** — twelve-month overview grouped by quarter, plus a yearly roadmap
- **Top priorities** — starred tasks, blocks, and goals with checkboxes and progress
- **Memory vault** — important dates with countdowns, plus pinned quick notes
- **Goals & habits** — short / medium / long horizons, progress bars, and a 7-day habit strip
- **Settings** — dark / light theme, **Export to JSON**, **Import from JSON**, sample data, and a full reset

## Local development

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default `http://localhost:5173`).

```bash
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## GitHub Pages

This repo is configured to deploy from `main` via `.github/workflows/deploy.yml`.

1. In the GitHub repo: **Settings → Pages → Build and deployment**
2. Set **Source** to **GitHub Actions**
3. Push to `main` (or run the workflow manually)

`vite.config.js` sets `base` to `/calendar/` during GitHub Actions builds so assets resolve under `https://<user>.github.io/calendar/`.

## Data

Harbor stores everything in `localStorage` under the key `harbor-folio-v1`. Use **Settings → Export to JSON** before clearing site data or switching browsers. Import the same file on another device to restore.

First launch loads a small sample week so the interface is not empty. Clear it or replace it from Settings whenever you like.

## Keyboard

| Key | Action |
| --- | --- |
| `n` | New time block |
| `t` | Jump to Today |
| `,` | Settings |

## Stack

- React 19 + Vite 6
- Tailwind CSS 4
- Lucide React
