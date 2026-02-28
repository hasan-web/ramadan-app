import { useState, useRef } from 'react'
import { db, today } from '../../utils/db'
import { getRamadanDay, getUserTimezone } from '../../utils/ramadan'

const PROMPTS = [
  'What am I grateful for today?',
  'How did I feel during prayer today?',
  'What is one thing I want to improve tomorrow?',
  'What touched my heart in the Quran today?',
  'How can I be more generous this week?',
  'What dua do I want to make tonight?',
  'How has this Ramadan changed me so far?',
  'What moment today made me feel closest to Allah?',
  'What is one habit I want to carry past Ramadan?',
  'What am I struggling with and how can I overcome it?',
]

const styles = `
  .reflection-prompt { font-size: 14px; color: #c9a84c; font-style: italic; margin-bottom: 14px; padding: 12px 16px; background: #1a2a1f; border-left: 3px solid #c9a84c; border-radius: 0 8px 8px 0; line-height: 1.5; }
  .reflection-ta {
    width: 100%; min-height: 140px; background: #0f1a14; border: 1px solid #2e4535;
    border-radius: 10px; color: #f0ede4; font-family: 'DM Sans', sans-serif;
    font-size: 14px; padding: 14px; resize: vertical; outline: none;
    transition: border .2s; line-height: 1.7;
  }
  .reflection-ta:focus { border-color: #c9a84c; }
  .reflection-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; }
  .saved-badge { font-size: 11px; color: #4fa068; opacity: 0; transition: opacity .3s; }
  .saved-badge.show { opacity: 1; }
  .char-count { font-size: 11px; color: #8a9e8d; }
  .prompt-nav { display: flex; gap: 8px; margin-bottom: 14px; }
`

export default function ReflectionJournal() {
  const tz = getUserTimezone()
  const day = getRamadanDay(tz) || 1
  const key = `reflection_${today()}`
  const promptIdx = (day - 1) % PROMPTS.length

  const [text, setText] = useState(() => db.get(key) || '')
  const [saved, setSaved] = useState(false)
  const [promptI, setPromptI] = useState(promptIdx)
  const timerRef = useRef(null)

  const onChange = (v) => {
    setText(v)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      db.set(key, v)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 700)
  }

  const nextPrompt = () => setPromptI((i) => (i + 1) % PROMPTS.length)
  const prevPrompt = () => setPromptI((i) => (i - 1 + PROMPTS.length) % PROMPTS.length)

  return (
    <>
      <style>{styles}</style>
      <div className="section">
        <div className="section-title">🪷 Daily Reflection</div>

        <div className="prompt-nav">
          <button className="btn btn-ghost btn-sm" onClick={prevPrompt}>←</button>
          <button className="btn btn-ghost btn-sm" onClick={nextPrompt} style={{ marginLeft: 'auto' }}>Next prompt →</button>
        </div>

        <div className="reflection-prompt">
          "{PROMPTS[promptI]}"
        </div>

        <textarea
          className="reflection-ta"
          placeholder="Write your thoughts here… this is your private space."
          value={text}
          onChange={(e) => onChange(e.target.value)}
        />

        <div className="reflection-footer">
          <div className={`saved-badge ${saved ? 'show' : ''}`}>✓ Auto-saved</div>
          <div className="char-count">{text.length} characters</div>
        </div>
      </div>
    </>
  )
}
