import Head from "next/head";
import Link from "next/link";

const INTEGRATIONS = [
  "Gmail",
  "Calendar",
  "Notion",
  "Asana",
  "Slack",
  "GitHub",
  "Drive",
  "Linear",
];

function Logo() {
  return (
    <div className="logo-wrap">
      <div className="logo-mark">AB</div>
      <span className="logo-word">
        Agent<span>Bora</span>
      </span>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="hero-visual">
      <div className="meeting-card">
        <div className="meeting-top">
          <p>Weekly Sync</p>
          <span className="badge rec">REC</span>
        </div>

        <div className="video-grid">
          {["Dev", "Lena", "Priya"].map((name) => (
            <div key={name} className="video-tile">
              <div className="avatar">{name[0]}</div>
              <span>{name}</span>
            </div>
          ))}
        </div>

        <div className="agent-speaking">
          <p className="agent-name">Atlas · AI agent</p>
          <p>
            "Editor and mobile share the same two engineers - want me to
            sequence them?"
          </p>
        </div>
      </div>

      <div className="brief-card">
        <p className="brief-title">Brief ready</p>
        <ul>
          <li>4 action items</li>
          <li>Decision logged</li>
          <li>Transcript + recording</li>
        </ul>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Agent Bora</title>
        <meta
          name="description"
          content="Landing page for Agent Bora prototype"
        />
      </Head>

      <main className="landing">
        <header className="landing-nav">
          <div className="inner row between">
            <Logo />
            <div className="row gap">
              <Link href="/login" className="btn ghost">
                Log in
              </Link>
              <Link href="/signup" className="btn primary">
                Get started
              </Link>
            </div>
          </div>
        </header>

        <section className="hero inner">
          <span className="badge accent">Meeting agents with real context</span>
          <h1>
            Send an agent
            <br />
            to the meeting.
          </h1>
          <p className="hero-sub">
            It knows your work, joins the call, and hands you the brief.
          </p>
          <div className="row cta">
            <Link href="/signup" className="btn primary lg">
              Start free
            </Link>
            <button className="btn secondary lg">See a brief</button>
          </div>
          <HeroVisual />
        </section>

        <section className="integrations">
          <div className="inner">
            <p className="section-label">Plugged into your stack</p>
            <div className="logo-grid">
              {INTEGRATIONS.map((name) => (
                <div key={name} className="logo-tile" title={name}>
                  {name}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="steps inner">
          <h2>Three steps. One brief.</h2>
          <div className="step-grid">
            <article>
              <p className="step-no">01</p>
              <h3>Feed it context</h3>
              <p>Docs, repos, sites.</p>
            </article>
            <article>
              <p className="step-no">02</p>
              <h3>Call it in</h3>
              <p>Drop a Meet or Teams link.</p>
            </article>
            <article>
              <p className="step-no">03</p>
              <h3>Get the brief</h3>
              <p>Summary, transcript, actions.</p>
            </article>
          </div>
        </section>

        <section className="proactive">
          <div className="inner pro-grid">
            <div>
              <span className="badge">Proactive</span>
              <h2>
                It speaks up
                <br />
                when it matters.
              </h2>
              <p>
                Not a note-taker. Your agent flags the risk, names the owner,
                catches the decision nobody made.
              </p>
            </div>
            <div>
              <div className="pro-card">
                <p>Atlas flagged a conflict</p>
                <span>
                  "We just committed two teams to the same sprint. Should I
                  reassign?"
                </span>
              </div>
              <div className="pro-mini-grid">
                <div>Owners assigned</div>
                <div>Full recall</div>
                <div>Pushes to your tools</div>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-band inner">
          <div>
            <h2>
              Your next meeting
              <br />
              can run itself.
            </h2>
            <Link href="/signup" className="btn primary lg">
              Start free
            </Link>
          </div>
        </section>

        <footer className="footer">
          <div className="inner row between">
            <Logo />
            <span>© 2026 Agent Bora</span>
          </div>
        </footer>
      </main>
    </>
  );
}
