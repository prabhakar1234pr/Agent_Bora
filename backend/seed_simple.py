#!/usr/bin/env python3
"""Simple database seeding using direct SQL"""

import subprocess
import json
import sys

def run_query(query: str):
    """Run a query via the CLI"""
    try:
        result = subprocess.run(
            ["npx", "@insforge/cli", "db", "query", query],
            capture_output=True,
            text=True,
            cwd="c:/Agent_bora"
        )
        if result.returncode != 0:
            print(f"Error: {result.stderr}")
            return False
        return True
    except Exception as e:
        print(f"Exception: {e}")
        return False

# Insert agents
agents_sql = """
INSERT INTO agents (id, name, tagline, persona, voice, created, meetings, words)
VALUES
  ('ag_atlas', 'Atlas', 'Product & roadmap copilot', 'Speaks up when scope creeps. Tracks decisions, owners, and dates. Confident, concise, never rambles.', 'proactive', '2026-04-02'::date, 14, '118k'),
  ('ag_scout', 'Scout', 'Customer research note-taker', 'Quiet listener. Captures verbatim quotes, themes, and objections. Only speaks when asked.', 'passive', '2026-04-21'::date, 9, '74k');
"""

print("Inserting agents...")
if not run_query(agents_sql):
    sys.exit(1)

# Insert agent sources
sources_sql = """
INSERT INTO agent_sources (agent_id, type, label, meta) VALUES
  ('ag_atlas', 'github', 'northwind/web-app', 'main · 1,284 files'),
  ('ag_atlas', 'notion', 'Product Wiki', '42 pages synced'),
  ('ag_atlas', 'url', 'northwind.io/changelog', 'crawled weekly'),
  ('ag_atlas', 'doc', 'Q3 Roadmap.pdf', '18 pages'),
  ('ag_scout', 'doc', 'Interview guide v3', '6 pages'),
  ('ag_scout', 'url', 'dovetail.com/northwind', 'crawled'),
  ('ag_scout', 'text', 'ICP & personas', 'pasted');
"""

print("Inserting agent sources...")
if not run_query(sources_sql):
    sys.exit(1)

# Insert agent integrations
integrations_sql = """
INSERT INTO agent_integrations (agent_id, integration_id) VALUES
  ('ag_atlas', 'notion'),
  ('ag_atlas', 'asana'),
  ('ag_atlas', 'calendar'),
  ('ag_atlas', 'github'),
  ('ag_scout', 'notion'),
  ('ag_scout', 'slack'),
  ('ag_scout', 'calendar');
"""

print("Inserting agent integrations...")
if not run_query(integrations_sql):
    sys.exit(1)

# Insert meetings
meetings_sql = """
INSERT INTO meetings (id, agent_id, title, date, duration_min, platform, mode, spoke, summary) VALUES
  ('m_q3plan', 'ag_atlas', 'Q3 Roadmap Lock', '2026-05-28T15:00:00'::timestamp, 48, 'meet', 'proactive', 6, 'The team locked the Q3 roadmap around three bets: the collaborative editor, billing v2, and the mobile beta. Billing v2 slips two weeks to absorb the SOC 2 audit window. Atlas flagged that the editor and mobile beta share the same two engineers and pushed the group to sequence them — mobile beta now starts after the editor ships.'),
  ('m_cust_villa', 'ag_scout', 'Customer Sync — Villa Group', '2026-05-26T17:30:00'::timestamp, 33, 'teams', 'passive', 0, 'Villa Group renews but wants SSO and granular roles before they expand seats. Their ops lead, Tomas, was blunt: the current permissions model blocks them from rolling Agent Bora out beyond the pilot team. Scout captured the renewal as low-risk but the expansion as gated on enterprise access controls landing this quarter.'),
  ('m_design_crit', 'ag_atlas', 'Design Crit — Editor Canvas', '2026-05-22T19:00:00'::timestamp, 41, 'meet', 'proactive', 3, 'The team reviewed three directions for the collaborative editor canvas. Direction B — a focused, single-column writing surface with presence cues in the gutter — won the room. Atlas tracked the open question of how comments resolve and surfaced that it was raised twice without an owner, then assigned it.'),
  ('m_eng_standup', 'ag_atlas', 'Eng Planning — Sprint 19', '2026-05-20T16:00:00'::timestamp, 29, 'teams', 'passive', 1, 'Sprint 19 commits to the editor data model and the billing migration spike. Omar raised flakiness in the CI suite eating review time. The team agreed to timebox a fix. Atlas noted the billing spike has no acceptance criteria yet and flagged it before commit.'),
  ('m_board', 'ag_atlas', 'Investor Update Prep', '2026-05-15T14:00:00'::timestamp, 37, 'meet', 'proactive', 4, 'Prep for the May investor update. Net revenue retention is the headline at 118%. Lena and Raj aligned on framing the billing slip as a deliberate trade for SOC 2 readiness, which unlocks enterprise. Atlas pulled the three numbers that needed sources and listed them.');
"""

