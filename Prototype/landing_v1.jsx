/* landing.jsx — marketing landing page */

function LandingNav({onNav}){
  return (
    <div style={{position:'sticky', top:0, zIndex:50, background:'color-mix(in oklab, var(--bg) 82%, transparent)',
      backdropFilter:'blur(12px)', borderBottom:'1px solid var(--border)'}}>
      <div style={{maxWidth:1180, margin:'0 auto', padding:'0 28px', height:68}} className="row between">
        <div className="row center" style={{gap:36}}>
          <Logo size={26} />
          <div className="row center" style={{gap:4}}>
            {['Product','How it works','Integrations'].map(l=>(
              <a key={l} href="#" onClick={e=>e.preventDefault()} style={{fontSize:14, fontWeight:500, color:'var(--text-2)', padding:'8px 12px', borderRadius:8}}>{l}</a>
            ))}
          </div>
        </div>
        <div className="row center" style={{gap:10}}>
          <Btn variant="ghost" onClick={()=>onNav('login')}>Log in</Btn>
          <Btn variant="primary" iconRight="arrowR" onClick={()=>onNav('signup')}>Get started</Btn>
        </div>
      </div>
    </div>
  );
}

function HeroVisual(){
  return (
    <div style={{position:'relative', width:'100%'}}>
      {/* glow */}
      <div style={{position:'absolute', inset:'-8% -6%', background:'radial-gradient(60% 55% at 70% 30%, color-mix(in oklab,var(--accent) 22%,transparent), transparent 70%)', filter:'blur(8px)', zIndex:0}} />

      {/* meeting frame */}
      <div className="card" style={{position:'relative', zIndex:1, borderRadius:22, overflow:'hidden', boxShadow:'var(--shadow-lg)'}}>
        <div className="row between" style={{padding:'12px 16px', borderBottom:'1px solid var(--border)', background:'var(--surface)'}}>
          <div className="row center" style={{gap:9}}>
            <Icon name="video" size={16} style={{color:'var(--text-3)'}} />
            <span style={{fontSize:12.5, fontWeight:600, color:'var(--text-2)'}}>Northwind · Weekly Sync</span>
          </div>
          <span className="badge" style={{background:'#FDECEC', color:'#D6453F'}}>
            <span className="dot pulse" style={{background:'#D6453F'}} />REC 24:18
          </span>
        </div>

        {/* participant strip */}
        <div style={{padding:14, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, background:'var(--surface-2)'}}>
          {['Dev R.','Lena C.','Priya N.'].map((n,i)=>(
            <div key={i} style={{aspectRatio:'4/3', borderRadius:12, background:`linear-gradient(150deg, ${['#64748b','#475569','#334155'][i]}, #1e293b)`,
              position:'relative', display:'grid', placeItems:'center'}}>
              <div className="avatar" style={{width:38, height:38, fontSize:14, background:'rgba(255,255,255,.14)', backdropFilter:'blur(4px)'}}>{n[0]}</div>
              <span style={{position:'absolute', left:8, bottom:7, fontSize:11, fontWeight:600, color:'#fff', opacity:.92}}>{n}</span>
            </div>
          ))}
        </div>

        {/* agent tile + caption */}
        <div style={{padding:'4px 14px 16px'}}>
          <div style={{borderRadius:14, border:'1.5px solid var(--accent-ring)', background:'var(--accent-t)', padding:14}}>
            <div className="row center between">
              <div className="row center" style={{gap:11}}>
                <AgentAvatar name="Atlas" size={42} listening />
                <div>
                  <div className="row center" style={{gap:8}}>
                    <span style={{fontWeight:700, fontSize:15}}>Atlas</span>
                    <span className="badge badge-accent" style={{height:20}}>AI agent</span>
                  </div>
                  <span style={{fontSize:12, color:'var(--accent-d)', fontWeight:600}}>Proactive · speaking</span>
                </div>
              </div>
              <Wave size={26} bars={6} big />
            </div>
            <p style={{marginTop:11, fontSize:13.5, lineHeight:1.55, color:'var(--accent-ink)', maxWidth:300}}>
              “Quick flag — the editor and mobile beta share the same two engineers. Want me to sequence them?”
            </p>
          </div>
        </div>
      </div>

      {/* floating brief card */}
      <div className="card fade-in" style={{position:'absolute', right:-38, bottom:-42, zIndex:2, width:222, padding:14, borderRadius:16, boxShadow:'var(--shadow-lg)'}}>
        <div className="row center" style={{gap:8, marginBottom:9}}>
          <div style={{width:26, height:26, borderRadius:8, background:'var(--accent)', display:'grid', placeItems:'center'}}>
            <Icon name="check" size={15} style={{color:'#fff'}} stroke={2.6} />
          </div>
          <span style={{fontWeight:700, fontSize:13}}>Brief ready</span>
        </div>
        <div className="col" style={{gap:7}}>
          {['4 action items, owners assigned','Decision: mobile after editor','Full transcript + recording'].map((t,i)=>(
            <div key={i} className="row" style={{gap:7, fontSize:11.5, color:'var(--text-2)'}}>
              <Icon name="check" size={13} style={{color:'var(--accent-d)', marginTop:1}} stroke={2.6} />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* floating context chip */}
      <div className="card" style={{position:'absolute', left:-34, top:54, zIndex:2, padding:'9px 13px', borderRadius:12, boxShadow:'var(--shadow-lg)', whiteSpace:'nowrap'}}>
        <div className="row center" style={{gap:8}}>
          <Icon name="brain" size={16} style={{color:'var(--accent-d)'}} />
          <span style={{fontSize:12, fontWeight:600}}>Knows your roadmap</span>
        </div>
      </div>
    </div>
  );
}

function Hero({onNav}){
  return (
    <div style={{maxWidth:1180, margin:'0 auto', padding:'72px 28px 96px'}}>
      <div style={{display:'grid', gridTemplateColumns:'1.05fr .95fr', gap:64, alignItems:'center'}}>
        <div>
          <div className="row center" style={{gap:8, marginBottom:22}}>
            <span className="badge badge-accent" style={{height:28, padding:'0 11px'}}>
              <Icon name="sparkle" size={13} /> Meeting agents with real context
            </span>
          </div>
          <h1 style={{fontSize:58, lineHeight:1.02, letterSpacing:'-.035em'}}>
            Send an agent to the meeting.<br/>
            <span style={{color:'var(--accent-d)'}}>Walk away with the brief.</span>
          </h1>
          <p style={{marginTop:22, fontSize:18.5, lineHeight:1.55, color:'var(--text-2)', maxWidth:520}}>
            Agent Bora builds AI agents that know your docs, code, and customers — then joins your Meet and Teams calls to take notes, speak up, and hand you a complete brief the second it ends.
          </p>
          <div className="row center" style={{gap:12, marginTop:30}}>
            <Btn variant="primary" size="lg" iconRight="arrowR" onClick={()=>onNav('signup')}>Start free</Btn>
            <Btn variant="secondary" size="lg" icon="play" onClick={()=>onNav('login')}>See a live brief</Btn>
          </div>
          <div className="row center" style={{gap:18, marginTop:34}}>
            <span style={{fontSize:13, fontWeight:600, color:'var(--text-3)'}}>Drops into</span>
            <div className="row center" style={{gap:14}}>
              <div className="row center" style={{gap:7}}>
                <IntegrationTile id="calendar" size={26} />
                <span style={{fontSize:13.5, fontWeight:600, color:'var(--text-2)'}}>Google Meet</span>
              </div>
              <span style={{color:'var(--border-2)'}}>·</span>
              <div className="row center" style={{gap:7}}>
                <div style={{width:26, height:26, borderRadius:7, background:'#EBEEFB', color:'#5059C9', display:'grid', placeItems:'center'}}>
                  <Icon name="video" size={14} /></div>
                <span style={{fontSize:13.5, fontWeight:600, color:'var(--text-2)'}}>Microsoft Teams</span>
              </div>
            </div>
          </div>
        </div>
        <HeroVisual />
      </div>
    </div>
  );
}

function StepCards(){
  const steps=[
    {n:'01', icon:'brain', title:'Feed it context', body:'Drop in URLs, docs, PDFs, GitHub repos, and Notion pages. Your agent reads everything so it walks into the room already up to speed.'},
    {n:'02', icon:'mic', title:'Call it into the meeting', body:'Paste a Meet or Teams link and pick a mode — proactive to speak up, or passive to listen quietly. It joins as its own participant.'},
    {n:'03', icon:'doc', title:'Get the brief', body:'The moment the call ends you get an AI summary, recording, audio, full transcript, and action items with owners — plus a chat to act on it.'},
  ];
  return (
    <div style={{background:'var(--surface)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)'}}>
      <div style={{maxWidth:1180, margin:'0 auto', padding:'84px 28px'}}>
        <div style={{textAlign:'center', marginBottom:52}}>
          <span className="badge badge-muted" style={{marginBottom:14}}>How it works</span>
          <h2 style={{fontSize:40, letterSpacing:'-.03em'}}>Three steps. One sharp brief.</h2>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:22}}>
          {steps.map(s=>(
            <div key={s.n} className="card card-pad" style={{borderRadius:18, position:'relative'}}>
              <div className="row between center" style={{marginBottom:18}}>
                <div style={{width:46, height:46, borderRadius:13, background:'var(--accent-t)', color:'var(--accent-d)', display:'grid', placeItems:'center'}}>
                  <Icon name={s.icon} size={23} stroke={1.9} />
                </div>
                <span className="mono" style={{fontSize:13, color:'var(--text-3)', fontWeight:600}}>{s.n}</span>
              </div>
              <h3 style={{fontSize:20, marginBottom:8}}>{s.title}</h3>
              <p className="muted" style={{fontSize:14.5, lineHeight:1.6}}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureGrid(){
  const feats=[
    {icon:'mic', title:'Speaks up when it matters', body:'In proactive mode your agent interjects with the flag, the missing owner, or the decision nobody made — then logs it.'},
    {icon:'layers', title:'Total recall', body:'Recording, audio, and a speaker-labeled transcript for every call. Search across all of them in one place.'},
    {icon:'listCheck', title:'Action items with owners', body:'Every commitment is captured with an owner and a due date. Push them straight to Asana, Linear, or Notion.'},
    {icon:'plug', title:'Wired into your stack', body:'Connect Gmail, Calendar, Notion, Asana and more. Ask your agent to draft the follow-up or file the task.'},
    {icon:'brain', title:'Context that compounds', body:'Each meeting makes the next one sharper. Your agent remembers decisions, threads, and who owns what.'},
    {icon:'shield', title:'Quiet by default', body:'Passive mode keeps the agent listening, never speaking. You control exactly when and where it has a voice.'},
  ];
  return (
    <div style={{maxWidth:1180, margin:'0 auto', padding:'90px 28px'}}>
      <div style={{maxWidth:560, marginBottom:48}}>
        <span className="badge badge-muted" style={{marginBottom:14}}>Why Agent Bora</span>
        <h2 style={{fontSize:40, letterSpacing:'-.03em', marginBottom:14}}>An agent that earns its seat.</h2>
        <p className="muted" style={{fontSize:17, lineHeight:1.6}}>Note-takers transcribe. Agent Bora understands the room — because it already knows your work.</p>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20}}>
        {feats.map(f=>(
          <div key={f.title} style={{padding:'4px 4px 4px 0'}}>
            <div style={{width:42, height:42, borderRadius:12, background:'var(--accent-t)', color:'var(--accent-d)', display:'grid', placeItems:'center', marginBottom:15}}>
              <Icon name={f.icon} size={21} stroke={1.9} />
            </div>
            <h3 style={{fontSize:18, marginBottom:7}}>{f.title}</h3>
            <p className="muted" style={{fontSize:14, lineHeight:1.6}}>{f.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function IntegrationStrip(){
  const ids=['gmail','calendar','notion','asana','slack','github','drive','linear'];
  return (
    <div style={{background:'var(--surface)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)'}}>
      <div style={{maxWidth:1180, margin:'0 auto', padding:'64px 28px', textAlign:'center'}}>
        <h3 style={{fontSize:15, fontWeight:600, color:'var(--text-3)', letterSpacing:'.04em', textTransform:'uppercase', marginBottom:30}}>
          Connect your agent to the tools you already use
        </h3>
        <div className="row center wrap" style={{gap:14, justifyContent:'center'}}>
          {ids.map(id=>(
            <div key={id} className="card row center" style={{padding:'10px 16px', borderRadius:13, gap:11}}>
              <IntegrationTile id={id} size={30} />
              <span style={{fontSize:14.5, fontWeight:600}}>{INTEGRATIONS[id].label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CTABand({onNav}){
  return (
    <div style={{maxWidth:1180, margin:'0 auto', padding:'90px 28px'}}>
      <div style={{borderRadius:28, padding:'64px 48px', position:'relative', overflow:'hidden',
        background:'linear-gradient(135deg, #0E1714 0%, #123127 100%)', textAlign:'center'}}>
        <div style={{position:'absolute', inset:0, background:'radial-gradient(50% 80% at 50% 0%, color-mix(in oklab,var(--accent) 30%,transparent), transparent 70%)'}} />
        <div style={{position:'relative'}}>
          <h2 style={{fontSize:44, color:'#fff', letterSpacing:'-.03em', marginBottom:16}}>Your next meeting can run itself.</h2>
          <p style={{fontSize:18, color:'rgba(255,255,255,.7)', maxWidth:480, margin:'0 auto 30px', lineHeight:1.55}}>
            Build your first agent in two minutes. Call it into a real meeting today.
          </p>
          <div className="row center" style={{gap:12, justifyContent:'center'}}>
            <Btn variant="primary" size="lg" iconRight="arrowR" onClick={()=>onNav('signup')}>Start free</Btn>
            <button className="btn btn-lg" style={{background:'rgba(255,255,255,.1)', color:'#fff', border:'1px solid rgba(255,255,255,.18)'}} onClick={()=>onNav('login')}>Book a demo</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer(){
  const cols=[
    ['Product',['Overview','Agents','Integrations','Security','Pricing']],
    ['Company',['About','Careers','Blog','Contact']],
    ['Resources',['Docs','Changelog','Status','Privacy']],
  ];
  return (
    <div style={{borderTop:'1px solid var(--border)', background:'var(--surface)'}}>
      <div style={{maxWidth:1180, margin:'0 auto', padding:'56px 28px 40px', display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr 1fr', gap:32}}>
        <div>
          <Logo size={24} />
          <p className="muted" style={{fontSize:13.5, lineHeight:1.6, marginTop:14, maxWidth:240}}>
            AI agents that join your meetings, with the context to actually be useful.
          </p>
        </div>
        {cols.map(([h,items])=>(
          <div key={h}>
            <h4 style={{fontSize:13, fontFamily:'var(--font-body)', fontWeight:700, marginBottom:14}}>{h}</h4>
            <div className="col" style={{gap:10}}>
              {items.map(it=><a key={it} href="#" onClick={e=>e.preventDefault()} style={{fontSize:13.5, color:'var(--text-2)'}}>{it}</a>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{borderTop:'1px solid var(--border)'}}>
        <div style={{maxWidth:1180, margin:'0 auto', padding:'18px 28px'}} className="row between">
          <span className="muted" style={{fontSize:13}}>© 2026 Agent Bora, Inc.</span>
          <span className="muted" style={{fontSize:13}}>Made for people with too many meetings.</span>
        </div>
      </div>
    </div>
  );
}

function Landing({onNav}){
  return (
    <div className="app-scroll fade-in">
      <LandingNav onNav={onNav} />
      <Hero onNav={onNav} />
      <StepCards />
      <FeatureGrid />
      <IntegrationStrip />
      <CTABand onNav={onNav} />
      <Footer />
    </div>
  );
}

Object.assign(window, { Landing });
