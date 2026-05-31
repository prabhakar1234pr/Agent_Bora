/* landing.jsx — minimal, visual-first marketing landing for Agent Bora */

function LandingNav({onNav}){
  return (
    <div style={{position:'sticky', top:0, zIndex:50, background:'color-mix(in oklab, var(--bg) 80%, transparent)',
      backdropFilter:'blur(14px)', borderBottom:'1px solid var(--border)'}}>
      <div style={{maxWidth:1120, margin:'0 auto', padding:'0 28px', height:66}} className="row between">
        <Logo size={26} />
        <div className="row center" style={{gap:8}}>
          <Btn variant="ghost" onClick={()=>onNav('login')}>Log in</Btn>
          <Btn variant="primary" onClick={()=>onNav('signup')}>Get started</Btn>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Hero product visual ---------------- */
function HeroVisual(){
  return (
    <div style={{position:'relative', width:'100%', maxWidth:560, margin:'0 auto'}}>
      <div style={{position:'absolute', inset:'-14% -10%', background:'radial-gradient(55% 50% at 50% 28%, color-mix(in oklab,var(--accent) 20%,transparent), transparent 72%)', filter:'blur(10px)', zIndex:0}} />

      <div className="card" style={{position:'relative', zIndex:1, borderRadius:24, overflow:'hidden', boxShadow:'var(--shadow-lg)'}}>
        <div className="row between" style={{padding:'13px 17px', borderBottom:'1px solid var(--border)'}}>
          <div className="row center" style={{gap:9}}>
            <BrandLogo id="meet" size={22} />
            <span style={{fontSize:12.5, fontWeight:600, color:'var(--text-2)'}}>Weekly Sync</span>
          </div>
          <span className="badge" style={{background:'#FDECEC', color:'#D6453F'}}>
            <span className="dot pulse" style={{background:'#D6453F'}} />REC
          </span>
        </div>

        <div style={{padding:14, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:9, background:'var(--surface-2)'}}>
          {['Dev','Lena','Priya'].map((n,i)=>(
            <div key={i} style={{aspectRatio:'4/3', borderRadius:11, background:`linear-gradient(150deg, ${['#64748b','#475569','#334155'][i]}, #1e293b)`,
              position:'relative', display:'grid', placeItems:'center'}}>
              <div className="avatar" style={{width:34, height:34, fontSize:13, background:'rgba(255,255,255,.14)'}}>{n[0]}</div>
              <span style={{position:'absolute', left:8, bottom:6, fontSize:10.5, fontWeight:600, color:'#fff', opacity:.92}}>{n}</span>
            </div>
          ))}
        </div>

        <div style={{padding:'4px 14px 15px'}}>
          <div style={{borderRadius:14, border:'1.5px solid var(--accent-ring)', background:'var(--accent-t)', padding:14}}>
            <div className="row center between">
              <div className="row center" style={{gap:11}}>
                <AgentAvatar name="Atlas" size={40} listening />
                <div>
                  <div className="row center" style={{gap:7}}>
                    <span style={{fontWeight:700, fontSize:14.5}}>Atlas</span>
                    <span className="badge badge-accent" style={{height:19}}>AI agent</span>
                  </div>
                  <span style={{fontSize:11.5, color:'var(--accent-d)', fontWeight:600}}>speaking</span>
                </div>
              </div>
              <Wave size={24} bars={6} big />
            </div>
            <p style={{marginTop:11, fontSize:13.5, lineHeight:1.5, color:'var(--accent-ink)'}}>
              “Editor and mobile share the same two engineers — want me to sequence them?”
            </p>
          </div>
        </div>
      </div>

      <div className="card fade-in" style={{position:'absolute', right:-30, bottom:-34, zIndex:2, width:210, padding:14, borderRadius:16, boxShadow:'var(--shadow-lg)'}}>
        <div className="row center" style={{gap:8, marginBottom:9}}>
          <div style={{width:24, height:24, borderRadius:7, background:'var(--accent)', display:'grid', placeItems:'center'}}>
            <Icon name="check" size={14} style={{color:'#fff'}} stroke={2.6} />
          </div>
          <span style={{fontWeight:700, fontSize:12.5}}>Brief ready</span>
        </div>
        <div className="col" style={{gap:7}}>
          {['4 action items','Decision logged','Transcript + recording'].map((t,i)=>(
            <div key={i} className="row" style={{gap:7, fontSize:11.5, color:'var(--text-2)'}}>
              <Icon name="check" size={12} style={{color:'var(--accent-d)', marginTop:1}} stroke={2.6} />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Hero({onNav}){
  return (
    <div style={{maxWidth:1120, margin:'0 auto', padding:'78px 28px 104px', textAlign:'center'}}>
      <span className="badge badge-accent" style={{height:28, padding:'0 12px', marginBottom:26}}>
        <Icon name="sparkle" size={13} /> Meeting agents with real context
      </span>
      <h1 style={{fontSize:'clamp(40px,6.4vw,72px)', lineHeight:.98, letterSpacing:'-.04em', maxWidth:820, margin:'0 auto'}}>
        Send an agent<br/>to the meeting.
      </h1>
      <p style={{marginTop:22, fontSize:19, lineHeight:1.5, color:'var(--text-2)', maxWidth:440, margin:'22px auto 0'}}>
        It knows your work, joins the call, and hands you the brief.
      </p>
      <div className="row center" style={{gap:12, marginTop:32, justifyContent:'center'}}>
        <Btn variant="primary" size="lg" iconRight="arrowR" onClick={()=>onNav('signup')}>Start free</Btn>
        <Btn variant="secondary" size="lg" icon="play" onClick={()=>onNav('login')}>See a brief</Btn>
      </div>
      <div style={{marginTop:72}}>
        <HeroVisual />
      </div>
    </div>
  );
}

/* ---------------- Integration logos ---------------- */
function IntegrationStrip(){
  const ids=['gmail','calendar','notion','asana','slack','github','drive','linear'];
  return (
    <div style={{background:'var(--surface)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)'}}>
      <div style={{maxWidth:1120, margin:'0 auto', padding:'58px 28px', textAlign:'center'}}>
        <p style={{fontSize:13, fontWeight:600, color:'var(--text-3)', letterSpacing:'.06em', textTransform:'uppercase', marginBottom:34}}>
          Plugged into your stack
        </p>
        <div className="row center wrap" style={{gap:20, justifyContent:'center'}}>
          {ids.map(id=>(
            <div key={id} title={INTEGRATIONS[id].label} className="logo-pop">
              <BrandLogo id={id} size={58} radius={16} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- How it works ---------------- */
function Steps(){
  const steps=[
    {n:'01', icon:'brain', title:'Feed it context', body:'Docs, repos, sites.'},
    {n:'02', icon:'mic', title:'Call it in', body:'Drop a Meet or Teams link.'},
    {n:'03', icon:'doc', title:'Get the brief', body:'Summary, transcript, actions.'},
  ];
  return (
    <div style={{maxWidth:1120, margin:'0 auto', padding:'96px 28px'}}>
      <div style={{textAlign:'center', marginBottom:60}}>
        <h2 style={{fontSize:'clamp(30px,4vw,44px)', letterSpacing:'-.035em'}}>Three steps. One brief.</h2>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:0, position:'relative'}}>
        {steps.map((s,i)=>(
          <div key={s.n} style={{textAlign:'center', padding:'0 28px', position:'relative'}}>
            {i>0 && <div style={{position:'absolute', left:0, top:33, width:1, height:34, background:'var(--border)'}} />}
            <div style={{width:66, height:66, borderRadius:20, background:'var(--accent-t)', color:'var(--accent-d)',
              display:'grid', placeItems:'center', margin:'0 auto 22px'}}>
              <Icon name={s.icon} size={30} stroke={1.8} />
            </div>
            <span className="mono" style={{fontSize:12, color:'var(--text-3)', fontWeight:600, letterSpacing:'.1em'}}>{s.n}</span>
            <h3 style={{fontSize:21, margin:'8px 0 6px'}}>{s.title}</h3>
            <p className="muted" style={{fontSize:15}}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Bold visual feature moment ---------------- */
function ProactiveShowcase(){
  return (
    <div style={{background:'var(--surface)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)'}}>
      <div style={{maxWidth:1120, margin:'0 auto', padding:'96px 28px', display:'grid',
        gridTemplateColumns:'1fr 1fr', gap:72, alignItems:'center'}}>
        <div>
          <span className="badge badge-muted" style={{marginBottom:18}}>Proactive</span>
          <h2 style={{fontSize:'clamp(30px,3.6vw,42px)', letterSpacing:'-.035em', marginBottom:18}}>
            It speaks up<br/>when it matters.
          </h2>
          <p className="muted" style={{fontSize:17, lineHeight:1.55, maxWidth:380}}>
            Not a note-taker. Your agent flags the risk, names the owner, catches the decision nobody made.
          </p>
        </div>
        <div className="col" style={{gap:14}}>
          <div className="card" style={{padding:16, borderRadius:16, borderColor:'var(--accent-ring)', background:'var(--accent-t)'}}>
            <div className="row center" style={{gap:11, marginBottom:10}}>
              <AgentAvatar name="Atlas" size={34} listening />
              <span style={{fontWeight:700, fontSize:14}}>Atlas flagged a conflict</span>
            </div>
            <p style={{fontSize:14.5, lineHeight:1.5, color:'var(--accent-ink)'}}>
              “We just committed two teams to the same sprint. Should I reassign?”
            </p>
          </div>
          <div className="row" style={{gap:14}}>
            {[['listCheck','Owners assigned'],['layers','Full recall'],['plug','Pushes to your tools']].map(([ic,t])=>(
              <div key={t} className="card row center" style={{flex:1, padding:'14px', borderRadius:14, gap:10, flexDirection:'column', textAlign:'center'}}>
                <div style={{width:38, height:38, borderRadius:11, background:'var(--accent-t)', color:'var(--accent-d)', display:'grid', placeItems:'center'}}>
                  <Icon name={ic} size={19} stroke={1.9} />
                </div>
                <span style={{fontSize:12.5, fontWeight:600, color:'var(--text-2)'}}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CTABand({onNav}){
  return (
    <div style={{maxWidth:1120, margin:'0 auto', padding:'104px 28px'}}>
      <div style={{borderRadius:28, padding:'80px 48px', position:'relative', overflow:'hidden',
        background:'linear-gradient(135deg, #0E1714 0%, #123127 100%)', textAlign:'center'}}>
        <div style={{position:'absolute', inset:0, background:'radial-gradient(50% 90% at 50% 0%, color-mix(in oklab,var(--accent) 32%,transparent), transparent 70%)'}} />
        <div style={{position:'relative'}}>
          <h2 style={{fontSize:'clamp(32px,4.4vw,48px)', color:'#fff', letterSpacing:'-.035em', marginBottom:28}}>
            Your next meeting<br/>can run itself.
          </h2>
          <Btn variant="primary" size="lg" iconRight="arrowR" onClick={()=>onNav('signup')}>Start free</Btn>
        </div>
      </div>
    </div>
  );
}

function Footer(){
  return (
    <div style={{borderTop:'1px solid var(--border)', background:'var(--surface)'}}>
      <div style={{maxWidth:1120, margin:'0 auto', padding:'30px 28px'}} className="row between">
        <Logo size={22} />
        <span className="muted" style={{fontSize:13}}>© 2026 Agent Bora</span>
      </div>
    </div>
  );
}

function Landing({onNav}){
  return (
    <div className="app-scroll fade-in">
      <LandingNav onNav={onNav} />
      <Hero onNav={onNav} />
      <IntegrationStrip />
      <Steps />
      <ProactiveShowcase />
      <CTABand onNav={onNav} />
      <Footer />
    </div>
  );
}

Object.assign(window, { Landing });