print("Inserting meetings...")
if not run_query(meetings_sql):
    sys.exit(1)

# Insert meeting attendees
attendees_sql = """
INSERT INTO meeting_attendees (meeting_id, name) VALUES
  ('m_q3plan', 'Mira Okonkwo'),
  ('m_q3plan', 'Dev Raman'),
  ('m_q3plan', 'Lena Cho'),
  ('m_q3plan', 'Priya Nair'),
  ('m_cust_villa', 'Mira Okonkwo'),
  ('m_cust_villa', 'Tomas Vela (Villa)'),
  ('m_cust_villa', 'Scout'),
  ('m_design_crit', 'Mira Okonkwo'),
  ('m_design_crit', 'Jun Park'),
  ('m_design_crit', 'Sara Bloom'),
  ('m_design_crit', 'Dev Raman'),
  ('m_eng_standup', 'Dev Raman'),
  ('m_eng_standup', 'Priya Nair'),
  ('m_eng_standup', 'Omar Diallo'),
  ('m_eng_standup', 'Atlas'),
  ('m_board', 'Mira Okonkwo'),
  ('m_board', 'Lena Cho'),
  ('m_board', 'Finance — Raj');
"""

print("Inserting meeting attendees...")
if not run_query(attendees_sql):
    sys.exit(1)

# Insert actions
actions_sql = """
INSERT INTO actions (meeting_id, text, owner, due, done) VALUES
  ('m_q3plan', 'Re-sequence mobile beta to start after editor GA', 'Dev Raman', 'Jun 2', true),
  ('m_q3plan', 'Book SOC 2 audit window with the security vendor', 'Lena Cho', 'Jun 5', false),
  ('m_q3plan', 'Draft pricing-experiment brief for Q4 review', 'Mira Okonkwo', 'Jun 9', false),
  ('m_q3plan', 'Update the public roadmap page with new dates', 'Priya Nair', 'Jun 4', false),
  ('m_cust_villa', 'Send SSO + roles roadmap timeline to Tomas', 'Mira Okonkwo', 'May 29', true),
  ('m_cust_villa', 'Assemble security review packet for Villa CISO', 'Mira Okonkwo', 'Jun 3', false),
  ('m_cust_villa', 'Flag enterprise-roles demand to roadmap review', 'Mira Okonkwo', 'Jun 1', false),
  ('m_design_crit', 'Prototype Direction B with live cursors', 'Jun Park', 'May 30', true),
  ('m_design_crit', 'Define comment-resolution interaction', 'Sara Bloom', 'Jun 2', false),
  ('m_design_crit', 'Spec gutter presence states for handoff', 'Jun Park', 'Jun 6', false),
  ('m_eng_standup', 'Write acceptance criteria for billing spike', 'Priya Nair', 'May 21', true),
  ('m_eng_standup', 'Timebox CI flakiness fix (1 day)', 'Omar Diallo', 'May 23', true),
  ('m_board', 'Source-check NRR, burn, and pipeline figures', 'Finance — Raj', 'May 18', true),
  ('m_board', 'Draft the SOC 2 narrative slide', 'Lena Cho', 'May 17', true),
  ('m_board', 'Send deck to board 48h ahead', 'Mira Okonkwo', 'May 20', true);
"""

print("Inserting actions...")
if not run_query(actions_sql):
    sys.exit(1)

# Insert highlights
highlights_sql = """
INSERT INTO meeting_highlights (meeting_id, highlight) VALUES
  ('m_q3plan', 'Three Q3 bets confirmed: collaborative editor, billing v2, mobile beta.'),
  ('m_q3plan', 'Billing v2 moves to mid-July to clear the SOC 2 audit window.'),
  ('m_q3plan', 'Editor and mobile beta de-conflicted — mobile starts post-editor ship.'),
  ('m_q3plan', 'Pricing experiment deferred to Q4 pending the billing migration.'),
  ('m_cust_villa', 'Renewal is solid — expansion is the real question.'),
  ('m_cust_villa', 'SSO + granular roles are hard blockers for a wider rollout.'),
  ('m_cust_villa', 'Tomas wants a security review packet for their CISO.'),
  ('m_cust_villa', 'Champion is strong; budget exists if access controls ship.'),
  ('m_design_crit', 'Direction B wins: focused single column with gutter presence.'),
  ('m_design_crit', 'Floating toolbar gets cut — too noisy on small screens.'),
  ('m_design_crit', 'Comment resolution flow is still undecided.'),
  ('m_design_crit', 'Jun to prototype B with real multiplayer cursors.'),
  ('m_eng_standup', 'Sprint 19: editor data model + billing migration spike.'),
  ('m_eng_standup', 'CI flakiness timeboxed to a one-day fix.'),
  ('m_eng_standup', 'Billing spike needs acceptance criteria before it starts.'),
  ('m_board', 'NRR of 118% is the lead metric.'),
  ('m_board', 'Frame billing slip as SOC 2 trade — unlocks enterprise pipeline.'),
  ('m_board', 'Three figures still need a verified source before the deck ships.');
"""

