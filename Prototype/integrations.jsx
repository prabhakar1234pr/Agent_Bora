/* integrations.jsx — connect tools to the agent */
const { useState } = React;

const INT_DETAIL = {
  gmail:{cat:'Communication', desc:'Draft and send follow-ups, pull email threads for context.', account:'mira@northwind.io'},
  calendar:{cat:'Communication', desc:'See upcoming meetings and auto-suggest which agent to send.', account:'mira@northwind.io'},
  slack:{cat:'Communication', desc:'Post recaps and action items to a channel after each call.', account:null},
  notion:{cat:'Knowledge', desc:'Read pages for context and write briefs back as new pages.', account:'Northwind workspace'},
  drive:{cat:'Knowledge', desc:'Pull docs and slides as living context for your agent.', account:null},
  github:{cat:'Engineering', desc:'Read repos and issues; reference code and PRs in meetings.', account:'northwind'},
  linear:{cat:'Work tracking', desc:'Turn action items into issues with owners and due dates.', account:null},
  asana:{cat:'Work tracking', desc:'Push captured action items straight into projects.', account:'Northwind · Product'},
};
const INT_ORDER=['gmail','calendar','slack','notion','drive','github','asana','linear'];

function IntegrationCard({id, connected, onToggle}){
  const m=INTEGRATIONS[id], d=INT_DETAIL[id];
  return (
    <div className="card" style={{borderRadius:16, padding:18, display:'flex', flexDirection:'column', gap:14,
      borderColor:connected?'var(--accent-ring)':'var(--border)'}}>
      <div className="row between" style={{alignItems:'flex-start'}}>
        <IntegrationTile id={id} size={46} />
        {connected
          ? <span className="badge badge-accent"><Icon name="check" size={12} stroke={2.6} />Connected</span>
          : <span className="badge badge-muted">{d.cat}</span>}
      </div>
      <div>
        <div style={{fontWeight:700, fontSize:15.5}}>{m.label}</div>
        <p className="muted" style={{fontSize:13, lineHeight:1.5, marginTop:5}}>{d.desc}</p>
      </div>
      <div className="row between center" style={{marginTop:'auto'}}>
        {connected
          ? <span className="row center" style={{gap:7, fontSize:12.5, color:'var(--text-2)', minWidth:0}}>
              <Icon name="user" size={13} /><span style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{d.account||'Connected'}</span></span>
          : <span className="faint" style={{fontSize:12.5}}>Not connected</span>}
        {connected
          ? <Btn variant="ghost" size="sm" className="btn-danger" onClick={()=>onToggle(id)}>Disconnect</Btn>
          : <Btn variant="primary" size="sm" icon="plug" onClick={()=>onToggle(id)}>Connect</Btn>}
      </div>
    </div>
  );
}

function Integrations({app}){
  const agent = app.agents.find(a=>a.id===app.currentAgentId) || app.agents[0];
  const [connected,setConnected]=useState(()=> new Set(app.connected));
  const toggle=(id)=>{
    setConnected(prev=>{
      const n=new Set(prev); n.has(id)?n.delete(id):n.add(id);
      app.setConnected([...n]);
      return n;
    });
  };
  const count=connected.size;

  return (
    <PageWrap
      title="Integrations"
      subtitle="Connect Agent Bora to the tools your team already lives in."
      back={()=>app.nav('agents')}
      actions={agent && <div className="row center" style={{gap:9, padding:'7px 12px 7px 8px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:11}}>
        <AgentAvatar name={agent.name} size={26} />
        <span style={{fontSize:13}}><span className="muted">For </span><b>{agent.name}</b></span>
      </div>}>

      <div className="card" style={{borderRadius:16, padding:'18px 22px', marginBottom:22, display:'flex', alignItems:'center', justifyContent:'space-between',
        background:'linear-gradient(120deg, var(--accent-t), var(--surface))'}}>
        <div className="row center" style={{gap:14}}>
          <div style={{width:44, height:44, borderRadius:12, background:'var(--accent)', color:'#fff', display:'grid', placeItems:'center'}}><Icon name="plug" size={22} /></div>
          <div>
            <div style={{fontWeight:700, fontSize:16}}>{count} of {INT_ORDER.length} tools connected</div>
            <div className="muted" style={{fontSize:13.5, marginTop:1}}>Connected tools let your agent act — not just talk.</div>
          </div>
        </div>
        <div className="row center" style={{gap:-8}}>
          {[...connected].slice(0,5).map((id,i)=>(
            <div key={id} style={{marginLeft:i?-8:0, border:'2px solid var(--surface)', borderRadius:11}}><IntegrationTile id={id} size={34} /></div>
          ))}
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16}}>
        {INT_ORDER.map(id=><IntegrationCard key={id} id={id} connected={connected.has(id)} onToggle={toggle} />)}
      </div>

      <div className="row center" style={{gap:10, marginTop:24, padding:'14px 18px', background:'var(--surface-2)', borderRadius:12}}>
        <Icon name="shield" size={18} style={{color:'var(--text-2)'}} />
        <span className="muted" style={{fontSize:13}}>Agent Bora requests the narrowest scopes it needs. You can revoke any connection at any time.</span>
      </div>
    </PageWrap>
  );
}

Object.assign(window, { Integrations });
