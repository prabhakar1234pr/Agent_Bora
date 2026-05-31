import { Btn, Icon, AgentAvatar } from "../ui";
import { fmtDate, fmtTime, relDay } from "../../lib/demo-data";
import PageWrap from "./PageWrap";

export function StatCard({ icon, label, value, sub, tone = "accent" }) {
  const tint = tone === "accent" ? "var(--accent-t)" : tone === "blue" ? "#EAF1FE" : tone === "violet" ? "#F3EEFF" : "#FEF4E2";
  const fg = tone === "accent" ? "var(--accent-d)" : tone === "blue" ? "#2563EB" : tone === "violet" ? "#7C3AED" : "#B45309";
  return (
    <div className="card card-pad" style={{ borderRadius: 16 }}>
      <div className="row between center">
        <div style={{ width: 38, height: 38, borderRadius: 11, background: tint, color: fg, display: "grid", placeItems: "center" }}>
          <Icon name={icon} size={19} stroke={2} />
        </div>
        {sub && (
          <span className="badge badge-accent" style={{ height: 22 }}>
            {sub}
          </span>
        )}
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, fontFamily: "var(--font-display)", letterSpacing: "-.03em", marginTop: 14, lineHeight: 1 }}>
        {value}
      </div>
      <div className="muted" style={{ fontSize: 13.5, marginTop: 5 }}>
        {label}
      </div>
    </div>
  );
}

export function PlatformTag({ platform }) {
  const isMeet = platform === "meet";
  return (
    <span className="row center" style={{ gap: 6, fontSize: 12, fontWeight: 600, color: "var(--text-2)" }}>
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: 5,
          display: "grid",
          placeItems: "center",
          background: isMeet ? "#E8F0FE" : "#EBEEFB",
          color: isMeet ? "#1A73E8" : "#5059C9",
        }}
      >
        <Icon name="video" size={11} />
      </span>
      {isMeet ? "Google Meet" : "Teams"}
    </span>
  );
}

function UpcomingRow({ m, app }) {
  const agent = app.agents.find((a) => a.id === m.agentId);
  return (
    <div className="row center between" style={{ padding: "14px 4px", borderBottom: "1px solid var(--border)" }}>
      <div className="row center" style={{ gap: 14 }}>
        <div className="col center" style={{ width: 52, textAlign: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-d)", textTransform: "uppercase" }}>
            {fmtDate(m.date, { weekday: "short" })}
          </span>
          <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-display)" }}>{fmtDate(m.date, { day: "numeric" })}</span>
        </div>
        <div style={{ width: 1, height: 34, background: "var(--border)" }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 240 }}>
            {m.title}
          </div>
          <div className="row center" style={{ gap: 12, marginTop: 4 }}>
            <span className="muted" style={{ fontSize: 12.5 }}>
              {fmtTime(m.date)}
            </span>
            <PlatformTag platform={m.platform} />
            <span className="row center" style={{ gap: 5, fontSize: 12.5, color: "var(--text-2)" }}>
              <Icon name="users" size={13} />
              {m.attendees}
            </span>
          </div>
        </div>
      </div>
      <div className="row center" style={{ gap: 12 }}>
        {agent && (
          <div className="row center" style={{ gap: 8 }}>
            <AgentAvatar name={agent.name} size={28} />
            <div className="col" style={{ gap: 1 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{agent.name}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: m.mode === "proactive" ? "var(--accent-d)" : "var(--text-3)" }}>
                {m.mode === "proactive" ? "Proactive" : "Passive"}
              </span>
            </div>
          </div>
        )}
        <Btn variant="secondary" size="sm">
          Details
        </Btn>
      </div>
    </div>
  );
}

