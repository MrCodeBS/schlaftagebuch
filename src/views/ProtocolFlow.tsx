import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { NumberStepper, TimePicker, RatingButtons } from '../components/ui/Inputs';
import { format, subDays, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { ArrowLeft, Calendar } from 'lucide-react';
import { calculateSleepStats, formatDuration } from '../utils/calculations';
import type { SleepEntry } from '../types';

const defaultEntry: Partial<SleepEntry> = {
  napped: false,
  alcohol: false,
  bedtime: '23:00',
  lightOffTime: '23:15',
  minutesToFallAsleep: 15,
  awakeAtNight: false,
  finalWakeUpTime: '06:30',
  outOfBedTime: '06:45',
  medication: false,
};

export default function ProtocolFlow() {
  const { type, date } = useParams<{ type: 'evening' | 'morning'; date?: string }>();
  const navigate = useNavigate();
  const { entries, saveEntry } = useStore();

  const isMorning = type === 'morning';
  const isRetroactive = !!date; // Are we filling in a past date?
  const targetDate =
    date || (isMorning ? format(subDays(new Date(), 1), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));

  const existingEntry = entries[targetDate] || { id: targetDate, ...defaultEntry };

  // Find previous entry to copy from
  const previousDate = format(subDays(new Date(targetDate), 1), 'yyyy-MM-dd');
  const previousEntry = entries[previousDate];

  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<SleepEntry>>(existingEntry);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    setData(existingEntry);
    setStep(0);
    setShowSummary(false);
  }, [targetDate, type]);

  const update = (updates: Partial<SleepEntry>) => setData((prev) => ({ ...prev, ...updates }));

  // Format the date for display
  const displayDate = format(parseISO(targetDate), 'EEEE, dd.MM.yyyy', { locale: de });

  const eveningSteps = [
    {
      title: 'Tagsüber geschlafen?',
      desc: 'Hast du an diesem Tag einen Mittagsschlaf gemacht?',
      render: () => (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Button variant={data.napped === true ? 'primary' : 'outline'} className="flex-1" onClick={() => update({ napped: true })}>Ja</Button>
            <Button variant={data.napped === false ? 'primary' : 'outline'} className="flex-1" onClick={() => update({ napped: false })}>Nein</Button>
          </div>
          {data.napped && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-4">
              <label className="block text-sm font-medium mb-2">Wie lange? (Minuten)</label>
              <NumberStepper value={data.napDuration || 30} onChange={(v) => update({ napDuration: v })} />
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Alkohol?',
      desc: 'Hast du in den letzten 4 Stunden vor dem Schlafengehen Alkohol getrunken?',
      render: () => (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Button variant={data.alcohol === true ? 'primary' : 'outline'} className="flex-1" onClick={() => update({ alcohol: true })}>Ja</Button>
            <Button variant={data.alcohol === false ? 'primary' : 'outline'} className="flex-1" onClick={() => update({ alcohol: false })}>Nein</Button>
          </div>
        </div>
      ),
    },
    {
      title: 'Stimmung',
      desc: 'Wie war deine Stimmung am Abend?',
      render: () => <RatingButtons value={data.moodEvening} onChange={(v) => update({ moodEvening: v })} />,
    },
    {
      title: 'Bettzeit',
      desc: 'Um wie viel Uhr bist du ins Bett gegangen?',
      render: () => <TimePicker value={data.bedtime || '23:00'} onChange={(v) => update({ bedtime: v })} />,
    },
  ];

  const morningSteps = [
    {
      title: 'Licht aus',
      desc: 'Wann hast du das Licht ausgemacht, um zu schlafen?',
      render: () => <TimePicker value={data.lightOffTime || data.bedtime || '23:00'} onChange={(v) => update({ lightOffTime: v })} />,
    },
    {
      title: 'Einschlafen',
      desc: 'Wie viele Minuten hast du ungefähr gebraucht, um einzuschlafen?',
      render: () => <NumberStepper value={data.minutesToFallAsleep || 15} onChange={(v) => update({ minutesToFallAsleep: v })} />,
    },
    {
      title: 'Nachts wach?',
      desc: 'Warst du in der Nacht wach?',
      render: () => (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Button variant={data.awakeAtNight === true ? 'primary' : 'outline'} className="flex-1" onClick={() => update({ awakeAtNight: true })}>Ja</Button>
            <Button variant={data.awakeAtNight === false ? 'primary' : 'outline'} className="flex-1" onClick={() => update({ awakeAtNight: false, awakeMinutes: 0 })}>Nein</Button>
          </div>
          {data.awakeAtNight && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-4">
              <label className="block text-sm font-medium mb-2">Wie lange insgesamt? (Minuten)</label>
              <NumberStepper value={data.awakeMinutes || 30} onChange={(v) => update({ awakeMinutes: v })} />
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Aufgewacht',
      desc: 'Um wie viel Uhr bist du am Morgen endgültig aufgewacht?',
      render: () => <TimePicker value={data.finalWakeUpTime || '06:30'} onChange={(v) => update({ finalWakeUpTime: v })} />,
    },
    {
      title: 'Aufgestanden',
      desc: 'Um wie viel Uhr bist du aus dem Bett aufgestanden?',
      render: () => <TimePicker value={data.outOfBedTime || '06:45'} onChange={(v) => update({ outOfBedTime: v })} />,
    },
    {
      title: 'Schlafqualität',
      desc: 'Wie beurteilst du deinen Schlaf in dieser Nacht insgesamt?',
      render: () => <RatingButtons value={data.sleepQuality} onChange={(v) => update({ sleepQuality: v })} />,
    },
  ];

  const steps = isMorning ? morningSteps : eveningSteps;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      finish();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((s) => s - 1);
    } else {
      navigate(-1);
    }
  };

  const finish = () => {
    const finalData = { ...data };
    if (isMorning) {
      finalData.morningCompleted = true;
    } else {
      finalData.eveningCompleted = true;
    }

    if (!finalData.createdAt) finalData.createdAt = Date.now();
    if (isRetroactive) finalData.isEstimated = true;

    saveEntry(finalData as SleepEntry);

    if (!isMorning) {
      // After evening, go straight to morning for the same date
      navigate('/protocol/morning/' + targetDate, { replace: true });
    } else {
      setShowSummary(true);
    }
  };

  const useYesterday = () => {
    if (!previousEntry) return;
    const updates: Partial<SleepEntry> = isMorning
      ? {
          lightOffTime: previousEntry.lightOffTime,
          minutesToFallAsleep: previousEntry.minutesToFallAsleep,
          awakeAtNight: previousEntry.awakeAtNight,
          awakeMinutes: previousEntry.awakeMinutes,
          finalWakeUpTime: previousEntry.finalWakeUpTime,
          outOfBedTime: previousEntry.outOfBedTime,
        }
      : {
          napped: previousEntry.napped,
          napDuration: previousEntry.napDuration,
          alcohol: previousEntry.alcohol,
          bedtime: previousEntry.bedtime,
        };
    setData((prev) => ({ ...prev, ...updates }));
  };

  // ── Summary Screen ──
  if (showSummary) {
    const stats = calculateSleepStats(data as SleepEntry);
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center animate-in fade-in zoom-in-95">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">🎉</span>
        </div>
        <h2 className="text-3xl font-bold">Protokoll gespeichert!</h2>

        <p className="text-gray-500 dark:text-gray-400">{displayDate}</p>

        {isRetroactive && (
          <p className="text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-xl">
            Nachträglich ausgefüllte Einträge sind Schätzungen. Sag das deinem Therapeuten.
          </p>
        )}

        {stats && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 w-full space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Du hast ca.</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatDuration(stats.totalSleepTime)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">geschlafen.</p>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Schlafeffizienz</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{Math.round(stats.sleepEfficiency)} %</p>
            </div>
          </div>
        )}

        <Button size="xl" onClick={() => navigate('/history')} className="mt-8 w-full">
          Fertig
        </Button>
      </div>
    );
  }

  // ── Wizard Steps ──
  const currentStep = steps[step];

  return (
    <div className="flex flex-col min-h-[90vh]">
      <header className="flex items-center justify-between mb-4">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-transform"
        >
          <ArrowLeft size={28} />
        </button>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-4 py-1.5 rounded-full">
          Schritt {step + 1} von {steps.length}
        </div>
        <div className="w-10"></div>
      </header>

      {/* Date badge */}
      <div className="flex items-center justify-center gap-2 mb-6 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 py-2 px-4 rounded-xl self-center">
        <Calendar size={16} />
        <span>{displayDate}</span>
        {isMorning ? (
          <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full font-bold">Morgen</span>
        ) : (
          <span className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs px-2 py-0.5 rounded-full font-bold">Abend</span>
        )}
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5 mb-10 overflow-hidden">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        ></div>
      </div>

      <div className="flex-1">
        <h2 className="text-3xl font-bold mb-3">{currentStep.title}</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">{currentStep.desc}</p>

        <div className="mb-12">{currentStep.render()}</div>
      </div>

      <div className="flex flex-col gap-4 mt-auto">
        <Button size="xl" onClick={handleNext}>
          {step === steps.length - 1 ? (isMorning ? 'Speichern' : 'Weiter zum Morgen →') : 'Weiter'}
        </Button>
        {step === 0 && previousEntry && (
          <Button variant="ghost" onClick={useYesterday} className="text-gray-500 dark:text-gray-400">
            Werte von gestern übernehmen
          </Button>
        )}
      </div>
    </div>
  );
}
