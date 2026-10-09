import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { format, subDays } from 'date-fns';
import { Moon, Sun } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { entries } = useStore();

  const currentHour = new Date().getHours();
  // Assume morning is 04:00 to 14:00, evening is 14:00 to 04:00
  const isMorning = currentHour >= 4 && currentHour < 14;

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  const todayEntry = entries[todayStr];
  const yesterdayEntry = entries[yesterdayStr];

  return (
    <div className="flex flex-col gap-8 pt-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-2">Hallo!</h1>
        <p className="text-gray-600 dark:text-gray-400">Zeit für dein Schlaftagebuch.</p>
      </header>

      <div className="flex flex-col gap-4">
        {isMorning ? (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl flex flex-col items-center text-center gap-6 border-2 border-blue-100 dark:border-blue-800">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
              <Sun size={40} className="text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Guten Morgen!</h2>
              <p className="text-gray-600 dark:text-gray-400">Wie hast du geschlafen?</p>
            </div>
            <Button size="xl" onClick={() => navigate('/protocol/morning')}>
              Morgenprotokoll ausfüllen
            </Button>
            {yesterdayEntry?.morningCompleted && (
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">Bereits ausgefüllt ✅</p>
            )}
          </div>
        ) : (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-3xl flex flex-col items-center text-center gap-6 border-2 border-indigo-100 dark:border-indigo-800">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-800 rounded-full flex items-center justify-center">
              <Moon size={40} className="text-indigo-600 dark:text-indigo-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Guten Abend!</h2>
              <p className="text-gray-600 dark:text-gray-400">Bereit für die Nacht?</p>
            </div>
            <Button size="xl" onClick={() => navigate('/protocol/evening')} className="bg-indigo-600 hover:bg-indigo-700">
              Abendprotokoll ausfüllen
            </Button>
            {todayEntry?.eveningCompleted && (
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">Bereits ausgefüllt ✅</p>
            )}
          </div>
        )}
      </div>

      {!isMorning && !yesterdayEntry?.morningCompleted && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-2xl border-2 border-yellow-100 dark:border-yellow-800">
          <h3 className="font-bold text-yellow-800 dark:text-yellow-400 mb-2">Morgenprotokoll fehlt</h3>
          <p className="text-yellow-700 dark:text-yellow-300 text-sm mb-4">Du hast das Protokoll für heute Morgen noch nicht ausgefüllt.</p>
          <Button variant="outline" className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-100" onClick={() => navigate('/protocol/morning')}>
            Jetzt nachtragen
          </Button>
        </div>
      )}
    </div>
  );
}
