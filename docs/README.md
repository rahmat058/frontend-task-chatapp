# ChatApp documentation

Developer docs for this messenger client. Setup and scripts: root [README.md](../README.md). System map: [ARCHITECTURE.md](../ARCHITECTURE.md).

This repo is the **Next.js frontend**. Auth, conversations, messages, and groups live on the hosted API — not in this tree.

---

## Documentation map

| Doc                                  | What it covers                                           |
| ------------------------------------ | -------------------------------------------------------- |
| [PRD.md](./PRD.md)                   | Take-home assignment — features F1–F8, landing, write-up |
| [API.md](./API.md)                   | Observed REST paths, payloads, and Socket.io events      |
| [design-style.md](./design-style.md) | Visual system — tokens, shells, bubbles, composer        |
| [prompt.md](./prompt.md)             | Cursor redesign prompt — workflow, preserve/avoid lists  |

Root (not under `docs/`):

| Doc                                   | What it covers                                       |
| ------------------------------------- | ---------------------------------------------------- |
| [README.md](../README.md)             | Install, env, scripts, troubleshooting               |
| [ARCHITECTURE.md](../ARCHITECTURE.md) | App routes, Query/Zustand, sockets, known API limits |
| [AGENTS.md](../AGENTS.md)             | Agent rules — Next.js managed block + pointers here  |

---

## Product at a glance

| Surface | Route        | Notes                               |
| ------- | ------------ | ----------------------------------- |
| Landing | `/`          | Marketing page                      |
| Login   | `/login`     | Name + Bangladesh `+880` phone; JWT |
| Inbox   | `/chat`      | Auth after session restore          |
| Thread  | `/chat/[id]` | Direct or group                     |

**API origin (default):** `https://frontend-task-chatapp.onrender.com`  
REST: `{origin}/api` · Socket.io: `{origin}` (not `/api`).

---

## Constraints agents should not violate

- Do not add REST routes this client does not already call, or mock a message database.
- Do not fake attachments, presence/online, or calls — those APIs are not in [API.md](./API.md).
- People search must stay debounced (**600ms** after typing stops).
- Auth starts as `restoring` until `GET /api/auth/me` finishes.
- Use tokens from [design-style.md](./design-style.md); Lucide icons for chrome (not font emoji).