function BriefMiniCard({ m, app }) {
  const agent = app.agents.find((a) => a.id === m.agentId);
  const open = m.actions.filter((a) => !a.done).length;
  return (
    <button
      className="card"
      onClick={() => app.nav("brief", { id: m.id })}
      style={{ textAlign: "left", cursor: "pointer", padding: 16, borderRadius: 14, transition: "all .15s" }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-md)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-sm)")}
    >
      <div className="row between center" style={{ marginBottom: 10 }}>
        <span className="muted" style={{ fontSize: 12 }}>
          {relDay(m.date)} · {m.durationMin}m
        </span>
        <PlatformTag platform={m.platform} />
      </div>
      <div style={{ fontWeight: 600, fontSize: 15.5, marginBottom: 8 }}>{m.title}</div>
      <p
        className="muted"
        style={{ fontSize: 13, lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
      >
        {m.summary}
      </p>
      <div className="row center between" style={{ marginTop: 13 }}>
        <div className="row center" style={{ gap: 7 }}>
          {agent && <AgentAvatar name={agent.name} size={22} />}
          <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)" }}>{agent ? agent.name : "—"}</span>
        </div>
        {open > 0 ? (
          <span className="badge badge-amber">{open} open</span>
        ) : (
          <span className="badge badge-accent">
            <Icon name="check" size={12} stroke={2.6} />
            Done
          </span>
        )}
      </div>
    </button>
  );
}

