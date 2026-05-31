# Agent Bora Database Setup

## What's Been Created

### 1. InsForge Database Schema
The following tables have been created in your InsForge Postgres database with full RLS policies:
- `agents` — Agent profiles with metadata
- `agent_sources` — Sources attached to agents (GitHub, Notion, URLs, PDFs, etc.)
- `agent_integrations` — Integrations connected to each agent
- `meetings` — Meeting/brief records
- `meeting_attendees` — People who attended meetings
- `actions` — Action items from meetings
- `transcript_entries` — Meeting transcript with speaker attribution
- `meeting_highlights` — Key points from meetings
- `integrations` — User's connected services (Gmail, Slack, Notion, etc.)
- `agent_chats` — Conversation history with agents
- `upcoming_meetings` — Future scheduled meetings

All tables have **Row-Level Security (RLS)** enabled, so users can only access their own data.

**Database Location:** `https://6dtjatee.us-west.insforge.app`

### 2. FastAPI Backend
Created a new backend at `backend/main.py` with REST endpoints:

**Agents:**
- `GET /api/agents` — List all agents
- `POST /api/agents` — Create a new agent
- `GET /api/agents/{id}` — Get agent details
- `PATCH /api/agents/{id}` — Update agent

**Meetings:**
- `GET /api/meetings` — List all meetings with full details (attendees, actions, transcript)
- `POST /api/meetings` — Create a meeting

**Actions:**
- `GET /api/actions` — List all action items (rolled up across meetings)
- `PATCH /api/meetings/{meeting_id}/actions/{idx}` — Toggle action done status

**Agent Chat:**
- `GET /api/agents/{agent_id}/chat` — Get chat history
- `POST /api/agents/{agent_id}/chat` — Send a message

**Integrations:**
- `GET /api/integrations` — List user's connected services

**Auth:**
- `GET /api/me` — Get current user info
- All endpoints require `Authorization: Bearer {token}` header

### 3. Frontend Data Layer
Updated `frontend/context/DemoStore.js` to fetch from the FastAPI backend instead of localStorage. The data flow is now:
```
Frontend -> FastAPI Backend (/api/agents, /api/meetings, etc.) 
        -> InsForge REST API (/rest/v1/agents, /rest/v1/meetings, etc.)
        -> PostgreSQL Database (with RLS)
```

### 4. Backend Configuration
- **File:** `backend/.env.local`
- **INSFORGE_URL:** `https://6dtjatee.us-west.insforge.app`
- **INSFORGE_API_KEY:** `ik_9f70228ae2be9d8420a214ad9acf52a1` (full-access key)
- **DEMO_USER_ID:** Your user ID for seeding data

## How to Use

### Step 1: Seed the Database with Demo Data
```bash
cd backend
uv sync  # Already done
uv run python seed.py
```

This will populate the database with the agents, meetings, actions, and other data from `frontend/lib/demo-data.js`. All data will be owned by your user ID.

### Step 2: Start the FastAPI Backend
```bash
cd backend
uv run uvicorn main:app --reload --port 8000
```

### Step 3: Start the Next.js Frontend
```bash
cd frontend
npm run dev
```

The frontend will now automatically fetch data from the backend at startup. All data will be loaded from the database through the REST API.

## Data Flow

1. User logs in via InsForge auth
2. Frontend gets the user's InsForge JWT token
3. Frontend fetches `/api/agents`, `/api/meetings`, etc. from FastAPI, passing the JWT in the `Authorization` header
4. FastAPI validates the JWT and queries InsForge's REST API
5. InsForge's RLS policies ensure users can only see their own data
6. Data is returned to the frontend and displayed

## Architecture Notes

- **Trust Model:** FastAPI validates the InsForge JWT on each request and uses the InsForge REST API as the data store
- **Authentication:** Users authenticate once with InsForge; the JWT is stored in httpOnly cookies by the frontend's auth routes
- **Authorization:** Row-Level Security (RLS) in PostgreSQL ensures row-level access control
- **API Keys:** The backend uses the full-access `INSFORGE_API_KEY` to query the database. This key should be stored as a secure environment variable in production (not checked into git)

## Next Steps

1. Run `uv run python seed.py` to populate the database
2. Start the backend with `uv run uvicorn main:app --reload --port 8000`
3. Start the frontend with `npm run dev`
4. Log in with your Google/GitHub account and you should see all the seeded data

The frontend UI will work exactly as before, but now all data is persisted to the database instead of localStorage!
