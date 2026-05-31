import { Btn, Icon } from "../ui";

/* Shared page scaffold — title, optional subtitle/back/actions, scroll container. */
export default function PageWrap({ title, subtitle, actions, back, children }) {
  return (
    <div className="app-scroll fade-in">
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "30px 36px 64px" }}>
        <div className="row between" style={{ alignItems: "flex-end", marginBottom: 26, gap: 20 }}>
          <div>
            {back && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={back}
                style={{ marginBottom: 10, paddingLeft: 8, marginLeft: -4 }}
              >
                <Icon name="chevL" size={16} />
                Back
              </button>
            )}
            <h1 style={{ fontSize: 30, letterSpacing: "-.03em" }}>{title}</h1>
            {subtitle && (
              <p className="muted" style={{ fontSize: 15.5, marginTop: 6 }}>
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="row center" style={{ gap: 10 }}>
              {actions}
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
