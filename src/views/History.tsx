import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useStore } from '../store/useStore';
import { format, parseISO, eachDayOfInterval, subDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { calculateSleepStats } from '../utils/calculations';
import { Button } from '../components/ui/Button';
import type { SleepEntry } from '../types';

export default function History() {
  const { entries, saveEntry } = useStore();
  const navigate = useNavigate();
  
  const [showCatchup, setShowCatchup] = useState(false);
  const [catchupDays, setCatchupDays] = useState(3);
  
  const sortedEntries = (Object.values(entries) as SleepEntry[]).sort((a, b) => b.id.localeCompare(a.id));

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 85) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
    if (efficiency >= 75) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
  };

  const handleCatchup = () => {
    const today = new Date();
    const startDate = subDays(today, catchupDays);
    const dates = eachDayOfInterval({ start: startDate, end: today });
    
    let added = 0;
    dates.forEach(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      if (!entries[dateStr]) {
        // Create an estimated entry
        const estimatedEntry: SleepEntry = {
          id: dateStr,
          eveningCompleted: true,
          napped: false,
          alcohol: false,
          bedtime: '23:00',
          morningCompleted: true,
          lightOffTime: '23:15',
          minutesToFallAsleep: 15,
          awakeAtNight: false,
          finalWakeUpTime: '06:30',
          outOfBedTime: '06:45',
          medication: false,
          isEstimated: true,
          note: '',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        saveEntry(estimatedEntry);
        added++;
      }
    });
    
    setShowCatchup(false);
    alert(`${added} fehlende Tage wurden mit Standardwerten (als geschätzt markiert) nachgetragen. Du kannst sie nun einzeln bearbeiten.`);
  };

  return (
    <div className="pt-4 pb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Verlauf</h1>
        <Button variant="outline" size="sm" onClick={() => setShowCatchup(!showCatchup)}>
          Nachtragen
        </Button>
      </div>

      {showCatchup && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl mb-6 border border-blue-100 dark:border-blue-800 animate-in fade-in slide-in-from-top-2">
          <h3 className="font-bold mb-2">Fehlende Tage schätzen</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Trägt automatisch typische Werte (23:00 - 06:30) für die letzten Tage ein, falls diese fehlen. Diese werden als "geschätzt" markiert.
          </p>
          <div className="flex gap-2 items-center mb-4">
            <span className="text-sm">Letzte</span>
            <select 
              value={catchupDays} 
              onChange={e => setCatchupDays(Number(e.target.value))}
              className="bg-white dark:bg-gray-800 border rounded-lg px-2 py-1"
            >
              <option value={3}>3 Tage</option>
              <option value={7}>7 Tage</option>
              <option value={14}>14 Tage</option>
            </select>
            <span className="text-sm">prüfen</span>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1" onClick={handleCatchup}>Auffüllen</Button>
            <Button variant="ghost" onClick={() => setShowCatchup(false)}>Abbrechen</Button>
          </div>
        </div>
      )}
      
      {sortedEntries.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Noch keine Einträge vorhanden.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sortedEntries.map(entry => {
            const stats = calculateSleepStats(entry);
            const date = parseISO(entry.id);
            
            return (
              <div key={entry.id} onClick={() => navigate('/protocol/evening/' + entry.id)} className="cursor-pointer bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between active:scale-[0.98] transition-transform relative overflow-hidden">
                {entry.isEstimated && (
                  <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                    GESCHÄTZT
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {format(date, 'EEEE, dd.MM.', { locale: de })}
                  </h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex gap-3">
                    <span>🛏️ {entry.bedtime || '--:--'}</span>
                    <span>🌅 {entry.finalWakeUpTime || '--:--'}</span>
                  </div>
                </div>
                {stats && (
                  <div className={`px-3 py-2 rounded-xl font-bold border ${getEfficiencyColor(stats.sleepEfficiency)}`}>
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