print("Inserting highlights...")
if not run_query(highlights_sql):
    sys.exit(1)

# Insert transcript entries
transcript_sql = """
INSERT INTO transcript_entries (meeting_id, t, speaker, text, is_agent) VALUES
  ('m_q3plan', '00:42', 'Mira Okonkwo', 'Okay, the goal today is to walk out with Q3 actually locked. No more re-litigating.', false),
  ('m_q3plan', '01:15', 'Dev Raman', 'Editor is the big one. I think it eats most of the quarter honestly.', false),
  ('m_q3plan', '02:03', 'Atlas', 'Quick flag — the editor and the mobile beta are both assigned to Dev and Priya. If they run in parallel you' + chr(39) + 're double-booking the same two people. Want me to sequence them?', true),
  ('m_q3plan', '02:20', 'Lena Cho', 'Good catch. Yeah, let' + chr(39) + 's not pretend we can do both at once.', false),
  ('m_q3plan', '02:48', 'Mira Okonkwo', 'Sequence it. Editor first, mobile beta right after GA.', false),
  ('m_cust_villa', '04:10', 'Tomas Vela', 'Look, the team that' + chr(39) + 's using it loves it. But I can' + chr(39) + 't hand this to 200 people without SSO. That' + chr(39) + 's a non-starter for us.', false),
  ('m_cust_villa', '05:02', 'Mira Okonkwo', 'Totally fair. SSO is on the Q3 list. Let me get you the actual timeline, not a vague promise.', false),
  ('m_design_crit', '08:30', 'Jun Park', 'B is the one I keep coming back to. It gets out of the way.', false),
  ('m_design_crit', '09:12', 'Sara Bloom', 'Agreed, but how do comments resolve? We keep skipping that.', false),
  ('m_eng_standup', '02:11', 'Omar Diallo', 'CI is failing randomly like a third of the time. It' + chr(39) + 's killing review velocity.', false),
  ('m_board', '05:40', 'Lena Cho', 'The billing slip is going to get a question. We should get ahead of it.', false);
"""

print("Inserting transcript entries...")
if not run_query(transcript_sql):
    sys.exit(1)

# Insert integrations
integrations_user_sql = """
INSERT INTO integrations (id, name) VALUES
  ('gmail', 'Gmail'),
  ('calendar', 'Google Calendar'),
  ('slack', 'Slack'),
  ('notion', 'Notion'),
  ('drive', 'Google Drive'),
  ('github', 'GitHub'),
  ('asana', 'Asana'),
  ('linear', 'Linear');
"""

print("Inserting integrations...")
if not run_query(integrations_user_sql):
    sys.exit(1)

# Insert agent chats
chats_sql = """
INSERT INTO agent_chats (agent_id, role, text) VALUES
  ('ag_atlas', 'agent', 'Morning, Mira. You' + chr(39) + 've got the Q3 Roadmap Lock in 40 minutes. Want the one-line state of each bet before you walk in?'),
  ('ag_atlas', 'user', 'Yes, quick version.'),
  ('ag_atlas', 'agent', 'Editor: on track, prototype lands Friday. Billing v2: slipped to mid-July for SOC 2 — that' + chr(39) + 's the one people will poke at. Mobile beta: sequenced after editor, no longer at risk. Two open actions are still unowned from last week — want me to chase them?'),
  ('ag_scout', 'agent', 'I pulled the themes across your last 6 customer calls. SSO and granular roles came up in 5 of 6. Want the highlight reel or the verbatim quotes?');
"""

print("Inserting agent chats...")
if not run_query(chats_sql):
    sys.exit(1)

# Insert upcoming meetings
upcoming_sql = """
INSERT INTO upcoming_meetings (id, agent_id, title, date, platform, mode, attendees) VALUES
  ('u1', 'ag_atlas', 'Q3 Roadmap Lock', '2026-05-30T15:00:00'::timestamp, 'meet', 'proactive', 4),
  ('u2', 'ag_scout', 'Customer Sync — Helio', '2026-05-30T18:30:00'::timestamp, 'teams', 'passive', 2),
  ('u3', 'ag_atlas', 'Design Crit — Mobile Shell', '2026-06-01T19:00:00'::timestamp, 'meet', 'proactive', 5);
"""

print("Inserting upcoming meetings...")
if not run_query(upcoming_sql):
    sys.exit(1)

print("\n✓ Database seeded successfully!")
