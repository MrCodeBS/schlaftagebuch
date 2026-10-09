import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { format, parseISO, startOfWeek, } from 'date-fns';
import { de } from 'date-fns/locale';
import { calculateSleepStats } from '../utils/calculations';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Weekly() {
  const { entries, settings } = useStore();

  const weeklyData = useMemo(() => {
    const weeks: Record<string, any[]> = {};
    
    Object.values(entries).forEach((entry: any) => {
      const stats = calculateSleepStats(entry);
      if (!stats) return;
      
      const date = parseISO(entry.id);
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      const weekKey = format(weekStart, 'yyyy-MM-dd');
      
      if (!weeks[weekKey]) {
        weeks[weekKey] = [];
      }
      weeks[weekKey].push(stats);
    });

    return Object.entries(weeks)
      .map(([weekStart, statsList]) => {
        const avgEff = statsList.reduce((acc, s) => acc + s.sleepEfficiency, 0) / statsList.length;
        const avgSleep = statsList.reduce((acc, s) => acc + s.totalSleepTime, 0) / statsList.length / 60; // hours
        return {
          week: format(parseISO(weekStart), 'dd.MM.', { locale: de }),
          effizienz: Math.round(avgEff),
          schlafzeit: Number(avgSleep.toFixed(1)),
          anzahl: statsList.length,
          rawDate: weekStart
        };
      })
      .sort((a, b) => a.rawDate.localeCompare(b.rawDate));
  }, [entries]);

  return (
    <div className="pt-4 pb-8">
      <h1 className="text-3xl font-bold mb-6">Wochen-Übersicht</h1>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl mb-8 border border-blue-100 dark:border-blue-800">
        <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Dein Schlaffenster</h3>
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-xl">
          <div className="text-center flex-1">
            <span className="block text-sm text-gray-500">Bettzeit</span>
            <span className="font-bold text-lg">{settings.prescribedBedtime}</span>
          </div>
          <div className="text-gray-300 dark:text-gray-600">-</div>
          <div className="text-center flex-1">
            <span className="block text-sm text-gray-500">Aufstehen</span>
            <span className="font-bold text-lg">{settings.prescribedOutOfBedTime}</span>
          </div>
        </div>
      </div>

      <h3 className="font-bold text-xl mb-4">Schlafeffizienz (%)</h3>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-64 mb-8">
        {weeklyData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="week" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => [`${value} %`, 'Effizienz']}
              />
              <Line type="monotone" dataKey="effizienz" stroke="#2563eb" strokeWidth={4} dot={{ r: 6, fill: '#2563eb' }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Nicht genug Daten für ein Diagramm.
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {weeklyData.slice().reverse().map(week => (
          <div key={week.rawDate} className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
            <div>
              <span className="font-bold block">Woche {week.week}</span>
              <span className="text-sm text-gray-500">{week.anzahl} Nächte</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-blue-600 dark:text-blue-400 block">{week.effizienz} %</span>
              <span className="text-sm text-gray-500">{week.schlafzeit} Std. Ø</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
