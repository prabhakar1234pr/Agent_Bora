import os
import json
import subprocess
from typing import Optional, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Agent Bora API", version="0.1.0")

INSFORGE_URL = os.getenv("INSFORGE_URL", "https://6dtjatee.us-west.insforge.app")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3004",
        "http://localhost:3005",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "http://127.0.0.1:3003",
        "http://127.0.0.1:3004",
        "http://127.0.0.1:3005",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class AgentSource(BaseModel):
    type: str
    label: str
    meta: str

class Agent(BaseModel):
    id: str
    name: str
    tagline: str
    persona: str
    voice: str
    created: str
    sources: list[AgentSource]
    integrations: list[str]
    meetings: int
    words: str

class ActionItem(BaseModel):
    text: str
    owner: str
    due: str
    done: bool = False

class TranscriptEntry(BaseModel):
    t: str
    speaker: str
    text: str
    isAgent: bool = False

class Meeting(BaseModel):
    id: str
    title: str
    date: str
    durationMin: int
    platform: str
    agentId: str
    mode: str
    attendees: list[str]
    spoke: int
    summary: str
    highlights: list[str]
    actions: list[ActionItem]
    transcript: list[TranscriptEntry]

class AgentChat(BaseModel):
    role: str
    text: str

class Integration(BaseModel):
    id: str
    name: str
    connected: bool = False

def run_query(sql: str) -> list:
    """Execute SQL query using InsForge CLI"""
    try:
        result = subprocess.run(
            ["npx", "@insforge/cli", "db", "query", sql, "--json"],
            capture_output=True,
            text=True,
            cwd="c:/Agent_bora"
        )
        if result.returncode != 0:
            raise Exception(f"Query failed: {result.stderr}")

        output = result.stdout.strip()
        if not output:
            return []

        return json.loads(output)
    except Exception as e:
        print(f"Error running query: {e}")
        return []

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "FastAPI backend is running"}

@app.get("/api/agents")
async def list_agents():
    """Get all agents with their sources and integrations"""
    agents = run_query("SELECT * FROM agents ORDER BY created DESC")

    result = []
    for agent in agents:
        # Get sources for this agent
        sources = run_query(f"SELECT type, label, meta FROM agent_sources WHERE agent_id = '{agent['id']}'")

        # Get integrations for this agent
        integrations = run_query(f"SELECT integration_id FROM agent_integrations WHERE agent_id = '{agent['id']}'")

        result.append({
            "id": agent["id"],
            "name": agent["name"],
            "tagline": agent.get("tagline", ""),
            "persona": agent.get("persona", ""),
            "voice": agent.get("voice", "proactive"),
            "created": str(agent.get("created", "")),
            "sources": sources,
            "integrations": [i["integration_id"] for i in integrations],
            "meetings": agent.get("meetings", 0),
            "words": agent.get("words", ""),
        })

    return result

@app.post("/api/agents")
async def create_agent(agent: Agent):
    """Create a new agent"""
    sql = f"""
    INSERT INTO agents (id, name, tagline, persona, voice, created, meetings, words)
    VALUES ('{agent.id}', '{agent.name}', '{agent.tagline}', '{agent.persona}', '{agent.voice}', '{agent.created}'::date, {agent.meetings}, '{agent.words}')
    RETURNING *
    """
    result = run_query(sql)

    # Add sources
    for source in agent.sources:
        run_query(f"""
        INSERT INTO agent_sources (agent_id, type, label, meta)
        VALUES ('{agent.id}', '{source.type}', '{source.label}', '{source.meta}')
        """)

    # Add integrations
    for integration_id in agent.integrations:
        run_query(f"""
        INSERT INTO agent_integrations (agent_id, integration_id)
        VALUES ('{agent.id}', '{integration_id}')
        """)

    return agent.dict()

