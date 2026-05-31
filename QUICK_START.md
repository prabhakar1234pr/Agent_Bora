# Quick Start — Agent Bora with InsForge Database

## 🚀 Run Everything (3 steps)

### 1. Start Backend
```bash
cd backend
uv run uvicorn main:app --reload --port 8000
```
Serves REST API at `http://localhost:8000`

### 2. Start Frontend
```bash
cd frontend
npm run dev
```
Runs at `http://localhost:3000`

### 3. Log In & See Data
- Go to http://localhost:3000
- Click **Login** → Google or GitHub
- **Done!** All data loads from the database

## 📊 What You'll See

✅ **2 AI Agents** (Atlas, Scout) with their sources and integrations  
✅ **5 Meetings** with full transcripts, action items, and highlights  
✅ **15 Action Items** across meetings  
✅ **3 Upcoming Meetings** scheduled  
✅ **8 Integration Options** (Gmail, Slack, Notion, etc.)  

## 🔗 Data Flow

```
Your Login (Google/GitHub)
    ↓
InsForge JWT Token
    ↓
Frontend /api/agents, /api/meetings, etc.
    ↓
FastAPI Backend (validates JWT)
    ↓
InsForge REST API
    ↓
PostgreSQL Database
    ↓
Your Data (private, RLS-protected)
```

## 🧪 Test It

1. **View Agents**
   - Click "Agents" page
   - See Atlas and Scout with full details

2. **View Meetings**
   - Click "Meetings" page
   - See all 5 meetings with transcripts and action items

3. **Toggle Actions**
   - Click meeting → click action checkbox
   - Saves to database instantly

4. **Check API**
   - Open http://localhost:8000/docs
   - Test endpoints in Swagger UI

## 📝 Database Schema

| Table | Records | Purpose |
|-------|---------|---------|
| agents | 2 | AI agents (Atlas, Scout) |
| meetings | 5 | Meeting briefs |
| actions | 15 | Action items from meetings |
| agent_sources | 7 | Sources for agents |
| agent_integrations | 7 | Integrations per agent |
| meeting_attendees | 18 | Who attended meetings |
| transcript_entries | 11 | Meeting transcript |
| meeting_highlights | 18 | Key points |
| integrations | 8 | Available services |
| agent_chats | 4 | Conversation history |
| upcoming_meetings | 3 | Scheduled meetings |

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `backend/main.py` | FastAPI REST endpoints |
| `frontend/context/DemoStore.js` | Data layer (fetches from /api) |
| `.insforge/project.json` | InsForge config |
| `frontend/.env.local` | Frontend env vars |
| `backend/.env.local` | Backend env vars |

## ❓ Common Tasks

### Seed More Data
```bash
cd backend
# Data is already seeded. To add more, insert via SQL:
npx @insforge/cli db query "INSERT INTO agents (...) VALUES (...);"
```

### Check Database
```bash
npx @insforge/cli db query "SELECT * FROM agents;"
```

### View API Docs
```
http://localhost:8000/docs
```

### Reset Database
```bash
# This DELETES all data!
npx @insforge/cli db query "DELETE FROM agents CASCADE;"
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | Check port 8000 is free: `lsof -i :8000` |
| Frontend can't reach backend | Check `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000` in frontend/.env.local |
| Login doesn't work | Verify InsForge OAuth configured in frontend/.env.local |
| No data appears | Check browser console for errors, restart both apps |
| JWT token invalid | Log out and back in, or clear cookies |

## 📚 Next Steps

1. **Test the full app** — Log in and browse all pages
2. **Create new agent** — Add a new AI agent with sources
3. **Add to meeting** — Invite an agent to a meeting
4. **Toggle actions** — Mark action items done
5. **Check transcripts** — View meeting transcripts and highlights

## 🎯 You're All Set!

The frontend now pulls **real data from the database**. Every user sees only their own data, protected by row-level security. All demo data is loaded and ready to use.

**Status:** ✅ Production-ready (minus prod secrets management)
