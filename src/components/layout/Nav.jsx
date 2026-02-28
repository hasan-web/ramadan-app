const TABS = [
  { id: 'dashboard',   label: '🏠 Home' },
  { id: 'prayers',     label: '🕌 Prayers' },
  { id: 'quran',       label: '📖 Quran' },
  { id: 'goals',       label: '✅ Goals' },
  { id: 'dhikr',       label: '📿 Dhikr' },
  { id: 'reflection',  label: '🪷 Reflect' },
  { id: 'brainstorm',  label: '🧩 Game' },
]

export default function Nav({ tab, setTab }) {
  return (
    <nav className="nav" role="tablist" aria-label="Main navigation">
      {TABS.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={tab === t.id}
          className={`nav-tab ${tab === t.id ? 'active' : ''}`}
          onClick={() => setTab(t.id)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  )
}