function OnboardingHome({ app }) {
  const steps = [
    { title: "Create your first agent", body: "Give it your docs, repos, and links so it walks in prepared.", cta: "Create agent", action: () => app.nav("createAgent") },
    { title: "Connect your tools", body: "Wire up Gmail, Calendar, Notion and Asana.", cta: "Open integrations", action: () => app.nav("integrations") },
    { title: "Call it into a meeting", body: "Paste a Meet or Teams link and pick a mode.", cta: "New meeting", action: () => app.nav("newMeeting") },
  ];
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", paddingTop: 24 }}>
      <div className="card" style={{ borderRadius: 20, overflow: "hidden" }}>
        <div style={{ padding: "32px 32px 26px", background: "linear-gradient(150deg, var(--accent-t), var(--surface))", borderBottom: "1px solid var(--border)" }}>
          <span className="badge badge-accent" style={{ marginBottom: 14 }}>
            <Icon name="rocket" size={13} />
            Get started
          </span>
          <h2 style={{ fontSize: 26, letterSpacing: "-.02em" }}>Let’s build your first agent.</h2>
          <p className="muted" style={{ fontSize: 15, marginTop: 8, maxWidth: 440, lineHeight: 1.55 }}>
            Three quick steps and your agent is ready to join its first call.
          </p>
        </div>
        <div className="col">
          {steps.map((s, i) => (
            <div key={i} className="row center between" style={{ padding: "20px 32px", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
              <div className="row center" style={{ gap: 16 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border: "2px solid var(--border-2)",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 700,
                    fontSize: 14,
                    color: "var(--text-3)",
                  }}
                >
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15.5 }}>{s.title}</div>
                  <div className="muted" style={{ fontSize: 13.5, marginTop: 2 }}>
                    {s.body}
                  </div>
                </div>
              </div>
              <Btn variant={i === 0 ? "primary" : "secondary"} onClick={s.action} iconRight="arrowR">
                {s.cta}
              </Btn>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home({ app }) {
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = app.user.name.split(" ")[0];

  if (app.agents.length === 0) {
    return (
      <PageWrap title={`${greet}, ${firstName}`} subtitle="Your workspace is empty — let’s fix that.">
        <OnboardingHome app={app} />
      </PageWrap>
    );
  }

  const openActions = app.meetings.flatMap((m) =>
    m.actions.filter((a) => !a.done).map((a) => ({ ...a, mtitle: m.title, mid: m.id }))
  );
  const recent = app.meetings.slice(0, 4);

  return (
    <PageWrap
      title={`${greet}, ${firstName}`}
      subtitle="Here’s what your agents are tracking."
      actions={
        <>
          <Btn variant="secondary" icon="agent" onClick={() => app.nav("agents")}>
            Agents
          </Btn>
          <Btn variant="primary" icon="plus" onClick={() => app.nav("newMeeting")}>
            New meeting
          </Btn>
        </>
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard icon="agent" label="Active agents" value={app.agents.length} tone="accent" />
        <StatCard icon="calendar" label="Meetings this week" value="7" sub="+3" tone="blue" />
        <StatCard icon="listCheck" label="Open action items" value={openActions.length} tone="amber" />
        <StatCard icon="clock" label="Meeting hours" value="11.5" tone="violet" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
        <div className="col" style={{ gap: 24 }}>
          <section>
            <div className="row between center" style={{ marginBottom: 6 }}>
              <h3 style={{ fontSize: 17 }}>Upcoming meetings</h3>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  app.nav("newMeeting");
                }}
                style={{ fontSize: 13, fontWeight: 600, color: "var(--accent-d)" }}
              >
                Schedule new
              </a>
            </div>
            <div className="card" style={{ borderRadius: 16, padding: "4px 18px" }}>
              {app.upcoming.map((m) => (
                <UpcomingRow key={m.id} m={m} app={app} />
              ))}
            </div>
          </section>

          <section>
            <div className="row between center" style={{ marginBottom: 12 }}>
              <h3 style={{ fontSize: 17 }}>Recent briefs</h3>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  app.nav("meetings");
                }}
                style={{ fontSize: 13, fontWeight: 600, color: "var(--accent-d)" }}
              >
                View all
              </a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {recent.map((m) => (
                <BriefMiniCard key={m.id} m={m} app={app} />
              ))}
            </div>
          </section>
        </div>

        <div className="col" style={{ gap: 24 }}>
          <section>
            <div className="row between center" style={{ marginBottom: 12 }}>
              <h3 style={{ fontSize: 17 }}>Your agents</h3>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  app.nav("createAgent");
                }}
                style={{ fontSize: 13, fontWeight: 600, color: "var(--accent-d)" }}
              >
                New
              </a>
            </div>
            <div className="col" style={{ gap: 12 }}>
              {app.agents.map((a) => (
                <button
                  key={a.id}
                  className="card row center between"
                  onClick={() => {
                    app.setCurrentAgentId(a.id);
                    app.nav("agents");
                  }}
                  style={{ padding: 14, borderRadius: 14, cursor: "pointer", gap: 12, textAlign: "left" }}
                >
                  <div className="row center" style={{ gap: 12 }}>
                    <AgentAvatar name={a.name} size={40} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14.5 }}>{a.name}</div>
                      <div className="muted" style={{ fontSize: 12.5 }}>
                        {a.tagline}
                      </div>
                    </div>
                  </div>
                  <Icon name="chevR" size={17} style={{ color: "var(--text-3)" }} />
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 style={{ fontSize: 17, marginBottom: 12 }}>Open action items</h3>
            <div className="card" style={{ borderRadius: 16, padding: "6px 16px" }}>
              {openActions.slice(0, 5).map((a, i) => (
                <button
                  key={i}
                  onClick={() => app.nav("brief", { id: a.mid })}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    gap: 11,
                    padding: "12px 0",
                    borderBottom: i < Math.min(openActions.length, 5) - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <div style={{ width: 18, height: 18, borderRadius: 6, border: "2px solid var(--border-2)", flex: "none", marginTop: 1 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500, lineHeight: 1.4 }}>{a.text}</div>
                    <div className="row center" style={{ gap: 8, marginTop: 4 }}>
                      <span className="muted" style={{ fontSize: 11.5 }}>
                        {a.owner}
                      </span>
                      <span className="dot" style={{ background: "var(--border-2)" }} />
                      <span className="muted" style={{ fontSize: 11.5 }}>
                        Due {a.due}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
              {openActions.length === 0 && (
                <div className="muted" style={{ padding: "16px 0", fontSize: 13.5, textAlign: "center" }}>
                  All caught up 🎉
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </PageWrap>
  );
}
