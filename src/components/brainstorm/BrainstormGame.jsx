import { useState, useRef, useEffect } from 'react'
import { db, today } from '../../utils/db'

// ── Challenge bank ──────────────────────────────────────────────────────────
const CHALLENGES = [
  {
    q: 'Name 5 acts of Sadaqah you can do today without spending money',
    category: 'Generosity', time: 60,
    tip: 'Think about smiling, sharing knowledge, helping someone, removing harm from a path…',
  },
  {
    q: 'List 3 duas you want to memorize before Ramadan ends',
    category: 'Dhikr', time: 90,
    tip: 'Consider duas for entering/leaving home, before eating, dua Qunoot…',
  },
  {
    q: 'What is one spiritual habit you will carry after Ramadan? How will you maintain it?',
    category: 'Growth', time: 90,
    tip: 'Think specifically — not just "pray more" but exactly when, where, how.',
  },
  {
    q: 'Name 5 things you are genuinely grateful for right now',
    category: 'Gratitude', time: 45,
    tip: 'Go beyond the obvious — think of small blessings you often overlook.',
  },
  {
    q: 'List 3 concrete ways you can improve your focus (khushu) in Salah',
    category: 'Prayer', time: 90,
    tip: 'Think about preparation, posture, understanding the words, what you recite…',
  },
  {
    q: 'Which Surah or ayah has moved you most this Ramadan and why?',
    category: 'Quran', time: 120,
    tip: 'Explain the meaning and what personal connection it has for you.',
  },
  {
    q: 'Name 4 people you will make sincere dua for tonight — and why',
    category: 'Community', time: 60,
    tip: 'Think of family, friends, those going through hardship, or people you\'ve wronged.',
  },
  {
    q: 'What is your single biggest spiritual goal to achieve by Eid? How will you get there?',
    category: 'Growth', time: 120,
    tip: 'Be specific. Break it into small steps you can take each remaining day.',
  },
  {
    q: 'Describe one way you can be a better family member during the remaining days of Ramadan',
    category: 'Community', time: 60,
    tip: 'Think about patience, helping with iftar, making someone feel valued…',
  },
  {
    q: 'What does Laylatul Qadr mean to you personally? What will you do on the odd nights?',
    category: 'Worship', time: 90,
    tip: 'Think beyond just staying up — what specific ibadah, what duas, what intention?',
  },
]

// ── Example answers shown to new users ─────────────────────────────────────
const EXAMPLE_ANSWERS = [
  {
    q: 'Name 5 acts of Sadaqah you can do today without spending money',
    category: 'Generosity',
    a: '1. Smile at every family member today — the Prophet ﷺ said smiling is sadaqah.\n2. Share a beneficial hadith or reminder with my WhatsApp group.\n3. Help my mother with household chores without being asked.\n4. Remove that broken glass from the pathway outside our building.\n5. Listen patiently and fully to my younger sibling when they want to talk.',
    pts: 48,
  },
  {
    q: 'What is one spiritual habit you will carry after Ramadan?',
    category: 'Growth',
    a: 'I want to continue the Fajr prayer on time every single day. During Ramadan it\'s easier because I\'m already awake for Suhoor. After Ramadan, I\'ll set an alarm 15 minutes before Fajr, keep my wudu supplies next to my bed, and text a friend each morning as accountability. The habit feels natural now — I just need to protect the time.',
    pts: 61,
  },
  {
    q: 'Name 4 people you will make sincere dua for tonight',
    category: 'Community',
    a: '1. My father — he works so hard for us and rarely complains. I want Allah to grant him health and ease.\n2. My friend who is going through a divorce — she\'s struggling and hiding it. May Allah give her sabr and a way out.\n3. The Muslims in Gaza — I can\'t stop thinking about them during iftar when I eat comfortably.\n4. My old teacher who guided me toward deen — I haven\'t thanked her enough.',
    pts: 52,
  },
]

