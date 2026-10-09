import { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

export const StorageWarning = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkStorage = async () => {
      try {
        if (navigator.storage && navigator.storage.persist) {
          const isPersisted = await navigator.storage.persisted();
          if (!isPersisted) {
            const granted = await navigator.storage.persist();
            if (!granted) {
              setIsVisible(true);
            }
          }
        }
      } catch (e) {
        setIsVisible(true);
      }
    };
    checkStorage();
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/30 border-b border-yellow-200 dark:border-yellow-800 p-4 flex gap-3 items-start relative">
      <AlertCircle className="text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
      <div className="pr-6">
        <h3 className="font-semibold text-yellow-800 dark:text-yellow-400">Wichtiger Hinweis</h3>
        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
          Deine Daten sind nur auf diesem Gerät gespeichert. Dein Browser könnte sie automatisch löschen. 
          Bitte mache regelmäßig ein Backup (unter Menü).
        </p>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 p-1 text-yellow-600 hover:bg-yellow-100 rounded-full dark:hover:bg-yellow-800"
      >
        <X size={20} />
      </button>
    </div>
  );
};
