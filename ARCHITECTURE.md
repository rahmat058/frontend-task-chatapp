# ChatApp — Architecture

Next.js 16 messenger **client** with JWT phone auth, TanStack Query for REST, Zustand for session/UI, and Socket.io for live delivery. Graphite + emerald product UI.

There is **no mock catalog of messages** in the repo. Conversations and history come from the hosted API.

Observed endpoint contract: **[docs/API.md](./docs/API.md)**. Assignment brief: **[docs/PRD.md](./docs/PRD.md)**. How to run: **[README.md](./README.md)**.

---

## High-level map

```
                    ┌─────────────────────────────────────────┐
                    │         AuthProvider + ChatShell        │
                    │  restore JWT · gate /chat · splash      │
                    └─────────────────────────────────────────┘
                                          │
        ┌─────────────┬───────────────────┴───────────┬─────────────┐
        ▼             ▼                               ▼             ▼
     Landing       Auth                            Chat          Next
     `/`           `/login`                        `/chat/*`     `/api/health`
     (public)      (guest + redirect)              (JWT)         (server proxy)
                                          │
                          ┌───────────────┴───────────────┐
                          ▼                               ▼
                     REST Axios                      Socket.io
                   `{ORIGIN}/api`                    `{ORIGIN}`
```

| Area    | Route group   | Shell        | Who can access              |
| ------- | ------------- | ------------ | --------------------------- |
| Landing | `src/app/page.tsx` | none     | Everyone                    |
| Auth    | `(auth)/login` | login layout | Guests (signed-in → `/chat`) |
| Chat    | `(chat)/chat` | `ChatShell`  | Authenticated after restore |
| Health  | `app/api/health` | —         | Everyone (server-side fetch) |

---

## Project structure

```
frontend-task-chatapp/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing
│   │   ├── (auth)/login/         # Phone + name
│   │   ├── (chat)/chat/          # Inbox + /chat/[id]
│   │   ├── api/health/           # Proxies origin /health (avoids browser CORS)
│   │   └── layout.tsx            # Query + Auth + Socket providers
│   ├── components/
│   │   ├── auth/                 # LoginForm, PhoneField
│   │   ├── chat/                 # Thread, bubbles, composer, group settings
│   │   ├── common/               # Button, Input, Dialog, Avatar, …
│   │   ├── conversations/        # Inbox list, new chat, new group
│   │   ├── landing/              # Marketing sections
│   │   └── layout/               # ChatShell, Sidebar, NavRail
│   ├── lib/
│   │   ├── api/                  # Axios client + resource modules
│   │   ├── hooks/                # Query/mutation hooks, debounce, socket
│   │   ├── socket/               # Socket.io store (useSyncExternalStore)
│   │   ├── store/                # Zustand: auth, UI, directory, toasts
│   │   └── utils/                # normalize, conversation, message, phone
│   ├── providers/                # QueryProvider, AuthProvider, SocketProvider
│   └── types/                    # models, api, socket events
├── docs/                         # PRD, API, design-style
├── README.md
└── ARCHITECTURE.md
```

---

## Auth

Phone + name only. **No password, no separate register.** `POST /api/auth/login` creates a user on a new number and returns a JWT.

### Routes

| Route    | Purpose                                      |
| -------- | -------------------------------------------- |
| `/login` | Credentials form; redirects if already in    |
| `/chat`  | Inbox — `ChatShell` sends guests to `/login` |

### Stack

| Piece                 | Location                         |
| --------------------- | -------------------------------- |
| JWT in `localStorage` | `lib/utils/storage.ts` (`chat_jwt`) |
| Session store         | `lib/store/authStore.ts`         |
| Restore on load       | `providers/AuthProvider.tsx` → `GET /api/auth/me` |
| Login / logout        | `lib/hooks/useAuth.ts`           |
| Bearer header         | Axios interceptor in `lib/api/client.ts` |
| 401                   | Interceptor calls `clearAuth()` — no hard `location` reload |

### Auth status machine

| Status              | Meaning                                              |
| ------------------- | ---------------------------------------------------- |
| `restoring`         | Initial. Token may exist; `/me` has not finished     |
| `authenticated`     | `/me` (or login) succeeded                           |
| `unauthenticated`   | No token, `/me` failed, or 401                       |

`ChatShell` and the login page **must wait** for `restoring` to end. Treating “no user yet” as logged-out would flash login on every refresh.

### Phone rules

`lib/utils/phone.ts`: country `+880`, **10** local digits. UI uses `PhoneField` (not a free-text international input).

---

## Chat app

`ChatShell` is a client auth gate plus a two-pane product layout: 72px nav rail, ~330px sidebar, thread column. Below `md`, either the list **or** the thread is shown (`hidden` / `flex`), not both squeezed.

### Routes

| Route          | Purpose                                              |
| -------------- | ---------------------------------------------------- |
| `/chat`        | Empty thread pane — “Select a conversation”          |
| `/chat/[id]`   | `ConversationView` → `ChatPanel`                     |

`export const instant = false` on chat routes so session restore is not prerendered as an instant navigation target.

### Inbox

`ConversationList` + `ConversationItem`:

- Filters: All / Unread / Groups (active filter is the emerald pill)
- Local search: name + last-message snippet, debounced 600ms
- Selected row: `--surface-active` + 3px emerald rail
- Unread badge from `uiStore.unreadById` (hidden on the active thread)

New chat / new group are dialogs from the sidebar, not separate routes.

### Direct thread

- Header: peer name + “Direct message”
- Intro card (centered): avatar, name, “This is the beginning of your conversation”, **View profile** / **Safety tools**
- Day dividers, clustered bubbles, composer

View profile shows directory name + phone when known. Safety tools explains the thread is private (no block API). Paperclip is `aria-disabled` — attachments are not in `SendMessageRequest`.

### Groups

- Header **Manage group** → `GroupSettingsDialog`
- Intro card uses the same centered stack with **Manage group**
- Admin actions: rename, add (search), promote, remove, leave — with confirm on destructive actions

Permissions: if `admins` is omitted on list payloads, the UI allows management and lets the API reject forbidden calls.

---

## Data & state

### REST (Axios)

`API_ORIGIN` = `process.env.NEXT_PUBLIC_CHAT_API_ORIGIN` or the Render host.

| Module                    | Responsibility              |
| ------------------------- | --------------------------- |
| `lib/api/client.ts`       | Base URL, Bearer, 401       |
| `lib/api/auth.ts`         | login, me                   |
| `lib/api/users.ts`        | search (`AbortSignal`)      |
| `lib/api/conversations.ts`| list, start DM, history     |
| `lib/api/messages.ts`     | send                        |
| `lib/api/groups.ts`       | create / members / rename   |
| `lib/api/normalize.ts`    | unwrap envelopes + errors   |

### TanStack Query

| Key                         | Hook                 | Notes                                      |
| --------------------------- | -------------------- | ------------------------------------------ |
| `['conversations']`         | `useConversations`   | List + mutations invalidate                |
| `['messages', id]`          | `useMessages`        | Infinite query, `before` cursor, `staleTime: Infinity` (socket keeps it fresh) |
| `['users', 'search', term]` | `useUserSearch`      | Enabled when term is non-empty; `staleTime` 60s |

Defaults (`QueryProvider`): `staleTime` 30s, `gcTime` 5 min, `retry: 1`, `refetchOnWindowFocus: false`.

### Zustand

| Store            | Persistence                         | Role                                      |
| ---------------- | ----------------------------------- | ----------------------------------------- |
| `authStore`      | JWT via `storage`                   | Session                                   |
| `userDirectory`  | `localStorage` `chat_user_directory`| Names/phones by user id + conversation id |
| `uiStore`        | memory                              | Unread counts, dialogs, active id         |
| `toastStore`     | memory                              | Toasts                                    |

`rememberPeer(conversationId, user)` is written when a DM is started from search so the sidebar still shows a name after a list refetch that returns ids only.

### Search debounce

| Surface                         | Mechanism                                                                 |
| ------------------------------- | ------------------------------------------------------------------------- |
| People search (new chat/group, add members) | `Input` `debounceMs={SEARCH_DEBOUNCE_MS}` (600) — `onChange` fires after idle |
| Inbox filter                    | `useDebounce(query, 600)` then `useMemo` filter                           |
| Network                         | `useUserSearch` uses the **settled** string; React Query is the result cache |

Clearing the field flushes immediately (no 600ms wait to empty results). In-flight search is aborted via Axios `signal`.

---

## Realtime

Socket.io is an **external lifecycle**, not React state. `lib/socket/socket.ts` exposes a snapshot through `useSyncExternalStore`.

| Direction       | Event                  | App behavior                                                                 |
| --------------- | ---------------------- | ---------------------------------------------------------------------------- |
| Connect         | `io(API_ORIGIN, { auth: { token } })` | Host origin, websocket + polling fallback                         |
| Client → server | `message:send`         | **Not used for send.** REST `POST /api/messages` is the write path          |
| Server → client | `message:new`          | Normalize → merge into message pages → drop matching optimistic row         |
| Server → client | `conversation:updated` | Invalidate `['conversations']`                                              |
| Connect / reconnect | `connect`          | Invalidate messages + conversations (close gap while disconnected)          |

Unread: if `pathname !== /chat/{conversationId}`, `incrementUnread`. Opening a thread `clearUnread`.

`SocketProvider` connects only while `isAuthenticated`. Logout disconnects.

---

## Messages

### History

`GET /api/conversations/:id/messages?limit=20&before=`

`useMessages` is an infinite query. `mergeMessages` drops an optimistic row when a confirmed message with the same sender + text exists.

### Send

1. `useSendMessage` inserts an `optimistic-*` message
2. `POST /api/messages` `{ conversationId, text }`
3. On error, restore the composer text and surface the API message
4. On socket `message:new`, replace the pending bubble

Composer: Enter sends, Shift+Enter newline. Lucide icons (same SVG on Windows/macOS). Emoji picker inserts at the caret.

### Bubbles

Clustered by sender + calendar day + 5 minutes. Incoming: tail / sharp corner **top-left** on the first of a cluster. Outgoing: tail **bottom-right** on the last. Tails sit **behind** the fill (no 1px border seam).

---

## API used by this client

Full observed shapes: **[docs/API.md](./docs/API.md)**.

| Method | Path | Notes |
| ------ | ---- | ----- |
| POST   | `/api/auth/login` | `{ phone, name }` → `{ token, user }` |
| GET    | `/api/auth/me` | Restore session |
| GET    | `/api/users/search?q=` | People |
| GET    | `/api/conversations` | Inbox |
| POST   | `/api/conversations` | `{ userId }` start/open DM |
| GET    | `/api/conversations/:id/messages` | Cursor history |
| POST   | `/api/messages` | `{ conversationId, text }` |
| POST   | `/api/conversations/group` | `{ name, participantIds }` |
| POST   | `/api/conversations/:id/participants` | Add |
| DELETE | `/api/conversations/:id/participants/:userId` | Remove or leave |
| POST   | `/api/conversations/:id/admins` | Promote |
| PATCH  | `/api/conversations/:id` | Rename |
| GET    | `/health` | Via Next `GET /api/health` |

---

## Cross-cutting concerns

| Topic                | Implementation                                                                 |
| -------------------- | ------------------------------------------------------------------------------ |
| **Payload variance** | `unwrapObject` / `unwrapArray`; conversation + message normalizers             |
| **Ids**              | `getEntityId` / `idsMatch` — string vs populated object                        |
| **Display names**    | `getConversationName` ignores placeholder `"direct message"`                   |
| **Unknown users**    | `useResolveUnknownUsers` searches by id when the directory has no name         |
| **Debounce**         | `SEARCH_DEBOUNCE_MS = 600`                                                     |
| **Motion**           | Framer Motion on landing; `prefers-reduced-motion` respected                   |
| **Tokens**           | CSS variables in `src/app/globals.css` from `docs/design-style.md`             |
| **Icons**            | Lucide SVG only — no font emoji for chrome                                     |
| **Health CORS**      | Server route fetches origin `/health`                                          |

---

## Design patterns

Frontend-only: no Prisma, no NextAuth. Domain logic is in hooks + normalizers.

| Pattern              | Where                                      | Purpose                                      |
| -------------------- | ------------------------------------------ | -------------------------------------------- |
| Provider stack       | `app/layout.tsx`                           | Query → Auth → Socket                        |
| External store       | `lib/socket/socket.ts`                     | Socket lifecycle outside React render        |
| Repository-ish API   | `lib/api/*.ts`                             | One module per resource                      |
| Defensive adapter    | `normalize.ts`, `conversation.ts`, `message.ts` | Unstable JSON → typed models            |
| Optimistic mutation  | `useSendMessage`                           | Pending bubble + rollback                    |
| Directory cache      | `userDirectory`                            | Survive id-only list payloads                |
| Debounced input      | `components/common/Input.tsx` `debounceMs` | Do not hit search per key                    |

```
UI → hooks (Query / Zustand) → lib/api (Axios) → hosted /api
UI ← SocketProvider ← Socket.io message:new / conversation:updated
```

---

## Known product limits (API)

| Missing in backend                         | UI choice                                              |
| ------------------------------------------ | ------------------------------------------------------ |
| Attachments / upload                       | Paperclip disabled, tooltip “coming soon”              |
| Presence / last-seen                       | Subtitle is “Direct message”, not “Online”             |
| Block / report                             | Safety tools dialog states there is no endpoint        |
| Typing indicators, read receipts beyond sent | Single/double check = optimistic vs confirmed send   |
| Message edit/delete                        | Not offered                                            |

---

## Visual system

Graphite surfaces, emerald only for action, focus, unread, and sent bubbles. Geist Sans with Inter fallback. See `docs/design-style.md` and tokens in `src/app/globals.css`.
