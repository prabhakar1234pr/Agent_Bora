import { useState } from "react";
import { Btn, Icon, AgentAvatar, EmptyState } from "../ui";
import PageWrap from "./PageWrap";
import { StatCard } from "./Home";

const A_MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
const A_NOW = new Date("2026-05-30T00:00:00");
function dueToDate(s) {
  const p = (s || "").trim().split(/\s+/);
  return new Date(2026, A_MONTHS[p[0]] ?? 0, parseInt(p[1]) || 1);
}

function OwnerChip({ name }) {
  return (
    <span className="row center" style={{ gap: 6 }}>
      <span className="avatar" style={{ width: 18, height: 18, fontSize: 8.5, background: "linear-gradient(140deg,#64748b,#334155)" }}>
        {(name || "?")[0]}
      </span>
      <span className="muted" style={{ fontSize: 12 }}>
        {name}
      </span>
    </span>
  );
}

function ActionRow({ item, app, last }) {
  const agent = app.agents.find((a) => a.id === item.agentId);
  return (
    <div className="row" style={{ gap: 13, padding: "14px 4px", borderBottom: last ? "none" : "1px solid var(--border)", alignItems: "flex-start" }}>
      <button
        onClick={() => app.toggleAction(item.mid, item.idx)}
        style={{
          width: 21,
          height: 21,
          borderRadius: 6,
          flex: "none",
          marginTop: 1,
          cursor: "pointer",
          border: "2px solid " + (item.done ? "var(--accent)" : "var(--border-2)"),
          background: item.done ? "var(--accent)" : "transparent",
          display: "grid",
          placeItems: "center",
        }}
      >
        {item.done && <Icon name="check" size={13} style={{ color: "#fff" }} stroke={3} />}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 500, lineHeight: 1.45, textDecoration: item.done ? "line-through" : "none", color: item.done ? "var(--text-3)" : "var(--text)" }}>
          {item.text}
        </div>
        <div className="row center wrap" style={{ gap: 14, marginTop: 8 }}>
          <OwnerChip name={item.owner} />
          <span className="row center" style={{ gap: 6 }}>
            <Icon name="clock" size={13} style={{ color: item.overdue ? "var(--danger)" : "var(--text-3)" }} />
            <span style={{ fontSize: 12, fontWeight: item.overdue ? 700 : 500, color: item.overdue ? "var(--danger)" : "var(--text-2)" }}>
              {item.overdue ? "Overdue · " : ""}Due {item.due}
            </span>
          </span>
          <button
            onClick={() => app.nav("brief", { id: item.mid })}
            className="row center"
            style={{ gap: 6, background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            {agent && <AgentAvatar name={agent.name} size={16} />}
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent-d)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 220 }}>
              {item.mtitle}
            </span>
            <Icon name="chevR" size={13} style={{ color: "var(--accent-d)" }} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Group({ title, color, items, app }) {
  if (!items.length) return null;
  return (
    <section style={{ marginBottom: 24 }}>
      <div className="row center" style={{ gap: 9, marginBottom: 6 }}>
        <span className="dot" style={{ background: color }} />
        <h3 style={{ fontSize: 15, fontFamily: "var(--font-body)", fontWeight: 700 }}>{title}</h3>
        <span className="badge badge-muted" style={{ height: 20 }}>
          {items.length}
        </span>
      </div>
      <div className="card" style={{ borderRadius: 16, padding: "2px 18px" }}>
        {items.map((it, i) => (
          <ActionRow key={it.mid + it.idx} item={it} app={app} last={i === items.length - 1} />
        ))}
      </div>
    </section>
  );
}

export function ActionsPage({ app }) {
  const [filter, setFilter] = useState("open");
  const [owner, setOwner] = useState("all");

  const all = app.meetings.flatMap((m) =>
    m.actions.map((a, idx) => {
      const dd = dueToDate(a.due);
      return { ...a, idx, mid: m.id, mtitle: m.title, platform: m.platform, agentId: m.agentId, dd, overdue: !a.done && dd < A_NOW };
    })
  );

  if (all.length === 0) {
    return (
      <PageWrap title="Action items" subtitle="Every commitment your agents captured.">
        <div className="card" style={{ borderRadius: 18 }}>
          <EmptyState
            icon="listCheck"
            title="No action items yet"
            body="When your agents sit in meetings, every owner and due date they capture lands here."
            action={
              <Btn variant="primary" icon="plus" onClick={() => app.nav("newMeeting")}>
                New meeting
              </Btn>
            }
          />
        </div>
      </PageWrap>
    );
  }

  const owners = [...new Set(all.map((a) => a.owner))];
  let scoped = owner === "all" ? all : all.filter((a) => a.owner === owner);

  const openCount = all.filter((a) => !a.done).length;
  const overdueCount = all.filter((a) => a.overdue).length;
  const doneCount = all.filter((a) => a.done).length;

  scoped.sort((a, b) => a.dd - b.dd);
  const overdue = scoped.filter((a) => a.overdue);
  const open = scoped.filter((a) => !a.done && !a.overdue);
  const done = scoped.filter((a) => a.done);

  const showOverdue = filter === "all" || filter === "open" || filter === "overdue";
  const showOpen = filter === "all" || filter === "open";
  const showDone = filter === "all" || filter === "done";

  const nothing = (showOverdue ? overdue.length : 0) + (showOpen ? open.length : 0) + (showDone ? done.length : 0) === 0;

  return (
    <PageWrap
      title="Action items"
      subtitle="Every commitment your agents captured — owners, dates, and where they came from."
      actions={
        <Btn variant="primary" icon="plus" onClick={() => app.nav("newMeeting")}>
          New meeting
        </Btn>
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard icon="listCheck" label="Open" value={openCount} tone="amber" />
        <StatCard icon="clock" label="Overdue" value={overdueCount} tone="accent" />
        <StatCard icon="checkCircle" label="Completed" value={doneCount} tone="blue" />
      </div>

      <div className="row between center wrap" style={{ gap: 14, marginBottom: 22 }}>
        <div className="row center" style={{ gap: 8 }}>
          {[
            ["open", "Open"],
            ["overdue", "Overdue"],
            ["done", "Completed"],
            ["all", "All"],
          ].map(([k, l]) => (
            <button key={k} className={"chip" + (filter === k ? " is-on" : "")} onClick={() => setFilter(k)}>
              {l}
            </button>
          ))}
        </div>
        <div className="row center" style={{ gap: 8 }}>
          <span className="muted" style={{ fontSize: 12.5, fontWeight: 600 }}>
            Owner
          </span>
          <select className="select" value={owner} onChange={(e) => setOwner(e.target.value)} style={{ height: 36, padding: "0 32px 0 12px", fontSize: 13 }}>
            <option value="all">Everyone</option>
            {owners.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showOverdue && <Group title="Overdue" color="var(--danger)" items={overdue} app={app} />}
      {showOpen && <Group title="Open" color="#E8A33D" items={open} app={app} />}
      {showDone && <Group title="Completed" color="var(--accent)" items={done} app={app} />}

      {nothing && (
        <div className="card" style={{ borderRadius: 16, padding: "40px", textAlign: "center" }}>
          <Icon name="checkCircle" size={28} style={{ color: "var(--accent-d)", margin: "0 auto 10px" }} />
          <div className="muted" style={{ fontSize: 14 }}>
            Nothing here under this filter.
          </div>
        </div>
      )}
    </PageWrap>
  );
}
