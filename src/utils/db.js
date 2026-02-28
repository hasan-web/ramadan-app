/**
 * db.js — Supabase-ready data layer
 *
 * Currently uses localStorage as a mock. To switch to real Supabase:
 *
 * 1. npm install @supabase/supabase-js
 * 2. Create a .env file:
 *      VITE_SUPABASE_URL=https://xxxx.supabase.co
 *      VITE_SUPABASE_ANON_KEY=your-anon-key
 * 3. Uncomment the Supabase client below and replace
 *    the localStorage calls with supabase.from(...) queries.
 *
 * Supabase tables needed:
 *   - prayers    (user_id, date, fajr, dhuhr, asr, maghrib, isha, taraweeh)
 *   - quran_logs (user_id, date, pages_read)
 *   - goals      (user_id, date, goal_text, completed)
 *   - reflections(user_id, date, reflection_text)
 *   - dhikr_logs (user_id, date, count)
 *   - brainstorm (user_id, date, question, answer, score)
 *
 * Enable Row Level Security (RLS) on all tables with policy:
 *   auth.uid() = user_id
 */

// ── Uncomment to use real Supabase ──────────────────────────────────────────
// import { createClient } from '@supabase/supabase-js'
// export const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL,
//   import.meta.env.VITE_SUPABASE_ANON_KEY
// )
// ────────────────────────────────────────────────────────────────────────────

export const db = {
  get(key) {
    try {
      const val = localStorage.getItem(key)
      return val ? JSON.parse(val) : null
    } catch {
      return null
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },

  remove(key) {
    localStorage.removeItem(key)
  },
}

export const today = () => new Date().toISOString().slice(0, 10)
