import { useState } from 'react'
import { db, today } from '../../utils/db'

const DHIKR_PRESETS = [
  { label: 'SubhanAllah',    arabic: 'سبحان الله',   meaning: 'Glory be to Allah' },
  { label: 'Alhamdulillah', arabic: 'الحمد لله',    meaning: 'All praise to Allah' },
  { label: 'Allahu Akbar',  arabic: 'الله أكبر',    meaning: 'Allah is the Greatest' },
  { label: 'Astaghfirullah',arabic: 'أستغفر الله',  meaning: 'I seek forgiveness' },
  { label: 'La ilaha',      arabic: 'لا إله إلا الله', meaning: 'None worthy of worship but Allah' },
  { label: 'Salawat',       arabic: 'صلى الله عليه وسلم', meaning: 'Blessings upon the Prophet' },
]

const styles = `
  .dhikr-center { text-align: center; }
  .dhikr-display {
    font-family: 'Playfair Display', serif; font-size: 80px; color: #c9a84c;
    line-height: 1; cursor: pointer; user-select: none; transition: transform .08s;
    display: inline-block;
  }
  .dhikr-display:active { transform: scale(0.93); }
  .dhikr-arabic { font-size: 24px; color: #e8c96a; margin: 8px 0 4px; direction: rtl; }
  .dhikr-meaning { font-size: 12px; color: #8a9e8d; margin-bottom: 20px; }
  .dhikr-tap-hint { font-size: 11px; color: #8a9e8d; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
  .dhikr-presets { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 20px; }
  .dhikr-preset-btn {
    padding: 6px 14px; border-radius: 99px; border: 1px solid #2e4535;
    background: transparent; color: #8a9e8d; cursor: pointer;
    font-size: 12px; font-family: 'DM Sans', sans-serif; transition: all .2s;
  }
  .dhikr-preset-btn.active { border-color: #c9a84c; color: #c9a84c; background: #1e2d22; }
  .dhikr-preset-btn:hover:not(.active) { color: #f0ede4; border-color: #3a6040; }
  .dhikr-quick { display: flex; gap: 8px; justify-content: center; margin-top: 4px; }
  .milestone { margin-top: 16px; padding: 12px 18px; background: #1e3a28; border-radius: 10px; color: #e8c96a; font-size: 13px; text-align: center; animation: popIn .3s ease; }
  @keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
`

export default function DhikrCounter() {
  const key = `dhikr_${today()}`
  const [count, setCount] = useState(() => db.get(key) || 0)
  const [active, setActive] = useState(0)

  const tap = () => {
    const n = count + 1
    setCount(n)
    db.set(key, n)
  }

  const add = (n) => {
    const next = count + n
    setCount(next)
    db.set(key, next)
  }

  const reset = () => { setCount(0); db.set(key, 0) }

  const preset = DHIKR_PRESETS[active]
  const milestone = count > 0 && count % 33 === 0 ? `🎉 ${count / 33}× set of 33 completed!` : null
  const tasbeehSets = Math.floor(count / 33)

  return (
    <>
      <style>{styles}</style>
      <div className="section">
        <div className="section-title">📿 Dhikr Counter</div>

        {/* Preset selector */}
        <div className="dhikr-presets">
          {DHIKR_PRESETS.map((p, i) => (
            <button
              key={i}
              className={`dhikr-preset-btn ${active === i ? 'active' : ''}`}
              onClick={() => setActive(i)}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Main counter */}
        <div className="dhikr-center">
          <div className="dhikr-arabic">{preset.arabic}</div>
          <div className="dhikr-meaning">{preset.meaning}</div>
          <div className="dhikr-tap-hint">Tap to count</div>
          <div className="dhikr-display" onClick={tap} role="button" aria-label="Count dhikr">
            {count.toLocaleString()}
          </div>

          <div style={{ marginTop: 12, fontSize: 12, color: '#8a9e8d' }}>
            {tasbeehSets > 0 && `${tasbeehSets} complete set${tasbeehSets > 1 ? 's' : ''} of 33 · `}
            {count % 33}/33 this set
          </div>

          {/* Quick add */}
          <div className="dhikr-quick">
            <button className="btn btn-ghost btn-sm" onClick={() => add(33)}>+33</button>
            <button className="btn btn-ghost btn-sm" onClick={() => add(99)}>+99</button>
            <button className="btn btn-ghost btn-sm" onClick={() => add(100)}>+100</button>
            <button className="btn btn-danger btn-sm" onClick={reset}>Reset</button>
          </div>
        </div>

        {milestone && <div className="milestone">{milestone}</div>}

        {count >= 1000 && (
          <div style={{ marginTop: 12, padding: '10px 16px', background: '#1e3a28', borderRadius: 10, color: '#4fa068', fontSize: 13, textAlign: 'center' }}>
            ✨ SubhanAllah! Over 1,000 dhikr today. May Allah accept it!
          </div>
        )}
      </div>
    </>
  )
}
