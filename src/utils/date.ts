const pad = (n: number) => String(n).padStart(2, '0')

/** Formats a Date using its LOCAL calendar day as YYYY-MM-DD (no UTC conversion). */
export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** Parses a YYYY-MM-DD string into a local Date at midnight (avoids UTC day-shift bugs). */
export function fromDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function todayKey(): string {
  return toDateKey(new Date())
}

export function isSameDay(a: Date, b: Date): boolean {
  return toDateKey(a) === toDateKey(b)
}

const LONG_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

export function formatLongDate(dateKey: string): string {
  return LONG_DATE_FORMATTER.format(fromDateKey(dateKey))
}

const MONTH_YEAR_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
})

export function formatMonthYear(date: Date): string {
  return MONTH_YEAR_FORMATTER.format(date)
}

const MONTH_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
})

export function formatMonthShort(dateKey: string): string {
  return MONTH_FORMATTER.format(fromDateKey(dateKey))
}

/** Returns the calendar grid (Mon-Sun weeks) for the month containing `monthDate`. */
export function getMonthGrid(monthDate: Date): Date[][] {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  const lastOfMonth = new Date(year, month + 1, 0)

  // Monday = 0 ... Sunday = 6
  const leadingEmpty = (firstOfMonth.getDay() + 6) % 7

  const days: Date[] = []
  for (let i = 0; i < leadingEmpty; i++) {
    days.push(new Date(year, month, 1 - (leadingEmpty - i)))
  }
  for (let d = 1; d <= lastOfMonth.getDate(); d++) {
    days.push(new Date(year, month, d))
  }
  while (days.length % 7 !== 0) {
    const last = days[days.length - 1]
    days.push(new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1))
  }

  const weeks: Date[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }
  return weeks
}

export function daysInMonth(monthDate: Date): number {
  return new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate()
}

export function addMonths(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1)
}

export function addDays(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + delta)
}
