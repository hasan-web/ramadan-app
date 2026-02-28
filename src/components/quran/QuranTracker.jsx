import { useState } from 'react'
import { db, today } from '../../utils/db'
import { getUserTimezone, getRamadanDates, getRamadanDay } from '../../utils/ramadan'

const styles = `
  .quran-input-row { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
  .num-input {
    width: 90px; padding: 10px; background: #0f1a14; border: 1px solid #2e4535;
    border-radius: 10px; color: #f0ede4; font-size: 28px; text-align: center;
    font-family: 'Playfair Display', serif; outline: none;
  }
  .num-input:focus { border-color: #c9a84c; }
  .num-label { font-size: 13px; color: #8a9e8d; }
  .quran-bar-grid { display: flex; gap: 3px; margin-top: 20px; align-items: flex-end; height: 60px; }
  .q-bar {
    flex: 1; background: #1e3a28; border-radius: 3px 3px 0 0;
    min-height: 4px; transition: height .3s ease; position: relative; cursor: default;
  }
  .q-bar.today-bar { background: #c9a84c; }
  .q-bar-label {
    position: absolute; bottom: -18px; left: 50%; transform: translateX(-50%);
    font-size: 8px; color: #8a9e8d; white-space: nowrap;
  }
  .quran-chart-wrap { margin-bottom: 8px; }
  .quran-chart-title { font-size: 12px; color: #8a9e8d; margin-bottom: 8px; }
`

export default function QuranTracker() {
  const key = `quran_${today()}`
  const [pages, setPages] = useState(() => db.get(key) || 0)

  const update = (v) => {
    const n = Math.max(0, Number(v) || 0)
    setPages(n)
    db.set(key, n)
  }

  const tz = getUserTimezone()
  const dates = getRamadanDates(tz)
  const currentDay = getRamadanDay(tz)

  const allPages = dates.map((date) => db.get(`quran_${date}`) || 0)
  const totalPages = allPages.reduce((a, b) => a + b, 0)
  const daysLogged = allPages.filter((p) => p > 0).length
  const avg = daysLogged > 0 ? Math.round(totalPages / daysLogged) : 0
  const projected = avg * 30
  const maxPages = Math.max(...allPages, 1)

  return (
    <>
      <style>{styles}</style>
      <div className="section">
        <div className="section-title">📖 Quran Tracker</div>

        <div className="quran-input-row">
          <button className="btn btn-ghost btn-sm" onClick={() => update(pages - 1)}>−</button>
          <input
            type="number"
            className="num-input"
            value={pages}
            min={0}
            onChange={(e) => update(e.target.value)}
          />
          <button className="btn btn-ghost btn-sm" onClick={() => update(pages + 1)}>+</button>
          <div className="num-label">pages read<br />today</div>
        </div>

        {/* Ramadan total progress */}
        <div style={{ fontSize: 13, color: '#8a9e8d', marginBottom: 6 }}>
          Ramadan total: <strong style={{ color: '#e8c96a' }}>{totalPages}</strong> / 600 pages
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${Math.min(100, (totalPages / 600) * 100)}%` }} />
        </div>
        <div style={{ fontSize: 11, color: '#8a9e8d', marginTop: 4, marginBottom: 20 }}>
          {Math.round((totalPages / 600) * 100)}% — {Math.max(0, 600 - totalPages)} pages remaining
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {[
            { num: totalPages, lbl: 'Total pages' },
            { num: avg,        lbl: 'Daily avg' },
            { num: projected,  lbl: 'Projected' },
            { num: Math.max(0, 600 - totalPages), lbl: 'Remaining' },
          ].map((s) => (
            <div key={s.lbl} style={{ flex: 1, background: '#0f1a14', borderRadius: 10, padding: '10px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: '#e8c96a' }}>{s.num}</div>
              <div style={{ fontSize: 10, color: '#8a9e8d', marginTop: 2 }}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* Daily bar chart */}
        <div className="quran-chart-wrap">
          <div className="quran-chart-title">Daily pages — all 30 days</div>
          <div className="quran-bar-grid">
            {allPages.map((p, i) => (
              <div
                key={i}
                className={`q-bar ${i + 1 === currentDay ? 'today-bar' : ''}`}
                style={{ height: `${(p / maxPages) * 56 + 4}px` }}
                title={`Day ${i + 1}: ${p} pages`}
              >
                {(i + 1) % 5 === 0 && <span className="q-bar-label">{i + 1}</span>}
              </div>
            ))}
          </div>
          <div style={{ height: 20 }} /> {/* space for labels */}
        </div>

        {pages >= 20 && (
          <div style={{ padding: '10px 16px', background: '#1e3a28', borderRadius: 10, fontSize: 13, color: '#e8c96a', marginTop: 8 }}>
            🌟 MashaAllah! {pages} pages today — you're on track for Khatm al-Quran!
          </div>
        )}
      </div>
    </>
  )
}
