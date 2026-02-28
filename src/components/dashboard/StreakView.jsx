import { db } from '../../utils/db'
import { getUserTimezone, getRamadanDates, getRamadanDay } from '../../utils/ramadan'

const styles = `
  .streak-row { display: flex; gap: 5px; flex-wrap: wrap; }
  .streak-dot {
    width: 24px; height: 24px; border-radius: 50%;
    background: #1a2a1f; border: 1px solid #2e4535;
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; color: #8a9e8d; font-weight: 500;
    position: relative; cursor: default;
  }
  .streak-dot.lit { background: #c9a84c; border-color: #e8c96a; color: #0f1a14; font-weight: 700; }
  .streak-dot.today { box-shadow: 0 0 0 2px #4fa068; }
  .streak-dot.partial { background: #1e3a28; border-color: #3a7c52; color: #4fa068; }
  .streak-legend { display: flex; gap: 16px; margin-top: 12px; font-size: 11px; color: #8a9e8d; }
  .legend-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 5px; }
`

export default function StreakView() {
  const tz = getUserTimezone()
  const dates = getRamadanDates(tz)
  const currentDay = getRamadanDay(tz)

  const dots = dates.map((date, i) => {
    const prayers = db.get(`prayers_${date}`) || {}
    const count = Object.values(prayers).filter(Boolean).length
    return {
      day: i + 1,
      date,
      count,
      lit: count >= 5,      // All 5 fard + taraweeh
      partial: count >= 3 && count < 5,
      isToday: i + 1 === currentDay,
    }
  })

  return (
    <>
      <style>{styles}</style>
      <div className="streak-row">
        {dots.map((d) => (
          <div
            key={d.day}
            className={`streak-dot ${d.lit ? 'lit' : d.partial ? 'partial' : ''} ${d.isToday ? 'today' : ''}`}
            title={`Day ${d.day}: ${d.count}/6 prayers`}
          >
            {d.day}
          </div>
        ))}
      </div>
      <div className="streak-legend">
        <span><span className="legend-dot" style={{ background: '#c9a84c' }} />5–6 prayers</span>
        <span><span className="legend-dot" style={{ background: '#1e3a28', border: '1px solid #3a7c52' }} />3–4 prayers</span>
        <span><span className="legend-dot" style={{ background: '#1a2a1f', border: '1px solid #2e4535' }} />Not logged</span>
      </div>
    </>
  )
}
