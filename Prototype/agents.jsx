/* agents.jsx — Agents page (chat / empty state) + Create Agent */
const { useState, useEffect, useRef } = React;

/* ---------------- Agents list rail ---------------- */
function AgentRail({app}){
  return (
    <div style={{width:248, borderRight:'1px solid var(--border)', background:'var(--surface)', display:'flex', flexDirection:'column', flex:'none'}}>
      <div style={{padding:'18px 16px 12px'}}>
        <div className="row between center" style={{marginBottom:4}}>
          <span style={{fontWeight:700, fontSize:15}}>Agents</span>
          <span className="badge badge-muted">{app.agents.length}</span>
        </div>
      </div>
      <div className="col grow" style={{gap:4, padding:'0 10px', overflowY:'auto'}}>
        {app.agents.map(a=>{
          const active=a.id===app.currentAgentId;
          return (
            <button key={a.id} onClick={()=>app.setCurrentAgentId(a.id)} style={{display:'flex', alignItems:'center', gap:11, padding:'10px 10px',
              borderRadius:11, cursor:'pointer', border:'1px solid '+(active?'var(--accent-ring)':'transparent'),
              background:active?'var(--accent-t)':'transparent', textAlign:'left', transition:'all .14s'}}>
              <AgentAvatar name={a.name} size={36} listening={active} />
              <div style={{minWidth:0, flex:1}}>
                <div style={{fontWeight:600, fontSize:14, color:active?'var(--accent-ink)':'var(--text)'}}>{a.name}</div>
                <div className="muted" style={{fontSize:11.5, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{a.tagline}</div>
              </div>
            </button>
          );
        })}
      </div>
      <div style={{padding:12, borderTop:'1px solid var(--border)'}}>
        <Btn variant="secondary" block icon="plus" onClick={()=>app.nav('createAgent')}>New agent</Btn>
      </div>
    </div>
  );
}

/* ---------------- Agent chat ---------------- */
const SUGGESTIONS = [
  'Summarize my last meeting',
  'What action items do I own?',
  'Draft a follow-up email',
  'What changed on the roadmap?',
];
function agentReply(agent, text){
  const t=text.toLowerCase();
  if(t.includes('action')) return 'You own 3 open items right now: source-check the investor figures (due May 18 — overdue), assemble the Villa security packet (Jun 3), and draft the Q4 pricing brief (Jun 9). Want me to draft any of them, or push them to Asana?';
  if(t.includes('follow') || t.includes('email')) return 'Drafted. Subject: “Q3 locked — here’s where each bet stands.” It recaps the three bets, the billing slip and why, and lists the four owners with dates. Want me to open it in Gmail or tweak the tone first?';
  if(t.includes('roadmap') || t.includes('chang')) return 'Since last week: billing v2 moved to mid-July for the SOC 2 window, mobile beta is now sequenced after the editor GA, and the pricing experiment was parked in Q4. Two action items from the lock are still unowned.';
  if(t.includes('summ') || t.includes('last meeting')) return 'Q3 Roadmap Lock (48m, 4 people): the team confirmed three bets — editor, billing v2, mobile beta. Billing slipped two weeks for SOC 2. I flagged the editor/mobile resource clash and we sequenced them. 4 action items captured with owners.';
  return 'On it. I’ve got full context from your synced sources and every meeting I’ve sat in — ask me to summarize, draft, or chase down owners and I’ll handle it.';
}

function ChatBubble({m, agent}){
  const isUser=m.role==='user';
  return (
    <div className="row" style={{gap:11, justifyContent:isUser?'flex-end':'flex-start', alignItems:'flex-start'}}>
      {!isUser && <AgentAvatar name={agent.name} size={30} />}
      <div style={{maxWidth:'72%', padding:'12px 15px', borderRadius:16, fontSize:14, lineHeight:1.58,
        background:isUser?'var(--accent)':'var(--surface)', color:isUser?'#fff':'var(--text)',
        border:isUser?'none':'1px solid var(--border)',
        borderBottomRightRadius:isUser?5:16, borderBottomLeftRadius:isUser?16:5,
        boxShadow:isUser?'var(--shadow-accent)':'var(--shadow-sm)'}}>
        {m.text}
      </div>
      {isUser && <UserAvatar name="You" size={30} />}
    </div>
  );
}

function AgentChat({app, agent}){
  const [msgs,setMsgs]=useState(app.agentChats[agent.id]||[]);
  const [draft,setDraft]=useState('');
  const [typing,setTyping]=useState(false);
  const scroller=useRef(null);

  useEffect(()=>{ setMsgs(app.agentChats[agent.id]||[]); },[agent.id]);
  useEffect(()=>{ if(scroller.current) scroller.current.scrollTop=scroller.current.scrollHeight; },[msgs,typing]);

  const send=(text)=>{
    const t=(text??draft).trim(); if(!t) return;
    const next=[...msgs,{role:'user',text:t}];
    setMsgs(next); setDraft(''); setTyping(true);
    setTimeout(()=>{
      const withReply=[...next,{role:'agent',text:agentReply(agent,t)}];
      setMsgs(withReply); setTyping(false);
      app.setAgentChat(agent.id, withReply);
    },900);
  };

  return (
    <div className="col grow" style={{minWidth:0, background:'var(--bg)'}}>
      {/* header */}
      <div className="row between center" style={{padding:'14px 24px', borderBottom:'1px solid var(--border)', background:'var(--surface)'}}>
        <div className="row center" style={{gap:13}}>
          <AgentAvatar name={agent.name} size={42} listening />
          <div>
            <div className="row center" style={{gap:9}}>
              <span style={{fontWeight:700, fontSize:16.5}}>{agent.name}</span>
              <span className={'badge '+(agent.voice==='proactive'?'badge-accent':'badge-muted')}>
                <Icon name={agent.voice==='proactive'?'mic':'eye'} size={12} />{agent.voice==='proactive'?'Proactive':'Passive'}
              </span>
            </div>
            <div className="row center" style={{gap:8, marginTop:2}}>
              <StatusDot label="Ready" /><span className="faint">·</span>
              <span className="muted" style={{fontSize:12.5}}>{agent.sources.length} sources · {agent.meetings} meetings</span>
            </div>
          </div>
        </div>
        <div className="row center" style={{gap:9}}>
          <Btn variant="secondary" icon="plug" onClick={()=>app.nav('integrations')}>Integrations</Btn>
          <Btn variant="primary" icon="mic" onClick={()=>app.nav('newMeeting')}>Call to meeting</Btn>
          <button className="btn btn-ghost btn-icon" onClick={()=>app.nav('createAgent',{edit:agent.id})}><Icon name="settings" size={18} /></button>
        </div>
      </div>

      {/* messages */}
      <div ref={scroller} className="grow" style={{overflowY:'auto', padding:'26px 24px'}}>
        <div className="col" style={{gap:16, maxWidth:760, margin:'0 auto'}}>
          {/* context banner */}
          <div className="row center" style={{gap:10, alignSelf:'center', padding:'8px 14px', background:'var(--surface-2)', borderRadius:999, marginBottom:4}}>
            <Icon name="brain" size={15} style={{color:'var(--accent-d)'}} />
            <span style={{fontSize:12.5, color:'var(--text-2)'}}>{agent.name} has context from {agent.sources.length} sources and {agent.integrations.length} connected tools</span>
          </div>
          {msgs.map((m,i)=><ChatBubble key={i} m={m} agent={agent} />)}
          {typing && (
            <div className="row" style={{gap:11}}>
              <AgentAvatar name={agent.name} size={30} />
              <div style={{padding:'14px 16px', borderRadius:16, borderBottomLeftRadius:5, background:'var(--surface)', border:'1px solid var(--border)'}}>
                <Wave size={14} bars={4} color="var(--text-3)" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* composer */}
      <div style={{padding:'14px 24px 20px', background:'var(--surface)', borderTop:'1px solid var(--border)'}}>
        <div style={{maxWidth:760, margin:'0 auto'}}>
          <div className="row wrap" style={{gap:8, marginBottom:12}}>
            {SUGGESTIONS.map(s=><button key={s} className="chip" onClick={()=>send(s)}>{s}</button>)}
          </div>
          <div className="row center" style={{gap:10, background:'var(--surface)', border:'1px solid var(--border-2)', borderRadius:14, padding:'7px 7px 7px 16px', boxShadow:'var(--shadow-sm)'}}>
            <input value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
              placeholder={`Message ${agent.name}…`} style={{flex:1, border:'none', outline:'none', fontSize:14.5, background:'transparent', color:'var(--text)'}} />
            <button className="btn btn-primary btn-icon" onClick={()=>send()} disabled={!draft.trim()} style={{opacity:draft.trim()?1:.5}}>
              <Icon name="send" size={17} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentsPage({app}){
  if(app.agents.length===0){
    return (
      <PageWrap title="Agents" subtitle="Your AI teammates live here.">
        <div className="card" style={{borderRadius:20, marginTop:8}}>
          <EmptyState icon="agent" title="No agents yet"
            body="Create your first agent and give it the context it needs — docs, repos, links — so it’s ready to join your meetings."
            action={<Btn variant="primary" size="lg" icon="plus" onClick={()=>app.nav('createAgent')}>Create agent</Btn>} />
        </div>
      </PageWrap>
    );
  }
  const agent = app.agents.find(a=>a.id===app.currentAgentId) || app.agents[0];
  return (
    <div className="fade-in" style={{display:'flex', height:'100vh'}}>
      <AgentRail app={app} />
      <AgentChat app={app} agent={agent} key={agent.id} />
    </div>
  );
}

/* ---------------- Create Agent ---------------- */
const SOURCE_TYPES=[
  {type:'url', label:'Website URL', icon:'globe', ph:'https://docs.yourco.com'},
  {type:'github', label:'GitHub repo', icon:'github', ph:'github.com/org/repo'},
  {type:'notion', label:'Notion page', icon:'doc', ph:'notion.so/...'},
  {type:'doc', label:'Upload doc', icon:'download', ph:'Choose a PDF, DOCX, or TXT'},
  {type:'text', label:'Paste text', icon:'list', ph:'Paste notes, specs, or context…'},
];

function CreateAgent({app}){
  const [name,setName]=useState('');
  const [tagline,setTagline]=useState('');
  const [persona,setPersona]=useState('');
  const [voice,setVoice]=useState('proactive');
  const [sources,setSources]=useState([]);
  const [activeType,setActiveType]=useState('url');
  const [srcInput,setSrcInput]=useState('');
  const [integrations,setIntegrations]=useState([]);

  const meta = SOURCE_TYPES.find(s=>s.type===activeType);
  const addSource=()=>{
    const val = activeType==='doc' ? 'roadmap-q3.pdf' : srcInput.trim();
    if(!val && activeType!=='doc') return;
    setSources([...sources,{type:activeType, label:val, meta:'queued'}]);
    setSrcInput('');
  };
  const canCreate = name.trim().length>1;

  const create=()=>{
    const id='ag_'+Math.random().toString(36).slice(2,7);
    app.createAgent({
      id, name:name.trim(), tagline:tagline.trim()||'Custom agent',
      persona:persona.trim()||'A helpful meeting agent.', voice, created:new Date().toISOString(),
      sources: sources.length?sources:[{type:'text', label:'Initial brief', meta:'pasted'}],
      integrations, meetings:0, words:'0',
    });
  };

  return (
    <div className="app-scroll fade-in">
      <div style={{maxWidth:840, margin:'0 auto', padding:'28px 28px 80px'}}>
        <button className="btn btn-ghost btn-sm" onClick={()=>app.nav('agents')} style={{marginBottom:18, paddingLeft:8}}><Icon name="chevL" size={16} />Back to agents</button>

        <div className="row center" style={{gap:18, marginBottom:30}}>
          <AgentAvatar name={name||'New Agent'} size={64} listening={!!name} />
          <div>
            <h1 style={{fontSize:30, letterSpacing:'-.03em'}}>{name?`Meet ${name}`:'New agent'}</h1>
            <p className="muted" style={{fontSize:15, marginTop:3}}>Give it an identity, a voice, and all the context you can.</p>
          </div>
        </div>

        {/* Identity */}
        <div className="card card-pad" style={{borderRadius:18, marginBottom:18}}>
          <SectionLabel n="1" title="Identity" />
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:18}}>
            <div className="field"><span className="label">Agent name</span>
              <input className="input" placeholder="e.g. Atlas" value={name} onChange={e=>setName(e.target.value)} autoFocus /></div>
            <div className="field"><span className="label">One-line role</span>
              <input className="input" placeholder="e.g. Product & roadmap copilot" value={tagline} onChange={e=>setTagline(e.target.value)} /></div>
          </div>
          <div className="field" style={{marginTop:16}}>
            <span className="label">Persona & instructions</span>
            <textarea className="textarea" rows={3} placeholder="How should it behave? When should it speak up? e.g. “Flag scope creep. Track owners and dates. Stay concise.”"
              value={persona} onChange={e=>setPersona(e.target.value)} />
          </div>
        </div>

        {/* Voice */}
        <div className="card card-pad" style={{borderRadius:18, marginBottom:18}}>
          <SectionLabel n="2" title="Voice in meetings" />
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginTop:18}}>
            {[
              {v:'proactive', icon:'mic', title:'Proactive', body:'Speaks up when it spots a gap, a missing owner, or a decision nobody made.'},
              {v:'passive', icon:'eye', title:'Passive', body:'Listens silently and only responds when you @mention or ask it directly.'},
            ].map(o=>{
              const on=voice===o.v;
              return (
                <button key={o.v} onClick={()=>setVoice(o.v)} style={{textAlign:'left', cursor:'pointer', padding:18, borderRadius:14,
                  border:'1.5px solid '+(on?'var(--accent)':'var(--border-2)'), background:on?'var(--accent-t)':'var(--surface)', transition:'all .15s'}}>
                  <div className="row between center" style={{marginBottom:10}}>
                    <div style={{width:38, height:38, borderRadius:11, background:on?'var(--accent)':'var(--surface-2)', color:on?'#fff':'var(--text-2)', display:'grid', placeItems:'center'}}>
                      <Icon name={o.icon} size={19} /></div>
                    <div style={{width:20, height:20, borderRadius:'50%', border:'2px solid '+(on?'var(--accent)':'var(--border-2)'), display:'grid', placeItems:'center'}}>
                      {on&&<div style={{width:10, height:10, borderRadius:'50%', background:'var(--accent)'}} />}</div>
                  </div>
                  <div style={{fontWeight:700, fontSize:15.5, marginBottom:4}}>{o.title}</div>
                  <div className="muted" style={{fontSize:13, lineHeight:1.5}}>{o.body}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Context sources */}
        <div className="card card-pad" style={{borderRadius:18, marginBottom:24}}>
          <SectionLabel n="3" title="Context sources" hint="The more you add, the sharper it gets." />
          <div className="row wrap" style={{gap:8, margin:'18px 0 14px'}}>
            {SOURCE_TYPES.map(s=>(
              <button key={s.type} className={'chip'+(activeType===s.type?' is-on':'')} onClick={()=>{setActiveType(s.type);setSrcInput('');}}>
                <Icon name={s.icon} size={15} />{s.label}
              </button>
            ))}
          </div>
          <div className="row center" style={{gap:10}}>
            {activeType==='doc' ? (
              <div className="row center grow" style={{gap:10, border:'1.5px dashed var(--border-2)', borderRadius:12, padding:'14px 16px', justifyContent:'center', color:'var(--text-2)'}}>
                <Icon name="download" size={18} /><span style={{fontSize:13.5}}>Drag a file here, or click to browse</span>
              </div>
            ) : (
              <input className="input" placeholder={meta.ph} value={srcInput} onChange={e=>setSrcInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addSource()} style={{flex:1}} />
            )}
            <Btn variant="primary" icon="plus" onClick={addSource}>Add</Btn>
          </div>

          {sources.length>0 && (
            <div className="col" style={{gap:8, marginTop:16}}>
              {sources.map((s,i)=>{
                const sm=SOURCE_META[s.type]||SOURCE_META.text;
                return (
                  <div key={i} className="row center between" style={{padding:'10px 12px', borderRadius:11, background:'var(--surface-2)'}}>
                    <div className="row center" style={{gap:11, minWidth:0}}>
                      <div style={{width:30, height:30, borderRadius:8, background:sm.tile, color:sm.color, display:'grid', placeItems:'center', flex:'none'}}>
                        <Icon name={sm.icon} size={15} /></div>
                      <div style={{minWidth:0}}>
                        <div style={{fontSize:13.5, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{s.label}</div>
                        <div className="faint" style={{fontSize:11.5}}>{sm.label} · {s.meta}</div>
                      </div>
                    </div>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={()=>setSources(sources.filter((_,j)=>j!==i))}><Icon name="x" size={15} /></button>
                  </div>
                );
              })}
            </div>
          )}
          {sources.length===0 && <p className="faint" style={{fontSize:13, marginTop:14, textAlign:'center'}}>No sources yet — add a few above. You can always add more later.</p>}
        </div>

        {/* footer actions */}
        <div className="row between center" style={{position:'sticky', bottom:0, background:'color-mix(in oklab,var(--bg) 88%,transparent)', backdropFilter:'blur(8px)', padding:'14px 0', borderTop:'1px solid var(--border)'}}>
          <span className="muted" style={{fontSize:13}}>{sources.length} source{sources.length!==1?'s':''} · {voice} mode</span>
          <div className="row center" style={{gap:10}}>
            <Btn variant="ghost" onClick={()=>app.nav('agents')}>Cancel</Btn>
            <Btn variant="primary" size="lg" icon="sparkle" disabled={!canCreate} onClick={create} style={{opacity:canCreate?1:.5}}>Create agent</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({n, title, hint}){
  return (
    <div className="row center" style={{gap:11}}>
      <span style={{width:26, height:26, borderRadius:8, background:'var(--accent-t)', color:'var(--accent-d)', display:'grid', placeItems:'center', fontWeight:700, fontSize:13, fontFamily:'var(--font-display)'}}>{n}</span>
      <span style={{fontWeight:700, fontSize:16}}>{title}</span>
      {hint && <span className="faint" style={{fontSize:12.5}}>· {hint}</span>}
    </div>
  );
}

Object.assign(window, { AgentsPage, CreateAgent });
