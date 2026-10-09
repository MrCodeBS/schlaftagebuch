import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import { SleepEntry, WeeklySettings } from '../types';

const idbStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

interface State {
  entries: Record<string, SleepEntry>;
  settings: WeeklySettings;
  saveEntry: (entry: SleepEntry) => void;
  deleteEntry: (id: string) => void;
  updateSettings: (settings: Partial<WeeklySettings>) => void;
  importData: (entries: SleepEntry[]) => void;
  clearAll: () => void;
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      entries: {},
      settings: {
        prescribedBedtime: '23:00',
        prescribedOutOfBedTime: '06:00',
      },
      saveEntry: (entry) =>
        set((state) => ({
          entries: {
            ...state.entries,
            [entry.id]: {
              ...entry,
              updatedAt: Date.now(),
            },
          },
        })),
      deleteEntry: (id) =>
        set((state) => {
          const newEntries = { ...state.entries };
          delete newEntries[id];
          return { entries: newEntries };
        }),
      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),
      importData: (newEntries) =>
        set((state) => {
          const entriesMap = { ...state.entries };
          newEntries.forEach((e) => {
            entriesMap[e.id] = e;
          });
          return { entries: entriesMap };
        }),
      clearAll: () => set({ entries: {} }),
    }),
    {
      name: 'sleep-diary-storage',
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
