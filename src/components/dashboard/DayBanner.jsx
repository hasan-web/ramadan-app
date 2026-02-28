import { getUserTimezone, getRamadanDay, getRamadanProgress, getDayMessage, getRegionLabel } from '../../utils/ramadan'

const styles = `
  .day-banner {
    background: linear-gradient(135deg, #1e3a28, #2e4a38);
    border: 1px solid #3a6040; border-radius: 16px;
    padding: 20px 24px; margin-bottom: 28px;
    display: flex; align-items: center; gap: 20px;
  }
  .day-left { flex-shrink: 0; }
  .day-label { font-size: 11px; color: #c9a84c; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; }
  .day-num { font-family: 'Playfair Display', serif; font-size: 52px; color: #c9a84c; line-height: 1; }
  .day-info { flex: 1; min-width: 0; }
  .day-title { font-size: 18px; font-weight: 500; }
  .day-ashra { color: #8a9e8d; font-size: 13px; margin-top: 4px; font-style: italic; }
  .day-region { font-size: 11px; color: #4fa068; margin-top: 6px; }
  .day-pre { color: #e8c96a; font-size: 15px; font-weight: 500; }
  @media (max-width: 450px) { .day-num { font-size: 40px; } .day-banner { gap: 12px; } }
`

export default function DayBanner() {
  const tz = getUserTimezone()
  const day = getRamadanDay(tz)
  const progress = getRamadanProgress(tz)
  const message = getDayMessage(day)
  const region = getRegionLabel(tz)

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <>
      <style>{styles}</style>
      <div className="day-banner">
        <div className="day-left">
          <div className="day-label">Ramadan 1447</div>
          {day ? (
            <div className="day-num">{day}</div>
          ) : (
            <div className="day-pre">☽</div>
          )}
        </div>

        <div className="day-info">
          {day ? (
            <>
              <div className="day-title">Day {day} of 30</div>
              <div className="day-ashra">{message}</div>
            </>
          ) : (
            <div className="day-title">Ramadan Mubarak!</div>
          )}
          <div className="day-region">📍 {region} · {tz}</div>
          <div className="progress-track" style={{ marginTop: 10 }}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div style={{ fontSize: 11, color: '#8a9e8d', marginTop: 4 }}>
            {todayStr}
          </div>
        </div>
      </div>
    </>
  )
}
