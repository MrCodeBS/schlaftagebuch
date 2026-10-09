export interface SleepEntry {
  id: string; // YYYY-MM-DD format (the date the night started)
  
  // Evening Protocol
  eveningCompleted: boolean;
  napped: boolean;
  napDuration?: number; // minutes
  napTime?: string; // HH:mm
  alcohol: boolean;
  alcoholDetails?: string;
  bedtime: string; // HH:mm
  
  // Ratings Evening (1 = sehr gut, 6 = sehr schlecht)
  moodEvening?: number;
  performance?: number;
  tirednessEvening?: number;

  // Morning Protocol
  morningCompleted: boolean;
  lightOffTime?: string; // HH:mm
  minutesToFallAsleep: number;
  awakeAtNight: boolean;
  awakeCount?: number;
  awakeMinutes?: number;
  finalWakeUpTime: string; // HH:mm
  outOfBedTime: string; // HH:mm
  medication: boolean;
  medicationDetails?: string;

  // Ratings Morning
  tirednessMorning?: number;
  moodMorning?: number;
  sleepQuality?: number;

  // Meta
  isEstimated: boolean;
  note: string;
  createdAt: number;
  updatedAt: number;
}

export interface WeeklySettings {
  prescribedBedtime: string;
  prescribedOutOfBedTime: string;
}
