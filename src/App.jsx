import { useState } from 'react'
import { db } from './utils/db'

import AuthScreen    from './components/auth/AuthScreen'
import Header        from './components/layout/Header'
import Nav           from './components/layout/Nav'
import DayBanner     from './components/dashboard/DayBanner'
import Dashboard     from './components/dashboard/Dashboard'
import PrayerTracker from './components/prayers/PrayerTracker'
import QuranTracker  from './components/quran/QuranTracker'
import DailyGoals    from './components/goals/DailyGoals'
import DhikrCounter  from './components/dhikr/DhikrCounter'
import ReflectionJournal from './components/reflection/ReflectionJournal'
import BrainstormGame    from './components/brainstorm/BrainstormGame'

/**
 * App.jsx — Root component
 *
 * Auth state is managed here. In production with Supabase:
 *
 *   import { supabase } from './utils/db'
 *   import { useEffect } from 'react'
 *
 *   useEffect(() => {
 *     // Get current session on mount
 *     supabase.auth.getSession().then(({ data: { session } }) => {
 *       setUser(session?.user ?? null)
 *     })
 *     // Listen for auth state changes
 *     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
 *       setUser(session?.user ?? null)
 *     })
 *     return () => subscription.unsubscribe()
 *   }, [])
 */

const TABS = ['dashboard', 'prayers', 'quran', 'goals', 'dhikr', 'reflection', 'brainstorm']

const TAB_COMPONENTS = {
  dashboard:  Dashboard,
  prayers:    PrayerTracker,
  quran:      QuranTracker,
  goals:      DailyGoals,
  dhikr:      DhikrCounter,
  reflection: ReflectionJournal,
  brainstorm: BrainstormGame,
}

export default function App() {
  const [user, setUser] = useState(() => db.get('rp_auth_user'))
  const [tab, setTab] = useState('dashboard')

  const handleLogin = (userData) => {
    db.set('rp_auth_user', userData)
    setUser(userData)
  }

  const handleLogout = () => {
    // With real Supabase: await supabase.auth.signOut()
    db.remove('rp_auth_user')
    setUser(null)
    setTab('dashboard')
  }

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />
  }

  const ActiveTab = TAB_COMPONENTS[tab] || Dashboard

  return (
    <>
      <Header user={user} onLogout={handleLogout} />
      <main className="app">
        <DayBanner />
        <Nav tab={tab} setTab={setTab} />
        <ActiveTab />
      </main>
    </>
  )
}
