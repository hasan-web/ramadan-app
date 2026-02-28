/**
 * ramadan.js — Smart Ramadan day calculator
 *
 * Ramadan 2026 (1447 AH) start dates vary by region due to moonsighting:
 *
 *   Feb 18 → Saudi Arabia, Gulf states, North America (ISNA/FCNA calculation)
 *   Feb 19 → South Asia (India, Pakistan, Bangladesh), Turkey, Europe,
 *             Southeast Asia, Africa, Australia
 *
 * We detect the user's IANA timezone and map it to the correct start date.
 * No geolocation permission required — timezone is available instantly.
 *
 * Source: Al Jazeera, IslamicFinder, ISNA official announcements (Feb 2026)
 */

// Timezones that follow Feb 18 (Saudi / ISNA)
const FEB18_PREFIXES = [
  'Asia/Riyadh', 'Asia/Dubai', 'Asia/Kuwait', 'Asia/Muscat',
  'Asia/Qatar', 'Asia/Bahrain', 'Asia/Aden',
  'America/', // ISNA covers all North America → Feb 18
]

// Ramadan 2026 start dates
const RAMADAN_STARTS = {
  feb18: new Date('2026-02-18'),
  feb19: new Date('2026-02-19'),
}

const RAMADAN_TOTAL_DAYS = 30

/**
 * Returns the IANA timezone of the user.
 * Falls back to 'UTC' if unavailable.
 */
export function getUserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
}

/**
 * Returns the region label for display.
 */
export function getRegionLabel(tz) {
  if (!tz) return 'Global'
  if (tz.startsWith('America/')) return 'North America'
  if (tz.startsWith('Asia/R') || tz.startsWith('Asia/Dubai') || tz.startsWith('Asia/Kuwait')) return 'Gulf'
  if (tz.startsWith('Asia/K') || tz.startsWith('Asia/D') || tz.startsWith('Asia/C')) return 'South/Southeast Asia'
  if (tz.startsWith('Europe/')) return 'Europe'
  if (tz.startsWith('Africa/')) return 'Africa'
  if (tz.startsWith('Australia/') || tz.startsWith('Pacific/')) return 'Oceania'
  return 'Global'
}

/**
 * Determines the Ramadan 2026 start date based on user's timezone.
 * Returns a Date object.
 */
export function getRamadanStart(tz) {
  const useFeb18 = FEB18_PREFIXES.some((prefix) => tz.startsWith(prefix))
  return useFeb18 ? RAMADAN_STARTS.feb18 : RAMADAN_STARTS.feb19
}

/**
 * Returns today's Ramadan day number (1–30).
 * Returns null if today is before Ramadan or after it ends.
 */
export function getRamadanDay(tz) {
  const start = getRamadanStart(tz)
  const now = new Date()
  // Compare date only (strip time)
  const startDay = new Date(start.toISOString().slice(0, 10))
  const todayDay = new Date(now.toISOString().slice(0, 10))
  const diff = Math.floor((todayDay - startDay) / 86400000) + 1

  if (diff < 1) return null // Ramadan hasn't started yet
  if (diff > RAMADAN_TOTAL_DAYS) return null // Ramadan is over
  return diff
}

/**
 * Returns the Ramadan start date as a YYYY-MM-DD string.
 */
export function getRamadanStartStr(tz) {
  return getRamadanStart(tz).toISOString().slice(0, 10)
}

/**
 * Returns all 30 Ramadan dates as YYYY-MM-DD strings.
 */
export function getRamadanDates(tz) {
  const start = getRamadanStart(tz)
  return Array.from({ length: RAMADAN_TOTAL_DAYS }, (_, i) => {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    return d.toISOString().slice(0, 10)
  })
}

/**
 * Returns the progress percentage through Ramadan (0–100).
 */
export function getRamadanProgress(tz) {
  const day = getRamadanDay(tz)
  if (!day) return 0
  return Math.round((day / RAMADAN_TOTAL_DAYS) * 100)
}

/**
 * Returns a contextual message based on the Ramadan day.
 */
export function getDayMessage(day) {
  if (!day) return 'Ramadan Mubarak!'
  if (day <= 10) return 'First Ashra — Days of Mercy (رحمة)'
  if (day <= 20) return 'Second Ashra — Days of Forgiveness (مغفرة)'
  return 'Third Ashra — Salvation from Hellfire (نجاة)'
}

export { RAMADAN_TOTAL_DAYS }
