/* data.jsx — seed data + store helpers for Agent Bora */

const DEMO_USER = { name:'Mira Okonkwo', email:'mira@northwind.io', company:'Northwind', role:'Head of Product' };

const SEED_AGENTS = [
  {
    id:'ag_atlas', name:'Atlas', tagline:'Product & roadmap copilot',
    persona:'Speaks up when scope creeps. Tracks decisions, owners, and dates. Confident, concise, never rambles.',
    voice:'proactive', created:'2026-04-02',
    sources:[
      {type:'github', label:'northwind/web-app', meta:'main · 1,284 files'},
      {type:'notion', label:'Product Wiki', meta:'42 pages synced'},
      {type:'url', label:'northwind.io/changelog', meta:'crawled weekly'},
      {type:'doc', label:'Q3 Roadmap.pdf', meta:'18 pages'},
    ],
    integrations:['notion','asana','calendar','github'],
    meetings:14, words:'118k',
  },
  {
    id:'ag_scout', name:'Scout', tagline:'Customer research note-taker',
    persona:'Quiet listener. Captures verbatim quotes, themes, and objections. Only speaks when asked.',
    voice:'passive', created:'2026-04-21',
    sources:[
      {type:'doc', label:'Interview guide v3', meta:'6 pages'},
      {type:'url', label:'dovetail.com/northwind', meta:'crawled'},
      {type:'text', label:'ICP & personas', meta:'pasted'},
    ],
    integrations:['notion','slack','calendar'],
    meetings:9, words:'74k',
  },
];

