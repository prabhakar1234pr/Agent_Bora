import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { DEMO_USER, SEED_UPCOMING } from "../lib/demo-data";

const LS_KEY = "agentbora_v1";
const DemoStoreContext = createContext(null);
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

function clone(x) {
  return JSON.parse(JSON.stringify(x));
}

export function DemoStoreProvider({ children, user }) {
  const { user: authUser } = useAuth();
  const [view, setView] = useState("home");
  const [params, setParams] = useState({});
  const [agents, setAgents] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [agentChats, setAgentChats] = useState({});
  const [connected, setConnectedState] = useState([]);
  const [currentAgentId, setCurrentAgentId] = useState("");
  const [loading, setLoading] = useState(true);

  // Prefer the real signed-in user’s identity
  const appUser = useMemo(() => {
    const name = user?.profile?.name || user?.name || (user?.email ? user.email.split("@")[0] : null);
    if (!name && !user?.email) return DEMO_USER;
    return {
      name: name || DEMO_USER.name,
      email: user?.email || DEMO_USER.email,
      company: DEMO_USER.company,
      role: DEMO_USER.role,
    };
  }, [user]);

  // Fetch data from backend when user is authenticated
  useEffect(() => {
    if (!authUser?.id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch agents
        const agentsRes = await fetch(`${API_BASE}/api/agents`, {
          credentials: "include",
        });
        if (agentsRes.ok) {
          const agentsData = await agentsRes.json();
          setAgents(agentsData);
          if (agentsData.length > 0 && !currentAgentId) {
            setCurrentAgentId(agentsData[0].id);
          }
        }

        // Fetch meetings
        const meetingsRes = await fetch(`${API_BASE}/api/meetings`, {
          credentials: "include",
        });
        if (meetingsRes.ok) {
          const meetingsData = await meetingsRes.json();
          setMeetings(meetingsData);
        }

        // Fetch integrations
        const integrationsRes = await fetch(`${API_BASE}/api/integrations`, {
          credentials: "include",
        });
        if (integrationsRes.ok) {
          const integrationsData = await integrationsRes.json();
          setConnectedState(integrationsData.filter((i) => i.connected).map((i) => i.id));
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data from backend:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [authUser?.id, currentAgentId]);

  const nav = (v, p = {}) => {
    setView(v);
    setParams(p);
    const sc = typeof document !== "undefined" ? document.querySelector(".app-scroll") : null;
    if (sc) sc.scrollTop = 0;
  };

  const createAgent = async (a) => {
    try {
      const response = await fetch(`${API_BASE}/api/agents`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(a),
      });

      if (!response.ok) throw new Error("Failed to create agent");
      const createdAgent = await response.json();

      setAgents((prev) => [...prev, createdAgent]);
      setAgentChats((prev) => ({
        ...prev,
        [createdAgent.id]: [
          {
            role: "agent",
            text: `Hi — I’m ${createdAgent.name}. I’ve started reading your sources. Add me to a meeting whenever you’re ready and I’ll take it from there.`,
          },
        ],
      }));
      setConnectedState((prev) => Array.from(new Set([...prev, ...(createdAgent.integrations || [])])));
      setCurrentAgentId(createdAgent.id);
      nav("agents");
    } catch (error) {
      console.error("Failed to create agent:", error);
    }
  };

  const setAgentChat = async (id, msgs) => {
    setAgentChats((prev) => ({ ...prev, [id]: msgs }));

    try {
      const lastMsg = msgs[msgs.length - 1];
      if (lastMsg) {
        await fetch(`${API_BASE}/api/agents/${id}/chat`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: lastMsg.role,
            text: lastMsg.text,
          }),
        });
      }
    } catch (error) {
      console.error("Failed to save chat:", error);
    }
  };

  const toggleAction = async (mid, idx) => {
    const meeting = meetings.find((m) => m.id === mid);
    if (!meeting) return;

    const action = meeting.actions[idx];

    // Optimistic update
    setMeetings((prev) =>
      prev.map((m) =>
        m.id !== mid ? m : { ...m, actions: m.actions.map((a, i) => (i !== idx ? a : { ...a, done: !a.done })) }
      )
    );

    // Persist to backend
    try {
      await fetch(`${API_BASE}/api/meetings/${mid}/actions/${idx}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: !action.done }),
      });
    } catch (error) {
      console.error("Failed to update action:", error);
      // Revert on error
      setMeetings((prev) =>
        prev.map((m) =>
          m.id !== mid ? m : { ...m, actions: m.actions.map((a, i) => (i !== idx ? a : { ...a, done: !a.done })) }
        )
      );
    }
  };

  const setConnected = (arr) => setConnectedState(arr);

  const upcoming = agents.length ? SEED_UPCOMING.filter((u) => agents.some((a) => a.id === u.agentId)) : [];

  const resetDemo = () => {
    window.location.reload();
  };

  const clearWorkspace = () => {
    setAgents([]);
    setMeetings([]);
    setAgentChats({});
    setConnectedState([]);
    setCurrentAgentId("");
    nav("home");
  };

  const app = {
    user: appUser,
    view,
    params,
    agents,
    meetings,
    agentChats,
    connected,
    currentAgentId,
    upcoming,
    nav,
    createAgent,
    setAgentChat,
    toggleAction,
    setConnected,
    setCurrentAgentId,
    resetDemo,
    clearWorkspace,
    loading,
  };

  return <DemoStoreContext.Provider value={app}>{children}</DemoStoreContext.Provider>;
}

export function useDemoStore() {
  const ctx = useContext(DemoStoreContext);
  if (!ctx) throw new Error("useDemoStore must be used within a DemoStoreProvider");
  return ctx;
}
