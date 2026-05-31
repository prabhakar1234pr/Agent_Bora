import Head from "next/head";
import Link from "next/link";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getFirstName(user) {
  const name = user?.profile?.name || user?.name || user?.email?.split("@")[0] || "there";
  return name.split(" ")[0];
}

export default function DashboardShell({ user, onSignOut, children }) {
  const firstName = getFirstName(user);

  return (
    <>
      <Head>
        <title>Dashboard · Agent Bora</title>
      </Head>

      <div className="dash">
        <header className="dash-nav">
          <div className="dash-nav-inner row between">
            <Link href="/dashboard" className="logo-wrap">
              <div className="logo-mark">AB</div>
              <span className="logo-word">
                Agent<span>Bora</span>
              </span>
            </Link>

            <nav className="dash-links row">
              <Link href="/dashboard" className="dash-link active">
                Home
              </Link>
              <span className="dash-link muted">Agents</span>
              <span className="dash-link muted">Meetings</span>
            </nav>

            <div className="row gap">
              <div className="dash-user">
                <span className="dash-user-name">{user?.profile?.name || firstName}</span>
                <span className="dash-user-email">{user?.email}</span>
              </div>
              <button type="button" className="btn ghost" onClick={onSignOut}>
                Sign out
              </button>
            </div>
          </div>
        </header>

        <main className="dash-main">
          <div className="dash-header">
            <div>
              <p className="badge accent">Dashboard</p>
              <h1>
                {getGreeting()}, {firstName}
              </h1>
              <p className="subtitle">Your workspace is ready. Here&apos;s how to get started.</p>
            </div>
            <div className="row gap">
              <button type="button" className="btn secondary">
                Connect tools
              </button>
              <button type="button" className="btn primary">
                New meeting
              </button>
            </div>
          </div>

          {children}
        </main>
      </div>
    </>
  );
}
