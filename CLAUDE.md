# Agent Bora

AI meeting-assistant SaaS. Users create **agents** (AI teammates that read context — docs, repos, links), send them into **meetings** (Google Meet / Teams), and they produce **briefs** (summary, transcript, action items) and integrate with tools (Gmail, Slack, Notion, etc).

## Status: ✅ MVP Complete
- ✅ **Frontend**: Next.js 14 with full UI, auth (InsForge OAuth), workspace
- ✅ **Backend**: FastAPI REST API fully wired to InsForge database
- ✅ **Database**: 11 PostgreSQL tables with RLS, schema complete
- ✅ **Integration**: Frontend fetches real data from backend (no more localStorage)

## Next Phase: 🤖 AI Agent Generation
The app is ready for real agent intelligence. In the next session, you'll provide the **Agent API key** to enable:
- Agents that analyze meeting context and generate intelligent briefs
- Real-time agent responses in meetings
- Smart action item extraction and ownership assignment

This repo holds:
- `Prototype/` — original React+Babel design prototype (reference only).
- `frontend/` — **Next.js** app with full UI, working auth, workspace router.
- `backend/` — **FastAPI** REST API connected to InsForge database.
- `migrations/` — PostgreSQL schema files.
- `SETUP_COMPLETE.md`, `QUICK_START.md` — documentation.

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

## Backend (`backend/`) — ✅ Complete

FastAPI managed by **uv**. Run: `cd backend && uv run uvicorn main:app --reload --port 8000`. Full API docs at `http://localhost:8000/docs`.

**Current endpoints** (all fetch from InsForge database):
- `GET /api/agents` — List all agents with sources & integrations
- `POST /api/agents` — Create new agent
- `GET /api/meetings` — List meetings with full details (attendees, actions, transcript, highlights)
- `GET /api/meetings/{id}` — Get single meeting brief
- `PATCH /api/meetings/{id}/actions/{idx}` — Toggle action item done status
- `GET /api/actions` — All action items rolled up across meetings
- `GET /api/integrations` — List available integrations
- `GET /api/agents/{id}/chat` — Get agent conversation history
- `POST /api/agents/{id}/chat` — Add message to agent chat
- `GET /api/me` — Current user info
- `GET /api/health` — Health check

**Architecture (Trust Model A — Recommended):**
- InsForge owns **auth + database**. Frontend authenticates via OAuth, gets JWT in httpOnly cookies.
- FastAPI **queries the database** via InsForge CLI (`npx @insforge/cli db query`).
- All data is **RLS-protected** — users only see their own agents, meetings, actions.
- FastAPI is the **orchestration layer** — adds AI generation, integration actions, business logic.

**CORS:** Allows localhost:3000-3005 for dev flexibility.

### Next: Wire Agent API for Intelligence
When you provide the **Agent API key**, add to `backend/.env.local`:
```
AGENT_API_KEY=<key>
```

Then update endpoints to call the agent for:
1. **Brief generation**: POST to Agent when meeting ends → summarize transcript
2. **Action extraction**: Call Agent to extract owners/due dates from summary
3. **Proactive flags**: Agent analyzes decisions and surfaces conflicts
4. **Chat replies**: Agent responds intelligently to user questions about meetings

See `Notes on AI Integration` section below for placeholder stubs.

### Data Model (from `frontend/lib/demo-data.js`)
- **Agent:** `{ id, name, tagline, persona, voice: "proactive"|"passive", created, sources: [{type,label,meta}], integrations: string[], meetings: int, words }`. `sources.type` ∈ `url|github|notion|doc|text|pdf`.
- **Meeting/Brief:** `{ id, title, date(ISO), durationMin, platform: "meet"|"teams", agentId, mode, attendees: string[], spoke, summary, highlights: string[], actions: [{text,owner,due,done}], transcript: [{t,speaker,text,isAgent?}] }`.
- **Action item:** Inside `meeting.actions[]`; UI rolls up across meetings, toggles `done`, groups by status. Owner + due date (e.g. `"Jun 5"`).
- **Integration:** `{ id, name, connected: bool }`. Available: `gmail, calendar, slack, notion, drive, github, asana, linear`.
- **Agent chat:** `{ role: "user"|"agent", text }`. History stored per agent.

