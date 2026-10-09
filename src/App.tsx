import { Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import Home from './views/Home';
import ProtocolFlow from './views/ProtocolFlow';
import History from './views/History';
import Weekly from './views/Weekly';
import Settings from './views/Settings';
import { StorageWarning } from './components/StorageWarning';

function App() {
  const location = useLocation();
  const isFlow = location.pathname.includes('/protocol');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans pb-24">
      {!isFlow && <StorageWarning />}
      <main className="max-w-md mx-auto p-4 md:p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/protocol/:type" element={<ProtocolFlow />} />
          <Route path="/history" element={<History />} />
          <Route path="/weekly" element={<Weekly />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      {!isFlow && <Navigation />}
    </div>
  );
}

export default App;
