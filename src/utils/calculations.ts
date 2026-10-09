import { differenceInMinutes, parse, addDays, isValid } from 'date-fns';
import { SleepEntry } from '../types';

export function parseTime(timeStr: string, baseDateStr: string, isNextDay = false): Date {
  const date = parse(baseDateStr, 'yyyy-MM-dd', new Date());
  const [hours, minutes] = timeStr.split(':').map(Number);
  date.setHours(hours, minutes, 0, 0);
  if (isNextDay) {
    return addDays(date, 1);
  }
  return date;
}

export function calculateSleepStats(entry: SleepEntry) {
  if (!entry.bedtime || !entry.outOfBedTime || !entry.finalWakeUpTime) return null;

  const baseDate = entry.id;
  
  const bedtime = parseTime(entry.bedtime, baseDate);
  let outOfBedTime = parseTime(entry.outOfBedTime, baseDate);
  
  // If out of bed time is earlier than bedtime, it must be the next day
  if (outOfBedTime < bedtime) {
    outOfBedTime = addDays(outOfBedTime, 1);
  }

  const timeInBed = differenceInMinutes(outOfBedTime, bedtime);

  const lightOffTime = entry.lightOffTime ? parseTime(entry.lightOffTime, baseDate) : bedtime;
  // Adjust lightOffTime if it crossed midnight relative to baseDate but bedtime didn't, or vice-versa
  let actualLightOffTime = lightOffTime;
  if (actualLightOffTime < bedtime && differenceInMinutes(bedtime, actualLightOffTime) > 12 * 60) {
     actualLightOffTime = addDays(actualLightOffTime, 1);
  } else if (actualLightOffTime > bedtime && differenceInMinutes(actualLightOffTime, bedtime) > 12 * 60) {
    // Edge case if bedtime is after midnight but light off is before... unlikely but possible
  }


  const sleepOnset = new Date(actualLightOffTime.getTime() + (entry.minutesToFallAsleep || 0) * 60000);

  let finalWakeUpTime = parseTime(entry.finalWakeUpTime, baseDate);
  if (finalWakeUpTime < bedtime) {
    finalWakeUpTime = addDays(finalWakeUpTime, 1);
  }

  const awakeMinutes = entry.awakeMinutes || 0;
  
  const totalSleepTime = differenceInMinutes(finalWakeUpTime, sleepOnset) - awakeMinutes;
  
  const sleepEfficiency = timeInBed > 0 ? (totalSleepTime / timeInBed) * 100 : 0;

  return {
    timeInBed,
    totalSleepTime,
    sleepEfficiency: Math.max(0, Math.min(100, sleepEfficiency)),
    sleepOnset
  };
}

export function formatDuration(minutes: number): string {
  if (minutes < 0) return '0 Min.';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} Min.`;
  return `${h} Std. ${m} Min.`;
}
