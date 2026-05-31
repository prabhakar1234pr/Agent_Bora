# Agent Bora

AI meeting-assistant SaaS. You create **agents** (AI teammates you feed context — docs, repos, links), send them into **meetings** (Google Meet / Teams), and they produce **briefs** (summary, transcript, recording, action items) and can act on those (draft emails, file tasks) through **integrations**.

This repo holds three things:
- `Prototype/` — the original self-contained React+Babel design prototype (reference only; do not build on it).
- `frontend/` — the real **Next.js** app (Pages Router). Fully built UI + working auth.
- `backend/` — a near-empty **FastAPI** app. **This is what we're building next.**

> The immediate goal is to build the backend (FastAPI) and wire it to **InsForge**, then connect the frontend's demo data layer to it.

---

## Layout

```
C:\Agent_bora\
  Prototype/        # original JSX prototype (reference for design/UX only)
  frontend/         # Next.js app — see frontend section below
  backend/          # FastAPI app — main.py is currently just /api/health + a stub
  insforge.toml     # InsForge auth config (allowed redirect URLs)
  skills-lock.json
```

---

## Frontend (`frontend/`) — already built, don't rebuild

Next.js 14 (Pages Router), plain JS (no TS), CSS in `styles/globals.css`. Run: `cd frontend && npm run dev`.

**Auth — real, via InsForge (keep it):**
- Email/password + Google/GitHub OAuth.
- Server-side via Next.js API routes in `pages/api/auth/*` (sign-in, sign-up, verify-email, user, sign-out, oauth, callback, refresh, reset/forgot password). These call the InsForge SDK and set httpOnly cookies.
- Client state in `context/AuthContext.js` (`useAuth`, `useRequireAuth`). User shape returned: `{ id, email, profile: { name }, ... }`.
- InsForge clients: `lib/insforge/client.js` (browser), `lib/insforge/server.js` + `lib/insforge/pages-api.js` (server), `lib/insforge/auth-cookies.js`.
- After login/signup → redirects to `/app`. `/dashboard` redirects to `/app`.

**Workspace — the actual app, at `/app`:**
- `pages/app.js` gates on `useRequireAuth`, then renders `components/workspace/Workspace.js`.
- `Workspace.js` is a **client-side view router**: an internal `view` string (`home`, `agents`, `createAgent`, `meetings`, `brief`, `actions`, `integrations`, `newMeeting`) selects which page renders inside the sidebar shell. There are no per-view Next.js routes — navigation is `app.nav("view", params)`.
- Pages: `components/workspace/{Home,Agents,Meetings,Actions,Integrations,NewMeeting,Sidebar,PageWrap}.js`.
- Design system: `components/ui.js` (Icon, Logo, Btn, AgentAvatar, Wave, etc.), `components/BrandLogos.js`.

**⭐ Data layer — `context/DemoStore.js` is THE integration seam for the backend.**
- Today it's a **localStorage-backed demo store** that seeds agents/meetings/actions/chats from `lib/demo-data.js`.
- It exposes one `app` object consumed by every workspace page: state (`user, agents, meetings, agentChats, connected, currentAgentId, upcoming, view, params`) + actions (`nav, createAgent, setAgentChat, toggleAction, setConnected, setCurrentAgentId, resetDemo, clearWorkspace`).
- **To connect the backend:** replace the localStorage reads/writes inside `DemoStore.js` with `fetch` calls to FastAPI (base URL `process.env.NEXT_PUBLIC_API_BASE_URL`, default `http://127.0.0.1:8000`). Keep the `app` object's shape identical so no page needs to change. Look at `lib/demo-data.js` for the **exact data shapes the backend must return**.

**Env (`frontend/.env.local`, see `.env.local.example`):**
```
NEXT_PUBLIC_INSFORGE_URL=...
NEXT_PUBLIC_INSFORGE_ANON_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

---

## Backend (`backend/`) — what we're building

FastAPI managed by **uv**. Run: `cd backend && uv sync && uv run uvicorn main:app --reload --port 8000`. Docs at `http://localhost:8000/docs`.

