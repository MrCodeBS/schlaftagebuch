import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  getDay,
  isToday,
  isFuture,
} from 'date-fns';
import { de } from 'date-fns/locale';
import { calculateSleepStats } from '../utils/calculations';
import type { SleepEntry } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

export default function History() {
  const { entries } = useStore();
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Build calendar grid for current month
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // getDay returns 0=Sun, we want 0=Mon
    let startDow = getDay(monthStart) - 1;
    if (startDow < 0) startDow = 6;

    return { days, startDow };
  }, [currentMonth]);

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 85) return 'bg-green-500 dark:bg-green-600';
    if (efficiency >= 75) return 'bg-yellow-400 dark:bg-yellow-500';
    return 'bg-red-400 dark:bg-red-500';
  };

  const getEfficiencyBorder = (efficiency: number) => {
    if (efficiency >= 85) return 'ring-green-500';
    if (efficiency >= 75) return 'ring-yellow-400';
    return 'ring-red-400';
  };

  const handleDayClick = (dateStr: string) => {
    const dayDate = parseISO(dateStr);
    if (isFuture(dayDate) && !isToday(dayDate)) return; // Can't fill in future days

    const entry = entries[dateStr];
    if (entry) {
      // Edit existing entry
      navigate('/protocol/evening/' + dateStr);
    } else {
      // Create new entry for that day
      navigate('/protocol/evening/' + dateStr);
    }
  };

  // Entries for the selected month as a list (below the calendar)
  const monthEntries = useMemo(() => {
    return (Object.values(entries) as SleepEntry[])
      .filter((e) => {
        const d = parseISO(e.id);
        return (
          d.getMonth() === currentMonth.getMonth() &&
          d.getFullYear() === currentMonth.getFullYear()
        );
      })
      .sort((a, b) => b.id.localeCompare(a.id));
  }, [entries, currentMonth]);

  return (
    <div className="pt-4 pb-8">
      <h1 className="text-3xl font-bold mb-6">Verlauf</h1>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
          className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-transform"
          aria-label="Vorheriger Monat"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-bold">
          {format(currentMonth, 'MMMM yyyy', { locale: de })}
        </h2>
        <button
          onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
          className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-transform"
          aria-label="Nächster Monat"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 border border-gray-100 dark:border-gray-700 shadow-sm mb-6">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="text-center text-xs font-bold text-gray-400 dark:text-gray-500 py-1"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells before the 1st */}
          {Array.from({ length: calendarDays.startDow }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {calendarDays.days.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const entry = entries[dateStr] as SleepEntry | undefined;
            const stats = entry ? calculateSleepStats(entry) : null;
            const future = isFuture(day) && !isToday(day);
            const today = isToday(day);

            return (
              <button
                key={dateStr}
                onClick={() => handleDayClick(dateStr)}
                disabled={future}
                className={`
                  aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium
                  transition-all active:scale-90 relative
                  ${future ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700'}
                  ${today ? 'ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-800' : ''}
                  ${entry && stats ? `ring-2 ${getEfficiencyBorder(stats.sleepEfficiency)} ring-offset-1 dark:ring-offset-gray-800` : ''}
                `}
              >
                <span className={`${today ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}`}>
                  {format(day, 'd')}
                </span>

                {/* Efficiency dot */}
                {stats && (
                  <div
                    className={`w-2 h-2 rounded-full mt-0.5 ${getEfficiencyColor(stats.sleepEfficiency)}`}
                    title={`${Math.round(stats.sleepEfficiency)} %`}
                  />
                )}

                {/* Estimated badge */}
                {entry?.isEstimated && (
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-yellow-400 rounded-full border border-white dark:border-gray-800" />
                )}

                {/* Empty day indicator (past, no entry) */}
                {!entry && !future && !today && (
                  <div className="w-2 h-2 rounded-full mt-0.5 bg-gray-200 dark:bg-gray-600" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> ≥ 85 %
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" /> 75–84 %
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" /> &lt; 75 %
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-gray-600 inline-block" /> Fehlt
          </span>
        </div>
      </div>

      {/* Hint */}
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
        Tippe auf einen Tag, um ihn auszufüllen oder zu bearbeiten.
      </p>

      {/* Entries list for this month */}
      <h3 className="font-bold text-lg mb-3">
        Einträge im {format(currentMonth, 'MMMM', { locale: de })}
      </h3>

      {monthEntries.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>Keine Einträge in diesem Monat.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {monthEntries.map((entry) => {
            const stats = calculateSleepStats(entry);
            const date = parseISO(entry.id);

            const effColor = stats
              ? stats.sleepEfficiency >= 85
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800'
                : stats.sleepEfficiency >= 75
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
              : '';

            return (
              <div
                key={entry.id}
                onClick={() => navigate('/protocol/evening/' + entry.id)}
                className="cursor-pointer bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between active:scale-[0.98] transition-transform relative overflow-hidden"
              >
                {entry.isEstimated && (
                  <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                    GESCHÄTZT
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg">
                    {format(date, 'EEEE, dd.MM.yyyy', { locale: de })}
                  </h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex gap-3">
                    <span>🛏️ {entry.bedtime || '--:--'}</span>
                    <span>🌅 {entry.finalWakeUpTime || '--:--'}</span>
                  </div>
                </div>
                {stats && (
                  <div
                    className={`px-3 py-2 rounded-xl font-bold border ${effColor}`}
                  >
                    {Math.round(stats.sleepEfficiency)} %
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
