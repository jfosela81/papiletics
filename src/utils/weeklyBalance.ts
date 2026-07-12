export interface TrackingEntry {
  fecha: string;
  kcal: number;
  proteina: number;
  entreno?: string;
  notas?: string;
}

export interface WeeklyBalance {
  weekStart: string;
  weekLabel: string;
  daysLogged: number;
  totalKcal: number;
  avgKcal: number;
  balance: number;
  incomplete: boolean;
}

function parseDate(fecha: string): Date {
  return new Date(`${fecha}T12:00:00`);
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function formatWeekLabel(start: Date): string {
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  const a = start.toLocaleDateString('es-ES', opts);
  const b = end.toLocaleDateString('es-ES', opts);
  return start.getMonth() === end.getMonth() ? `${start.getDate()}–${b}` : `${a} – ${b}`;
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function aggregateWeeklyBalance(
  entries: TrackingEntry[],
  tdee: number,
): WeeklyBalance[] {
  const byWeek = new Map<string, TrackingEntry[]>();

  for (const entry of entries) {
    const weekStart = isoDate(startOfWeek(parseDate(entry.fecha)));
    const list = byWeek.get(weekStart) ?? [];
    list.push(entry);
    byWeek.set(weekStart, list);
  }

  const today = parseDate(isoDate(new Date()));
  const currentWeekStart = isoDate(startOfWeek(today));

  return [...byWeek.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([weekStart, days]) => {
      const totalKcal = days.reduce((sum, d) => sum + d.kcal, 0);
      const daysLogged = days.length;
      const balance = tdee * daysLogged - totalKcal;
      const incomplete =
        daysLogged < 7 || weekStart === currentWeekStart;

      return {
        weekStart,
        weekLabel: formatWeekLabel(parseDate(weekStart)),
        daysLogged,
        totalKcal,
        avgKcal: Math.round(totalKcal / daysLogged),
        balance,
        incomplete,
      };
    });
}

export type ChartMode = 'empty' | 'preview' | 'full';

export function getChartMode(totalDays: number): ChartMode {
  if (totalDays < 7) return 'empty';
  if (totalDays < 14) return 'preview';
  return 'full';
}

export function sortByDateDesc<T extends { fecha: string }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => b.fecha.localeCompare(a.fecha));
}
