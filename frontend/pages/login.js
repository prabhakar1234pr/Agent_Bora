import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import AuthLayout, {
  AuthField,
  AuthMessage,
  AuthSwitchLink,
  OAuthButtons,
} from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      void router.replace("/dashboard");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("insforge_status") === "success" && params.get("insforge_type") === "verify_email") {
      setNotice("Email verified. Sign in with your password.");
    }
    if (params.get("error")) {
      setError("Sign in failed. Try again.");
    }
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await signIn({ email, password });
      await router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Log in">
      <div className="auth-panel">
        <Link href="/" className="auth-back">
          ← Back
        </Link>

        <AuthSwitchLink prompt="New to Agent Bora?" href="/signup" label="Sign up" />

        <h1>Welcome back</h1>
        <p className="auth-subtitle">Pick up right where your agents left off.</p>

        {notice ? <AuthMessage type="success">{notice}</AuthMessage> : null}
        {error ? <AuthMessage>{error}</AuthMessage> : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          <AuthField
            label="Work email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@company.com"
            autoFocus
          />
          <AuthField
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
          />

          <div className="auth-row between">
            <span />
            <Link href="/forgot-password" className="auth-link">
              Forgot password?
            </Link>
          </div>

          <button className="btn primary lg auth-submit" type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Log in"}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <OAuthButtons />
      </div>
    </AuthLayout>
  );
}
