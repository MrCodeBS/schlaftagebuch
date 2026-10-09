import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { TimePicker } from '../components/ui/Inputs';
import { exportToCSV } from '../utils/csv';
import { Download, AlertTriangle, Info } from 'lucide-react';

export default function Settings() {
  const { settings, updateSettings, entries, clearAll } = useStore();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  return (
    <div className="pt-4 pb-8">
      <h1 className="text-3xl font-bold mb-6">Menü</h1>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">Therapie-Vorgaben</h2>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Vorgegebene Bettzeit
            </label>
            <TimePicker 
              value={settings.prescribedBedtime} 
              onChange={v => updateSettings({ prescribedBedtime: v })} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Vorgegebene Aufstehzeit
            </label>
            <TimePicker 
              value={settings.prescribedOutOfBedTime} 
              onChange={v => updateSettings({ prescribedOutOfBedTime: v })} 
            />
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">Daten & Export</h2>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col gap-4">
          <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-xl">
            <Info size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm">Deine Daten werden nur auf diesem Gerät im Browser gespeichert. Exportiere sie regelmäßig, um sie nicht zu verlieren oder sie deinem Therapeuten zu zeigen.</p>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-center gap-2 mt-2"
            onClick={() => exportToCSV(entries)}
          >
            <Download size={20} />
            Als CSV exportieren (Excel)
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">Gefahrenzone</h2>
        <div className="bg-red-50 dark:bg-red-900/10 p-5 rounded-2xl border border-red-100 dark:border-red-900/50">
          {!showClearConfirm ? (
            <Button 
              variant="danger" 
              className="w-full"
              onClick={() => setShowClearConfirm(true)}
            >
              Alle Daten löschen
            </Button>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold">
                <AlertTriangle size={20} />
                Wirklich alles unwiderruflich löschen?
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowClearConfirm(false)}>
                  Abbrechen
                </Button>
                <Button 
                  variant="danger" 
                  className="flex-1"
                  onClick={() => {
                    clearAll();
                    setShowClearConfirm(false);
                  }}
                >
                  Ja, löschen
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