### API Surface — ✅ Implemented
All endpoints return JSON matching frontend `DemoStore.js` shape. Fetch via `credentials: "include"` (uses httpOnly JWT cookies).

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/agents` | GET | List agents |
| `/api/agents` | POST | Create agent |
| `/api/meetings` | GET | List meetings + briefs |
| `/api/meetings/{id}` | GET | Get single brief |
| `/api/actions` | GET | All action items |
| `/api/meetings/{id}/actions/{idx}` | PATCH | Toggle action done |
| `/api/integrations` | GET | List integrations |
| `/api/agents/{id}/chat` | GET | Chat history |
| `/api/agents/{id}/chat` | POST | Add chat message |
| `/api/me` | GET | User info |

### Notes on AI Integration — ⏳ Next Phase

**Agent Generation Stubs** (to be filled when API key provided):

1. **Brief generation** — When user views a meeting:
   ```python
   # In GET /api/meetings/{id}
   # Call Agent API with transcript → get summary, highlights, actions
   brief = await agent_api.generate_brief(
       transcript=meeting.transcript,
       agent_persona=agent.persona,
       attendees=attendees
   )
   meeting.summary = brief.summary
   meeting.highlights = brief.highlights
   meeting.actions = brief.actions  # with owners + due dates
   ```

2. **Proactive agent flags** — When creating a brief:
   ```python
   # Call Agent to analyze for risks/conflicts
   flags = await agent_api.analyze_for_flags(
       transcript=meeting.transcript,
       agent_mode=agent.voice
   )
   # Add to summary if proactive mode
   ```

3. **Chat intelligence** — When user asks agent a question:
   ```python
   # In POST /api/agents/{id}/chat
   response = await agent_api.chat(
       agent_id=agent_id,
       user_message=message,
       context=user_meetings + user_agents
   )
   # Save response to agent_chats
   ```

4. **Meeting context ingestion** — When user adds sources to agent:
   ```python
   # In POST /api/agents
   await agent_api.ingest_context(
       agent_id=agent.id,
       sources=agent.sources  # URLs, repos, docs
   )
   ```

**Environment setup:**
- Add `AGENT_API_KEY` to `backend/.env.local`
- Create agent API client class in `backend/agents.py`
- Call from endpoints above
- Log all Agent API calls and responses for debugging

### When Working on This Codebase

**Frontend** (`context/DemoStore.js`):
- Is the **integration seam** with backend
- Shape is stable — don't change `app` object structure
- All data fetches via `${API_BASE}/api/*` with `credentials: "include"`
- No authentication header needed (JWT in cookies)

**Backend** (`backend/main.py`):
- Add new endpoints by following the existing pattern
- Test endpoints at `http://localhost:8000/docs` (auto-generated Swagger)
- Query database via `run_query(sql)` helper function
- When Agent API key is provided, add to env + wire up the stubs above

**Database** (InsForge):
- Use `npx @insforge/cli db query` for direct SQL queries
- RLS policies ensure users see only their data
- Migrations in `migrations/` folder (manage with `npx @insforge/cli db migrations`)

**Never:**
- Change the `DemoStore.js` shape — frontend pages depend on it
- Build on `Prototype/` — it's reference only
- Store secrets in code — use `.env.local` and `npx @insforge/cli secrets`

---

## Quick Start (Dev)

```bash
# Terminal 1 — Backend
cd backend
uv sync
uv run uvicorn main:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend
npm install  # if needed
npm run dev  # runs on next available port (usually 3006)
```

Then:
1. Visit `http://localhost:3006` (or check terminal for actual port)
2. Sign up / log in with Google or GitHub
3. App fetches data from backend at `/api/agents`, `/api/meetings`, etc.
4. Database is empty by default — create agents and meetings to populate it

## Conventions

- **Frontend**: Plain JavaScript + React (no TypeScript). Single global CSS file (`styles/globals.css`) with design tokens. Match existing inline-style idiom.
- **Backend**: FastAPI + Pydantic, managed with `uv` (not pip/poetry).
- **Database**: InsForge PostgreSQL with RLS policies. Query via `npx @insforge/cli db query`.
- **No TypeScript**: Keep JS simple and readable.
- **Reference only**: Don't build on `Prototype/` — it's for design reference. Live app is `frontend/`.

## Key Files to Know

| File | Purpose |
|------|---------|
| `frontend/context/DemoStore.js` | ⭐ **Data layer seam** — fetches from `/api/*`, provides `app` object to all pages |
| `backend/main.py` | REST API endpoints (call `run_query()` to fetch from DB) |
| `frontend/lib/demo-data.js` | Defines expected data shapes |
| `frontend/pages/app.js` | Workspace entry point, gates on auth |
| `insforge.toml` | Auth redirect URLs config |
| `migrations/` | Database schema (PostgreSQL) |

## Environment Variables

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_INSFORGE_URL=https://6dtjatee.us-west.insforge.app
NEXT_PUBLIC_INSFORGE_ANON_KEY=<anon-key>
NEXT_PUBLIC_APP_URL=http://localhost:3006
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

**Backend** (`backend/.env.local`):
```
INSFORGE_URL=https://6dtjatee.us-west.insforge.app
INSFORGE_API_KEY=<api-key>
AGENT_API_KEY=<provide-in-next-session>  # For AI agent generation
```

Never commit `.env.local`. Add to `.gitignore`.
