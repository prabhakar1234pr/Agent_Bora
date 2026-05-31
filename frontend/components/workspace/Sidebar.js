import { useState } from "react";
import { Logo, Btn, Icon, UserAvatar } from "../ui";

const NAV = [
  { view: "home", icon: "home", label: "Home" },
  { view: "agents", icon: "agent", label: "Agents" },
  { view: "meetings", icon: "meetings", label: "Meetings" },
  { view: "actions", icon: "listCheck", label: "Action items" },
];
const PARENT = { createAgent: "agents", integrations: "agents", brief: "meetings", newMeeting: "meetings" };

export default function Sidebar({ app, onSignOut }) {
  const [menu, setMenu] = useState(false);
  const activeParent = PARENT[app.view] || app.view;
  const openActions = app.meetings.reduce((n, m) => n + m.actions.filter((a) => !a.done).length, 0);

  return (
    <div
      style={{
        width: 236,
        borderRight: "1px solid var(--border)",
        background: "var(--surface)",
        display: "flex",
        flexDirection: "column",
        flex: "none",
        height: "100vh",
      }}
    >
      <div style={{ padding: "20px 18px 14px" }}>
        <Logo size={25} />
      </div>

      <div style={{ padding: "6px 14px 0" }}>
        <Btn variant="primary" block icon="plus" onClick={() => app.nav("newMeeting")}>
          New meeting
        </Btn>
      </div>

      <div className="col" style={{ gap: 3, padding: "16px 14px" }}>
        {NAV.map((n) => (
          <div
            key={n.view}
            className={"nav-item" + (activeParent === n.view ? " is-active" : "")}
            onClick={() => app.nav(n.view)}
          >
            <Icon name={n.icon} size={18} />
            {n.label}
            {n.view === "agents" && app.agents.length > 0 && (
              <span className="badge badge-muted" style={{ marginLeft: "auto", height: 20 }}>
                {app.agents.length}
              </span>
            )}
            {n.view === "actions" && openActions > 0 && (
              <span className="badge badge-amber" style={{ marginLeft: "auto", height: 20 }}>
                {openActions}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="grow" />

      {/* upsell card */}
      <div style={{ padding: "0 14px 12px" }}>
        <div
          style={{
            borderRadius: 14,
            padding: 16,
            background: "linear-gradient(150deg, var(--accent-t), var(--surface-2))",
            border: "1px solid var(--border)",
          }}
        >
          <div className="row center" style={{ gap: 8, marginBottom: 7 }}>
            <Icon name="bolt" size={15} style={{ color: "var(--accent-d)" }} />
            <span style={{ fontSize: 12.5, fontWeight: 700 }}>Northwind · Pro</span>
          </div>
          <div style={{ height: 5, borderRadius: 99, background: "var(--surface-3)", overflow: "hidden", marginBottom: 7 }}>
            <div style={{ width: "68%", height: "100%", background: "var(--accent)" }} />
          </div>
          <span className="muted" style={{ fontSize: 11.5 }}>
            34 of 50 agent-hours used
          </span>
        </div>
      </div>

      {/* user */}
      <div style={{ padding: "12px 14px", borderTop: "1px solid var(--border)", position: "relative" }}>
        {menu && (
          <>
            <div onClick={() => setMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
            <div
              className="card"
              style={{ position: "absolute", left: 14, right: 14, bottom: 70, zIndex: 41, borderRadius: 13, padding: 6, boxShadow: "var(--shadow-lg)" }}
            >
              <button className="nav-item" style={{ width: "100%" }} onClick={() => setMenu(false)}>
                <Icon name="settings" size={17} />
                Settings
              </button>
              <button
                className="nav-item"
                style={{ width: "100%" }}
                onClick={() => {
                  setMenu(false);
                  app.nav("integrations");
                }}
              >
                <Icon name="plug" size={17} />
                Integrations
              </button>
              <div className="hairline" style={{ margin: "4px 8px" }} />
              <button
                className="nav-item"
                style={{ width: "100%", color: "var(--danger)" }}
                onClick={() => {
                  setMenu(false);
                  onSignOut && onSignOut();
                }}
              >
                <Icon name="logout" size={17} />
                Log out
              </button>
            </div>
          </>
        )}
        <button
          onClick={() => setMenu((m) => !m)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 11,
            padding: "8px",
            borderRadius: 11,
            border: "none",
            background: menu ? "var(--surface-2)" : "transparent",
            cursor: "pointer",
          }}
        >
          <UserAvatar name={app.user.name} size={34} />
          <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {app.user.name}
            </div>
            <div className="muted" style={{ fontSize: 11.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {app.user.email}
            </div>
          </div>
          <Icon
            name="chevD"
            size={15}
            style={{ color: "var(--text-3)", transform: menu ? "rotate(180deg)" : "none", transition: "transform .15s" }}
          />
        </button>
      </div>
    </div>
  );
}
