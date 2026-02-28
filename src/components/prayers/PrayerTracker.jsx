import { useState } from 'react'
import { db, today } from '../../utils/db'

const PRAYERS = [
  { key: 'fajr',     label: 'Fajr',     icon: '🌙', time: 'Pre-dawn' },
  { key: 'dhuhr',    label: 'Dhuhr',    icon: '☀️', time: 'Midday' },
  { key: 'asr',      label: 'Asr',      icon: '🌤️', time: 'Afternoon' },
  { key: 'maghrib',  label: 'Maghrib',  icon: '🌇', time: 'Sunset' },
  { key: 'isha',     label: 'Isha',     icon: '🌃', time: 'Night' },
  { key: 'taraweeh', label: 'Taraweeh', icon: '✨', time: 'Late night' },
]

const styles = `
  .prayer-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .prayer-btn {
    padding: 16px 8px; border-radius: 12px; border: 2px solid #2e4535;
    background: #0f1a14; cursor: pointer; text-align: center;
    transition: all .25s; color: #8a9e8d;
    font-family: 'DM Sans', sans-serif;
  }
  .prayer-btn:hover { border-color: #4fa068; }
  .prayer-btn.done { background: #1e3a28; border-color: #3a7c52; color: #f0ede4; }
  .prayer-btn.done .p-check { opacity: 1; }
  .p-icon { font-size: 22px; display: block; margin-bottom: 6px; }
  .p-name { font-size: 13px; font-weight: 500; }
  .p-time { font-size: 10px; color: #8a9e8d; margin-top: 2px; }
  .p-check { font-size: 10px; color: #4fa068; margin-top: 4px; opacity: 0; transition: opacity .2s; }
  .prayer-summary {
    background: #0f1a14; border-radius: 10px; padding: 14px 18px;
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 16px;
  }
  .ps-label { font-size: 13px; color: #8a9e8d; }
  .ps-fard { font-size: 12px; color: #4fa068; }
  @media (max-width: 400px) { .prayer-grid { grid-template-columns: repeat(2, 1fr); } }
`

export default function PrayerTracker() {
  const key = `prayers_${today()}`
  const [prayers, setPrayers] = useState(() => db.get(key) || {})

  const toggle = (p) => {
    const updated = { ...prayers, [p]: !prayers[p] }
    setPrayers(updated)
    db.set(key, updated)
  }

  const done = Object.values(prayers).filter(Boolean).length
  const fard = PRAYERS.slice(0, 5).filter((p) => prayers[p.key]).length

  return (
    <>
      <style>{styles}</style>
      <div className="section">
        <div className="section-title">🕌 Prayer Tracker</div>

        <div className="prayer-summary">
          <div>
            <div className="ps-label">{done} of 6 logged today</div>
            <div className="ps-fard">{fard}/5 Fard · {prayers.taraweeh ? '1/1' : '0/1'} Taraweeh</div>
          </div>
          <div style={{ font: "500 24px/1 'Playfair Display', serif", color: '#c9a84c' }}>
            {done}/6
          </div>
        </div>

        <div className="progress-track" style={{ marginBottom: 20 }}>
          <div className="progress-fill" style={{ width: `${(done / 6) * 100}%` }} />
        </div>

        <div className="prayer-grid">
          {PRAYERS.map((p) => (
            <button
              key={p.key}
              className={`prayer-btn ${prayers[p.key] ? 'done' : ''}`}
              onClick={() => toggle(p.key)}
              aria-pressed={!!prayers[p.key]}
            >
              <span className="p-icon">{prayers[p.key] ? '✅' : p.icon}</span>
              <div className="p-name">{p.label}</div>
              <div className="p-time">{p.time}</div>
              <div className="p-check">✓ Completed</div>
            </button>
          ))}
        </div>

        {done === 6 && (
          <div style={{ marginTop: 16, padding: '12px 18px', background: '#1e3a28', borderRadius: 10, color: '#e8c96a', fontSize: 13, textAlign: 'center' }}>
            🎉 MashaAllah! All 6 prayers completed today!
          </div>
        )}
      </div>
    </>
  )
}
