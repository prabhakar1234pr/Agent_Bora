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

export default function SignupPage() {
  const router = useRouter();
  const { user, loading, signUp, verifyEmail, resendVerification } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("signup");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      void router.replace("/dashboard");
    }
  }, [loading, user, router]);

  async function handleSignUp(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const data = await signUp({ email, password, name });
      if (data.requireEmailVerification) {
        setStep("verify");
        setNotice("Check your email for a verification code.");
        return;
      }
      if (data.user) {
        await router.push("/dashboard");
        return;
      }
      setError("Sign up failed. Please try again.");
    } catch (err) {
      setError(err.message || "Sign up failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerify(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await verifyEmail({ email, otp });
      await router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setError("");
    setNotice("");
    try {
      await resendVerification({ email });
      setNotice("Verification code resent.");
    } catch (err) {
      setError(err.message || "Failed to resend code");
    }
  }

  return (
    <AuthLayout title="Sign up">
      <div className="auth-panel">
        <Link href="/" className="auth-back">
          ← Back
        </Link>

        <AuthSwitchLink prompt="Already have an account?" href="/login" label="Log in" />

        <h1>Create your account</h1>
        <p className="auth-subtitle">Build your first agent in under two minutes.</p>

        {notice ? <AuthMessage type="success">{notice}</AuthMessage> : null}
        {error ? <AuthMessage>{error}</AuthMessage> : null}

        {step === "signup" ? (
          <>
            <form className="auth-form" onSubmit={handleSignUp}>
              <AuthField
                label="Full name"
                value={name}
                onChange={setName}
                placeholder="Jordan Rivera"
                autoFocus
              />
              <AuthField
                label="Work email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@company.com"
              />
              <AuthField
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="At least 6 characters"
              />

              <button className="btn primary lg auth-submit" type="submit" disabled={submitting}>
                {submitting ? "Creating account..." : "Create account"}
              </button>
            </form>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <OAuthButtons />
          </>
        ) : (
          <form className="auth-form" onSubmit={handleVerify}>
            <AuthField
              label="Verification code"
              value={otp}
              onChange={setOtp}
              placeholder="123456"
              autoFocus
            />
            <button className="btn primary lg auth-submit" type="submit" disabled={submitting}>
              {submitting ? "Verifying..." : "Verify email"}
            </button>
            <button type="button" className="btn ghost auth-submit" onClick={handleResend}>
              Resend code
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
