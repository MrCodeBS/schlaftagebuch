import type { SleepEntry } from '../types';
import { calculateSleepStats } from './calculations';

export function exportToCSV(entries: Record<string, SleepEntry>) {
  const sortedEntries = (Object.values(entries) as SleepEntry[]).sort((a, b) => a.id.localeCompare(b.id));

  // CSV Header
  const headers = [
    'Datum',
    'Abend_Tagschlaf',
    'Abend_Tagschlaf_Dauer',
    'Abend_Alkohol',
    'Abend_Stimmung',
    'Bettzeit',
    'Licht_Aus',
    'Einschlafdauer_Min',
    'Nachts_Wach',
    'Nachts_Wach_Dauer',
    'Aufwachzeit',
    'Aufstehzeit',
    'Morgen_Stimmung',
    'Morgen_Schlafqualitaet',
    'Berechnet_Bettzeit_Min',
    'Berechnet_Schlafzeit_Min',
    'Berechnet_Schlafeffizienz',
    'Schaetzung_Nachtraeglich'
  ];

  const rows = sortedEntries.map(e => {
    const stats = calculateSleepStats(e);
    return [
      e.id,
      e.napped ? 'Ja' : 'Nein',
      e.napDuration || '',
      e.alcohol ? 'Ja' : 'Nein',
      e.moodEvening || '',
      e.bedtime || '',
      e.lightOffTime || '',
      e.minutesToFallAsleep || '',
      e.awakeAtNight ? 'Ja' : 'Nein',
      e.awakeMinutes || '',
      e.finalWakeUpTime || '',
      e.outOfBedTime || '',
      e.moodMorning || '',
      e.sleepQuality || '',
      stats?.timeInBed || '',
      stats?.totalSleepTime || '',
      stats ? Math.round(stats.sleepEfficiency) : '',
      e.isEstimated ? 'Ja' : 'Nein'
    ];
  });

  const csvContent = [
    headers.join(';'),
    ...rows.map(r => r.join(';'))
  ].join('\n');

  // Add BOM for Excel UTF-8 support
  const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
  const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `schlaftagebuch_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
