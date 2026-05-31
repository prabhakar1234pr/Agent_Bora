import Head from "next/head";
import Link from "next/link";

function AuthAside() {
  return (
    <aside className="auth-aside">
      <div className="auth-aside-glow" />
      <div className="auth-aside-top">
        <div className="logo-wrap">
          <div className="logo-mark">AB</div>
          <span className="logo-word">
            Agent<span>Bora</span>
          </span>
        </div>
      </div>

      <div className="auth-aside-card">
        <div className="auth-agent-row">
          <div className="auth-agent-avatar">A</div>
          <div>
            <p className="auth-agent-name">Atlas</p>
            <p className="auth-agent-status">Listening · Northwind Sync</p>
          </div>
        </div>
        <p className="auth-agent-quote">
          &ldquo;That&apos;s the second time comment-resolution came up with no owner. Want me to
          assign it?&rdquo;
        </p>
      </div>

      <div className="auth-aside-copy">
        <h2>
          The teammate who
          <br />
          read every doc.
        </h2>
        <p>
          Give an agent your context once. It shows up to every meeting already knowing
          the work.
        </p>
      </div>
    </aside>
  );
}

export default function AuthLayout({ title, children }) {
  return (
    <>
      <Head>
        <title>{`${title} · Agent Bora`}</title>
      </Head>
      <div className="auth-shell">
        <AuthAside />
        <div className="auth-main">{children}</div>
      </div>
    </>
  );
}

export function AuthField({ label, type = "text", value, onChange, placeholder, autoFocus }) {
  return (
    <label className="auth-field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
    </label>
  );
}

export function AuthMessage({ type = "error", children }) {
  return <p className={`auth-message ${type}`}>{children}</p>;
}

export function OAuthButtons() {
  const providers = [
    { id: "google", label: "Continue with Google", mark: "G", markClass: "google" },
    { id: "github", label: "Continue with GitHub", mark: "GH", markClass: "github" },
  ];

  return (
    <div className="auth-oauth">
      {providers.map((provider) => (
        <a
          key={provider.id}
          href={`/api/auth/oauth?provider=${provider.id}`}
          className="btn secondary auth-oauth-btn"
        >
          <span className={`auth-oauth-mark ${provider.markClass}`}>{provider.mark}</span>
          {provider.label}
        </a>
      ))}
    </div>
  );
}

export function AuthSwitchLink({ prompt, href, label }) {
  return (
    <p className="auth-switch">
      {prompt}{" "}
      <Link href={href} className="auth-link">
        {label}
      </Link>
    </p>
  );
}