function mins(n){ return n; }
const SEED_MEETINGS = [
  {
    id:'m_q3plan', title:'Q3 Roadmap Lock', date:'2026-05-28T15:00:00', durationMin:48,
    platform:'meet', agentId:'ag_atlas', mode:'proactive', attendees:['Mira Okonkwo','Dev Raman','Lena Cho','Priya Nair'],
    spoke:6,
    summary:'The team locked the Q3 roadmap around three bets: the collaborative editor, billing v2, and the mobile beta. Billing v2 slips two weeks to absorb the SOC 2 audit window. Atlas flagged that the editor and mobile beta share the same two engineers and pushed the group to sequence them — mobile beta now starts after the editor ships.',
    highlights:[
      'Three Q3 bets confirmed: collaborative editor, billing v2, mobile beta.',
      'Billing v2 moves to mid-July to clear the SOC 2 audit window.',
      'Editor and mobile beta de-conflicted — mobile starts post-editor ship.',
      'Pricing experiment deferred to Q4 pending the billing migration.',
    ],
    actions:[
      {text:'Re-sequence mobile beta to start after editor GA', owner:'Dev Raman', due:'Jun 2', done:true},
      {text:'Book SOC 2 audit window with the security vendor', owner:'Lena Cho', due:'Jun 5', done:false},
      {text:'Draft pricing-experiment brief for Q4 review', owner:'Mira Okonkwo', due:'Jun 9', done:false},
      {text:'Update the public roadmap page with new dates', owner:'Priya Nair', due:'Jun 4', done:false},
    ],
    transcript:[
      {t:'00:42', speaker:'Mira Okonkwo', text:'Okay, the goal today is to walk out with Q3 actually locked. No more re-litigating.'},
      {t:'01:15', speaker:'Dev Raman', text:'Editor is the big one. I think it eats most of the quarter honestly.'},
      {t:'02:03', speaker:'Atlas', isAgent:true, text:'Quick flag — the editor and the mobile beta are both assigned to Dev and Priya. If they run in parallel you’re double-booking the same two people. Want me to sequence them?'},
      {t:'02:20', speaker:'Lena Cho', text:'Good catch. Yeah, let’s not pretend we can do both at once.'},
      {t:'02:48', speaker:'Mira Okonkwo', text:'Sequence it. Editor first, mobile beta right after GA.'},
      {t:'03:30', speaker:'Atlas', isAgent:true, text:'Logged. Mobile beta now starts after editor GA. I’ll also move the pricing experiment out — it depends on billing v2, which just slipped. Park it in Q4?'},
      {t:'03:51', speaker:'Priya Nair', text:'Park it. We can’t test pricing on a migration that isn’t done.'},
    ],
  },
  {
    id:'m_cust_villa', title:'Customer Sync — Villa Group', date:'2026-05-26T17:30:00', durationMin:33,
    platform:'teams', agentId:'ag_scout', mode:'passive', attendees:['Mira Okonkwo','Tomas Vela (Villa)','Scout'],
    spoke:0,
    summary:'Villa Group renews but wants SSO and granular roles before they expand seats. Their ops lead, Tomas, was blunt: the current permissions model blocks them from rolling Agent Bora out beyond the pilot team. Scout captured the renewal as low-risk but the expansion as gated on enterprise access controls landing this quarter.',
    highlights:[
      'Renewal is solid — expansion is the real question.',
      'SSO + granular roles are hard blockers for a wider rollout.',
      'Tomas wants a security review packet for their CISO.',
      'Champion is strong; budget exists if access controls ship.',
    ],
    actions:[
      {text:'Send SSO + roles roadmap timeline to Tomas', owner:'Mira Okonkwo', due:'May 29', done:true},
      {text:'Assemble security review packet for Villa CISO', owner:'Mira Okonkwo', due:'Jun 3', done:false},
      {text:'Flag enterprise-roles demand to roadmap review', owner:'Mira Okonkwo', due:'Jun 1', done:false},
    ],
    transcript:[
      {t:'04:10', speaker:'Tomas Vela', text:'Look, the team that’s using it loves it. But I can’t hand this to 200 people without SSO. That’s a non-starter for us.'},
      {t:'05:02', speaker:'Mira Okonkwo', text:'Totally fair. SSO is on the Q3 list. Let me get you the actual timeline, not a vague promise.'},
      {t:'06:20', speaker:'Tomas Vela', text:'And roles. Right now everyone sees everything. Our legal team would lose it.'},
      {t:'07:01', speaker:'Mira Okonkwo', text:'Granular roles ship in the same release. I’ll put together a packet your CISO can actually review.'},
    ],
  },
  {
    id:'m_design_crit', title:'Design Crit — Editor Canvas', date:'2026-05-22T19:00:00', durationMin:41,
    platform:'meet', agentId:'ag_atlas', mode:'proactive', attendees:['Mira Okonkwo','Jun Park','Sara Bloom','Dev Raman'],
    spoke:3,
    summary:'The team reviewed three directions for the collaborative editor canvas. Direction B — a focused, single-column writing surface with presence cues in the gutter — won the room. Atlas tracked the open question of how comments resolve and surfaced that it was raised twice without an owner, then assigned it.',
    highlights:[
      'Direction B wins: focused single column with gutter presence.',
      'Floating toolbar gets cut — too noisy on small screens.',
      'Comment resolution flow is still undecided.',
      'Jun to prototype B with real multiplayer cursors.',
    ],
    actions:[
      {text:'Prototype Direction B with live cursors', owner:'Jun Park', due:'May 30', done:true},
      {text:'Define comment-resolution interaction', owner:'Sara Bloom', due:'Jun 2', done:false},
      {text:'Spec gutter presence states for handoff', owner:'Jun Park', due:'Jun 6', done:false},
    ],
    transcript:[
      {t:'08:30', speaker:'Jun Park', text:'B is the one I keep coming back to. It gets out of the way.'},
      {t:'09:12', speaker:'Sara Bloom', text:'Agreed, but how do comments resolve? We keep skipping that.'},
      {t:'09:40', speaker:'Atlas', isAgent:true, text:'That’s the second time comment resolution has come up with no owner. Sara, want me to put it on you to define, due before handoff?'},
      {t:'09:58', speaker:'Sara Bloom', text:'Yeah, give it to me. June 2nd.'},
    ],
  },
  {
    id:'m_eng_standup', title:'Eng Planning — Sprint 19', date:'2026-05-20T16:00:00', durationMin:29,
    platform:'teams', agentId:'ag_atlas', mode:'passive', attendees:['Dev Raman','Priya Nair','Omar Diallo','Atlas'],
    spoke:1,
    summary:'Sprint 19 commits to the editor data model and the billing migration spike. Omar raised flakiness in the CI suite eating review time. The team agreed to timebox a fix. Atlas noted the billing spike has no acceptance criteria yet and flagged it before commit.',
    highlights:[
      'Sprint 19: editor data model + billing migration spike.',
      'CI flakiness timeboxed to a one-day fix.',
      'Billing spike needs acceptance criteria before it starts.',
    ],
    actions:[
      {text:'Write acceptance criteria for billing spike', owner:'Priya Nair', due:'May 21', done:true},
      {text:'Timebox CI flakiness fix (1 day)', owner:'Omar Diallo', due:'May 23', done:true},
    ],
    transcript:[
      {t:'02:11', speaker:'Omar Diallo', text:'CI is failing randomly like a third of the time. It’s killing review velocity.'},
      {t:'03:00', speaker:'Atlas', isAgent:true, text:'Before we commit the billing spike — it has no acceptance criteria on the ticket. It’ll balloon. Want someone to write them first?'},
    ],
  },
  {
    id:'m_board', title:'Investor Update Prep', date:'2026-05-15T14:00:00', durationMin:37,
    platform:'meet', agentId:'ag_atlas', mode:'proactive', attendees:['Mira Okonkwo','Lena Cho','Finance — Raj'],
    spoke:4,
    summary:'Prep for the May investor update. Net revenue retention is the headline at 118%. Lena and Raj aligned on framing the billing slip as a deliberate trade for SOC 2 readiness, which unlocks enterprise. Atlas pulled the three numbers that needed sources and listed them.',
    highlights:[
      'NRR of 118% is the lead metric.',
      'Frame billing slip as SOC 2 trade — unlocks enterprise pipeline.',
      'Three figures still need a verified source before the deck ships.',
    ],
    actions:[
      {text:'Source-check NRR, burn, and pipeline figures', owner:'Finance — Raj', due:'May 18', done:true},
      {text:'Draft the SOC 2 narrative slide', owner:'Lena Cho', due:'May 17', done:true},
      {text:'Send deck to board 48h ahead', owner:'Mira Okonkwo', due:'May 20', done:true},
    ],
    transcript:[
      {t:'05:40', speaker:'Lena Cho', text:'The billing slip is going to get a question. We should get ahead of it.'},
      {t:'06:15', speaker:'Atlas', isAgent:true, text:'Three numbers in this deck don’t have a source attached yet — NRR, monthly burn, and Q3 pipeline. I’d lock those before it goes out. Want me to assign the source-check?'},
    ],
  },
];

