# Product Requirements Document (PRD)
### Frontend Developer Take-Home Assignment — Chat Application

> **Source:** `Senior_Frontend_Engineer_Task_Instructions.pdf`
> **API Docs:** https://frontend-task-chatapp.onrender.com/docs/
> **Submission Deadline:** Aug 22, 2026 — 4:00 PM
> **Tech Stack:** React / Next.js (TypeScript)

---

## Table of Contents

1. [Assignment Overview](#1-assignment-overview)
2. [Part 1 — Chat Application](#2-part-1--chat-application-api--feature-implementation)
   - [2.1 API Documentation Deliverable](#21-api-documentation-deliverable)
   - [2.2 Authentication & Authorization](#22-authentication--authorization)
   - [2.3 WebSocket Real-time](#23-websocket-real-time)
   - [2.4 Feature Requirements F1–F8](#24-feature-requirements)
   - [2.5 UX & Edge Cases](#25-ux--edge-cases)
3. [Part 2 — Creative Landing Page](#3-part-2--creative-landing-page)
4. [Part 3 — Thought Process Write-up](#4-part-3--thought-process-write-up)
5. [API Reference](#5-api-reference)
6. [Data Models (TypeScript)](#6-data-models-typescript)
7. [Screens & User Flows](#7-screens--user-flows)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [Bonus Opportunities](#9-bonus-opportunities)
10. [Submission Checklist](#10-submission-checklist)

---

## 1. Assignment Overview

Three-part take-home assignment. Each part builds on the previous one.

| Part | Title | Deliverable |
|------|-------|-------------|
| **Part 1** | API Docs + Chat App | Working chat screens + standalone API doc |
| **Part 2** | Creative Landing Page | Landing page showcasing Part 1 |
| **Part 3** | Thought Process Write-up | README section or separate doc |

> **Evaluation Focus:** Code quality, decision-making, creativity, and real-world judgment. No single "correct" solution — how you think and structure your code matters most.

---

## 2. Part 1 — Chat Application (API + Feature Implementation)

### 2.1 API Documentation Deliverable

Write your own API documentation **before** you start building. This is a **standalone deliverable**.

- Format: Markdown, Postman collection, or OpenAPI/Swagger YAML — your choice
- Must cover: endpoints, HTTP methods, request body, response body/shape (inspect the live API), parameters, status codes
- You **may rename** endpoints, add new ones, or remove ones — it's your call
- Suggested output: `docs/API.md`

---

### 2.2 Authentication & Authorization

**Endpoint:** `POST /api/auth/login`

- **No separate sign-up.** New phone number → auto-registers. Existing phone → logs in.
- Returns a **JWT token** on success
- All protected requests require: `Authorization: Bearer <token>`
- On app load: call `GET /api/auth/me` to restore an existing session from a stored token

**Login Screen Requirements:**

| Field | Type | Validation |
|-------|------|------------|
| Phone number | text input | Required, valid phone format |
| Name | text input | Required, non-empty |

- No password field
- On success → redirect to the chat main screen
- Persist JWT to `localStorage` for session continuity

---

### 2.3 WebSocket (Real-time)

**Library:** Socket.io client

```js
// Connect to ROOT origin — NOT /api
const socket = io('https://frontend-task-chatapp.onrender.com', {
  auth: { token }  // JWT from login
});
```

> ⚠️ **Critical:** Socket.io lives at the host root, not under `/api`. An invalid or missing token is rejected at handshake time.

#### Event Reference

| Direction | Event | Payload | Description |
|-----------|-------|---------|-------------|
| Client → Server | `message:send` | `{ conversationId, text }` | Send a message (optional ack callback) |
| Server → Client | `message:new` | Message object | New message arrived for the current user |
| Server → Client | `conversation:updated` | Conversation object | Group created, renamed, or members/admins changed |

**Behavior rules:**
- `message:new` → append to active conversation list; show unread badge if not active
- `conversation:updated` → refresh conversation name/participants in sidebar
- On socket disconnect → show reconnecting banner; on reconnect → re-fetch latest messages to close any gap

---

### 2.4 Feature Requirements

#### F1 — Login Screen

| ID | Requirement |
|----|-------------|
| F1.1 | User enters **phone number** and **name** to log in/register |
| F1.2 | New phone number triggers auto-registration; existing phone logs in |
| F1.3 | JWT stored and reused across sessions (localStorage) |
| F1.4 | On page reload → call `GET /api/auth/me` with stored token to restore session |
| F1.5 | Clear error state shown on failed login |

---

#### F2 — Conversation List Screen

| ID | Requirement |
|----|-------------|
| F2.1 | Fetch all conversations the user is part of via `GET /api/conversations` |
| F2.2 | Show: name (or participant name for DMs), last message preview, timestamp |
| F2.3 | Visually distinguish **direct** (1-to-1) vs **group** conversations |
| F2.4 | Real-time: `message:new` bumps conversation to top and updates preview |
| F2.5 | Empty state: "No conversations yet — start one!" |
| F2.6 | Loading skeleton while fetching |

---

#### F3 — Starting a Direct Conversation

| ID | Requirement |
|----|-------------|
| F3.1 | User searches by **name or phone number** via `GET /api/users/search?q=` |
| F3.2 | Trigger search on minimum 1 character |
| F3.3 | Selecting a result → `POST /api/conversations` with `{ userId }` |
| F3.4 | If conversation already exists, open the existing one (no duplicate) |
| F3.5 | Navigate to the chat panel on creation |

---

#### F4 — Group Conversations

| ID | Requirement |
|----|-------------|
| F4.1 | Create a group with a **name** and **multiple participants** |
| F4.2 | `POST /api/conversations/group` with `{ name, participantIds }` |
| F4.3 | Creator automatically becomes an **admin** |
| F4.4 | Admins can: add members, remove members, promote to admin, rename group |
| F4.5 | Any member can **leave** (DELETE their own userId from participants) |
| F4.6 | `conversation:updated` socket event refreshes group state in real-time |

**Group API operations at a glance:**

| Action | Method + Path |
|--------|---------------|
| Create group | `POST /api/conversations/group` |
| Add members | `POST /api/conversations/:id/participants` |
| Remove member / leave | `DELETE /api/conversations/:id/participants/:userId` |
| Promote to admin | `POST /api/conversations/:id/admins` |
| Rename group | `PATCH /api/conversations/:id` |

---

#### F5 — Message List (Chat Panel)

| ID | Requirement |
|----|-------------|
| F5.1 | Fetch history via `GET /api/conversations/:id/messages` |
| F5.2 | Pagination: `limit` (default 20) + `before` cursor for loading older messages |
| F5.3 | **Sent** messages right-aligned; **received** messages left-aligned |
| F5.4 | Each message shows: sender name (groups), message text, timestamp |
| F5.5 | Loading state while fetching |
| F5.6 | Empty state: "No messages yet — say hello!" |

---

#### F6 — Sending Messages

| ID | Requirement |
|----|-------------|
| F6.1 | Text input fixed at the bottom of the chat panel |
| F6.2 | Submit via **Enter key** or **Send button** |
| F6.3 | **Empty messages must not be sendable** — button disabled, Enter no-ops |
| F6.4 | Send via `POST /api/messages` with `{ conversationId, text }` |
| F6.5 | Or send via socket `message:send` event — both approaches are valid |
| F6.6 | Optimistic UI: show message immediately; confirm/revert on response |
| F6.7 | Input clears after successful send |

---

#### F7 — Real-time Updates

| ID | Requirement |
|----|-------------|
| F7.1 | `message:new` socket event appends new message to the active conversation |
| F7.2 | New message in a non-active conversation → show unread badge/count |
| F7.3 | No manual refresh ever required |
| F7.4 | Socket disconnect → show "Reconnecting..." indicator |
| F7.5 | On reconnect → re-fetch recent messages to close any message gap |

---

#### F8 — Auto-scroll Behavior

| ID | Requirement |
|----|-------------|
| F8.1 | Auto-scroll to latest message when the chat panel first opens |
| F8.2 | Auto-scroll on new message **only if** the user is already at the bottom |
| F8.3 | **Do NOT force-scroll** if the user has scrolled up to read earlier messages |
| F8.4 | Show "↓ New message" / scroll-to-bottom FAB when scrolled up and new message arrives |

---

### 2.5 UX & Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Empty message send attempt | Send button disabled; Enter key is a no-op |
| Network error on send | Error toast shown; allow retry |
| Token expired or invalid | Redirect to login; clear stored JWT |
| User search returns no results | "No users found" empty state |
| Socket disconnects | "Connection lost. Reconnecting..." banner |
| Loading conversations | Skeleton loader (not a spinner) |
| Very long message text | Wraps cleanly inside the bubble |
| Sending to yourself | Handled gracefully (API decides behavior) |

---

## 3. Part 2 — Creative Landing Page

**Goal:** Design and build a landing page that presents the chat app to real users. **No design file provided** — the visual direction is entirely up to you.

### Requirements

| ID | Requirement |
|----|-------------|
| LP1 | Full visual creative freedom — no design file provided |
| LP2 | Design your own: layout, color palette, typography, animations |
| LP3 | Fully **responsive** — mobile, tablet, and desktop |
| LP4 | Clearly communicates what the product does and its key features |
| LP5 | **Live hosted URL required** (Vercel, Netlify, etc.) for submission |
| LP6 | Bold and creative — we'd rather see original instincts than a generic template |

### Suggested Sections

| Section | Content |
|---------|---------|
| **Hero** | Headline, subheadline, primary CTA ("Try it now →") |
| **Features** | Real-time messaging, groups, simple login |
| **Demo Preview** | Screenshot or animated UI preview of the chat |
| **How It Works** | 3-step: Log in → Find contacts → Chat |
| **Footer** | Links, tech stack credit |

> **Design inspiration:** Modern SaaS products like Linear, Vercel, Loom — dark themes, glassmorphism, smooth scroll animations.

---

## 4. Part 3 — Thought Process Write-up

Include in `README.md` or a separate `docs/WRITEUP.md`.

### Required Sections

| Section | What to cover |
|---------|---------------|
| **Architecture & Libraries (Part 1)** | Why you chose your folder structure, state management, and libraries. Trade-offs considered. |
| **Design Decisions (Part 2)** | Reasoning behind color palette, layout, typography, and animation choices. |
| **AI Tool Usage** | Which tools used, what for (boilerplate, debugging, docs, research), and what you changed, rejected, or wrote yourself. |
| **What You'd Improve** | What you'd do differently or add with more time. |
| **API Issues Observed** | Odd behavior, inconsistent responses, missing error handling, pagination quirks — and how you worked around them. Say "none" if nothing was observed. |

> Tip: Keep this **concise and honest**. Clear reasoning over exhaustive coverage.

---

## 5. API Reference

**Base URL:** `https://frontend-task-chatapp.onrender.com/api`
**Auth:** `Authorization: Bearer <JWT>` on all protected endpoints (except `/auth/login` and `/health`)

> Note: The official spec intentionally **omits response bodies and status codes** — inspect the live API and document them yourself as part of the assignment.

---

### Auth

#### `POST /auth/login` — Login or Register
🔓 No auth required

**Request Body:**
```json
{
  "phone": "+15551234567",
  "name": "Ada Lovelace"
}
```

**Observed Response:**
```json
{
  "token": "<JWT>",
  "user": { "_id": "string", "phone": "+15551234567", "name": "Ada Lovelace" }
}
```

---

#### `GET /auth/me` — Get Current User
🔐 Auth required

**Observed Response:**
```json
{ "_id": "string", "phone": "+15551234567", "name": "Ada Lovelace" }
```

---

### Users

#### `GET /users/search?q={term}` — Search Users
🔐 Auth required

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `q` | query | string | Yes | Name or phone to search |

**Observed Response:**
```json
[{ "_id": "string", "name": "string", "phone": "string" }]
```

---

### Conversations

#### `GET /conversations` — List My Conversations
🔐 Auth required

**Observed Response:**
```json
[
  {
    "_id": "string",
    "type": "direct | group",
    "name": "string (group only)",
    "participants": ["userId"],
    "admins": ["userId (group only)"],
    "lastMessage": { "text": "string", "createdAt": "ISO string" },
    "updatedAt": "ISO string"
  }
]
```

---

#### `POST /conversations` — Start a Direct Conversation
🔐 Auth required

**Request Body:**
```json
{ "userId": "665f0c2a9b1e4a0012ab34cd" }
```

---

#### `GET /conversations/:id/messages` — Get Message History
🔐 Auth required

| Param | In | Type | Required | Default | Description |
|-------|----|------|----------|---------|-------------|
| `id` | path | string | Yes | — | Conversation ID |
| `limit` | query | integer | No | 20 | Messages per page |
| `before` | query | string | No | — | Cursor: fetch messages before this message ID |

**Observed Response:**
```json
{
  "messages": [
    {
      "_id": "string",
      "conversationId": "string",
      "sender": { "_id": "string", "name": "string" },
      "text": "string",
      "createdAt": "ISO string"
    }
  ],
  "hasMore": true,
  "nextCursor": "string | null"
}
```

---

### Messages

#### `POST /messages` — Send a Message
🔐 Auth required

**Request Body:**
```json
{ "conversationId": "string", "text": "Hello!" }
```

---

### Groups

#### `POST /conversations/group` — Create a Group
🔐 Auth required

```json
{ "name": "Project Team", "participantIds": ["userId1", "userId2"] }
```

---

#### `POST /conversations/:id/participants` — Add Members
🔐 Auth required | Admins only

```json
{ "userIds": ["userId1", "userId2"] }
```

---

#### `DELETE /conversations/:id/participants/:userId` — Remove Member / Leave
🔐 Auth required | Admins only (or own `userId` to leave)

---

#### `POST /conversations/:id/admins` — Promote to Admin
🔐 Auth required | Admins only

```json
{ "userId": "string" }
```

---

#### `PATCH /conversations/:id` — Rename Group
🔐 Auth required | Admins only

```json
{ "name": "Renamed Team" }
```

---

### System

#### `GET /health` — Health Check
🔓 No auth required

---

## 6. Data Models (TypeScript)

```typescript
// Authenticated user
interface User {
  _id: string;
  name: string;
  phone: string;
}

// Conversation (direct or group)
interface Conversation {
  _id: string;
  type: 'direct' | 'group';
  name?: string;           // group only
  participants: string[];  // array of user IDs
  admins?: string[];       // group only
  lastMessage?: {
    text: string;
    createdAt: string;     // ISO 8601
  };
  updatedAt: string;       // ISO 8601
}

// Individual message
interface Message {
  _id: string;
  conversationId: string;
  sender: {
    _id: string;
    name: string;
  };
  text: string;
  createdAt: string;       // ISO 8601
}

// Login / registration response
interface AuthResponse {
  token: string;
  user: User;
}

// Message history response
interface MessageHistoryResponse {
  messages: Message[];
  hasMore: boolean;
  nextCursor: string | null;
}

// Socket.io events
interface SocketSendPayload {
  conversationId: string;
  text: string;
}
```

---

## 7. Screens & User Flows

### Flow 1 — Login / Session Restore

```
App loads
  └─ Token in localStorage?
       ├─ YES → GET /auth/me
       │          ├─ OK → [Chat Main Screen]
       │          └─ Error (expired) → Clear token → [Login Screen]
       └─ NO → [Login Screen]
                  └─ Enter phone + name → POST /auth/login
                       ├─ OK → Store JWT → [Chat Main Screen]
                       └─ Error → Show error message
```

### Flow 2 — View & Open a Conversation

```
[Chat Main Screen]
  GET /conversations → Render conversation list
  Click conversation
    GET /conversations/:id/messages (paginated)
    [Chat Panel] opens with message history
```

### Flow 3 — Start a Direct Conversation

```
Click "New chat" button
  Type in search box
    GET /users/search?q=...
    Select result
      POST /conversations { userId }
        └─ Navigate to [Chat Panel]
```

### Flow 4 — Create a Group

```
Click "New group" button
  Enter group name
  Search & select ≥2 participants
    POST /conversations/group { name, participantIds }
      └─ Navigate to [Chat Panel]
```

### Flow 5 — Send a Message

```
[Chat Panel] — user types in input
  Input is not empty?
    ├─ YES → Press Enter or Send
    │          POST /messages { conversationId, text }
    │          OR socket emit 'message:send'
    │          Optimistic append → confirm on response
    └─ NO → Send button disabled, Enter blocked
```

### Flow 6 — Receive a Real-time Message

```
Socket event: message:new
  ├─ Active conversation? → Append message
  │     └─ User at bottom? → Auto-scroll
  │          └─ Scrolled up? → Show "↓ New message" button
  └─ Inactive conversation? → Update unread badge
```

---

## 8. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Code Quality** | Production-level: clean, maintainable, reasonably organized — not a prototype |
| **Responsiveness** | Mobile-first; works correctly on mobile and desktop |
| **Performance** | Paginated message history; avoid unnecessary re-renders |
| **Accessibility** | Keyboard navigable; sufficient color contrast; ARIA labels on interactive elements |
| **Error Handling** | Loading, empty, and error states handled throughout the entire app |
| **Deployment** | Both Part 1 and Part 2 must have live, working hosted URLs |
| **README** | Clear setup/run instructions, tech stack used, and the Part 3 write-up |

---

## 9. Bonus Opportunities

> Bonuses apply **only if the addition is genuinely original**. Common/generic additions do not qualify even if well-executed.

### Part 1 — Chat App Bonus Ideas

- **Typing indicator** — "Ada is typing..." shown in real-time
- **Message delivery status** — sent → delivered → seen (read receipts)
- **Smart unread jump** — "↑ 5 unread messages" shortcut that jumps to first unread
- **Inline emoji reactions** on messages
- **Message search** within a conversation

### Part 2 — Landing Page Bonus Ideas

- **Live embedded mini-chat** on the landing page itself (real connection to the API)
- **Interactive product tour** — step-by-step walkthrough of the UI
- Scroll-triggered animations that feel novel and purposeful (not stock)

---

## 10. Submission Checklist

| Item | Required | Done |
|------|----------|------|
| GitHub repo (public, or private with access granted) | ✅ | ☐ |
| `README.md` with setup/run instructions | ✅ | ☐ |
| Tech stack listed in README | ✅ | ☐ |
| Part 3 write-up in README or separate doc | ✅ | ☐ |
| **Standalone API documentation** (Part 1 deliverable) | ✅ | ☐ |
| Part 1 — Live hosted demo URL (chat app) | ✅ | ☐ |
| Part 2 — Live hosted demo URL (landing page) | ✅ | ☐ |
| F1: Login screen (phone + name, JWT, session restore) | ✅ | ☐ |
| F2: Conversation list (direct + group, loading/empty states) | ✅ | ☐ |
| F3: Start a direct conversation (user search → new chat) | ✅ | ☐ |
| F4: Group conversations (create, add/remove members, admin) | ✅ | ☐ |
| F5: Message list (paginated, sender/receiver distinction) | ✅ | ☐ |
| F6: Send messages (empty prevention, optimistic UI) | ✅ | ☐ |
| F7: Real-time updates via Socket.io | ✅ | ☐ |
| F8: Auto-scroll (smart — does not force-scroll when reading) | ✅ | ☐ |
| Loading, empty, and error states throughout | ✅ | ☐ |

---

*PRD derived from `Senior_Frontend_Engineer_Task_Instructions.pdf` and the live OpenAPI spec at `https://frontend-task-chatapp.onrender.com/docs/`*
