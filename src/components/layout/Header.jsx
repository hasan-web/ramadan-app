const styles = `
  .header {
    position: sticky; top: 0; z-index: 100;
    background: rgba(15, 26, 20, 0.92); backdrop-filter: blur(16px);
    border-bottom: 1px solid #1e2d22; padding: 14px 0; margin-bottom: 32px;
  }
  .header-inner {
    max-width: 900px; margin: 0 auto; padding: 0 16px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .logo {
    font-family: 'Playfair Display', serif; color: #c9a84c;
    font-size: 20px; display: flex; align-items: center; gap: 10px;
  }
  .logo-sub { font-size: 11px; color: #8a9e8d; font-family: 'DM Sans', sans-serif; font-weight: 400; margin-top: 1px; }
  .user-chip { display: flex; align-items: center; gap: 10px; }
  .avatar {
    width: 32px; height: 32px; border-radius: 50%; background: #3a7c52;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 600; color: white; flex-shrink: 0;
  }
  .user-name { font-size: 13px; color: #8a9e8d; }
  @media (max-width: 400px) { .user-name { display: none; } }
`

export default function Header({ user, onLogout }) {
  const initial = (user?.name || user?.email || 'U')[0].toUpperCase()

  return (
    <>
      <style>{styles}</style>
      <div className="header">
        <div className="header-inner">
          <div className="logo">
            <span>☽</span>
            <div>
              <div>Ramadan Planner</div>
              <div className="logo-sub">1447 AH · 2026</div>
            </div>
          </div>

          <div className="user-chip">
            <div className="avatar">{initial}</div>
            <span className="user-name">{user?.name || user?.email}</span>
            <button className="btn btn-ghost btn-sm" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
