#!/usr/bin/env python3
"""Seed the InsForge database with demo data from the frontend"""

import os
import uuid
import httpx
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

INSFORGE_URL = os.getenv("INSFORGE_URL", "https://6dtjatee.us-west.insforge.app")
INSFORGE_API_KEY = os.getenv("INSFORGE_API_KEY", "")
USER_ID = os.getenv("DEMO_USER_ID", str(uuid.uuid4()))  # Use a test user ID

# Demo user that owns the data
DEMO_USER = {
    "name": "Mira Okonkwo",
    "email": "mira@northwind.io",
    "company": "Northwind",
    "role": "Head of Product",
}

SEED_AGENTS = [
    {
        "id": "ag_atlas",
        "name": "Atlas",
        "tagline": "Product & roadmap copilot",
        "persona": "Speaks up when scope creeps. Tracks decisions, owners, and dates. Confident, concise, never rambles.",
        "voice": "proactive",
        "created": "2026-04-02",
        "sources": [
            {"type": "github", "label": "northwind/web-app", "meta": "main · 1,284 files"},
            {"type": "notion", "label": "Product Wiki", "meta": "42 pages synced"},
            {"type": "url", "label": "northwind.io/changelog", "meta": "crawled weekly"},
            {"type": "doc", "label": "Q3 Roadmap.pdf", "meta": "18 pages"},
        ],
        "integrations": ["notion", "asana", "calendar", "github"],
        "meetings": 14,
        "words": "118k",
    },
    {
        "id": "ag_scout",
        "name": "Scout",
        "tagline": "Customer research note-taker",
        "persona": "Quiet listener. Captures verbatim quotes, themes, and objections. Only speaks when asked.",
        "voice": "passive",
        "created": "2026-04-21",
        "sources": [
            {"type": "doc", "label": "Interview guide v3", "meta": "6 pages"},
            {"type": "url", "label": "dovetail.com/northwind", "meta": "crawled"},
            {"type": "text", "label": "ICP & personas", "meta": "pasted"},
        ],
        "integrations": ["notion", "slack", "calendar"],
        "meetings": 9,
        "words": "74k",
    },
]

SEED_MEETINGS = [
    {
        "id": "m_q3plan",
        "title": "Q3 Roadmap Lock",
        "date": "2026-05-28T15:00:00",
        "durationMin": 48,
        "platform": "meet",
        "agentId": "ag_atlas",
        "mode": "proactive",
        "attendees": ["Mira Okonkwo", "Dev Raman", "Lena Cho", "Priya Nair"],
        "spoke": 6,
        "summary": "The team locked the Q3 roadmap around three bets: the collaborative editor, billing v2, and the mobile beta. Billing v2 slips two weeks to absorb the SOC 2 audit window. Atlas flagged that the editor and mobile beta share the same two engineers and pushed the group to sequence them — mobile beta now starts after the editor ships.",
        "highlights": [
            "Three Q3 bets confirmed: collaborative editor, billing v2, mobile beta.",
            "Billing v2 moves to mid-July to clear the SOC 2 audit window.",
            "Editor and mobile beta de-conflicted — mobile starts post-editor ship.",
            "Pricing experiment deferred to Q4 pending the billing migration.",
        ],
        "actions": [
            {"text": "Re-sequence mobile beta to start after editor GA", "owner": "Dev Raman", "due": "Jun 2", "done": True},
            {"text": "Book SOC 2 audit window with the security vendor", "owner": "Lena Cho", "due": "Jun 5", "done": False},
            {"text": "Draft pricing-experiment brief for Q4 review", "owner": "Mira Okonkwo", "due": "Jun 9", "done": False},
            {"text": "Update the public roadmap page with new dates", "owner": "Priya Nair", "due": "Jun 4", "done": False},
        ],
        "transcript": [
            {"t": "00:42", "speaker": "Mira Okonkwo", "text": "Okay, the goal today is to walk out with Q3 actually locked. No more re-litigating."},
            {"t": "01:15", "speaker": "Dev Raman", "text": "Editor is the big one. I think it eats most of the quarter honestly."},
            {
                "t": "02:03",
                "speaker": "Atlas",
                "isAgent": True,
                "text": "Quick flag — the editor and the mobile beta are both assigned to Dev and Priya. If they run in parallel you're double-booking the same two people. Want me to sequence them?",
            },
        ],
    },
    {
        "id": "m_cust_villa",
        "title": "Customer Sync — Villa Group",
        "date": "2026-05-26T17:30:00",
        "durationMin": 33,
        "platform": "teams",
        "agentId": "ag_scout",
        "mode": "passive",
        "attendees": ["Mira Okonkwo", "Tomas Vela (Villa)", "Scout"],
        "spoke": 0,
        "summary": "Villa Group renews but wants SSO and granular roles before they expand seats. Their ops lead, Tomas, was blunt: the current permissions model blocks them from rolling Agent Bora out beyond the pilot team. Scout captured the renewal as low-risk but the expansion as gated on enterprise access controls landing this quarter.",
        "highlights": [
            "Renewal is solid — expansion is the real question.",
            "SSO + granular roles are hard blockers for a wider rollout.",
            "Tomas wants a security review packet for their CISO.",
            "Champion is strong; budget exists if access controls ship.",
        ],
        "actions": [
            {"text": "Send SSO + roles roadmap timeline to Tomas", "owner": "Mira Okonkwo", "due": "May 29", "done": True},
            {"text": "Assemble security review packet for Villa CISO", "owner": "Mira Okonkwo", "due": "Jun 3", "done": False},
            {"text": "Flag enterprise-roles demand to roadmap review", "owner": "Mira Okonkwo", "due": "Jun 1", "done": False},
        ],
        "transcript": [
            {
                "t": "04:10",
                "speaker": "Tomas Vela",
                "text": "Look, the team that's using it loves it. But I can't hand this to 200 people without SSO. That's a non-starter for us.",
            },
        ],
    },
]