@app.get("/api/meetings")
async def list_meetings():
    """Get all meetings with full details"""
    meetings = run_query("SELECT * FROM meetings ORDER BY date DESC")

    result = []
    for meeting in meetings:
        # Get attendees
        attendees = run_query(f"SELECT name FROM meeting_attendees WHERE meeting_id = '{meeting['id']}'")

        # Get actions
        actions = run_query(f"SELECT text, owner, due, done FROM actions WHERE meeting_id = '{meeting['id']}'")

        # Get highlights
        highlights = run_query(f"SELECT highlight FROM meeting_highlights WHERE meeting_id = '{meeting['id']}'")

        # Get transcript
        transcript = run_query(f"SELECT t, speaker, text, is_agent as isAgent FROM transcript_entries WHERE meeting_id = '{meeting['id']}'")

        result.append({
            "id": meeting["id"],
            "title": meeting["title"],
            "date": str(meeting.get("date", "")),
            "durationMin": meeting.get("duration_min", 0),
            "platform": meeting.get("platform", "meet"),
            "agentId": meeting.get("agent_id", ""),
            "mode": meeting.get("mode", "proactive"),
            "attendees": [a["name"] for a in attendees],
            "spoke": meeting.get("spoke", 0),
            "summary": meeting.get("summary", ""),
            "highlights": [h["highlight"] for h in highlights],
            "actions": actions,
            "transcript": transcript,
        })

    return result

@app.get("/api/meetings/{meeting_id}")
async def get_meeting(meeting_id: str):
    """Get a single meeting"""
    meetings = run_query(f"SELECT * FROM meetings WHERE id = '{meeting_id}'")
    if not meetings:
        raise HTTPException(status_code=404, detail="Meeting not found")

    meeting = meetings[0]

    # Get attendees
    attendees = run_query(f"SELECT name FROM meeting_attendees WHERE meeting_id = '{meeting_id}'")

    # Get actions
    actions = run_query(f"SELECT text, owner, due, done FROM actions WHERE meeting_id = '{meeting_id}'")

    # Get highlights
    highlights = run_query(f"SELECT highlight FROM meeting_highlights WHERE meeting_id = '{meeting_id}'")

    # Get transcript
    transcript = run_query(f"SELECT t, speaker, text, is_agent as isAgent FROM transcript_entries WHERE meeting_id = '{meeting_id}'")

    return {
        "id": meeting["id"],
        "title": meeting["title"],
        "date": str(meeting.get("date", "")),
        "durationMin": meeting.get("duration_min", 0),
        "platform": meeting.get("platform", "meet"),
        "agentId": meeting.get("agent_id", ""),
        "mode": meeting.get("mode", "proactive"),
        "attendees": [a["name"] for a in attendees],
        "spoke": meeting.get("spoke", 0),
        "summary": meeting.get("summary", ""),
        "highlights": [h["highlight"] for h in highlights],
        "actions": actions,
        "transcript": transcript,
    }

@app.get("/api/actions")
async def list_actions():
    """Get all action items rolled up across meetings"""
    actions = run_query("SELECT * FROM actions ORDER BY due")
    return actions

@app.get("/api/integrations")
async def list_integrations():
    """Get all integrations"""
    integrations = run_query("SELECT * FROM integrations ORDER BY id")
    return [{
        "id": i["id"],
        "name": i.get("name", ""),
        "connected": i.get("connected", False)
    } for i in integrations]

@app.get("/api/agents/{agent_id}/chat")
async def get_agent_chat(agent_id: str):
    """Get chat history for an agent"""
    chats = run_query(f"SELECT role, text FROM agent_chats WHERE agent_id = '{agent_id}' ORDER BY created ASC")
    return chats

@app.post("/api/agents/{agent_id}/chat")
async def post_agent_chat(agent_id: str, chat: AgentChat):
    """Add a message to agent chat"""
    sql = f"""
    INSERT INTO agent_chats (agent_id, role, text)
    VALUES ('{agent_id}', '{chat.role}', '{chat.text.replace("'", "''")}')
    RETURNING role, text
    """
    result = run_query(sql)
    return result[0] if result else {}

@app.patch("/api/meetings/{meeting_id}/actions/{action_idx}")
async def toggle_action(meeting_id: str, action_idx: int, done: bool):
    """Toggle action item done status"""
    sql = f"""
    UPDATE actions
    SET done = {str(done).lower()}
    WHERE meeting_id = '{meeting_id}'
    LIMIT 1 OFFSET {action_idx}
    RETURNING *
    """
    result = run_query(sql)
    return result[0] if result else {}

@app.get("/api/me")
async def get_user():
    """Get current user info"""
    return {
        "id": "demo-user",
        "email": "user@example.com",
        "profile": {"name": "User"}
    }
