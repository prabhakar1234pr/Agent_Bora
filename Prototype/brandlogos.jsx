/* brandlogos.jsx — real, full-color brand marks for integrations.
   Each entry renders inside a neutral white "app icon" tile for a consistent,
   minimal integration-chip look. Used by BrandLogo + IntegrationTile. */

const BRAND = {
  gmail: {
    label: 'Gmail', vb: '0 0 48 48',
    mark: (
      <>
        <path fill="#4285F4" d="M6 38h6V24L4 18v18a2 2 0 0 0 2 2z"/>
        <path fill="#34A853" d="M42 38h-6V24l8-6v18a2 2 0 0 1-2 2z"/>
        <path fill="#FBBC04" d="M36 12v12l8-6v-4.5a3.5 3.5 0 0 0-5.6-2.8z"/>
        <path fill="#EA4335" d="M12 24V12l12 9 12-9v12l-12 9z"/>
        <path fill="#C5221F" d="M4 13.5V18l8 6V12L9.6 10.2A3.5 3.5 0 0 0 4 13.5z"/>
      </>
    ),
  },
  calendar: {
    label: 'Google Calendar', vb: '0 0 48 48',
    mark: (
      <>
        <path fill="#fff" d="M34 14H14v20h20z"/>
        <path fill="#EA4335" d="M34 8H14a6 6 0 0 0-6 6h6V8z"/>
        <path fill="#4285F4" d="M34 14h6a6 6 0 0 0-6-6v6z"/>
        <path fill="#34A853" d="M34 34v6a6 6 0 0 0 6-6h-6z"/>
        <path fill="#188038" d="M14 34H8a6 6 0 0 0 6 6v-6z"/>
        <path fill="#1967D2" d="M40 14h-6v20h6z"/>
        <path fill="#FBBC04" d="M14 34V14H8v20z"/>
        <path fill="#4285F4" d="M19.3 27.4c-.4-.3-.7-.7-.9-1.3l1.4-.6c.1.3.2.6.4.8.2.2.5.3.8.3.3 0 .6-.1.8-.3.2-.2.3-.4.3-.7 0-.3-.1-.5-.3-.7-.2-.2-.5-.3-.9-.3h-.8v-1.3h.7c.3 0 .6-.1.8-.3.2-.1.3-.4.3-.6 0-.2-.1-.4-.3-.6-.2-.1-.4-.2-.6-.2-.3 0-.5.1-.6.2-.2.2-.3.4-.4.6l-1.4-.6c.1-.4.4-.7.7-1 .4-.3.9-.5 1.6-.5.5 0 .9.1 1.3.3.4.2.7.4.9.8.2.3.3.7.3 1.1 0 .4-.1.8-.3 1-.2.3-.4.5-.7.6.4.2.7.4.9.7.2.3.3.7.3 1.2 0 .4-.1.8-.3 1.2-.2.3-.5.6-.9.8-.4.2-.9.3-1.4.3-.6 0-1.1-.2-1.6-.5zM26.6 22.3l-1.5 1.1-.8-1.2 2.7-1.9h1V28h-1.5z"/>
      </>
    ),
  },
  notion: {
    label: 'Notion', vb: '0 0 48 48', tileBg: '#fff',
    mark: (
      <>
        <g fill="#191918">
          <rect x="16.5" y="14" width="3.4" height="20" rx=".4"/>
          <rect x="28.1" y="14" width="3.4" height="20" rx=".4"/>
          <path d="M18.2 14h2.7l11 17.6-.1 2.4h-2.4L18.2 16.7z"/>
        </g>
      </>
    ),
  },
  asana: {
    label: 'Asana', vb: '0 0 48 48', tileBg: '#fff',
    mark: (
      <>
        <circle cx="24" cy="15" r="6.2" fill="#F06A6A"/>
        <circle cx="14.4" cy="31.4" r="6.2" fill="#F06A6A"/>
        <circle cx="33.6" cy="31.4" r="6.2" fill="#F06A6A"/>
      </>
    ),
  },
  slack: {
    label: 'Slack', vb: '0 0 24 24', tileBg: '#fff',
    mark: (
      <>
        <path fill="#E01E5A" d="M5.04 15.12a2.52 2.52 0 1 1-2.52-2.52h2.52v2.52zM6.3 15.12a2.52 2.52 0 0 1 5.04 0v6.3a2.52 2.52 0 0 1-5.04 0v-6.3z"/>
        <path fill="#36C5F0" d="M8.82 5.04A2.52 2.52 0 1 1 11.34 2.52v2.52H8.82zM8.82 6.3a2.52 2.52 0 0 1 0 5.04H2.52a2.52 2.52 0 0 1 0-5.04h6.3z"/>
        <path fill="#2EB67D" d="M18.96 8.82a2.52 2.52 0 1 1 2.52 2.52h-2.52V8.82zM17.7 8.82a2.52 2.52 0 0 1-5.04 0V2.52a2.52 2.52 0 0 1 5.04 0v6.3z"/>
        <path fill="#ECB22E" d="M15.18 18.96a2.52 2.52 0 1 1-2.52 2.52v-2.52h2.52zM15.18 17.7a2.52 2.52 0 0 1 0-5.04h6.3a2.52 2.52 0 0 1 0 5.04h-6.3z"/>
      </>
    ),
  },
  github: {
    label: 'GitHub', vb: '0 0 24 24', tileBg: '#fff',
    mark: (
      <path fill="#181717" d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.44 9.63 8.21 11.19.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.4-4.04-1.4-.55-1.36-1.33-1.73-1.33-1.73-1.09-.73.08-.72.08-.72 1.2.08 1.84 1.21 1.84 1.21 1.07 1.79 2.81 1.27 3.49.97.11-.76.42-1.27.76-1.56-2.67-.29-5.47-1.29-5.47-5.75 0-1.27.47-2.31 1.24-3.12-.13-.29-.54-1.47.12-3.07 0 0 1.01-.31 3.3 1.19a11.7 11.7 0 0 1 6 0c2.29-1.5 3.3-1.19 3.3-1.19.66 1.6.25 2.78.12 3.07.77.81 1.24 1.85 1.24 3.12 0 4.47-2.81 5.45-5.49 5.74.43.36.81 1.07.81 2.16v3.2c0 .31.21.69.83.57C20.57 21.91 24 17.5 24 12.29 24 5.78 18.63.5 12 .5z"/>
    ),
  },
  drive: {
    label: 'Google Drive', vb: '0 0 87.3 78', tileBg: '#fff',
    mark: (
      <>
        <path fill="#0066DA" d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z"/>
        <path fill="#00AC47" d="M43.65 25L29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44A9.06 9.06 0 0 0 0 53h27.5z"/>
        <path fill="#EA4335" d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 11.5z"/>
        <path fill="#00832D" d="M43.65 25L57.4 1.2c-1.35-.8-2.9-1.2-4.5-1.2H34.4c-1.6 0-3.15.45-4.5 1.2z"/>
        <path fill="#2684FC" d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"/>
        <path fill="#FFBA00" d="M73.4 26.5L60.7 4.5c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"/>
      </>
    ),
  },
  linear: {
    label: 'Linear', vb: '0 0 100 100', tileBg: '#fff',
    mark: (
      <g fill="#5E6AD2">
        <path d="M1.225 61.523c-.222-.949.908-1.546 1.597-.857l36.512 36.512c.69.69.092 1.82-.857 1.597C20.426 94.97 5.03 79.575 1.225 61.523Z"/>
        <path d="M.002 46.889a.99.99 0 0 0 .29.76L52.35 99.71c.201.2.478.307.761.29 3.7-.22 7.297-.831 10.75-1.793a.991.991 0 0 0 .424-1.66L2.45 35.715a.991.991 0 0 0-1.66.424A50.169 50.169 0 0 0 .002 46.889Z"/>
        <path d="M4.078 24.44a.99.99 0 0 0 .206 1.115L74.45 95.72a.99.99 0 0 0 1.116.207 50.6 50.6 0 0 0 7.844-4.547.987.987 0 0 0 .124-1.49L10.115 16.473a.987.987 0 0 0-1.49.124 50.6 50.6 0 0 0-4.547 7.844Z"/>
        <path d="M11.56 14.566a.99.99 0 0 0-.073 1.341l72.607 72.607a.99.99 0 0 0 1.341-.073C94.673 79.182 100 67.213 100 50 100 22.386 77.614 0 50 0 32.787 0 20.818 5.327 11.56 14.566Z"/>
      </g>
    ),
  },
  meet: {
    label: 'Google Meet', vb: '0 0 48 48', tileBg: '#fff',
    mark: (
      <>
        <path fill="#2684FC" d="M5 15v18a2 2 0 0 0 2 2h9V13H7a2 2 0 0 0-2 2z"/>
        <path fill="#EA4335" d="M16 13H7a2 2 0 0 0-2 2v3l11-5z"/>
        <path fill="#FFBA00" d="M16 35H7a2 2 0 0 1-2-2v-3l11 5z"/>
        <path fill="#00AC47" d="M16 13v22h11.5l3.5-11-3.5-11z"/>
        <path fill="#00832D" d="M31 18.5v11l9.2 6.2A1.7 1.7 0 0 0 43 34.3V13.7a1.7 1.7 0 0 0-2.8-1.3z"/>
        <path fill="#FFBA00" d="M27.5 35H16v-9l15 9z" opacity="0"/>
      </>
    ),
  },
  teams: {
    label: 'Microsoft Teams', vb: '0 0 48 48', tileBg: '#fff',
    mark: (
      <>
        <circle cx="38" cy="12.5" r="3.8" fill="#5059C9"/>
        <path fill="#5059C9" d="M43.5 19h-9a1.5 1.5 0 0 0-1.5 1.5v9.2a6.3 6.3 0 0 0 12.6.4V21.5A2.5 2.5 0 0 0 43.5 19z"/>
        <circle cx="27.5" cy="10" r="5.6" fill="#7B83EB"/>
        <path fill="#7B83EB" d="M35 18H20a2.6 2.6 0 0 0-2.6 2.6v12.7a9.1 9.1 0 0 0 18.2-.3V20.6A2.6 2.6 0 0 0 35 18z"/>
        <rect x="5" y="14" width="22" height="22" rx="3.2" fill="#4B53BC"/>
        <path fill="#fff" d="M10.5 19.2h11v2.9h-3.9v10.4h-3.2V22.1h-3.9z"/>
      </>
    ),
  },
};

function BrandMark({ id, size = 24 }) {
  const b = BRAND[id];
  if (!b) return <Icon name="plug" size={size} />;
  return (
    <svg width={size} height={size} viewBox={b.vb} style={{ display: 'block', flex: 'none' }}>
      {b.mark}
    </svg>
  );
}

/* White rounded app-icon tile with the brand mark centered inside. */
function BrandLogo({ id, size = 40, radius, plain = false }) {
  if (plain) return <BrandMark id={id} size={size} />;
  return (
    <div style={{
      width: size, height: size, borderRadius: radius ?? size * 0.27,
      background: '#fff', border: '1px solid var(--border)',
      boxShadow: '0 1px 2px rgba(16,30,24,.05)',
      display: 'grid', placeItems: 'center', flex: 'none', overflow: 'hidden',
    }}>
      <BrandMark id={id} size={Math.round(size * 0.62)} />
    </div>
  );
}

Object.assign(window, { BRAND, BrandMark, BrandLogo });
