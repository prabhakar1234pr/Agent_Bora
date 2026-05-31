/* ui.jsx — shared design-system primitives for Agent Bora */
const { useState, useEffect, useRef, useMemo } = React;

/* ---------------- Icons (minimal line set) ---------------- */
const ICONS = {
  home:'M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1V9.5',
  agent:'M12 3v3M9 9h6a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3ZM9.5 14h.01M14.5 14h.01M4 13H3M21 13h-1',
  meetings:'M7 3v3M17 3v3M4 8h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z',
  mic:'M12 3a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3ZM5 11a7 7 0 0 0 14 0M12 18v3',
  plug:'M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0V8ZM12 17v4',
  mail:'M3 7l9 6 9-6M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z',
  link:'M9 15l6-6M10.5 6.5l1-1a4 4 0 0 1 6 6l-1 1M13.5 17.5l-1 1a4 4 0 0 1-6-6l1-1',
  github:'M9 19c-4 1.5-4-2-6-2.5m12 5v-3.5a3 3 0 0 0-.8-2.3c2.7-.3 5.5-1.3 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.7 11.7 0 0 0-6 0C6.9 3.7 5.9 4 5.9 4a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.5 10.4c0 4.6 2.8 5.7 5.5 6a3 3 0 0 0-.8 2.2V22',
  doc:'M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8l-4-5ZM14 3v5h4M9 13h6M9 17h4',
  check:'M5 12.5 10 17.5 19.5 7',
  checkCircle:'M9 12l2 2 4-4M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z',
  plus:'M12 5v14M5 12h14',
  search:'M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16ZM21 21l-4.3-4.3',
  logout:'M15 17l5-5-5-5M20 12H9M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5',
  chevR:'M9 6l6 6-6 6',
  chevL:'M15 6l-6 6 6 6',
  chevD:'M6 9l6 6 6-6',
  sparkle:'M12 3l1.6 4.8L18 9.4l-4.4 1.6L12 16l-1.6-5L6 9.4l4.4-1.6L12 3ZM19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z',
  play:'M7 4.5v15l13-7.5-13-7.5Z',
  pause:'M8 4h3v16H8zM13 4h3v16h-3z',
  download:'M12 3v12M7 11l5 5 5-5M5 21h14',
  clock:'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18ZM12 7v5l3 2',
  users:'M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM22 20v-1.5a4 4 0 0 0-3-3.8M16 4.3a3.5 3.5 0 0 1 0 6.8',
  arrowR:'M5 12h14M13 6l6 6-6 6',
  x:'M6 6l12 12M18 6 6 18',
  send:'M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z',
  list:'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
  listCheck:'M4 6l1.5 1.5L8 4M4 12l1.5 1.5L8 10M4 18l1.5 1.5L8 16M11 6h9M11 12h9M11 18h9',
  message:'M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12Z',
  globe:'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18ZM3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z',
  lock:'M6 10V8a6 6 0 0 1 12 0v2M5 10h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z',
  user:'M5 20v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  settings:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 13a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7 19.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 4 13a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 5.4 6.3L5.3 6.2a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 11 4V3.9a2 2 0 1 1 4 0V4a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.6 1.6 0 0 0 20 9h.1a2 2 0 1 1 0 4H20a1.6 1.6 0 0 0-1.4 1Z',
  bell:'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
  calendar:'M7 3v3M17 3v3M4 8h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z',
  video:'M15 10l5-3v10l-5-3M3 7a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Z',
  audio:'M11 5 6 9H3v6h3l5 4V5ZM16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12',
  bolt:'M13 2 4 14h7l-1 8 9-12h-7l1-8Z',
  shield:'M12 3l8 3v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z',
  layers:'M12 3 3 8l9 5 9-5-9-5ZM3 13l9 5 9-5M3 18l9 5 9-5',
  pin:'M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11ZM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  copy:'M9 9h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1ZM5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1',
  more:'M5 12h.01M12 12h.01M19 12h.01',
  trash:'M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13',
  filter:'M3 5h18l-7 8v6l-4-2v-4L3 5Z',
  zap:'M13 2 4 14h7l-1 8 9-12h-7l1-8Z',
  bookOpen:'M12 6.5C10.5 5 8 4.5 4 5v13c4-.5 6.5 0 8 1.5M12 6.5C13.5 5 16 4.5 20 5v13c-4-.5-6.5 0-8 1.5M12 6.5V20',
  brain:'M8.5 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8A3 3 0 0 0 8.5 18a2.5 2.5 0 0 0 3.5-2.3V6a2.5 2.5 0 0 0-3.5-2ZM15.5 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8A3 3 0 0 1 15.5 18a2.5 2.5 0 0 1-3.5-2.3',
  refresh:'M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5',
  rocket:'M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2M9 11a13 13 0 0 1 8-8c2 0 3 1 3 3a13 13 0 0 1-8 8l-3-3ZM9 11l-4 1 .5 2.5L7 15l1 .5 1.5 1.5 1-4M14 8.5a1.5 1.5 0 1 0 0 .01',
  eye:'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
};
function Icon({name, size=20, stroke=2, style, className}){
  const d = ICONS[name] || '';
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      style={{flex:'none', ...style}}>
      {d.split('M').filter(Boolean).map((seg,i)=><path key={i} d={'M'+seg} />)}
    </svg>
  );
}

