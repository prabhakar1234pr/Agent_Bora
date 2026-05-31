/* Workspace.js — the authenticated app shell + client-side view router.
   Mirrors the prototype's App router: an internal `view` (from the demo store)
   selects which page renders inside the sidebar shell. */
import { useDemoStore } from "../../context/DemoStore";
import Sidebar from "./Sidebar";
import Home from "./Home";
import { AgentsPage, CreateAgent } from "./Agents";
import { MeetingsPage, BriefPage } from "./Meetings";
import { ActionsPage } from "./Actions";
import { Integrations } from "./Integrations";
import { NewMeeting } from "./NewMeeting";

export default function Workspace({ onSignOut }) {
  const app = useDemoStore();

  const PAGES = {
    home: <Home app={app} />,
    agents: <AgentsPage app={app} />,
    createAgent: <CreateAgent app={app} />,
    integrations: <Integrations app={app} />,
    meetings: <MeetingsPage app={app} />,
    actions: <ActionsPage app={app} />,
    brief: <BriefPage app={app} />,
    newMeeting: <NewMeeting app={app} />,
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar app={app} onSignOut={onSignOut} />
      <div className="grow" style={{ minWidth: 0, height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {PAGES[app.view] || PAGES.home}
      </div>
    </div>
  );
}
