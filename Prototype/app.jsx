/* app.jsx — store, router, shell, tweaks, mount */
const { useState, useEffect, useRef } = React;

/* ---------------- shared PageWrap ---------------- */
function PageWrap({title, subtitle, actions, back, children}){
  return (
    <div className="app-scroll fade-in">
      <div style={{maxWidth:1180, margin:'0 auto', padding:'30px 36px 64px'}}>
        <div className="row between" style={{alignItems:'flex-end', marginBottom:26, gap:20}}>
          <div>
            {back && <button className="btn btn-ghost btn-sm" onClick={back} style={{marginBottom:10, paddingLeft:8, marginLeft:-4}}><Icon name="chevL" size={16} />Back</button>}
            <h1 style={{fontSize:30, letterSpacing:'-.03em'}}>{title}</h1>
            {subtitle && <p className="muted" style={{fontSize:15.5, marginTop:6}}>{subtitle}</p>}
          </div>
          {actions && <div className="row center" style={{gap:10}}>{actions}</div>}
        </div>
        {children}
      </div>
    </div>
  );
}
Object.assign(window, { PageWrap });

/* ---------------- Sidebar ---------------- */
const NAV=[
  {view:'home', icon:'home', label:'Home'},
  {view:'agents', icon:'agent', label:'Agents'},
  {view:'meetings', icon:'meetings', label:'Meetings'},
  {view:'actions', icon:'listCheck', label:'Action items'},
];
const PARENT={createAgent:'agents', integrations:'agents', brief:'meetings', newMeeting:'meetings'};

