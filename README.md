# The BIGmini Crossword

A daily crossword puzzle web app built with React, TypeScript, and Vite. A new puzzle is published each day — solve it, track your score, and save your statistics by signing in with your Google or Discord account.

---

## Features

- **Daily puzzle** — one new crossword per day; progress is saved locally and resets automatically at midnight Eastern Time
- **Across & Down clues** — clue lists with auto-scroll to the active clue
- **Three zoom levels** — full-grid, clue-level, and cell-level zoom for comfortable play on any screen size
- **Check & Reveal** — verify or expose a single letter, a word, or the entire grid (with score impact warnings)
- **Scoring** — completion score calculated from revealed/checked cells and solve time (seconds per cell)
- **Timer** — pauses automatically when a modal is open, the tab is hidden, or the puzzle is complete
- **On-screen keyboard** — full QWERTY layout with number/symbol pages, a zoom button, and inline Check/Reveal menus
- **Authentication** — sign in with Google or Discord via OAuth popup; scores are submitted to a backend database
- **Pending score submission** — if you finish the puzzle while logged out, your score is automatically sent once you sign in
- **Stats** — lifetime wins and average score fetched from the backend
- **Settings** — light/dark/system theme, move-to-next-clue, skip-filled navigation, auto error check, and puzzle reset
- **Mobile-first layout** — sticky clue banner with prev/next chevron navigation, responsive grid

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Routing | React Router v6 |
| HTTP client | Axios 1.7 |
| Auth | Google OAuth + Discord OAuth |
| Icons | `react-icons` (FontAwesome 6) |
| Styling | SCSS (per-component + global partials) |
| State | React Context + `localStorage` |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install dependencies

```bash
npm install
```

### Environment variables

Create a `.env` file in the project root:

```env
VITE_SERVER_BASE_URL=
VITE_CLIENT_BASE_URL=
```

### Run in development

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

---

## Project Structure

```
src/
├── assets/data/          # Static puzzle JSON (puzzle-game-data.json, game-data-template.json)
├── components/           # UI components (Grid, ClueList, ClueContainer, Keyboard, Modals, …)
├── context/              # React contexts (GameData, Auth, Modal)
├── hooks/                # Game logic hooks (input, timer, check/reveal, scoring, …)
├── pages/                # Route-level pages (MainPage, AuthCallbackPage, …)
├── styles/               # Global SCSS partials (variables, mixins, reset)
└── types/                # TypeScript type definitions
```

---

## Puzzle Data

Puzzles are bundled as static JSON at build time. To publish a new puzzle, update the two files in `src/assets/data/`:

- **`game-data-template.json`** — contains the `gameDate` (ISO date string) and default game metadata
- **`puzzle-game-data.json`** — contains `dimensions`, `cells[][]` (a 2-D array of `CellData`), and `clues[]`

The app detects a date mismatch on tab focus and automatically reloads to pick up the new puzzle.

---

## Scoring

$$\text{score} = \frac{\text{totalCells} - \text{revealedCnt} - \text{checkedCnt} \times 0.5}{\text{totalCells}} \times 100$$

- **Revealed cells** deduct their full weight from the score.
- **Checked cells** (where the answer was wrong and you were told) deduct half weight.
- `secondsPerCell` is recorded as a secondary metric.

---

## Authentication & API

Authentication uses an OAuth popup flow. The popup navigates to the server's `/api/auth/google` or `/api/auth/discord` route, which redirects back to the client's `/auth/login-callback` page. That page posts the tokens to the opener via `window.postMessage`.

Access tokens are refreshed automatically via an Axios response interceptor on `401` responses.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/auth/google` | Initiate Google OAuth |
| `GET` | `/api/auth/discord` | Initiate Discord OAuth |
| `POST` | `/api/auth/logout` | Revoke refresh token |
| `POST` | `/api/auth/refresh-token` | Rotate access & refresh tokens |
| `POST` | `/api/games` | Submit today's score |
| `GET` | `/api/games/stats` | Fetch lifetime wins & average score |

---

## License

Private — all rights reserved.