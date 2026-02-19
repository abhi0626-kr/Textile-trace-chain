import { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../api/config';

const statusClass = (status) => {
  if (status === 'UP') return 'bg-green-500/10 text-green-500 border-green-500/30';
  if (status === 'DOWN') return 'bg-red-500/10 text-red-500 border-red-500/30';
  return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
};

const SystemHealth = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/health`);
        setHealth(response.data);
      } catch {
        setHealth(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <div className="min-h-screen px-4 py-8 text-center font-black">Loading system health...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-primary px-4 sm:px-6 md:px-8 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <section className="bg-surface border border-border rounded-3xl p-6 sm:p-8">
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-gold mb-2">System Health</p>
          <h1 className="text-3xl font-black mb-3">Monitoring & Reliability Dashboard</h1>
          <p className="text-secondary font-medium">Live visibility for network, API, database, and blockchain synchronization.</p>
        </section>

        {!health ? (
          <section className="bg-surface border border-border rounded-3xl p-8">
            <p className="text-red-500 font-bold">Unable to load health metrics right now.</p>
          </section>
        ) : (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-surface border border-border rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-widest font-black text-secondary mb-2">Polygon RPC</p>
                <span className={`inline-flex px-3 py-1 rounded-full border text-xs font-black uppercase ${statusClass(health.network?.rpcStatus)}`}>{health.network?.rpcStatus || 'Unknown'}</span>
              </div>
              <div className="bg-surface border border-border rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-widest font-black text-secondary">API Latency</p>
                <p className="text-2xl font-black text-gold mt-1">{health.api?.latencyMs ?? '-'} ms</p>
              </div>
              <div className="bg-surface border border-border rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-widest font-black text-secondary mb-2">DB Status</p>
                <span className={`inline-flex px-3 py-1 rounded-full border text-xs font-black uppercase ${statusClass(health.database?.status)}`}>{health.database?.status || 'Unknown'}</span>
              </div>
              <div className="bg-surface border border-border rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-widest font-black text-secondary">Last Sync Time</p>
                <p className="font-bold mt-1">{health.sync?.lastSyncTime ? new Date(health.sync.lastSyncTime).toLocaleString() : 'No sync yet'}</p>
              </div>
              <div className="bg-surface border border-border rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-widest font-black text-secondary">Verification Rate</p>
                <p className="text-2xl font-black text-gold mt-1">{health.sync?.verificationRate ?? 0}%</p>
              </div>
            </section>

            <section className="bg-surface border border-border rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-black mb-4">Blockchain Integrity</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-background border border-border rounded-2xl p-4">
                  <p className="text-[10px] uppercase tracking-widest font-black text-secondary">Chain Valid</p>
                  <p className="font-black text-gold mt-1">{health.blockchain?.chainValid ? 'Yes' : 'No'}</p>
                </div>
                <div className="bg-background border border-border rounded-2xl p-4">
                  <p className="text-[10px] uppercase tracking-widest font-black text-secondary">Total Blocks</p>
                  <p className="font-black text-gold mt-1">{health.blockchain?.totalBlocks ?? 0}</p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default SystemHealth;