SEED_INTEGRATIONS = [
    {"id": "gmail", "name": "Gmail", "connected": False},
    {"id": "calendar", "name": "Google Calendar", "connected": False},
    {"id": "slack", "name": "Slack", "connected": False},
    {"id": "notion", "name": "Notion", "connected": False},
    {"id": "drive", "name": "Google Drive", "connected": False},
    {"id": "github", "name": "GitHub", "connected": False},
    {"id": "asana", "name": "Asana", "connected": False},
    {"id": "linear", "name": "Linear", "connected": False},
]

async def seed_database():
    """Seed the database with demo data"""
    async with httpx.AsyncClient() as client:
        headers = {
            "apikey": INSFORGE_API_KEY,
            "Content-Type": "application/json",
        }

        print(f"Using USER_ID: {USER_ID}")
        print(f"Using INSFORGE_URL: {INSFORGE_URL}")

        # Seed agents
        print("\nSeeding agents...")
        for agent_data in SEED_AGENTS:
            sources = agent_data.pop("sources")
            integrations = agent_data.pop("integrations")

            agent_data["user_id"] = USER_ID

            # Create agent
            response = await client.post(
                f"{INSFORGE_URL}/rest/v1/agents",
                headers=headers,
                json=agent_data,
            )
            print(f"Agent {agent_data['id']}: {response.status_code}")
            if response.status_code >= 400:
                print(f"  Error: {response.text}")
                continue

            # Create sources
            for source in sources:
                source_data = {
                    "agent_id": agent_data["id"],
                    **source,
                }
                response = await client.post(
                    f"{INSFORGE_URL}/rest/v1/agent_sources",
                    headers=headers,
                    json=source_data,
                )
                print(f"  Source {source['label']}: {response.status_code}")

            # Create integrations
            for integration_id in integrations:
                integration_data = {
                    "agent_id": agent_data["id"],
                    "integration_id": integration_id,
                }
                response = await client.post(
                    f"{INSFORGE_URL}/rest/v1/agent_integrations",
                    headers=headers,
                    json=integration_data,
                )
                print(f"  Integration {integration_id}: {response.status_code}")

        # Seed meetings
        print("\nSeeding meetings...")
        for meeting_data in SEED_MEETINGS:
            attendees = meeting_data.pop("attendees")
            actions = meeting_data.pop("actions")
            highlights = meeting_data.pop("highlights")
            transcript = meeting_data.pop("transcript")

            meeting_data["user_id"] = USER_ID
            meeting_data["agent_id"] = meeting_data.pop("agentId")
            meeting_data["duration_min"] = meeting_data.pop("durationMin")

            # Create meeting
            response = await client.post(
                f"{INSFORGE_URL}/rest/v1/meetings",
                headers=headers,
                json=meeting_data,
            )
            print(f"Meeting {meeting_data['id']}: {response.status_code}")
            if response.status_code >= 400:
                print(f"  Error: {response.text}")
                continue

            # Create attendees
            for attendee_name in attendees:
                attendee_data = {
                    "meeting_id": meeting_data["id"],
                    "name": attendee_name,
                }
                response = await client.post(
                    f"{INSFORGE_URL}/rest/v1/meeting_attendees",
                    headers=headers,
                    json=attendee_data,
                )
                print(f"  Attendee {attendee_name}: {response.status_code}")

            # Create actions
            for action in actions:
                action_data = {
                    "meeting_id": meeting_data["id"],
                    **action,
                }
                response = await client.post(
                    f"{INSFORGE_URL}/rest/v1/actions",
                    headers=headers,
                    json=action_data,
                )
                print(f"  Action '{action['text'][:30]}...': {response.status_code}")

            # Create highlights
            for highlight in highlights:
                highlight_data = {
                    "meeting_id": meeting_data["id"],
                    "highlight": highlight,
                }
                response = await client.post(
                    f"{INSFORGE_URL}/rest/v1/meeting_highlights",
                    headers=headers,
                    json=highlight_data,
                )
                print(f"  Highlight: {response.status_code}")

            # Create transcript entries
            for entry in transcript:
                entry_data = {
                    "meeting_id": meeting_data["id"],
                    "t": entry["t"],
                    "speaker": entry["speaker"],
                    "text": entry["text"],
                    "is_agent": entry.get("isAgent", False),
                }
                response = await client.post(
                    f"{INSFORGE_URL}/rest/v1/transcript_entries",
                    headers=headers,
                    json=entry_data,
                )
                print(f"  Transcript entry from {entry['speaker']}: {response.status_code}")

        # Seed integrations
        print("\nSeeding integrations...")
        for integration in SEED_INTEGRATIONS:
            integration["user_id"] = USER_ID
            response = await client.post(
                f"{INSFORGE_URL}/rest/v1/integrations",
                headers=headers,
                json=integration,
            )
            print(f"Integration {integration['id']}: {response.status_code}")

        print("\nDatabase seeding complete!")

if __name__ == "__main__":
    import asyncio
    asyncio.run(seed_database())
