import React, { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import HistoryPanel from '../components/HistoryPanel';
import { getRouteHistory } from '../services/api';

const AnalyticsPage = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadHistory = async () => {
      setLoading(true);
      setError('');

      try {
        const history = await getRouteHistory();
        if (!active) return;
        setHistoryData(history);
      } catch (err) {
        if (!active) return;
        setHistoryData([]);
        setError(err.message || 'Failed to load route history from backend.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadHistory();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen p-8 pt-8">
      <header className="mb-8 flex items-center gap-4">
        <div className="p-3 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-300">
          <BarChart3 size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-blue-950">Advanced Analytics</h1>
          <p className="text-sm font-bold text-blue-500 uppercase tracking-widest">Performance Insights</p>
        </div>
      </header>

      <div className="mb-8">
        {loading && <div className="glass-panel p-4 text-sm text-blue-700">Loading route history from backend...</div>}
        {!loading && error && <div className="glass-panel p-4 text-sm text-red-600">{error}</div>}
        {!loading && !error && <HistoryPanel historyData={historyData} />}
      </div>

      <div className="glass-panel p-10 border-2 border-blue-200 text-center flex flex-col items-center justify-center min-h-[200px]">
        <div className="p-4 bg-blue-100 rounded-2xl mb-3 border-2 border-blue-300">
          <BarChart3 size={36} className="text-blue-600" />
        </div>
        <h2 className="text-lg font-black text-blue-950 mb-1">More Analytics Coming Soon</h2>
        <p className="text-blue-500 font-medium text-sm max-w-md mx-auto">
          Cost trend charts, AI performance metrics, and global route optimization insights.
        </p>
      </div>
    </div>
  );
};

export default AnalyticsPage;
