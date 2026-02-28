import { useState } from 'react'
import { db, today } from '../../utils/db'

const styles = `
  .goal-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px; padding: 10px 12px; background: #0f1a14; border-radius: 10px; border: 1px solid #1e2d22; transition: border .2s; }
  .goal-row:hover { border-color: #2e4535; }
  .goal-check {
    width: 20px; height: 20px; border-radius: 6px; border: 2px solid #3a6040;
    background: transparent; cursor: pointer; appearance: none;
    flex-shrink: 0; margin-top: 1px; transition: all .2s; accent-color: #3a7c52;
  }
  .goal-check:checked { background: #3a7c52; border-color: #3a7c52; }
  .goal-text-wrap { flex: 1; }
  .goal-text { font-size: 14px; transition: all .2s; }
  .goal-text.done { text-decoration: line-through; color: #8a9e8d; }
  .goal-date { font-size: 10px; color: #8a9e8d; margin-top: 2px; }
  .add-row { display: flex; gap: 8px; margin-top: 14px; }
  .goals-empty { text-align: center; padding: 24px; color: #8a9e8d; font-size: 14px; }
`

export default function DailyGoals() {
  const key = `goals_${today()}`
  const [goals, setGoals] = useState(() => db.get(key) || [])
  const [text, setText] = useState('')

  const save = (g) => { setGoals(g); db.set(key, g) }

  const add = () => {
    if (!text.trim()) return
    save([...goals, { id: Date.now(), text: text.trim(), done: false, created: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    setText('')
  }

  const toggle = (id) => save(goals.map((g) => g.id === id ? { ...g, done: !g.done } : g))
  const remove = (id) => save(goals.filter((g) => g.id !== id))

  const done = goals.filter((g) => g.done).length

  return (
    <>
      <style>{styles}</style>
      <div className="section">
        <div className="section-title">✅ Daily Goals — {done}/{goals.length}</div>

        {goals.length > 0 && (
          <div className="progress-track" style={{ marginBottom: 16 }}>
            <div className="progress-fill" style={{ width: `${goals.length ? (done / goals.length) * 100 : 0}%` }} />
          </div>
        )}

        {goals.length === 0 ? (
          <div className="goals-empty">
            No goals yet — add your first one below ✨
          </div>
        ) : (
          goals.map((g) => (
            <div key={g.id} className="goal-row">
              <input
                type="checkbox"
                className="goal-check"
                checked={g.done}
                onChange={() => toggle(g.id)}
              />
              <div className="goal-text-wrap">
                <div className={`goal-text ${g.done ? 'done' : ''}`}>{g.text}</div>
                {g.created && <div className="goal-date">Added at {g.created}</div>}
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => remove(g.id)}
                aria-label="Delete goal"
              >
                ✕
              </button>
            </div>
          ))
        )}

        <div className="add-row">
          <input
            className="add-input"
            placeholder="Add a goal for today…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
          />
          <button className="btn btn-emerald btn-sm" onClick={add}>Add</button>
        </div>

        {done === goals.length && goals.length > 0 && (
          <div style={{ marginTop: 14, padding: '12px', background: '#1e3a28', borderRadius: 10, color: '#e8c96a', fontSize: 13, textAlign: 'center' }}>
            🎯 All goals completed! Barak Allahu feekum!
          </div>
        )}
      </div>
    </>
  )
}
