# Chat API (observed)

Source: [live OpenAPI spec](https://frontend-task-chatapp.onrender.com/docs/) (request-focused) plus live responses from `https://frontend-task-chatapp.onrender.com`.

**REST base:** `https://frontend-task-chatapp.onrender.com/api`  
**Auth:** `Authorization: Bearer <JWT>` on every route except `POST /api/auth/login` and `GET /health`.  
**Socket:** connect to the **host origin**, not `/api`:

```js
io('https://frontend-task-chatapp.onrender.com', { auth: { token } })
```

The published spec omits most response bodies. Shapes below are what this client actually unwraps.

---

## Auth

### `POST /api/auth/login`

No auth. New phone numbers register; existing phones log in.

**Request:** `{ "phone": "string", "name": "string" }`  
**Response (200):** `{ "token": "JWT", "user": { "_id", "name", "phone", "createdAt" } }`

### `GET /api/auth/me`

**Response (200):** `{ "_id", "name", "phone", "createdAt" }`  
**401:** token missing/invalid — client clears the session.

---

## Users

### `GET /api/users/search?q={term}`

**Response (200):** `[{ "_id", "name", "phone" }]`

---

## Conversations

### `GET /api/conversations`

**Response (200):** `{ "data": Conversation[] }` (empty list is `{ "data": [] }`).

Conversation objects typically include `_id`, `type` (`direct` | `group`), optional `name` (groups), `participants` (ids and/or user objects), optional `admins`, `lastMessage`, `updatedAt`. Direct chats often have **ids only** for participants (no display name).

### `POST /api/conversations`

**Request:** `{ "userId": "string" }`  
Opens an existing 1:1 thread if one already exists.

### `GET /api/conversations/{id}/messages`

**Query:** `limit` (default 20), `before` (message id cursor).  
**Response:** `{ "messages": Message[], "hasMore": boolean, "nextCursor": string | null }`

Message `sender` may be a populated `{ _id, name }` or a bare id.

---

## Messages

### `POST /api/messages`

**Request:** `{ "conversationId": "string", "text": "string" }`  
**Response:** a Message object (sometimes wrapped as `{ message }` / `{ data }`).

---

## Groups

### `POST /api/conversations/group`

**Request:** `{ "name": "string", "participantIds": ["userId"] }`

### `POST /api/conversations/{id}/participants`

Admins. **Request:** `{ "userIds": ["userId"] }`

### `DELETE /api/conversations/{id}/participants/{userId}`

Admins may remove others; any member may delete their own `userId` to leave.

### `POST /api/conversations/{id}/admins`

Admins. **Request:** `{ "userId": "string" }`

### `PATCH /api/conversations/{id}`

Admins. **Request:** `{ "name": "string" }`

---

## System

### `GET /health`

Host **root**, not under `/api`. No auth.  
**Response (200):** `{ "status": "ok" }`

---

## WebSocket events

| Direction | Event | Payload |
|-----------|-------|---------|
| Client → server | `message:send` | `{ conversationId, text }` |
| Server → client | `message:new` | Message |
| Server → client | `conversation:updated` | Conversation |

This app **sends** messages with `POST /api/messages` and **receives** with `message:new`.

---

## Client mapping

| Spec path | App usage |
|-----------|-----------|
| `POST /auth/login` | Login form |
| `GET /auth/me` | Session restore |
| `GET /users/search` | New chat + add group members |
| `GET /conversations` | Sidebar list |
| `POST /conversations` | Start DM |
| `GET /conversations/:id/messages` | Chat history |
| `POST /messages` | Send |
| `POST /conversations/group` | New group |
| `POST /conversations/:id/participants` | Group settings → Add |
| `DELETE /conversations/:id/participants/:userId` | Remove member / Leave |
| `POST /conversations/:id/admins` | Promote |
| `PATCH /conversations/:id` | Rename |
| `GET /health` | Login screen reachability check |