const styles = `
  .game-wrap { }
  .game-hero {
    background: linear-gradient(135deg, #0d2535, #0f1a14);
    border: 1px solid #1e4060; border-radius: 16px;
    padding: 28px 24px; margin-bottom: 20px; text-align: center;
  }
  .game-title { font-family: 'Playfair Display', serif; font-size: 24px; color: #7ecde8; margin-bottom: 8px; }
  .game-desc { color: #8a9e8d; font-size: 14px; line-height: 1.7; max-width: 440px; margin: 0 auto 24px; }
  .game-badge { display: inline-block; background: #1a3a45; border: 1px solid #2e6070; border-radius: 99px; padding: 3px 12px; font-size: 11px; color: #7ecde8; margin-bottom: 16px; }
  .game-card { background: #172018; border: 1px solid #1e4060; border-radius: 14px; padding: 28px; margin-bottom: 20px; }
  .game-meta { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .game-cat { padding: 4px 12px; border-radius: 99px; background: #1a3a45; border: 1px solid #2e6070; color: #7ecde8; font-size: 12px; }
  .game-timer { font-family: 'Playfair Display', serif; font-size: 24px; margin-left: auto; }
  .game-timer.ok { color: #e8c96a; }
  .game-timer.urgent { color: #d4876a; animation: pulse .5s ease infinite alternate; }
  @keyframes pulse { from { opacity: 1; } to { opacity: .5; } }
  .game-q { font-size: 18px; font-weight: 500; color: #f0ede4; line-height: 1.6; margin-bottom: 8px; }
  .game-tip { font-size: 12px; color: #8a9e8d; font-style: italic; margin-bottom: 16px; }
  .game-ta {
    width: 100%; min-height: 120px; background: #0a1210; border: 1px solid #1e4060;
    border-radius: 10px; color: #f0ede4; font-family: 'DM Sans', sans-serif;
    font-size: 14px; padding: 14px; resize: none; outline: none; line-height: 1.7;
    transition: border .2s;
  }
  .game-ta:focus { border-color: #7ecde8; }
  .game-wc { font-size: 11px; color: #8a9e8d; margin-top: 6px; text-align: right; }
  .game-actions { display: flex; gap: 10px; margin-top: 14px; }
  .game-score-big { font-family: 'Playfair Display', serif; font-size: 64px; color: #7ecde8; text-align: center; margin: 20px 0; }
  .game-score-lbl { text-align: center; color: #8a9e8d; font-size: 14px; }
  .result-actions { display: flex; gap: 12px; justify-content: center; margin-top: 24px; }

  /* Example answers */
  .examples-section { margin-bottom: 20px; }
  .examples-title { font-family: 'Playfair Display', serif; font-size: 18px; color: #7ecde8; margin-bottom: 4px; display: flex; align-items: center; gap: 10px; }
  .examples-sub { font-size: 13px; color: #8a9e8d; margin-bottom: 16px; }
  .example-card { background: #0a1210; border: 1px solid #1e4060; border-radius: 12px; padding: 18px; margin-bottom: 12px; }
  .example-q { font-size: 12px; color: #7ecde8; margin-bottom: 8px; font-weight: 500; }
  .example-a { font-size: 13px; color: #c0cec0; line-height: 1.7; white-space: pre-line; }
  .example-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; }
  .example-cat { font-size: 11px; color: #8a9e8d; }
  .example-pts { font-size: 12px; color: #7ecde8; font-weight: 500; }

  /* History */
  .history-card { background: #0a1210; border: 1px solid #1e4060; border-radius: 12px; padding: 16px; margin-bottom: 10px; }
  .history-q { font-size: 12px; color: #7ecde8; margin-bottom: 6px; }
  .history-a { font-size: 13px; color: #8a9e8d; line-height: 1.6; white-space: pre-line; }
  .history-footer { display: flex; justify-content: space-between; margin-top: 8px; font-size: 11px; color: #8a9e8d; }

  /* Round progress */
  .round-dots { display: flex; gap: 8px; justify-content: center; margin-bottom: 20px; }
  .round-dot { width: 10px; height: 10px; border-radius: 50%; background: #1e4060; transition: background .3s; }
  .round-dot.done { background: #7ecde8; }
  .round-dot.current { background: #7ecde8; box-shadow: 0 0 0 3px rgba(126,205,232,.25); }
`

const TOTAL_ROUNDS = 3