// Pre-seeded chat threads
const SEED_AGENT_CHAT = {
  ag_atlas:[
    {role:'agent', text:'Morning, Mira. You’ve got the Q3 Roadmap Lock in 40 minutes. Want the one-line state of each bet before you walk in?'},
    {role:'user', text:'Yes, quick version.'},
    {role:'agent', text:'Editor: on track, prototype lands Friday. Billing v2: slipped to mid-July for SOC 2 — that’s the one people will poke at. Mobile beta: sequenced after editor, no longer at risk. Two open actions are still unowned from last week — want me to chase them?'},
  ],
  ag_scout:[
    {role:'agent', text:'I pulled the themes across your last 6 customer calls. SSO and granular roles came up in 5 of 6. Want the highlight reel or the verbatim quotes?'},
  ],
};

function fmtDate(iso, opts){
  const d=new Date(iso);
  return d.toLocaleDateString('en-US', opts||{month:'short', day:'numeric'});
}
function fmtTime(iso){
  return new Date(iso).toLocaleTimeString('en-US',{hour:'numeric', minute:'2-digit'});
}
function relDay(iso){
  const d=new Date(iso); const now=new Date('2026-05-30T10:00:00');
  const days=Math.round((now-d)/86400000);
  if(days===0) return 'Today';
  if(days===1) return 'Yesterday';
  if(days<7) return days+' days ago';
  return fmtDate(iso);
}

// Upcoming (future) meetings for the dashboard
const SEED_UPCOMING = [
  {id:'u1', title:'Q3 Roadmap Lock', date:'2026-05-30T15:00:00', platform:'meet', agentId:'ag_atlas', mode:'proactive', attendees:4},
  {id:'u2', title:'Customer Sync — Helio', date:'2026-05-30T18:30:00', platform:'teams', agentId:'ag_scout', mode:'passive', attendees:2},
  {id:'u3', title:'Design Crit — Mobile Shell', date:'2026-06-01T19:00:00', platform:'meet', agentId:'ag_atlas', mode:'proactive', attendees:5},
];

Object.assign(window, {
  DEMO_USER, SEED_AGENTS, SEED_MEETINGS, SEED_AGENT_CHAT, SEED_UPCOMING,
  fmtDate, fmtTime, relDay,
});
