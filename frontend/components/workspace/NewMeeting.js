import { useState } from "react";
import { Btn, Icon, AgentAvatar, Wave, EmptyState } from "../ui";
import PageWrap from "./PageWrap";

function detectPlatform(link) {
  const l = link.toLowerCase();
  if (l.includes("meet.google") || l.includes("g.co/meet")) return "meet";
  if (l.includes("teams.") || l.includes("teams.microsoft")) return "teams";
  return null;
}

export function NewMeeting({ app }) {
  const [link, setLink] = useState("");
  const [agentId, setAgentId] = useState(app.currentAgentId || app.agents[0]?.id || "");
  const [mode, setMode] = useState("proactive");
  const [when, setWhen] = useState("now");
  const [sent, setSent] = useState(false);

  const platform = detectPlatform(link);
  const agent = app.agents.find((a) => a.id === agentId);
  const canSend = link.trim().length > 6 && agentId;

  if (app.agents.length === 0) {
    return (
      <PageWrap title="New meeting" back={() => app.nav("home")}>
        <div className="card" style={{ borderRadius: 18 }}>
          <EmptyState
            icon="agent"
            title="Create an agent first"
            body="You need at least one agent before you can send one into a meeting."
            action={
              <Btn variant="primary" icon="plus" onClick={() => app.nav("createAgent")}>
                Create agent
              </Btn>
            }
          />
        </div>
      </PageWrap>
    );
  }

  if (sent) {
    return (
      <div className="app-scroll fade-in" style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
        <div className="card" style={{ borderRadius: 24, padding: "48px 44px", maxWidth: 460, textAlign: "center", boxShadow: "var(--shadow-lg)" }}>
          <div style={{ position: "relative", width: 88, height: 88, margin: "0 auto 8px" }}>
            <AgentAvatar name={agent.name} size={88} listening />
          </div>
          <div className="row center" style={{ justifyContent: "center", margin: "18px 0 6px" }}>
            <Wave size={28} bars={7} big />
          </div>
          <h2 style={{ fontSize: 24, letterSpacing: "-.02em", marginTop: 8 }}>{agent.name} is on the way</h2>
          <p className="muted" style={{ fontSize: 15, lineHeight: 1.6, marginTop: 10 }}>
            {when === "now" ? (
              <>
                Joining your {platform === "teams" ? "Teams" : "Google Meet"} call now in <b>{mode}</b> mode. You’ll get the brief the moment it ends.
              </>
            ) : (
              <>
                Scheduled to join in <b>{mode}</b> mode. We’ll drop the agent in automatically when the meeting starts.
              </>
            )}
          </p>
          <div className="col" style={{ gap: 10, marginTop: 26 }}>
            <Btn variant="primary" block size="lg" icon="meetings" onClick={() => app.nav("meetings")}>
              Go to meetings
            </Btn>
            <Btn
              variant="ghost"
              block
              onClick={() => {
                setSent(false);
                setLink("");
              }}
            >
              Send another
            </Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-scroll fade-in">
      <div style={{ maxWidth: 620, margin: "0 auto", padding: "28px 28px 80px" }}>
        <button className="btn btn-ghost btn-sm" onClick={() => app.nav("home")} style={{ marginBottom: 18, paddingLeft: 8 }}>
          <Icon name="chevL" size={16} />
          Back
        </button>

        <div style={{ marginBottom: 28 }}>
          <span className="badge badge-accent" style={{ marginBottom: 14 }}>
            <Icon name="mic" size={13} />
            New meeting
          </span>
          <h1 style={{ fontSize: 32, letterSpacing: "-.03em" }}>Send an agent to a meeting</h1>
          <p className="muted" style={{ fontSize: 15.5, marginTop: 8 }}>
            Paste the link, pick your agent, choose how vocal it should be.
          </p>
        </div>

        {/* link */}
        <div className="card card-pad" style={{ borderRadius: 18, marginBottom: 16 }}>
          <div className="field">
            <span className="label">Meeting link</span>
            <div style={{ position: "relative" }}>
              <Icon name="link" size={17} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }} />
              <input
                className="input"
                placeholder="Paste a Google Meet or Teams link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                style={{ paddingLeft: 40, height: 50, fontSize: 15 }}
                autoFocus
              />
              {platform && (
                <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }} className="badge badge-accent">
                  <Icon name="check" size={12} stroke={2.6} />
                  {platform === "meet" ? "Google Meet" : "Teams"} detected
                </span>
              )}
            </div>
          </div>
          <div className="row center" style={{ gap: 7, marginTop: 12 }}>
            <span className="faint" style={{ fontSize: 12.5 }}>
              Works with
            </span>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)" }}>Google Meet and Teams</span>
          </div>
        </div>

        {/* agent */}
        <div className="card card-pad" style={{ borderRadius: 18, marginBottom: 16 }}>
          <span className="label" style={{ marginBottom: 14, display: "block" }}>
            WHICH AGENT?
          </span>
          <div className="col" style={{ gap: 10 }}>
            {app.agents.map((a) => {
              const on = a.id === agentId;
              return (
                <button
                  key={a.id}
                  onClick={() => setAgentId(a.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 13,
                    padding: 14,
                    borderRadius: 13,
                    cursor: "pointer",
                    textAlign: "left",
                    border: "1.5px solid " + (on ? "var(--accent)" : "var(--border-2)"),
                    background: on ? "var(--accent-t)" : "var(--surface)",
                    transition: "all .15s",
                  }}
                >
                  <AgentAvatar name={a.name} size={42} listening={on} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{a.name}</div>
                    <div className="muted" style={{ fontSize: 13 }}>
                      {a.tagline}
                    </div>
                  </div>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", border: "2px solid " + (on ? "var(--accent)" : "var(--border-2)"), display: "grid", placeItems: "center" }}>
                    {on && <div style={{ width: 11, height: 11, borderRadius: "50%", background: "var(--accent)" }} />}
                  </div>
                </button>
              );
            })}
            <button
              className="row center"
              onClick={() => app.nav("createAgent")}
              style={{ gap: 9, padding: "12px", border: "1.5px dashed var(--border-2)", borderRadius: 13, background: "transparent", cursor: "pointer", color: "var(--text-2)", justifyContent: "center", fontWeight: 600, fontSize: 13.5 }}
            >
              <Icon name="plus" size={16} />
              New agent
            </button>
          </div>
        </div>

        {/* mode + timing */}
        <div className="card card-pad" style={{ borderRadius: 18, marginBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="field">
              <span className="label">Agent behavior</span>
              <select className="select" value={mode} onChange={(e) => setMode(e.target.value)} style={{ height: 46 }}>
                <option value="proactive">Proactive — speaks up</option>
                <option value="passive">Passive — listens only</option>
              </select>
              <span className="faint" style={{ fontSize: 12, marginTop: 2 }}>
                {mode === "proactive" ? "Interjects with flags and missing owners." : "Stays silent unless asked directly."}
              </span>
            </div>
            <div className="field">
              <span className="label">When</span>
              <select className="select" value={when} onChange={(e) => setWhen(e.target.value)} style={{ height: 46 }}>
                <option value="now">Join now</option>
                <option value="scheduled">When the meeting starts</option>
              </select>
              <span className="faint" style={{ fontSize: 12, marginTop: 2 }}>
                {when === "now" ? "Agent joins immediately." : "We’ll drop it in automatically."}
              </span>
            </div>
          </div>
        </div>

        {/* summary + send */}
        <div className="row between center" style={{ padding: "16px 20px", borderRadius: 16, background: agent ? "var(--accent-t)" : "var(--surface-2)" }}>
          <div className="row center" style={{ gap: 11 }}>
            {agent && <AgentAvatar name={agent.name} size={34} />}
            <span style={{ fontSize: 13.5, color: "var(--accent-ink)" }}>
              {agent ? (
                <>
                  <b>{agent.name}</b> will join {platform ? (platform === "meet" ? "Google Meet" : "Teams") : "the call"} in <b>{mode}</b> mode
                </>
              ) : (
                "Pick an agent to continue"
              )}
            </span>
          </div>
        </div>
        <Btn variant="primary" size="lg" block icon="mic" disabled={!canSend} onClick={() => setSent(true)} style={{ marginTop: 14, opacity: canSend ? 1 : 0.5 }}>
          {when === "now" ? "Send agent to meeting" : "Schedule agent"}
        </Btn>
      </div>
    </div>
  );
}