/* ---------------- Logo ---------------- */
function Logo({size=26, withWord=true, color}){
  const s=size;
  return (
    <div className="row center" style={{gap:10}}>
      <div style={{width:s, height:s, borderRadius:s*0.32, position:'relative',
        background:'linear-gradient(145deg, var(--accent) 0%, color-mix(in oklab, var(--accent) 55%, #0ea5e9) 100%)',
        boxShadow:'inset 0 1px 1px rgba(255,255,255,.35), var(--shadow-sm)', display:'grid', placeItems:'center', flex:'none'}}>
        <span style={{fontFamily:'var(--font-display)', fontWeight:700, fontSize:s*0.46, color:'#fff', letterSpacing:'-.04em', lineHeight:1}}>AB</span>
      </div>
      {withWord && <span style={{fontFamily:'var(--font-display)', fontWeight:600, fontSize:s*0.72, letterSpacing:'-.02em', color:color||'var(--text)'}}>
        Agent<span style={{color:'var(--accent-d)'}}>Bora</span>
      </span>}
    </div>
  );
}

/* ---------------- Button ---------------- */
function Btn({children, variant='secondary', size='', icon, iconRight, block, className='', ...rest}){
  const cls = ['btn', `btn-${variant}`, size&&`btn-${size}`, block&&'btn-block', className].filter(Boolean).join(' ');
  return (
    <button className={cls} {...rest}>
      {icon && <Icon name={icon} size={size==='sm'?15:17} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size==='sm'?15:17} />}
    </button>
  );
}

/* ---------------- Agent avatar + waveform ---------------- */
const AGENT_GRADIENTS = [
  ['#34D399','#0EA5E9'], ['#A78BFA','#6366F1'], ['#FB7185','#F59E0B'],
  ['#22D3EE','#3B82F6'], ['#F472B6','#A855F7'], ['#4ADE80','#14B8A6'],
];
function gradFor(seed=''){
  let h=0; for(let i=0;i<seed.length;i++) h=(h*31+seed.charCodeAt(i))>>>0;
  return AGENT_GRADIENTS[h % AGENT_GRADIENTS.length];
}
function initials(name=''){
  const p=name.trim().split(/\s+/);
  return ((p[0]?.[0]||'')+(p[1]?.[0]||'')).toUpperCase()||'A';
}
function AgentAvatar({name='Agent', size=40, square=false, listening=false, glyph=true}){
  const [a,b]=gradFor(name);
  return (
    <div style={{position:'relative', width:size, height:size, flex:'none'}}>
      {listening && <span style={{position:'absolute', inset:-4, borderRadius:square?'34%':'50%',
        border:'2px solid var(--accent)', opacity:.55, animation:'pulse 1.6s ease-in-out infinite'}} />}
      <div className={'avatar'+(square?' sq':'')} style={{width:size, height:size,
        fontSize:size*0.38, background:`linear-gradient(140deg, ${a}, ${b})`,
        boxShadow:'inset 0 1px 2px rgba(255,255,255,.4)'}}>
        {glyph
          ? <Icon name="agent" size={size*0.56} stroke={1.9} style={{color:'#fff', opacity:.96}} />
          : initials(name)}
      </div>
    </div>
  );
}
function Wave({size=18, color='var(--accent-d)', bars=5, big=false}){
  const hs=[0.4,0.85,0.55,1,0.65,0.45,0.9];
  return (
    <div className={'wave'+(big?' lg':'')} style={{height:size, color}}>
      {Array.from({length:bars}).map((_,i)=>(
        <span key={i} style={{animationDelay:`${(i*0.13).toFixed(2)}s`,
          animationDuration:`${0.8+ (i%3)*0.18}s`}} />
      ))}
    </div>
  );
}

/* ---------------- User avatar ---------------- */
function UserAvatar({name='You', size=34}){
  return (
    <div className="avatar" style={{width:size, height:size, fontSize:size*0.4,
      background:'linear-gradient(140deg,#475569,#0f172a)'}}>{initials(name)}</div>
  );
}

/* ---------------- Status dot ---------------- */
function StatusDot({color='var(--accent)', label, pulse=true}){
  return (
    <span className="row center" style={{gap:7}}>
      <span className="dot" style={{background:color, boxShadow:`0 0 0 3px color-mix(in oklab, ${color} 22%, transparent)`}}
        {...(pulse?{className:'dot pulse'}:{})} />
      {label && <span style={{fontSize:13, fontWeight:600, color:'var(--text-2)'}}>{label}</span>}
    </span>
  );
}

