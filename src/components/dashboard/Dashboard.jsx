import { db, today } from '../../utils/db'
import { getUserTimezone, getRamadanDates } from '../../utils/ramadan'
import StreakView from './StreakView'

const styles = `
  .overview { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 28px; }
  .ov-card {
    background: #1e2d22; border: 1px solid #2e4535; border-radius: 16px;
    padding: 18px; text-align: center;
  }
  .ov-num { font-family: 'Playfair Display', serif; font-size: 30px; color: #c9a84c; }
  .ov-label { color: #8a9e8d; font-size: 12px; margin-top: 4px; }
  .q-stat-row { display: flex; gap: 12px; margin-top: 14px; }
  .q-stat { flex: 1; background: #0f1a14; border-radius: 10px; padding: 12px; text-align: center; }
  .q-stat-num { font-family: 'Playfair Display', serif; font-size: 22px; color: #e8c96a; }
  .q-stat-lbl { color: #8a9e8d; font-size: 11px; margin-top: 2px; }
  @media (max-width: 400px) { .ov-num { font-size: 24px; } }
`

export default function Dashboard() {
  const td = today()
  const prayers = db.get(`prayers_${td}`) || {}
  const prayerCount = Object.values(prayers).filter(Boolean).length

  const quranToday = db.get(`quran_${td}`) || 0
  const goals = db.get(`goals_${td}`) || []
  const doneGoals = goals.filter((g) => g.done).length
  const dhikr = db.get(`dhikr_${td}`) || 0

  // Ramadan-wide Quran total
  const tz = getUserTimezone()
  const dates = getRamadanDates(tz)
  const totalPages = dates.reduce((sum, date) => sum + (db.get(`quran_${date}`) || 0), 0)
  const daysLogged = dates.filter((d) => (db.get(`quran_${d}`) || 0) > 0).length
  const avg = daysLogged > 0 ? Math.round(totalPages / daysLogged) : 0
  const projected = avg * 30

  return (
    <>
      <style>{styles}</style>

      {/* Today overview */}
      <div className="overview">
        <div className="ov-card">
          <div className="ov-num">{prayerCount}/6</div>
          <div className="ov-label">Prayers today</div>
        </div>
        <div className="ov-card">
          <div className="ov-num">{quranToday}</div>
          <div className="ov-label">Pages today</div>
        </div>
        <div className="ov-card">
          <div className="ov-num">{doneGoals}/{goals.length || 0}</div>
          <div className="ov-label">Goals done</div>
        </div>
      </div>

      {/* Quran Ramadan progress */}
      <div className="section">
        <div className="section-title">📖 Quran Progress This Ramadan</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#8a9e8d', marginBottom: 6 }}>
          <span>{totalPages} pages read</span>
          <span>Goal: 600 pages</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${Math.min(100, (totalPages / 600) * 100)}%` }} />
        </div>
        <div style={{ fontSize: 11, color: '#8a9e8d', marginTop: 4 }}>
          {Math.round((totalPages / 600) * 100)}% of full Quran complete
        </div>
        <div className="q-stat-row">
          <div className="q-stat"><div className="q-stat-num">{totalPages}</div><div className="q-stat-lbl">Total pages</div></div>
          <div className="q-stat"><div className="q-stat-num">{avg}</div><div className="q-stat-lbl">Daily avg</div></div>
          <div className="q-stat"><div className="q-stat-num">{projected}</div><div className="q-stat-lbl">Projected</div></div>
          <div className="q-stat"><div className="q-stat-num">{Math.max(0, 600 - totalPages)}</div><div className="q-stat-lbl">Remaining</div></div>
        </div>
      </div>

      {/* Dhikr today */}
      <div className="section">
        <div className="section-title">📿 Dhikr Today</div>
        <div style={{ fontSize: 42, fontFamily: "'Playfair Display', serif", color: '#c9a84c', textAlign: 'center' }}>
          {dhikr.toLocaleString()}
        </div>
        <div style={{ textAlign: 'center', color: '#8a9e8d', fontSize: 12, marginTop: 4 }}>total counts today</div>
      </div>

      {/* Prayer streak */}
      <div className="section">
        <div className="section-title">🔥 Prayer Streak — Ramadan</div>
        <StreakView />
      </div>
    </>
  )
}
