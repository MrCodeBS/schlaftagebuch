import React from 'react';
import { cn } from './Button';
import { Minus, Plus } from 'lucide-react';

export const RatingButtons = ({ 
  value, 
  onChange,
  labels = ['sehr gut', 'gut', 'eher gut', 'eher schlecht', 'schlecht', 'sehr schlecht']
}: { 
  value?: number; 
  onChange: (v: number) => void;
  labels?: string[];
}) => {
  return (
    <div className="flex flex-col gap-3 w-full">
      {[1, 2, 3, 4, 5, 6].map((num, i) => (
        <button
          key={num}
          onClick={() => onChange(num)}
          className={cn(
            "flex items-center justify-between w-full h-14 px-6 rounded-xl border-2 text-lg font-medium transition-all",
            value === num 
              ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" 
              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          )}
        >
          <span>{num}</span>
          <span className="text-base font-normal opacity-80">{labels[i]}</span>
        </button>
      ))}
    </div>
  );
};

export const NumberStepper = ({
  value = 0,
  onChange,
  min = 0,
  max = 999,
  step = 5,
  suffix = 'Minuten'
}: {
  value?: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) => {
  return (
    <div className="flex items-center justify-between w-full bg-white dark:bg-gray-800 rounded-2xl p-2 border-2 border-gray-200 dark:border-gray-700">
      <button
        onClick={() => onChange(Math.max(min, value - step))}
        className="w-16 h-16 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 active:scale-95 transition-transform"
        aria-label="Weniger"
      >
        <Minus size={28} />
      </button>
      <div className="flex flex-col items-center justify-center flex-1">
        <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</span>
        {suffix && <span className="text-sm text-gray-500 dark:text-gray-400">{suffix}</span>}
      </div>
      <button
        onClick={() => onChange(Math.min(max, value + step))}
        className="w-16 h-16 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 active:scale-95 transition-transform"
        aria-label="Mehr"
      >
        <Plus size={28} />
      </button>
    </div>
  );
};

export const TimePicker = ({
  value,
  onChange
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  // Parse initial value or default to current time
  const parseTime = (timeStr: string) => {
    if (!timeStr) return { h: 22, m: 0 };
    const [h, m] = timeStr.split(':').map(Number);
    return { h: isNaN(h) ? 0 : h, m: isNaN(m) ? 0 : m };
  };

  const adjustTime = (minutesToAdd: number) => {
    const current = parseTime(value);
    let date = new Date();
    date.setHours(current.h, current.m, 0, 0);
    date.setMinutes(date.getMinutes() + minutesToAdd);
    const newH = date.getHours().toString().padStart(2, '0');
    const newM = date.getMinutes().toString().padStart(2, '0');
    onChange(`${newH}:${newM}`);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-center bg-white dark:bg-gray-800 rounded-2xl p-4 border-2 border-gray-200 dark:border-gray-700">
        <input 
          type="time" 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)}
          className="text-4xl font-bold bg-transparent text-center text-gray-900 dark:text-gray-100 outline-none w-full"
          style={{ WebkitAppearance: 'none' }}
        />
      </div>
      <div className="flex gap-2 justify-center">
        <button onClick={() => adjustTime(-15)} className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-medium active:scale-95">-15</button>
        <button onClick={() => adjustTime(-5)} className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-medium active:scale-95">-5</button>
        <button onClick={() => adjustTime(5)} className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-medium active:scale-95">+5</button>
        <button onClick={() => adjustTime(15)} className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-medium active:scale-95">+15</button>
      </div>
    </div>
  );
};
