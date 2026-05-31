import DashboardShell from "../components/DashboardShell";
import { useRequireAuth, useAuth } from "../context/AuthContext";

const STATS = [
  { title: "Active agents", value: "0", helper: "Create your first agent", tone: "accent" },
  { title: "Meetings this week", value: "0", helper: "No meetings scheduled", tone: "blue" },
  { title: "Open actions", value: "0", helper: "Nothing pending yet", tone: "amber" },
  { title: "Meeting hours", value: "0h", helper: "Tracked automatically", tone: "violet" },
];

const STEPS = [
  {
    title: "Create your first agent",
    body: "Give it your docs, repos, and links so it walks in prepared.",
    cta: "Create agent",
  },
  {
    title: "Connect your tools",
    body: "Wire up Gmail, Calendar, Notion, and Asana.",
    cta: "Open integrations",
  },
  {
    title: "Call it into a meeting",
    body: "Paste a Meet or Teams link and pick a mode.",
    cta: "New meeting",
  },
];

const SAMPLE_MEETINGS = [
  {
    title: "Weekly product sync",
    date: "Mon · Jun 2",
    time: "10:00 AM",
    platform: "Google Meet",
    agent: "Atlas",
    mode: "Proactive",
  },
  {
    title: "Design review",
    date: "Wed · Jun 4",
    time: "2:30 PM",
    platform: "Teams",
    agent: "Unassigned",
    mode: "Passive",
  },
];

export default function DashboardPage() {
  const { user, loading, signOut } = useRequireAuth();

  if (loading || !user) {
    return (
      <main className="page">
        <section className="hero-card">
          <p className="subtitle">Loading your workspace...</p>
        </section>
      </main>
    );
  }

  return (
    <DashboardShell user={user} onSignOut={() => void signOut()}>
      <section className="dash-stats">
        {STATS.map((stat) => (
          <article key={stat.title} className={`dash-stat dash-stat-${stat.tone}`}>
            <p className="label">{stat.title}</p>
            <p className="value">{stat.value}</p>
            <p className="helper">{stat.helper}</p>
          </article>
        ))}
      </section>

      <div className="dash-grid">
        <section className="dash-onboard card-surface">
          <div className="dash-onboard-head">
            <span className="badge accent">Get started</span>
            <h2>Let&apos;s build your first agent.</h2>
            <p>Three quick steps and your agent is ready to join its first call.</p>
          </div>
          <div className="dash-steps">
            {STEPS.map((step, index) => (
              <div key={step.title} className="dash-step">
                <div className="dash-step-no">{index + 1}</div>
                <div className="dash-step-copy">
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
                <button type="button" className={`btn ${index === 0 ? "primary" : "secondary"}`}>
                  {step.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        <aside className="dash-side">
          <section className="card-surface dash-panel">
            <div className="dash-panel-head row between">
              <h3>Upcoming meetings</h3>
              <span className="dash-link-muted">Sample preview</span>
            </div>
            <div className="dash-meetings">
              {SAMPLE_MEETINGS.map((meeting) => (
                <article key={meeting.title} className="dash-meeting">
                  <div>
                    <p className="dash-meeting-title">{meeting.title}</p>
                    <p className="helper">
                      {meeting.date} · {meeting.time} · {meeting.platform}
                    </p>
                  </div>
                  <div className="dash-meeting-meta">
                    <span>{meeting.agent}</span>
                    <span className="badge">{meeting.mode}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="card-surface dash-panel">
            <h3>Account</h3>
            <dl className="dash-account">
              <div>
                <dt>Email</dt>
                <dd>{user.email}</dd>
              </div>
              <div>
                <dt>Name</dt>
                <dd>{user.profile?.name || "Not set yet"}</dd>
              </div>
              <div>
                <dt>User ID</dt>
                <dd className="mono">{user.id}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </DashboardShell>
  );
}
