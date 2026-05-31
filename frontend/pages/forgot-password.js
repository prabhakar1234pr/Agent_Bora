import { useState } from "react";
import Link from "next/link";
import AuthLayout, { AuthField, AuthMessage } from "../components/AuthLayout";

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setSubmitting(true);

    try {
      await postJson("/api/auth/forgot-password", { email });
      setNotice("If an account exists, a reset code was sent to your email.");
    } catch (err) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Forgot password">
      <div className="auth-panel">
        <Link href="/login" className="auth-back">
          ← Back to login
        </Link>

        <h1>Reset your password</h1>
        <p className="auth-subtitle">We&apos;ll email you a 6-digit code.</p>

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
          <button className="btn primary lg auth-submit" type="submit" disabled={submitting}>
            {submitting ? "Sending..." : "Send reset code"}
          </button>
        </form>

        <p className="auth-switch">
          Have a code?{" "}
          <Link href="/reset-password" className="auth-link">
            Enter it here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
