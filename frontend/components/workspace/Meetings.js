import { useEffect, useRef, useState } from "react";
import { Btn, Icon, AgentAvatar, EmptyState, IntegrationTile, INTEGRATIONS } from "../ui";
import { fmtDate, fmtTime } from "../../lib/demo-data";
import PageWrap from "./PageWrap";
import { PlatformTag } from "./Home";

/* ---------------- Meetings list ---------------- */
function MeetingCard({ m, app }) {
  const agent = app.agents.find((a) => a.id === m.agentId);
  const open = m.actions.filter((a) => !a.done).length;
  return (
    <button
      className="card"
      onClick={() => app.nav("brief", { id: m.id })}
      style={{ textAlign: "left", cursor: "pointer", padding: 0, borderRadius: 16, overflow: "hidden", transition: "all .15s", display: "flex", flexDirection: "column" }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-md)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-sm)")}
    >
      <div style={{ padding: "18px 20px 16px" }}>
        <div className="row between center" style={{ marginBottom: 12 }}>
          <div className="row center" style={{ gap: 9 }}>
            <PlatformTag platform={m.platform} />
            <span className="faint">·</span>
            <span className="muted" style={{ fontSize: 12.5 }}>
              {fmtDate(m.date, { month: "short", day: "numeric" })} · {m.durationMin}m
            </span>
          </div>
          {m.spoke > 0 ? (
            <span className="badge badge-accent">
              <Icon name="mic" size={12} />
              Spoke {m.spoke}×
            </span>
          ) : (
            <span className="badge badge-muted">
              <Icon name="eye" size={12} />
              Listened
            </span>
          )}
        </div>
        <h3 style={{ fontSize: 17.5, marginBottom: 9 }}>{m.title}</h3>
        <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {m.summary}
        </p>
      </div>
      <div className="row between center" style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", background: "var(--surface-2)" }}>
        <div className="row center" style={{ gap: 9 }}>
          {agent && <AgentAvatar name={agent.name} size={24} />}
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>{agent ? agent.name : "—"}</span>
        </div>
        <div className="row center" style={{ gap: 14 }}>
          <span className="row center muted" style={{ gap: 6, fontSize: 12.5 }}>
            <Icon name="users" size={14} />
            {m.attendees.length}
          </span>
          {open > 0 ? (
            <span className="badge badge-amber">{open} open</span>
          ) : (
            <span className="badge badge-accent">
              <Icon name="check" size={12} stroke={2.6} />
              Closed
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export function MeetingsPage({ app }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  let list = app.meetings;
  if (filter !== "all") list = list.filter((m) => m.agentId === filter);
  if (q.trim())
    list = list.filter(
      (m) => m.title.toLowerCase().includes(q.toLowerCase()) || m.summary.toLowerCase().includes(q.toLowerCase())
    );

  return (
    <PageWrap
      title="Meetings"
      subtitle="Every call your agents sat in — and the briefs they wrote."
      actions={
        <Btn variant="primary" icon="plus" onClick={() => app.nav("newMeeting")}>
          New meeting
        </Btn>
      }
    >
      <div className="row between center" style={{ marginBottom: 20, gap: 14 }}>
        <div className="row center" style={{ gap: 8 }}>
          <button className={"chip" + (filter === "all" ? " is-on" : "")} onClick={() => setFilter("all")}>
            All agents
          </button>
          {app.agents.map((a) => (
            <button key={a.id} className={"chip" + (filter === a.id ? " is-on" : "")} onClick={() => setFilter(a.id)}>
              <AgentAvatar name={a.name} size={18} />
              {a.name}
            </button>
          ))}
        </div>
        <div style={{ position: "relative", width: 280 }}>
          <Icon name="search" size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }} />
          <input className="input" placeholder="Search briefs…" value={q} onChange={(e) => setQ(e.target.value)} style={{ paddingLeft: 36, height: 40 }} />
        </div>
      </div>

      {list.length === 0 ? (
        <div className="card" style={{ borderRadius: 18 }}>
          <EmptyState
            icon="meetings"
            title="No meetings found"
            body="Try a different filter, or call an agent into your next call."
            action={
              <Btn variant="primary" icon="plus" onClick={() => app.nav("newMeeting")}>
                New meeting
              </Btn>
            }
          />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
          {list.map((m) => (
            <MeetingCard key={m.id} m={m} app={app} />
          ))}
        </div>
      )}
    </PageWrap>
  );
}

/* ---------------- Brief: media player ---------------- */
function MediaPlayer({ m }) {
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0.34);
  const dur = m.durationMin;
  const cur = Math.round(dur * t);
  return (
    <div className="card" style={{ borderRadius: 16, overflow: "hidden" }}>
      <div className="ph" style={{ aspectRatio: "16/9", borderRadius: 0, border: "none", position: "relative", background: "linear-gradient(150deg,#1b2521,#0f1714)" }}>
        <div style={{ position: "absolute", inset: 0, padding: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 10, opacity: 0.9 }}>
          {m.attendees.slice(0, 4).map((n, i) => (
            <div
              key={i}
              style={{
                borderRadius: 10,
                background: `linear-gradient(150deg, ${["#3f4d59", "#2f3b45", "#45525d", "#27323b"][i]}, #182026)`,
                display: "grid",
                placeItems: "center",
                position: "relative",
              }}
            >
              <div className="avatar" style={{ width: 34, height: 34, fontSize: 13, background: "rgba(255,255,255,.16)" }}>
                {n[0]}
              </div>
              <span style={{ position: "absolute", left: 8, bottom: 6, fontSize: 10.5, color: "#fff", fontWeight: 600, opacity: 0.9 }}>{n.split(" ")[0]}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => setPlaying((p) => !p)}
          style={{
            position: "absolute",
            inset: 0,
            margin: "auto",
            width: 64,
            height: 64,
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            background: "rgba(255,255,255,.92)",
            display: "grid",
            placeItems: "center",
            boxShadow: "0 8px 24px rgba(0,0,0,.3)",
          }}
        >
          <Icon name={playing ? "pause" : "play"} size={26} style={{ color: "#0E1714", marginLeft: playing ? 0 : 3 }} />
        </button>
        <span style={{ position: "absolute", top: 12, left: 14 }} className="mono">
          MEETING RECORDING
        </span>
      </div>
      <div className="row center" style={{ gap: 12, padding: "12px 16px", background: "var(--surface)" }}>
        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setPlaying((p) => !p)}>
          <Icon name={playing ? "pause" : "play"} size={17} />
        </button>
        <span className="mono" style={{ fontSize: 12, color: "var(--text-2)" }}>
          {cur}:{(((t * 60) % 60) | 0).toString().padStart(2, "0")}
        </span>
        <div
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setT(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
          }}
          style={{ flex: 1, height: 6, borderRadius: 99, background: "var(--surface-3)", cursor: "pointer", position: "relative" }}
        >
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${t * 100}%`, background: "var(--accent)", borderRadius: 99 }} />
          <div
            style={{
              position: "absolute",
              left: `${t * 100}%`,
              top: "50%",
              transform: "translate(-50%,-50%)",
              width: 13,
              height: 13,
              borderRadius: "50%",
              background: "#fff",
              border: "2px solid var(--accent)",
              boxShadow: "var(--shadow-sm)",
            }}
          />
        </div>
        <span className="mono" style={{ fontSize: 12, color: "var(--text-3)" }}>
          {dur}:00
        </span>
        <button className="btn btn-ghost btn-icon btn-sm">
          <Icon name="download" size={16} />
        </button>
      </div>
    </div>
  );
}

function AudioBar() {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="row center" style={{ gap: 12, padding: "12px 16px", background: "var(--surface-2)", borderRadius: 12 }}>
      <button
        className="btn btn-primary btn-icon btn-sm"
        onClick={() => setPlaying((p) => !p)}
        style={{ borderRadius: "50%", width: 34, height: 34 }}
      >
        <Icon name={playing ? "pause" : "play"} size={15} style={{ marginLeft: playing ? 0 : 2 }} />
      </button>
      <Icon name="audio" size={16} style={{ color: "var(--text-2)" }} />
      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>Audio only</span>
      <div className="grow" style={{ display: "flex", alignItems: "center", gap: 2, height: 24 }}>
        {Array.from({ length: 48 }).map((_, i) => (
          <span key={i} style={{ flex: 1, height: `${20 + Math.abs(Math.sin(i * 0.9)) * 70}%`, background: i < 18 ? "var(--accent)" : "var(--border-2)", borderRadius: 2 }} />
        ))}
      </div>
      <span className="mono" style={{ fontSize: 11.5, color: "var(--text-3)" }}>
        MP3
      </span>
      <button className="btn btn-ghost btn-icon btn-sm">
        <Icon name="download" size={16} />
      </button>
    </div>
  );
}

/* ---------------- Brief: transcript ---------------- */
function Transcript({ m, agent }) {
  return (
    <div className="col" style={{ gap: 2 }}>
      {m.transcript.map((line, i) => {
        const isAgent = line.isAgent;
        return (
          <div key={i} style={{ display: "flex", gap: 13, padding: "12px 12px", borderRadius: 12, background: isAgent ? "var(--accent-t)" : "transparent" }}>
            <span className="mono" style={{ fontSize: 11.5, color: "var(--text-3)", width: 42, flex: "none", paddingTop: 3 }}>
              {line.t}
            </span>
            {isAgent ? (
              <AgentAvatar name={agent ? agent.name : line.speaker} size={28} />
            ) : (
              <div className="avatar" style={{ width: 28, height: 28, fontSize: 11, background: "var(--surface-3)", color: "var(--text-2)" }}>
                {line.speaker[0]}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="row center" style={{ gap: 8, marginBottom: 3 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: isAgent ? "var(--accent-ink)" : "var(--text)" }}>{line.speaker}</span>
                {isAgent && (
                  <span className="badge badge-accent" style={{ height: 18, fontSize: 11 }}>
                    agent
                  </span>
                )}
              </div>
              <p style={{ fontSize: 13.5, lineHeight: 1.55, color: isAgent ? "var(--accent-ink)" : "var(--text-2)" }}>{line.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Brief: act-on-it chat ---------------- */
const ACT_QUICK = [
  { id: "email", label: "Draft follow-up", icon: "mail", int: "gmail", reply: "Drafted a follow-up in Gmail to all 4 attendees — recaps the decision, lists the open action items with owners, and asks the two unowned items to be claimed. Ready in your drafts." },
  { id: "tasks", label: "Create tasks", icon: "listCheck", int: "asana", reply: "Created 3 tasks in Asana under “Q3 Roadmap”, each with the owner and due date from this brief. Want me to set reminders too?" },
  { id: "notion", label: "Save to Notion", icon: "doc", int: "notion", reply: "Saved the full brief to your Notion “Meeting Notes” database with the summary, action items, and transcript link." },
  { id: "cal", label: "Schedule follow-up", icon: "calendar", int: "calendar", reply: "Found a 30-min slot Thursday at 2pm that works for everyone and drafted a calendar invite titled “Q3 follow-up — open items”." },
];
function ActChat({ m, agent, app }) {
  const [thread, setThread] = useState([
    { role: "agent", text: `I’ve got the full context of this meeting. Want me to act on it? I can draft the follow-up, file the tasks, or answer anything about what was said.` },
  ]);
  const [draft, setDraft] = useState("");
  const scroller = useRef(null);
  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [thread]);

  const run = (q, reply) => {
    setThread((t) => [...t, { role: "user", text: q }]);
    setTimeout(() => setThread((t) => [...t, { role: "agent", text: reply }]), 700);
  };
  const send = () => {
    const t = draft.trim();
    if (!t) return;
    setDraft("");
    run(t, "Done — pulled that straight from the transcript and your connected tools. Anything else you want me to handle from this meeting?");
  };

  return (
    <div className="card" style={{ borderRadius: 16, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div className="row center between" style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
        <div className="row center" style={{ gap: 10 }}>
          <AgentAvatar name={agent ? agent.name : "Agent"} size={30} listening />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Act on this meeting</div>
            <div className="faint" style={{ fontSize: 11.5 }}>
              Connected to your tools
            </div>
          </div>
        </div>
        <Icon name="sparkle" size={17} style={{ color: "var(--accent-d)" }} />
      </div>

      <div ref={scroller} style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12, maxHeight: 300, overflowY: "auto" }}>
        {thread.map((msg, i) => (
          <div key={i} className="row" style={{ gap: 9, justifyContent: msg.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-start" }}>
            {msg.role === "agent" && <AgentAvatar name={agent ? agent.name : "A"} size={24} />}
            <div
              style={{
                maxWidth: "82%",
                padding: "10px 13px",
                borderRadius: 13,
                fontSize: 13,
                lineHeight: 1.5,
                background: msg.role === "user" ? "var(--accent)" : "var(--surface-2)",
                color: msg.role === "user" ? "#fff" : "var(--text)",
                borderBottomRightRadius: msg.role === "user" ? 4 : 13,
                borderBottomLeftRadius: msg.role === "user" ? 13 : 4,
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "10px 16px 14px", borderTop: "1px solid var(--border)" }}>
        <div className="row wrap" style={{ gap: 7, marginBottom: 10 }}>
          {ACT_QUICK.map((a) => {
            const conn = app.connected.includes(a.int);
            return (
              <button
                key={a.id}
                className="chip"
                onClick={() => run(a.label, conn ? a.reply : `I can do that once ${INTEGRATIONS[a.int].label} is connected. Want to connect it now?`)}
                style={{ height: 30 }}
              >
                <IntegrationTile id={a.int} size={16} radius={5} />
                {a.label}
              </button>
            );
          })}
        </div>
        <div className="row center" style={{ gap: 8, border: "1px solid var(--border-2)", borderRadius: 11, padding: "5px 5px 5px 13px" }}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask about this meeting…"
            style={{ flex: 1, border: "none", outline: "none", fontSize: 13.5, background: "transparent" }}
          />
          <button className="btn btn-primary btn-icon btn-sm" onClick={send} disabled={!draft.trim()} style={{ opacity: draft.trim() ? 1 : 0.5 }}>
            <Icon name="send" size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Brief page ---------------- */
export function BriefPage({ app }) {
  const m = app.meetings.find((x) => x.id === app.params.id);
  if (!m)
    return (
      <PageWrap title="Brief">
        <div className="muted">Meeting not found.</div>
      </PageWrap>
    );
  const agent = app.agents.find((a) => a.id === m.agentId);

  return (
    <div className="app-scroll fade-in">
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "24px 28px 60px" }}>
        <button className="btn btn-ghost btn-sm" onClick={() => app.nav("meetings")} style={{ marginBottom: 16, paddingLeft: 8 }}>
          <Icon name="chevL" size={16} />
          All meetings
        </button>

        {/* header */}
        <div className="row between" style={{ alignItems: "flex-start", marginBottom: 24, gap: 20 }}>
          <div>
            <div className="row center" style={{ gap: 10, marginBottom: 10 }}>
              <PlatformTag platform={m.platform} />
              <span className="faint">·</span>
              <span className="muted" style={{ fontSize: 13 }}>
                {fmtDate(m.date, { weekday: "long", month: "long", day: "numeric" })} · {fmtTime(m.date)} · {m.durationMin} min
              </span>
            </div>
            <h1 style={{ fontSize: 34, letterSpacing: "-.03em" }}>{m.title}</h1>
            <div className="row center" style={{ gap: 14, marginTop: 14 }}>
              {agent && (
                <div className="row center" style={{ gap: 9 }}>
                  <AgentAvatar name={agent.name} size={30} />
                  <span style={{ fontSize: 13.5 }}>
                    <span className="muted">Covered by </span>
                    <b>{agent.name}</b>
                  </span>
                  <span className={"badge " + (m.mode === "proactive" ? "badge-accent" : "badge-muted")}>{m.mode === "proactive" ? "Proactive" : "Passive"}</span>
                </div>
              )}
            </div>
          </div>
          <div className="row center" style={{ gap: 9 }}>
            <Btn variant="secondary" icon="download">
              Export
            </Btn>
            <Btn variant="secondary" icon="copy">
              Share
            </Btn>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.62fr 1fr", gap: 26, alignItems: "start" }}>
          {/* main */}
          <div className="col" style={{ gap: 22 }}>
            <MediaPlayer m={m} />
            <AudioBar />

            {/* summary */}
            <div className="card card-pad" style={{ borderRadius: 16 }}>
              <div className="row center" style={{ gap: 9, marginBottom: 14 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: "var(--accent-t)", color: "var(--accent-d)", display: "grid", placeItems: "center" }}>
                  <Icon name="sparkle" size={16} />
                </div>
                <h3 style={{ fontSize: 17 }}>AI summary</h3>
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.68, color: "var(--text)" }}>{m.summary}</p>
              <div className="hairline" style={{ margin: "18px 0" }} />
              <div className="label" style={{ marginBottom: 12 }}>
                KEY MOMENTS
              </div>
              <div className="col" style={{ gap: 10 }}>
                {m.highlights.map((h, i) => (
                  <div key={i} className="row" style={{ gap: 11, alignItems: "flex-start" }}>
                    <div style={{ width: 20, height: 20, borderRadius: 6, background: "var(--accent-t)", color: "var(--accent-d)", display: "grid", placeItems: "center", flex: "none", marginTop: 1 }}>
                      <Icon name="check" size={13} stroke={2.6} />
                    </div>
                    <span style={{ fontSize: 14, lineHeight: 1.5 }}>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* transcript */}
            <div className="card card-pad" style={{ borderRadius: 16 }}>
              <div className="row between center" style={{ marginBottom: 8 }}>
                <div className="row center" style={{ gap: 9 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: "var(--surface-2)", color: "var(--text-2)", display: "grid", placeItems: "center" }}>
                    <Icon name="list" size={16} />
                  </div>
                  <h3 style={{ fontSize: 17 }}>Transcript</h3>
                  <span className="badge badge-muted">{m.transcript.length} segments</span>
                </div>
                <button className="btn btn-ghost btn-sm">
                  <Icon name="search" size={15} />
                  Search
                </button>
              </div>
              <Transcript m={m} agent={agent} />
              <button className="btn btn-ghost btn-sm btn-block" style={{ marginTop: 8, color: "var(--accent-d)" }}>
                View full transcript
                <Icon name="chevD" size={15} />
              </button>
            </div>
          </div>

          {/* rail */}
          <div className="col" style={{ gap: 22, position: "sticky", top: 24 }}>
            {/* action items */}
            <div className="card card-pad" style={{ borderRadius: 16 }}>
              <div className="row between center" style={{ marginBottom: 14 }}>
                <h3 style={{ fontSize: 16 }}>Action items</h3>
                <span className="badge badge-amber">{m.actions.filter((a) => !a.done).length} open</span>
              </div>
              <div className="col" style={{ gap: 4 }}>
                {m.actions.map((a, i) => (
                  <div key={i} className="row" style={{ gap: 11, padding: "10px 0", borderBottom: i < m.actions.length - 1 ? "1px solid var(--border)" : "none", alignItems: "flex-start" }}>
                    <button
                      onClick={() => app.toggleAction(m.id, i)}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 6,
                        flex: "none",
                        marginTop: 1,
                        cursor: "pointer",
                        border: "2px solid " + (a.done ? "var(--accent)" : "var(--border-2)"),
                        background: a.done ? "var(--accent)" : "transparent",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      {a.done && <Icon name="check" size={13} style={{ color: "#fff" }} stroke={3} />}
                    </button>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, lineHeight: 1.45, fontWeight: 500, textDecoration: a.done ? "line-through" : "none", color: a.done ? "var(--text-3)" : "var(--text)" }}>
                        {a.text}
                      </div>
                      <div className="row center" style={{ gap: 8, marginTop: 5 }}>
                        <span className="row center" style={{ gap: 5 }}>
                          <div className="avatar" style={{ width: 16, height: 16, fontSize: 8, background: "var(--surface-3)", color: "var(--text-2)" }}>
                            {a.owner[0]}
                          </div>
                          <span className="muted" style={{ fontSize: 11.5 }}>
                            {a.owner}
                          </span>
                        </span>
                        <span className="dot" style={{ background: "var(--border-2)" }} />
                        <span className="muted" style={{ fontSize: 11.5 }}>
                          Due {a.due}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* act-on-it chat */}
            <ActChat m={m} agent={agent} app={app} />

            {/* attendees */}
            <div className="card card-pad" style={{ borderRadius: 16 }}>
              <h3 style={{ fontSize: 16, marginBottom: 14 }}>Attendees</h3>
              <div className="col" style={{ gap: 11 }}>
                {m.attendees.map((n, i) => {
                  const isAgentName = agent && n === agent.name;
                  return (
                    <div key={i} className="row center between">
                      <div className="row center" style={{ gap: 10 }}>
                        {isAgentName ? (
                          <AgentAvatar name={n} size={28} />
                        ) : (
                          <div className="avatar" style={{ width: 28, height: 28, fontSize: 11, background: "linear-gradient(140deg,#64748b,#334155)" }}>
                            {n[0]}
                          </div>
                        )}
                        <span style={{ fontSize: 13.5, fontWeight: 500 }}>{n}</span>
                      </div>
                      {isAgentName && <span className="badge badge-accent">agent</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
