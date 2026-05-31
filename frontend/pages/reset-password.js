import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
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

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setSubmitting(true);

    try {
      await postJson("/api/auth/reset-password", { email, code, newPassword });
      setNotice("Password updated. You can sign in now.");
      setTimeout(() => {
        void router.push("/login");
      }, 1200);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Reset password">
      <div className="auth-panel">
        <Link href="/login" className="auth-back">
          ← Back to login
        </Link>

        <h1>Choose a new password</h1>
        <p className="auth-subtitle">Enter the code from your email and a new password.</p>

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
            label="Reset code"
            value={code}
            onChange={setCode}
            placeholder="123456"
          />
          <AuthField
            label="New password"
            type="password"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="At least 6 characters"
          />
          <button className="btn primary lg auth-submit" type="submit" disabled={submitting}>
            {submitting ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
