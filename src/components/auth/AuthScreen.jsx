import { useState } from 'react'

/**
 * AuthScreen.jsx
 *
 * To use real Supabase auth, replace the handleSubmit function with:
 *
 *   import { supabase } from '../../utils/db'
 *
 *   // Email + password login:
 *   const { data, error } = await supabase.auth.signInWithPassword({ email, password })
 *
 *   // Sign up:
 *   const { data, error } = await supabase.auth.signUp({ email, password })
 *
 *   // Google OAuth (recommended):
 *   const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
 *
 *   if (data?.user) onLogin(data.user)
 */

const styles = `
  .auth-wrap {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: radial-gradient(ellipse at 50% 30%, #1e3a28 0%, #0f1a14 70%);
    padding: 20px;
  }
  .auth-card {
    background: #1e2d22; border: 1px solid #2e4535; border-radius: 24px;
    padding: 48px 40px; width: 100%; max-width: 400px; text-align: center;
    box-shadow: 0 40px 80px rgba(0,0,0,0.5);
    animation: fadeUp .4s ease;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .auth-star { font-size: 52px; margin-bottom: 16px; }
  .auth-title {
    font-family: 'Playfair Display', serif; font-size: 28px;
    color: #c9a84c; margin-bottom: 6px;
  }
  .auth-sub { color: #8a9e8d; font-size: 14px; margin-bottom: 32px; line-height: 1.5; }
  .auth-input {
    width: 100%; padding: 12px 16px; background: #0f1a14; border: 1px solid #2e4535;
    border-radius: 10px; color: #f0ede4; font-family: 'DM Sans', sans-serif;
    font-size: 14px; margin-bottom: 12px; outline: none; transition: border .2s;
  }
  .auth-input:focus { border-color: #c9a84c; }
  .auth-divider { display: flex; align-items: center; gap: 12px; margin: 16px 0; color: #8a9e8d; font-size: 12px; }
  .auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: #2e4535; }
  .auth-google {
    width: 100%; padding: 12px; background: #0f1a14; border: 1px solid #2e4535;
    border-radius: 10px; color: #f0ede4; font-family: 'DM Sans', sans-serif;
    font-size: 14px; cursor: pointer; display: flex; align-items: center;
    justify-content: center; gap: 10px; transition: border .2s, background .2s;
    margin-bottom: 12px;
  }
  .auth-google:hover { border-color: #c9a84c; background: #172018; }
  .auth-toggle { margin-top: 16px; color: #8a9e8d; font-size: 13px; }
  .auth-toggle span { color: #c9a84c; cursor: pointer; }
  .auth-demo {
    margin-top: 24px; padding: 12px; background: #0f1a14;
    border-radius: 8px; font-size: 12px; color: #8a9e8d; line-height: 1.5;
  }
  .auth-error {
    background: #2a1515; border: 1px solid #c0544a; border-radius: 8px;
    padding: 10px 14px; color: #e88; font-size: 13px; margin-bottom: 12px;
  }
`

export default function AuthScreen({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email || !password) { setError('Please enter your email and password.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setError('')
    setLoading(true)

    // ── Mock auth (replace with real Supabase calls) ──────────────────────
    await new Promise((r) => setTimeout(r, 600))
    onLogin({
      id: `user_${btoa(email).slice(0, 8)}`,
      email,
      name: email.split('@')[0],
    })
    // ──────────────────────────────────────────────────────────────────────

    setLoading(false)
  }

  const handleGoogle = () => {
    // ── Replace with: supabase.auth.signInWithOAuth({ provider: 'google' }) ──
    alert('Connect Supabase to enable Google OAuth.\nSee src/utils/db.js for instructions.')
  }

  return (
    <>
      <style>{styles}</style>
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-star">☽</div>
          <div className="auth-title">Ramadan Planner</div>
          <div className="auth-sub">
            Track your spiritual journey through Ramadan 1447.
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-google" onClick={handleGoogle}>
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>

          <div className="auth-divider">or</div>

          <input
            className="auth-input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />

          <button
            className="btn btn-primary btn-full"
            onClick={handleSubmit}
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1, marginTop: 4 }}
          >
            {loading ? 'Signing in…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          <div className="auth-toggle">
            {mode === 'login' ? "Don't have an account? " : 'Already have one? '}
            <span onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError('') }}>
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </span>
          </div>

          <div className="auth-demo">
            💡 Any email/password works in demo mode.<br />
            See <code>src/utils/db.js</code> to connect real Supabase.
          </div>
        </div>
      </div>
    </>
  )
}
