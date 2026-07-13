/** Monday 00:00 of the week containing `d`. */
export function startOfWeek(d: Date = new Date()): Date {
  const day = (d.getDay() + 6) % 7; // Mon=0 .. Sun=6
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  out.setDate(out.getDate() - day);
  return out;
}

/** Calendar-day key, stable across timezones for same-day comparisons. */
export function todayKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function greeting(hour: number = new Date().getHours()): string {
  if (hour < 6) return "Still up?";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/** "2026-07-13" for an `<input type="date">` value, in local time. */
export function toDateInputValue(d: Date = new Date()): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Parses an `<input type="date">` value ("YYYY-MM-DD") into a local-midnight timestamp. */
export function parseDateInputValue(value: string): number {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d).getTime();
}

/** "12:34" or "1:02:34" for durations at or past an hour. */
export function formatDuration(totalSeconds: number): string {
  const sec = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "Today", "Yesterday", or "Wed 12 Jul". */
export function formatDate(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const yesterday = new Date(now.getTime() - 86400000);
  if (todayKey(d) === todayKey(now)) return "Today";
  if (todayKey(d) === todayKey(yesterday)) return "Yesterday";
  return `${DAY_NAMES[d.getDay()]} ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
}

/** "Wed 12 Jul 2026, 9:04". */
export function formatFullDate(ts: number): string {
  const d = new Date(ts);
  return `${DAY_NAMES[d.getDay()]} ${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}, ${d.getHours()}:${pad(d.getMinutes())}`;
}

/** "12 Jul – 18 Jul" for the Statistics tab's week nav (Monday–Sunday). */
export function formatWeekRange(weekStartTs: number): string {
  const start = new Date(weekStartTs);
  const end = new Date(weekStartTs + 6 * 86400000);
  return `${start.getDate()} ${MONTH_NAMES[start.getMonth()]} – ${end.getDate()} ${MONTH_NAMES[end.getMonth()]}`;
}
