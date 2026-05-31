/* auth.jsx — login & signup split screen */
const { useState } = React;

function AuthAside(){
  return (
    <div style={{position:'relative', overflow:'hidden', background:'linear-gradient(160deg, #0E1714 0%, #103026 60%, #0c241c 100%)',
      padding:'48px 46px', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
      <div style={{position:'absolute', inset:0, background:'radial-gradient(55% 45% at 80% 12%, color-mix(in oklab,var(--accent) 28%,transparent), transparent 70%)'}} />
      <div style={{position:'relative'}}>
        <Logo size={28} color="#fff" />
      </div>

      <div style={{position:'relative'}}>
        {/* mini live-agent card */}
        <div style={{borderRadius:18, border:'1px solid rgba(255,255,255,.14)', background:'rgba(255,255,255,.06)', backdropFilter:'blur(8px)', padding:18, maxWidth:330}}>
          <div className="row center between">
            <div className="row center" style={{gap:11}}>
              <AgentAvatar name="Atlas" size={40} listening />
              <div>
                <div style={{fontWeight:700, fontSize:14.5, color:'#fff'}}>Atlas</div>
                <div style={{fontSize:12, color:'var(--accent-ring)', fontWeight:600}}>Listening · Northwind Sync</div>
              </div>
            </div>
            <Wave size={24} bars={5} color="var(--accent-ring)" big />
          </div>
          <p style={{marginTop:13, fontSize:13.5, lineHeight:1.55, color:'rgba(255,255,255,.82)'}}>
            “That’s the second time comment-resolution has come up with no owner. Want me to assign it?”
          </p>
        </div>
        <h2 style={{color:'#fff', fontSize:30, letterSpacing:'-.03em', marginTop:34, lineHeight:1.12}}>
          The teammate who<br/>read every doc.
        </h2>
        <p style={{color:'rgba(255,255,255,.66)', fontSize:15.5, lineHeight:1.6, marginTop:14, maxWidth:360}}>
          Give an agent your context once. It shows up to every meeting already knowing the work.
        </p>
      </div>

      <div style={{position:'relative'}} className="row center" >
        <div className="row center" style={{gap:-8}}>
          {['#64748b','#475569','#0ea5e9'].map((c,i)=>(
            <div key={i} className="avatar" style={{width:30, height:30, fontSize:11, background:c, border:'2px solid #103026', marginLeft:i?-8:0}}>{['D','L','P'][i]}</div>
          ))}
        </div>
        <span style={{color:'rgba(255,255,255,.6)', fontSize:13, marginLeft:12}}>Trusted across 600+ teams</span>
      </div>
    </div>
  );
}

function Field({label, type='text', placeholder, value, onChange, icon, autoFocus}){
  return (
    <div className="field">
      <span className="label">{label}</span>
      <div style={{position:'relative'}}>
        {icon && <Icon name={icon} size={17} style={{position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)'}} />}
        <input className="input" type={type} placeholder={placeholder} value={value} autoFocus={autoFocus}
          onChange={e=>onChange&&onChange(e.target.value)} style={{paddingLeft:icon?38:13}} />
      </div>
    </div>
  );
}

function Auth({mode='login', onNav, onAuth}){
  const isSignup = mode==='signup';
  const [name,setName]=useState('');
  const [email,setEmail]=useState(isSignup?'':'mira@northwind.io');
  const [pw,setPw]=useState(isSignup?'':'••••••••••');

  const submit=()=>onAuth(isSignup);

  return (
    <div className="app-scroll fade-in" style={{display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:'100vh'}}>
      <div style={{display:'grid'}}><AuthAside /></div>

      <div style={{display:'flex', flexDirection:'column', padding:'28px 0'}}>
        <div className="row between" style={{padding:'0 44px'}}>
          <button className="btn btn-ghost btn-sm" onClick={()=>onNav('landing')}><Icon name="chevL" size={15} /> Back</button>
          <span style={{fontSize:13.5, color:'var(--text-2)'}}>
            {isSignup?'Already have an account?':'New to Agent Bora?'}{' '}
            <a href="#" onClick={e=>{e.preventDefault();onNav(isSignup?'login':'signup');}} style={{color:'var(--accent-d)', fontWeight:700}}>
              {isSignup?'Log in':'Sign up'}
            </a>
          </span>
        </div>

        <div style={{flex:1, display:'grid', placeItems:'center', padding:'24px'}}>
          <div style={{width:'100%', maxWidth:380}}>
            <h1 style={{fontSize:32, letterSpacing:'-.03em', marginBottom:8}}>{isSignup?'Create your account':'Welcome back'}</h1>
            <p className="muted" style={{fontSize:15, marginBottom:28}}>
              {isSignup?'Build your first agent in under two minutes.':'Pick up right where your agents left off.'}
            </p>

            <div className="col" style={{gap:16}}>
              {isSignup && <Field label="Full name" placeholder="Jordan Rivera" value={name} onChange={setName} icon="user" autoFocus />}
              <Field label="Work email" type="email" placeholder="you@company.com" value={email} onChange={setEmail} icon="mail" autoFocus={!isSignup} />
              <Field label="Password" type="password" placeholder="••••••••" value={pw} onChange={setPw} icon="lock" />
              {!isSignup && <a href="#" onClick={e=>e.preventDefault()} style={{fontSize:13, color:'var(--accent-d)', fontWeight:600, marginTop:-6, alignSelf:'flex-end'}}>Forgot password?</a>}

              <Btn variant="primary" block size="lg" iconRight="arrowR" onClick={submit} style={{marginTop:4}}>
                {isSignup?'Create account':'Log in'}
              </Btn>
            </div>

            <div className="row center" style={{gap:14, margin:'22px 0'}}>
              <div className="grow hairline" /><span className="faint" style={{fontSize:12.5}}>or</span><div className="grow hairline" />
            </div>

            <div className="col" style={{gap:10}}>
              <button className="btn btn-secondary btn-block" onClick={submit} style={{height:46}}>
                <div style={{width:18, height:18, borderRadius:5, background:'#fff', border:'1px solid var(--border-2)', display:'grid', placeItems:'center'}}>
                  <span style={{fontSize:12, fontWeight:800, color:'#4285F4'}}>G</span></div>
                Continue with Google
              </button>
              <button className="btn btn-secondary btn-block" onClick={submit} style={{height:46}}>
                <div style={{width:18, height:18, borderRadius:5, background:'#5059C9', display:'grid', placeItems:'center'}}>
                  <Icon name="video" size={11} style={{color:'#fff'}} /></div>
                Continue with Microsoft
              </button>
            </div>

            {!isSignup && (
              <div className="row center" style={{gap:8, marginTop:22, padding:'10px 12px', background:'var(--accent-t)', borderRadius:10}}>
                <Icon name="sparkle" size={15} style={{color:'var(--accent-d)'}} />
                <span style={{fontSize:12.5, color:'var(--accent-ink)'}}>Demo account is pre-filled — just hit <b>Log in</b> to explore a loaded workspace.</span>
              </div>
            )}
            <p className="faint" style={{fontSize:11.5, textAlign:'center', marginTop:22, lineHeight:1.5}}>
              By continuing you agree to the Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Auth });