function Sidebar({app}){
  const [menu,setMenu]=useState(false);
  const activeParent = PARENT[app.view]||app.view;
  const openActions = app.meetings.reduce((n,m)=>n+m.actions.filter(a=>!a.done).length,0);
  return (
    <div style={{width:236, borderRight:'1px solid var(--border)', background:'var(--surface)', display:'flex', flexDirection:'column', flex:'none', height:'100vh'}}>
      <div style={{padding:'20px 18px 14px'}}><Logo size={25} /></div>

      <div style={{padding:'6px 14px 0'}}>
        <Btn variant="primary" block icon="plus" onClick={()=>app.nav('newMeeting')}>New meeting</Btn>
      </div>

      <div className="col" style={{gap:3, padding:'16px 14px'}}>
        {NAV.map(n=>(
          <div key={n.view} className={'nav-item'+(activeParent===n.view?' is-active':'')} onClick={()=>app.nav(n.view)}>
            <Icon name={n.icon} size={18} />{n.label}
            {n.view==='agents' && app.agents.length>0 && <span className="badge badge-muted" style={{marginLeft:'auto', height:20}}>{app.agents.length}</span>}
            {n.view==='actions' && openActions>0 && <span className="badge badge-amber" style={{marginLeft:'auto', height:20}}>{openActions}</span>}
          </div>
        ))}
      </div>

      <div className="grow" />

      {/* upsell card */}
      <div style={{padding:'0 14px 12px'}}>
        <div style={{borderRadius:14, padding:16, background:'linear-gradient(150deg, var(--accent-t), var(--surface-2))', border:'1px solid var(--border)'}}>
          <div className="row center" style={{gap:8, marginBottom:7}}>
            <Icon name="bolt" size={15} style={{color:'var(--accent-d)'}} />
            <span style={{fontSize:12.5, fontWeight:700}}>Northwind · Pro</span>
          </div>
          <div style={{height:5, borderRadius:99, background:'var(--surface-3)', overflow:'hidden', marginBottom:7}}>
            <div style={{width:'68%', height:'100%', background:'var(--accent)'}} /></div>
          <span className="muted" style={{fontSize:11.5}}>34 of 50 agent-hours used</span>
        </div>
      </div>

      {/* user */}
      <div style={{padding:'12px 14px', borderTop:'1px solid var(--border)', position:'relative'}}>
        {menu && <>
          <div onClick={()=>setMenu(false)} style={{position:'fixed', inset:0, zIndex:40}} />
          <div className="card" style={{position:'absolute', left:14, right:14, bottom:70, zIndex:41, borderRadius:13, padding:6, boxShadow:'var(--shadow-lg)'}}>
            <button className="nav-item" style={{width:'100%'}} onClick={()=>{setMenu(false);}}><Icon name="settings" size={17} />Settings</button>
            <button className="nav-item" style={{width:'100%'}} onClick={()=>{setMenu(false);app.nav('integrations');}}><Icon name="plug" size={17} />Integrations</button>
            <div className="hairline" style={{margin:'4px 8px'}} />
            <button className="nav-item" style={{width:'100%', color:'var(--danger)'}} onClick={app.logout}><Icon name="logout" size={17} />Log out</button>
          </div>
        </>}
        <button onClick={()=>setMenu(m=>!m)} style={{width:'100%', display:'flex', alignItems:'center', gap:11, padding:'8px', borderRadius:11, border:'none', background:menu?'var(--surface-2)':'transparent', cursor:'pointer'}}>
          <UserAvatar name={app.user.name} size={34} />
          <div style={{flex:1, textAlign:'left', minWidth:0}}>
            <div style={{fontSize:13.5, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{app.user.name}</div>
            <div className="muted" style={{fontSize:11.5, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{app.user.email}</div>
          </div>
          <Icon name="chevD" size={15} style={{color:'var(--text-3)', transform:menu?'rotate(180deg)':'none', transition:'transform .15s'}} />
        </button>
      </div>
    </div>
  );
}

/* ---------------- Tweaks ---------------- */
const FONT_PAIRS={
  modern:{display:"'Space Grotesk', sans-serif", body:"'Plus Jakarta Sans', sans-serif", label:'Modern'},
  geometric:{display:"'Outfit', sans-serif", body:"'DM Sans', sans-serif", label:'Geometric'},
  editorial:{display:"'Instrument Serif', serif", body:"'Plus Jakarta Sans', sans-serif", label:'Editorial'},
};
const TWEAK_DEFAULTS={ accent:'#10B981', fontPair:'modern' };

function BoraTweaks({t,setTweak}){
  return (
    <TweaksPanel>
      <TweakSection label="Brand color" />
      <TweakColor label="Accent" value={t.accent}
        options={['#10B981','#2563EB','#6366F1','#8B5CF6','#F97316','#F43F5E']}
        onChange={v=>setTweak('accent',v)} />
      <TweakSection label="Typography" />
      <TweakRadio label="Font pairing" value={t.fontPair}
        options={['modern','geometric','editorial']}
        onChange={v=>setTweak('fontPair',v)} />
      <div style={{padding:'2px 2px 6px', fontSize:12, color:'var(--text-3)', lineHeight:1.5}}>
        {FONT_PAIRS[t.fontPair].label}: headings in {FONT_PAIRS[t.fontPair].display.split(',')[0].replace(/'/g,'')}.
      </div>
    </TweaksPanel>
  );
}

/* ---------------- Store + App ---------------- */
const LS_KEY='agentbora_v1';
function loadState(){
  try{ return JSON.parse(localStorage.getItem(LS_KEY)); }catch(e){ return null; }
}
function clone(x){ return JSON.parse(JSON.stringify(x)); }

function App(){
  const [t,setTweak]=useTweaks(TWEAK_DEFAULTS);
  const saved=useRef(loadState()).current;

  const [authed,setAuthed]=useState(saved?.authed||false);
  const [view,setView]=useState(saved?.view||'landing');
  const [params,setParams]=useState(saved?.params||{});
  const [agents,setAgents]=useState(saved?.agents||[]);
  const [meetings,setMeetings]=useState(saved?.meetings||[]);
  const [agentChats,setAgentChats]=useState(saved?.agentChats||{});
  const [connected,setConnectedState]=useState(saved?.connected||[]);
  const [currentAgentId,setCurrentAgentId]=useState(saved?.currentAgentId||'');
  const user=DEMO_USER;

  // apply tweaks → CSS vars
  useEffect(()=>{
    const r=document.documentElement;
    r.style.setProperty('--accent', t.accent);
    const fp=FONT_PAIRS[t.fontPair]||FONT_PAIRS.modern;
    r.style.setProperty('--font-display', fp.display);
    r.style.setProperty('--font-body', fp.body);
  },[t.accent, t.fontPair]);

  // persist
  useEffect(()=>{
    localStorage.setItem(LS_KEY, JSON.stringify({authed,view,params,agents,meetings,agentChats,connected,currentAgentId}));
  },[authed,view,params,agents,meetings,agentChats,connected,currentAgentId]);

  const nav=(v,p={})=>{ setView(v); setParams(p); const sc=document.querySelector('.app-scroll'); if(sc) sc.scrollTop=0; };

  const login=(isNew)=>{
    if(isNew){
      setAgents([]); setMeetings([]); setAgentChats({}); setConnectedState([]); setCurrentAgentId('');
    }else{
      setAgents(clone(SEED_AGENTS)); setMeetings(clone(SEED_MEETINGS)); setAgentChats(clone(SEED_AGENT_CHAT));
      setConnectedState(['gmail','calendar','notion','asana','github']); setCurrentAgentId('ag_atlas');
    }
    setAuthed(true); nav('home');
  };
  const logout=()=>{ setAuthed(false); nav('landing'); };

  const createAgent=(a)=>{
    setAgents(prev=>[...prev,a]);
    setAgentChats(prev=>({...prev,[a.id]:[{role:'agent',text:`Hi — I’m ${a.name}. I’ve started reading your sources. Add me to a meeting whenever you’re ready and I’ll take it from there.`}]}));
    setConnectedState(prev=>Array.from(new Set([...prev,...(a.integrations||[])])));
    setCurrentAgentId(a.id);
    nav('agents');
  };
  const setAgentChat=(id,msgs)=>setAgentChats(prev=>({...prev,[id]:msgs}));
  const toggleAction=(mid,idx)=>setMeetings(prev=>prev.map(m=>m.id!==mid?m:{...m, actions:m.actions.map((a,i)=>i!==idx?a:{...a,done:!a.done})}));
  const setConnected=(arr)=>setConnectedState(arr);

  const upcoming = authed && agents.length ? SEED_UPCOMING.filter(u=>agents.some(a=>a.id===u.agentId)) : [];

  const app={ user, view, params, agents, meetings, agentChats, connected, currentAgentId, upcoming,
    nav, login, logout, createAgent, setAgentChat, toggleAction, setConnected, setCurrentAgentId };

  // ---- routing ----
  let body;
  if(!authed){
    if(view==='login') body=<Auth mode="login" onNav={nav} onAuth={login} />;
    else if(view==='signup') body=<Auth mode="signup" onNav={nav} onAuth={login} />;
    else body=<Landing onNav={nav} />;
    return <>{body}<BoraTweaks t={t} setTweak={setTweak} /></>;
  }

  // authed → app shell
  const PAGES={
    home:<Home app={app} />,
    agents:<AgentsPage app={app} />,
    createAgent:<CreateAgent app={app} />,
    integrations:<Integrations app={app} />,
    meetings:<MeetingsPage app={app} />,
    actions:<ActionsPage app={app} />,
    brief:<BriefPage app={app} />,
    newMeeting:<NewMeeting app={app} />,
  };
  return (
    <>
      <div style={{display:'flex', height:'100vh', overflow:'hidden'}}>
        <Sidebar app={app} />
        <div className="grow" style={{minWidth:0, height:'100vh', overflow:'hidden', display:'flex', flexDirection:'column'}}>
          {PAGES[view]||PAGES.home}
        </div>
      </div>
      <BoraTweaks t={t} setTweak={setTweak} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
