# ChatApp

![ChatApp — inbox and thread](./public/chat-app.png)

**ChatApp** is a real-time messenger client for private 1:1 threads and groups. It is a Next.js 16 frontend that talks to the assignment backend over REST + Socket.io. Sign in with a name and a Bangladesh phone number — no password. New numbers register; known numbers return.

There is **no local mock chat API**. Auth, conversations, messages, and groups live on the hosted backend.

**API origin (default):** [frontend-task-chatapp.onrender.com](https://frontend-task-chatapp.onrender.com)  
**Live OpenAPI:** [frontend-task-chatapp.onrender.com/docs](https://frontend-task-chatapp.onrender.com/docs/)

For architecture, routes, sockets, stores, and design decisions — see **[ARCHITECTURE.md](./ARCHITECTURE.md)**.

For the assignment brief, observed API, and visual system — see **[docs/](./docs/)**.

---

## Tech Stack

### Core

<div>
<img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white">
<img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black">
<img src="https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white">
<img src="https://img.shields.io/badge/TypeScript_5-007ACC?style=for-the-badge&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/Node.js_24-339933?style=for-the-badge&logo=nodedotjs&logoColor=white">
<img src="https://img.shields.io/badge/Motion-000000?style=for-the-badge&logo=framer&logoColor=white">
</div>

### Data, auth & realtime

<div>
<img src="https://img.shields.io/badge/TanStack_Query_5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white">
<img src="https://img.shields.io/badge/Zustand_5-000000?style=for-the-badge&logo=redux&logoColor=white">
<img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white">
<img src="https://img.shields.io/badge/Socket.io_4-010101?style=for-the-badge&logo=socketdotio&logoColor=white">
<img src="https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white">
</div>

### UI & tooling

<div>
<img src="https://img.shields.io/badge/Lucide-000000?style=for-the-badge&logo=lucide&logoColor=white">
<img src="https://img.shields.io/badge/date--fns-770C56?style=for-the-badge&logo=databricks&logoColor=white">
<img src="https://img.shields.io/badge/ESLint_9-4B32C3?style=for-the-badge&logo=eslint&logoColor=white">
<img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black">
</div>

**Key dependencies:** `next` · `react` · `@tanstack/react-query` · `zustand` · `axios` · `socket.io-client` · `react-hook-form` · `framer-motion` · `lucide-react` · `date-fns` · `clsx` · `tailwind-merge`

---

## Features

- **Landing** — marketing page for the product (hero, capabilities, features, how-it-works, FAQ, CTA)
- **Phone sign-in** — name + Bangladesh `+880` number; JWT in `localStorage`; session restore via `GET /api/auth/me`
- **Inbox** — conversation list with All / Unread / Groups filters and local search
- **Direct threads** — search people, open or resume a 1:1 chat
- **Groups** — create, rename, add, promote admin, remove, leave
- **Realtime** — Socket.io `message:new` and `conversation:updated`; reconnect refetches gaps
- **Optimistic send** — `POST /api/messages` with a pending bubble; socket echo replaces the placeholder
- **Unread** — badges on other threads; the open thread does not steal scroll
- **Search debounce** — people search waits **600ms** after typing stops (`SEARCH_DEBOUNCE_MS`); React Query caches results 60s
- **Responsive** — below `md`, list and thread are separate views (not two squeezed columns)

---

## Prerequisites

| Requirement | Version / notes                          |
| ----------- | ---------------------------------------- |
| **Node.js** | `>=24.11.0` (see `package.json` engines) |
| **npm**     | Package manager for this repo            |

No local database. The client uses the hosted Chat API (or an origin you set in env).

---

## First-time setup

### 1. Clone and install

```bash
cd frontend-task-chatapp
nvm use          # if you use nvm — Node 24
npm install
```

### 2. Environment variables

Optional. Defaults already point at the assignment API.

| Variable                      | Required | Notes                                                                                 |
| ----------------------------- | -------- | ------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_CHAT_API_ORIGIN` | No       | Host origin **without** `/api`. Default: `https://frontend-task-chatapp.onrender.com` |

Create `.env.local` only if you need a different backend:

```bash
NEXT_PUBLIC_CHAT_API_ORIGIN=https://frontend-task-chatapp.onrender.com
```

REST calls go to `{ORIGIN}/api`. Socket.io connects to `{ORIGIN}` (not `/api`).

### 3. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Path         | What you get          |
| ------------ | --------------------- |
| `/`          | Landing page          |
| `/login`     | Name + phone sign-in  |
| `/chat`      | Inbox (auth required) |
| `/chat/[id]` | Active thread         |

---

## Scripts

| Command                | Description                    |
| ---------------------- | ------------------------------ |
| `npm run dev`          | Next.js dev server (Turbopack) |
| `npm run build`        | Production build               |
| `npm run start`        | Run production server          |
| `npm run lint`         | ESLint                         |
| `npm run format`       | Prettier write                 |
| `npm run format:check` | Prettier check                 |

Type-check (not a package script): `npx tsc --noEmit`.

---

## After pulling changes

```bash
npm install
npm run dev
```

Restart the dev server after changing `.env.local`.

---

## Troubleshooting

| Problem                                      | Fix                                                                                                                  |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Wrong Node version                           | `nvm install 24.11.0 && nvm use`                                                                                     |
| Login works then `/chat` bounces to `/login` | Wait for session restore (`GET /api/auth/me`). Hard-reload if `chat_jwt` was cleared.                                |
| Empty inbox / 401 after idle                 | JWT expired or invalid — sign in again. Axios clears auth on 401.                                                    |
| Names show as “Direct message”               | List payloads often return participant **ids only**. Search that person once so the directory can remember the name. |
| People search fires every keystroke          | Search fields must use `debounceMs={SEARCH_DEBOUNCE_MS}` (600). Restart `npm run dev` after pull.                    |
| Socket never connects                        | Confirm origin has **no** `/api` suffix. Browser must reach the Socket.io host, not only REST.                       |
| Health badge / CORS on `/health`             | Browser calls to the public `/health` URL are often blocked; the app proxies via `GET /api/health`.                  |
| Paperclip does nothing                       | Attachments are not in the message API. The control is disabled with “coming soon”.                                  |
| Stale user after testing another account     | DevTools → Application → Local Storage → remove `chat_jwt` and `chat_user_directory`.                                |
| People search is not case-sensitive          | `GET /api/users/search` matches **abc** and **ABC** the same. That is the API, not a client filter.                  |
| Your name changes after refresh              | Reload calls `GET /api/auth/me`. The server sometimes returns a stored name that differs from the one sent at login. |

---

## Docs

| File                                           | Contents                                      |
| ---------------------------------------------- | --------------------------------------------- |
| [ARCHITECTURE.md](./ARCHITECTURE.md)           | Routes, data flow, sockets, stores, decisions |
| [docs/API.md](./docs/API.md)                   | Observed REST + socket contract               |
| [docs/PRD.md](./docs/PRD.md)                   | Assignment requirements                       |
| [docs/design-style.md](./docs/design-style.md) | Visual system (graphite / emerald)            |

---

## Thought process (assignment Part 3)

This client is a **frontend against an existing backend**. I did not invent REST routes or a database. The work is mapping an under-specified API onto a product UI that still feels complete. Madagascar.

### Architecture & libraries (Part 1)

Auth starts as `restoring` until `GET /api/auth/me` finishes, so a valid JWT is never bounced to login on reload. TanStack Query owns server cache (conversations, paginated messages, people search). Zustand owns session, unread, dialogs, and a local **user directory** because list payloads often return participant ids with no names.

Trade-off: REST `POST /api/messages` is the write path so validation, errors, and optimistic bubbles stay in one place. Socket.io is inbound only (`message:new`, `conversation:updated`, reconnect refetch). Using `message:send` as well would have duplicated send-error handling.

Search is debounced **600ms** at the input so `/users/search` is not called per key. React Query caches the settled term.

Folder layout, event tables, and stores: **[ARCHITECTURE.md](./ARCHITECTURE.md)**. Observed contract: **[docs/API.md](./docs/API.md)**.

### Design decisions (Part 2)

The landing page uses the same **graphite + emerald** system as the messenger so marketing and product feel like one app. Emerald is reserved for action (CTAs, sent bubbles, unread). Type is Geist with a tight tracking hero; motion is Framer `Reveal` with `prefers-reduced-motion` respected. The hero includes a framed product preview instead of stock screenshots. Copy leads with private 1:1 and groups, then **Try it now →** to `/login`.

### AI tool usage

Cursor (Grok) was used for scaffolding, API-shape research, debugging session restore and payload variance, and drafting docs. I kept architecture choices (restoring auth, REST send + socket receive, directory cache, debounce) and rejected faking attachments, presence, and extra backend routes. UI polish and copy were iterated against `docs/design-style.md` and the live API, not generated as a generic chat template.

### What I'd improve with more time

- Hosted demo URL and a small Playwright pass over login → search → send → reconnect.
- Preserve scroll position more carefully when loading older pages (anchor on the first visible message).
- If the API added typing / read receipts, show them; until then those stay out of the UI.

### API issues observed

The published OpenAPI spec is request-focused and omits most response bodies and status codes. In practice:

- Conversation list items often have **ids only** for DM participants (no display name). Workaround: `userDirectory` filled from search, login, and sockets.
- Message `sender` is sometimes a populated object and sometimes a bare id. Workaround: `normalizeMessage` + `getSenderId`.
- Responses are sometimes a bare object and sometimes `{ data }` / `{ message }` / `{ conversation }`. Workaround: `unwrapObject` / `unwrapArray`.
- Browser `GET` to origin `/health` is CORS-blocked even when `/api` works. Workaround: Next.js `GET /api/health` proxy.
- Pagination `hasMore` can be true without a usable `nextCursor`. Workaround: treat `hasMore` as true only when a cursor string is present.
- **User search is not case-sensitive.** `GET /api/users/search?q=` matches the same people for `abc` and `ABC`. The client searches with the typed string as-is and does not add a case-sensitive filter.
- **Display name can change on refresh.** Login sends `{ phone, name }`, but a reload restores the session with `GET /api/auth/me`. For an existing phone, the API sometimes keeps an older stored name (or a different spelling/casing) instead of the name just entered. The client treats `/me` as the source of truth after restore, so the header can disagree with the last login form.

None of these blocked the product; they are why the client is defensive rather than strictly typed to the spec.