export default function BrainstormGame() {
  const [phase, setPhase] = useState('menu') // menu | playing | result
  const [challengeIdx, setChallengeIdx] = useState(0)
  const [answer, setAnswer] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0) // 0-indexed
  const [sessionAnswers, setSessionAnswers] = useState([])
  const [history, setHistory] = useState(() => db.get('brainstorm_history') || [])
  const timerRef = useRef(null)

  const challenge = CHALLENGES[challengeIdx]
  const isNewUser = history.length === 0

  // ── Timer ────────────────────────────────────────────────────────────────
  const startTimer = (seconds) => {
    setTimeLeft(seconds)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          // Auto-submit on timeout — call via ref to avoid stale closure
          submitAnswerRef.current(true)
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  // ── Submit answer (uses ref to avoid stale state in timer closure) ────────
  const submitAnswerRef = useRef(null)

  const submitAnswer = (auto = false) => {
    clearInterval(timerRef.current)
    const words = answer.trim().split(/\s+/).filter(Boolean).length
    const pts = words * 2 + (auto ? 0 : 15) + (words >= 30 ? 10 : 0) // bonus for long answers
    const newScore = score + pts

    const entry = {
      q: challenge.q,
      category: challenge.category,
      a: answer.trim(),
      pts,
      date: today(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    const newSession = [...sessionAnswers, entry]
    setSessionAnswers(newSession)
    setScore(newScore)

    const newHistory = [entry, ...history].slice(0, 30)
    setHistory(newHistory)
    db.set('brainstorm_history', newHistory)

    const nextRound = round + 1
    if (nextRound >= TOTAL_ROUNDS) {
      setRound(nextRound)
      setPhase('result')
    } else {
      // Pick a non-repeating next challenge
      const usedIdx = newSession.map((_, i) => (challengeIdx - newSession.length + 1 + i + CHALLENGES.length) % CHALLENGES.length)
      let nextIdx = (challengeIdx + 1) % CHALLENGES.length
      setRound(nextRound)
      setChallengeIdx(nextIdx)
      setAnswer('')
      setTimeout(() => startTimer(CHALLENGES[nextIdx].time), 400)
    }
  }

  submitAnswerRef.current = submitAnswer

  // ── Start game ────────────────────────────────────────────────────────────
  const startGame = () => {
    const startIdx = Math.floor(Math.random() * CHALLENGES.length)
    setChallengeIdx(startIdx)
    setAnswer('')
    setScore(0)
    setRound(0)
    setSessionAnswers([])
    setPhase('playing')
    startTimer(CHALLENGES[startIdx].time)
  }

  useEffect(() => () => clearInterval(timerRef.current), [])

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length

  // ── MENU ─────────────────────────────────────────────────────────────────
  if (phase === 'menu') return (
    <>
      <style>{styles}</style>
      <div className="game-wrap">
        <div className="game-hero">
          <div className="game-badge">✨ NEW FEATURE</div>
          <div className="game-title">🧩 Spiritual Brainstorm</div>
          <div className="game-desc">
            Sharpen your Islamic reflection with timed challenges. Answer thought-provoking prompts quickly
            to earn points and deepen your spiritual awareness. {TOTAL_ROUNDS} rounds per session.
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-blue" style={{ minWidth: 180 }} onClick={startGame}>
              Start Challenge
            </button>
          </div>
          <div style={{ marginTop: 16, fontSize: 12, color: '#8a9e8d' }}>
            Scoring: 2 pts per word · +15 pts for submitting before time · +10 pts for 30+ word answers
          </div>
        </div>

        {/* Example answers for new users OR history for returning users */}
        {isNewUser ? (
          <div className="section" style={{ borderColor: '#1e4060', background: '#0f1a20' }}>
            <div className="examples-title">💡 Example Answers</div>
            <div className="examples-sub">
              Here's what thoughtful responses look like — yours will be saved here after your first game.
            </div>
            {EXAMPLE_ANSWERS.map((ex, i) => (
              <div key={i} className="example-card">
                <div className="example-q">"{ex.q}"</div>
                <div className="example-a">{ex.a}</div>
                <div className="example-footer">
                  <span className="example-cat">🏷 {ex.category}</span>
                  <span className="example-pts">~{ex.pts} pts</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="section" style={{ borderColor: '#1e4060', background: '#0f1a20' }}>
            <div className="examples-title" style={{ marginBottom: 4 }}>📜 Your Past Answers</div>
            <div style={{ fontSize: 13, color: '#8a9e8d', marginBottom: 16 }}>
              {history.length} answer{history.length > 1 ? 's' : ''} saved
            </div>
            {history.slice(0, 6).map((h, i) => (
              <div key={i} className="history-card">
                <div className="history-q">{h.q}</div>
                <div className="history-a">{h.a || <em style={{ color: '#3a5040' }}>No answer submitted</em>}</div>
                <div className="history-footer">
                  <span>🏷 {h.category}</span>
                  <span>{h.pts} pts · {h.date} {h.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )

  // ── RESULT ────────────────────────────────────────────────────────────────
  if (phase === 'result') return (
    <>
      <style>{styles}</style>
      <div className="game-hero" style={{ padding: 40 }}>
        <div style={{ fontSize: 48 }}>🎉</div>
        <div className="game-title" style={{ marginTop: 12 }}>Session Complete!</div>
        <div className="game-score-big">{score}</div>
        <div className="game-score-lbl">points earned this session</div>
        <div style={{ fontSize: 14, color: '#8a9e8d', marginTop: 12, marginBottom: 24 }}>
          {score > 100
            ? 'MashaAllah! Exceptional reflection. May Allah put barakah in your intentions.'
            : score > 50
            ? 'Good effort! Your answers have been saved to your journal.'
            : 'Every step of reflection is rewarded. Keep going!'}
        </div>

        {/* Session recap */}
        {sessionAnswers.length > 0 && (
          <div style={{ textAlign: 'left', marginBottom: 24 }}>
            {sessionAnswers.map((a, i) => (
              <div key={i} className="history-card" style={{ marginBottom: 8 }}>
                <div className="history-q">{a.q}</div>
                <div className="history-a">{a.a || <em style={{ color: '#3a5040' }}>Skipped</em>}</div>
                <div className="history-footer"><span>{a.category}</span><span>{a.pts} pts</span></div>
              </div>
            ))}
          </div>
        )}

        <div className="result-actions">
          <button className="btn btn-blue" onClick={startGame}>Play Again</button>
          <button className="btn btn-ghost" onClick={() => setPhase('menu')}>View History</button>
        </div>
      </div>
    </>
  )

  // ── PLAYING ───────────────────────────────────────────────────────────────
  return (
    <>
      <style>{styles}</style>
      <div className="game-wrap">
        <div className="game-hero" style={{ padding: '20px 24px', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="game-badge">Round {round + 1} of {TOTAL_ROUNDS}</div>
            <div style={{ color: '#c9a84c', fontFamily: "'Playfair Display', serif" }}>
              {score} pts
            </div>
          </div>
          <div className="round-dots" style={{ marginTop: 12, marginBottom: 0 }}>
            {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
              <div key={i} className={`round-dot ${i < round ? 'done' : i === round ? 'current' : ''}`} />
            ))}
          </div>
        </div>

        <div className="game-card">
          <div className="game-meta">
            <div className="game-cat">🏷 {challenge.category}</div>
            <div className={`game-timer ${timeLeft <= 15 ? 'urgent' : 'ok'}`}>
              {fmt(timeLeft)}
            </div>
          </div>

          <div className="game-q">{challenge.q}</div>
          <div className="game-tip">💡 {challenge.tip}</div>

          <textarea
            className="game-ta"
            placeholder="Type your answer here… More words = more points. Be specific and sincere."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            autoFocus
          />
          <div className="game-wc">{wordCount} word{wordCount !== 1 ? 's' : ''}</div>

          <div className="game-actions">
            <button
              className="btn btn-blue"
              onClick={() => submitAnswer(false)}
            >
              Submit Answer →
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => { clearInterval(timerRef.current); setPhase('menu') }}
            >
              Quit
            </button>
          </div>

          {timeLeft <= 15 && timeLeft > 0 && (
            <div style={{ marginTop: 12, fontSize: 13, color: '#d4876a', textAlign: 'center' }}>
              ⏰ {timeLeft} seconds remaining — submit when ready!
            </div>
          )}
        </div>
      </div>
    </>
  )
}