Current state: `main.py` has only `/api/health`, `/api/prototype-summary`, and CORS allowing `localhost:3000`. Deps: `fastapi`, `pydantic`, `uvicorn[standard]`.

### How it should fit together
- **InsForge owns auth + (likely) the database/storage.** The frontend already authenticates against InsForge directly and holds an InsForge access token in cookies. Decide and document the trust model before coding:
  - **Option A (recommended):** FastAPI validates the InsForge JWT on each request (read the `Authorization: Bearer` / cookie token, verify against InsForge), and uses InsForge as the data store via its SDK/REST. FastAPI is the orchestration/business-logic layer (agent context ingestion, brief generation, integration actions).
  - **Option B:** FastAPI keeps its own DB and just trusts a verified InsForge user id. Heavier; only if InsForge's DB doesn't fit.
  - Confirm with the InsForge skills which pieces (Postgres tables + RLS, storage buckets, edge functions, auth JWT verification) should live in InsForge vs. FastAPI before writing endpoints.
- **CORS:** `main.py` currently allows only port 3000. The dev server falls back to 3001/3002 when 3000 is taken — widen `allow_origins` or use a regex.

### Data model (derive shapes from `frontend/lib/demo-data.js`)
- **Agent:** `{ id, name, tagline, persona, voice: "proactive"|"passive", created, sources: [{type,label,meta}], integrations: string[], meetings: int, words }`. `sources.type` ∈ `url|github|notion|doc|text|pdf`.
- **Meeting / brief:** `{ id, title, date(ISO), durationMin, platform: "meet"|"teams", agentId, mode, attendees: string[], spoke, summary, highlights: string[], actions: [{text,owner,due,done}], transcript: [{t,speaker,text,isAgent?}] }`.
- **Action item:** lives inside a meeting's `actions[]`; the UI rolls them up across meetings, toggles `done`, and groups by overdue/open/done. Owner + `due` (e.g. `"Jun 5"`).
- **Integrations:** connection state is a `connected: string[]` of ids (`gmail, calendar, slack, notion, drive, github, asana, linear`).
- **Agent chat:** `agentChats[agentId] = [{role:"user"|"agent", text}]`.
- **Upcoming meetings:** future-dated meetings for the dashboard.

### Suggested API surface (REST, prefix `/api`)
Mirror the `app` object so `DemoStore.js` maps 1:1:
- `GET /agents`, `POST /agents`, `GET /agents/{id}`, `PATCH /agents/{id}`
- `GET /agents/{id}/chat`, `POST /agents/{id}/chat`
- `GET /meetings`, `POST /meetings` (= "send agent to meeting"), `GET /meetings/{id}` (brief)
- `PATCH /meetings/{id}/actions/{idx}` (toggle done) or a dedicated actions endpoint
- `GET /actions` (rolled up across meetings)
- `GET /integrations`, `POST /integrations/{id}/connect`, `DELETE /integrations/{id}`
- `GET /me` / dashboard stats
All authenticated by the InsForge user (see trust model above). Use Pydantic models that match the shapes above.

### When working on the backend
- **Use the InsForge skills first** (`insforge`, `insforge-cli`, `insforge-debug`, `insforge-integrations`) to provision the project, set up auth JWT verification, create tables/RLS or storage, and manage secrets — before hand-rolling anything.
- Keep the frontend's `DemoStore.js` contract stable; the win condition is "swap localStorage for fetch, nothing else in the UI changes."
- The "AI" behavior in the prototype (agent replies, brief generation) is currently canned strings in the frontend. Real generation belongs in the backend later — note where stubs live so they can be replaced.

---

## Conventions
- Frontend is plain JavaScript + React, no TypeScript; styling is a single global CSS file with design tokens (accent `#10B981`, Space Grotesk + Plus Jakarta Sans). Match the existing inline-style idiom in workspace components.
- Backend is FastAPI + Pydantic, managed with `uv` (not pip/poetry).
- Don't build on `Prototype/` — it's reference only. The live app is `frontend/`.
