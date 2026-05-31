import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";
import { insforge } from "../lib/insforge/client";

const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  verifyEmail: async () => {},
  signOut: async () => {},
  resendVerification: async () => {},
});

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const response = await fetch("/api/auth/user", {
          method: "GET",
          credentials: "include",
        });
        if (cancelled) return;

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadUser();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const data = await postJson("/api/auth/sign-in", { email, password });
    setUser(data.user);
    return data;
  }, []);

  const signUp = useCallback(async ({ email, password, name }) => {
    return postJson("/api/auth/sign-up", { email, password, name });
  }, []);

  const verifyEmail = useCallback(async ({ email, otp }) => {
    const data = await postJson("/api/auth/verify-email", { email, otp });
    setUser(data.user);
    return data;
  }, []);

  const resendVerification = useCallback(async ({ email }) => {
    return postJson("/api/auth/resend-verification", { email });
  }, []);

  const signOut = useCallback(async () => {
    await fetch("/api/auth/sign-out", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    await router.push("/login");
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      signIn,
      signUp,
      verifyEmail,
      signOut,
      resendVerification,
    }),
    [user, token, loading, signIn, signUp, verifyEmail, signOut, resendVerification]
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useRequireAuth(redirectTo = "/login") {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.loading && !auth.user) {
      void router.replace(redirectTo);
    }
  }, [auth.loading, auth.user, redirectTo, router]);

  return auth;
}