/* ---------------- Integration logo tile (generic, non-branded glyphs) ---------------- */
const INTEGRATIONS = {
  gmail:{label:'Gmail', sub:'Email', tile:'#FEECEB', fg:'#EA4335', icon:'mail'},
  calendar:{label:'Google Calendar', sub:'Scheduling', tile:'#E8F0FE', fg:'#1A73E8', icon:'calendar'},
  notion:{label:'Notion', sub:'Docs & wiki', tile:'#F1F0EE', fg:'#1F1F1F', icon:'doc'},
  asana:{label:'Asana', sub:'Tasks', tile:'#FDEAF1', fg:'#F06A6A', icon:'listCheck'},
  slack:{label:'Slack', sub:'Messaging', tile:'#F3E9F7', fg:'#7C3AED', icon:'message'},
  github:{label:'GitHub', sub:'Code & issues', tile:'#F0F1F3', fg:'#1F2328', icon:'github'},
  drive:{label:'Google Drive', sub:'Files', tile:'#E9F6EE', fg:'#1E8E3E', icon:'layers'},
  linear:{label:'Linear', sub:'Issues', tile:'#ECEDFB', fg:'#5E63D8', icon:'zap'},
};
function IntegrationTile({id, size=40, radius}){
  if(window.BRAND && window.BRAND[id]) return <BrandLogo id={id} size={size} radius={radius} />;
  const m=INTEGRATIONS[id]||{tile:'var(--surface-2)', fg:'var(--text-2)', icon:'plug'};
  return (
    <div style={{width:size, height:size, borderRadius:radius??size*0.28, background:m.tile, color:m.fg,
      display:'grid', placeItems:'center', flex:'none', border:'1px solid color-mix(in oklab, '+m.fg+' 12%, transparent)'}}>
      <Icon name={m.icon} size={size*0.5} stroke={2} />
    </div>
  );
}

/* ---------------- Source-type chip glyph ---------------- */
const SOURCE_META = {
  url:{icon:'globe', label:'URL', color:'#2563EB', tile:'#EAF1FE'},
  doc:{icon:'doc', label:'Document', color:'#7C3AED', tile:'#F3EEFF'},
  github:{icon:'github', label:'GitHub repo', color:'#1F2328', tile:'#F0F1F3'},
  notion:{icon:'doc', label:'Notion', color:'#1F1F1F', tile:'#F1F0EE'},
  pdf:{icon:'doc', label:'PDF', color:'#DC2626', tile:'#FEECEB'},
  text:{icon:'list', label:'Text', color:'#0E9F6E', tile:'#E7F8F1'},
};

/* ---------------- Toggle ---------------- */
function Toggle({on, onChange}){
  return (
    <button onClick={()=>onChange(!on)} style={{width:42, height:25, borderRadius:99, border:'none', cursor:'pointer',
      background:on?'var(--accent)':'var(--border-2)', position:'relative', transition:'background .18s', flex:'none', padding:0}}>
      <span style={{position:'absolute', top:3, left:on?20:3, width:19, height:19, borderRadius:'50%', background:'#fff',
        boxShadow:'0 1px 3px rgba(0,0,0,.2)', transition:'left .18s'}} />
    </button>
  );
}

/* ---------------- Empty state ---------------- */
function EmptyState({icon, title, body, action}){
  return (
    <div className="col center" style={{textAlign:'center', padding:'56px 24px', gap:6}}>
      <div style={{width:64, height:64, borderRadius:18, background:'var(--accent-t)', color:'var(--accent-d)',
        display:'grid', placeItems:'center', marginBottom:10}}>
        <Icon name={icon} size={30} stroke={1.8} />
      </div>
      <h3 style={{fontSize:19}}>{title}</h3>
      <p className="muted" style={{maxWidth:360, fontSize:14.5, lineHeight:1.6}}>{body}</p>
      {action && <div style={{marginTop:14}}>{action}</div>}
    </div>
  );
}

/* ---------------- Tag pill (small) ---------------- */
function Pill({children, tone='muted', icon}){
  const cls = tone==='accent'?'badge badge-accent':tone==='amber'?'badge badge-amber':tone==='blue'?'badge badge-blue':tone==='violet'?'badge badge-violet':'badge badge-muted';
  return <span className={cls}>{icon&&<Icon name={icon} size={13} />}{children}</span>;
}

Object.assign(window, {
  Icon, Logo, Btn, AgentAvatar, Wave, UserAvatar, StatusDot, IntegrationTile,
  INTEGRATIONS, SOURCE_META, Toggle, EmptyState, Pill, gradFor, initials,
});
