import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../api/config';
import TraceTimeline from '../components/TraceTimeline';
import TraceMap from '../components/TraceMap';
import ImpactScore from '../components/ImpactScore';
import BlockchainStatusBadge from '../components/BlockchainStatusBadge';
import { CONTRACT_ADDRESS, CONTRACT_URL, NETWORK_NAME, POLYGONSCAN_BASE, txUrl } from '../config/network';

const STAGE_ICONS = {
  RAW_COTTON: '🌱',
  GINNED: '🏭',
  SPUN_YARN: '🧶',
  WOVEN_FABRIC: '🧵',
  DYED: '🎨',
  GARMENT_FINISHED: '👕',
  SHIPPED: '🚢'
};

const DEMO_BATCH = {
  batchId: 'COT-DEMO-ITALY-001',
  stage: 'SHIPPED',
  isSynced: true,
  updatedAt: new Date().toISOString(),
  currentOwner: 'Italian Buyer (BUYER)',
  data: {
    variety: 'Certified Organic Cotton',
    location: 'Milan, Italy',
    carbonFootprintKg: 34.2,
    certifiedOrganic: true
  },
  blockchain: {
    syncStatus: 'VERIFIED',
    latestTxHash: '0xd3c1f4a0f1f96d2f7b2f12fef8d5000b31a3c59fd7b90f036a7ad74f47a110c2'
  },
  history: [
    { stage: 'RAW_COTTON', owner: 'Salem Farmers Co-op', location: 'Salem, Tamil Nadu', timestamp: '2026-01-03T08:00:00.000Z', coordinates: { lat: 11.6643, lng: 78.146 }, txId: '0xa1' },
    { stage: 'GINNED', owner: 'Salem Mill', location: 'Salem, Tamil Nadu', timestamp: '2026-01-07T11:10:00.000Z', coordinates: { lat: 11.6643, lng: 78.146 }, txId: '0xa2' },
    { stage: 'SPUN_YARN', owner: 'Coimbatore Spinning Unit', location: 'Coimbatore, Tamil Nadu', timestamp: '2026-01-12T10:30:00.000Z', coordinates: { lat: 11.0168, lng: 76.9558 }, txId: '0xa3' },
    { stage: 'GARMENT_FINISHED', owner: 'Coimbatore Manufacturer', location: 'Coimbatore, Tamil Nadu', timestamp: '2026-01-17T09:45:00.000Z', coordinates: { lat: 11.0168, lng: 76.9558 }, txId: '0xa4' },
    { stage: 'SHIPPED', owner: 'Italy Import Partner', location: 'Milan, Italy', timestamp: '2026-01-27T15:20:00.000Z', coordinates: { lat: 45.4642, lng: 9.19 }, txId: '0xa5' }
  ]
};

const normalizeBatch = (batch) => {
  const history = Array.isArray(batch?.history) ? batch.history : [];
  const latest = history[history.length - 1];
  const latestTxHash = batch?.blockchain?.latestTxHash || latest?.txId || null;

  return {
    ...batch,
    history,
    blockchain: {
      syncStatus: batch?.blockchain?.syncStatus || (batch?.isSynced ? 'VERIFIED' : 'PENDING'),
      latestTxHash
    }
  };
};

const PublicExplorer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(id || '');
  const [batch, setBatch] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentStatus = batch?.blockchain?.syncStatus || 'PENDING';
  const latestTx = batch?.blockchain?.latestTxHash;

  useEffect(() => {
    const loadHealth = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/health`);
        setHealth(response.data);
      } catch {
        setHealth(null);
      }
    };

    loadHealth();
  }, []);

  useEffect(() => {
    if (!id) return;
    setQuery(id);
    if (id === DEMO_BATCH.batchId) {
      setBatch(normalizeBatch(DEMO_BATCH));
      return;
    }
    handleSearch(id);
  }, [id]);

  const handleSearch = async (value = query) => {
    if (!value) return;

    if (value === DEMO_BATCH.batchId) {
      setBatch(normalizeBatch(DEMO_BATCH));
      setError('');
      navigate(`/explorer/${DEMO_BATCH.batchId}`, { replace: true });
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${API_URL}/api/batch/${value}`);
      setBatch(normalizeBatch(response.data));
      navigate(`/explorer/${value}`, { replace: true });
    } catch {
      setError('Batch not found. Check the Batch ID and try again.');
      setBatch(null);
    } finally {
      setLoading(false);
    }
  };

  const loadDemo = () => {
    setError('');
    setQuery(DEMO_BATCH.batchId);
    setBatch(normalizeBatch(DEMO_BATCH));
    navigate(`/explorer/${DEMO_BATCH.batchId}`, { replace: true });
  };

  const summary = useMemo(() => {
    if (!batch) return null;
    const sustainability = batch.data?.variety || 'Standard Cotton';
    const score = sustainability.toLowerCase().includes('organic') ? 96 : 65;
    return { score };
  }, [batch]);

  return (
    <div className="min-h-screen bg-background text-primary px-4 sm:px-6 md:px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="bg-surface border border-border rounded-3xl p-6 sm:p-8">
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-gold mb-2">Public Verification Explorer</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">Track Textile Batches Without Login</h1>
          <p className="text-secondary font-medium">Enter a Batch ID to see live stage, blockchain status, transaction hash, timeline, map, and sustainability score.</p>

          <div className="mt-6 flex flex-col md:flex-row gap-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Enter Batch ID (example: COT-2026-001)"
              className="flex-1 bg-background border border-border rounded-xl p-3 font-semibold focus:outline-none focus:border-gold"
            />
            <button onClick={() => handleSearch()} className="bg-gold text-black px-6 py-3 rounded-xl font-black uppercase tracking-widest">Search</button>
            <button onClick={loadDemo} className="border border-border px-6 py-3 rounded-xl font-black uppercase tracking-widest hover:border-gold hover:text-gold transition-colors">Try Demo Data</button>
          </div>
          {error && <p className="mt-3 text-red-500 font-bold text-sm">{error}</p>}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-background border border-border rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-widest font-black text-secondary mb-2">Supply Chain Flow</p>
              <p className="font-black text-gold">Farmer → Mill → Manufacturer → Exporter → Buyer → Consumer</p>
            </div>
            <div className="bg-background border border-border rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-widest font-black text-secondary mb-2">How It Works</p>
              <p className="font-bold text-primary">1) Register Batch • 2) Record Stage Updates • 3) Blockchain Verification • 4) QR-Based Consumer Check</p>
            </div>
          </div>
        </section>

        <section className="bg-surface border border-border rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-secondary mb-2">Blockchain Transparency</p>
              <h2 className="text-xl sm:text-2xl font-black">Network & Contract Visibility</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${health?.network?.rpcStatus === 'UP' ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'}`}>
                <span className="w-2 h-2 rounded-full bg-current" />
                Network {health?.network?.rpcStatus || 'Unknown'}
              </span>
              <a href={POLYGONSCAN_BASE} target="_blank" rel="noreferrer" className="text-gold font-black text-xs uppercase tracking-widest">Open Polygonscan</a>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-background border border-border rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-widest font-black text-secondary">Network</p>
              <p className="font-black text-primary mt-1">{NETWORK_NAME}</p>
            </div>
            <div className="bg-background border border-border rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-widest font-black text-secondary">Smart Contract Address</p>
              {CONTRACT_URL ? (
                <a href={CONTRACT_URL} target="_blank" rel="noreferrer" className="text-gold font-black break-all">{CONTRACT_ADDRESS}</a>
              ) : (
                <p className="font-bold text-secondary mt-1">Set VITE_CONTRACT_ADDRESS to enable public contract link.</p>
              )}
            </div>
          </div>
        </section>

        {loading && (
          <section className="bg-surface border border-border rounded-3xl p-8 text-center font-black">Loading batch details...</section>
        )}

        {batch && !loading && (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-surface border border-border rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-widest font-black text-secondary">Current Stage</p>
                <p className="text-xl font-black text-gold mt-1">{batch.stage?.replaceAll('_', ' ')}</p>
              </div>
              <div className="bg-surface border border-border rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-widest font-black text-secondary mb-2">Blockchain Status</p>
                <BlockchainStatusBadge status={currentStatus} />
              </div>
              <div className="bg-surface border border-border rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-widest font-black text-secondary">Batch Owner</p>
                <p className="font-black mt-1">{batch.currentOwner}</p>
              </div>
              <div className="bg-surface border border-border rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-widest font-black text-secondary">Sustainability Score</p>
                <p className="text-xl font-black text-gold mt-1">{summary?.score || 0}/100</p>
              </div>
            </section>

            <section className="bg-surface border border-border rounded-3xl p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-secondary">Verification Passport</p>
                  <h3 className="text-2xl font-black text-gold break-all">{batch.batchId}</h3>
                </div>
                {latestTx && (
                  <a href={txUrl(latestTx)} target="_blank" rel="noreferrer" className="text-xs font-black text-gold uppercase tracking-widest">View Latest Tx Hash</a>
                )}
              </div>

              <TraceTimeline currentStage={batch.stage} />

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm uppercase tracking-widest font-black text-secondary mb-4">Full Timeline</h4>
                  <div className="space-y-4">
                    {batch.history.map((event, index) => (
                      <div key={`${event.timestamp}-${index}`} className="bg-background border border-border rounded-2xl p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-black text-gold uppercase tracking-widest text-xs">{STAGE_ICONS[event.stage] || '📌'} {event.stage?.replaceAll('_', ' ')}</p>
                            <p className="text-sm font-bold text-primary mt-1">{event.owner}</p>
                            <p className="text-xs text-secondary mt-1">📍 {event.location || 'Unknown location'}</p>
                          </div>
                          <span className="text-[10px] font-bold text-secondary" title={event.txId || 'No tx hash available'}>{new Date(event.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm uppercase tracking-widest font-black text-secondary mb-4">Map View</h4>
                  <TraceMap history={batch.history} />
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ImpactScore variety={batch.data?.variety} />
              <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8">
                <p className="text-[10px] uppercase tracking-widest font-black text-secondary mb-2">Sustainability Signals</p>
                <h3 className="text-2xl font-black mb-6">Consumer-Visible ESG Summary</h3>
                <div className="space-y-4">
                  <div className="bg-background border border-border rounded-2xl p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-gold">Carbon Footprint</p>
                    <p className="font-bold mt-1">{batch.data?.carbonFootprintKg || 42.8} kg CO₂e / batch</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full border border-border text-xs font-black uppercase tracking-widest">ESG Aligned</span>
                    <span className="px-3 py-1 rounded-full border border-border text-xs font-black uppercase tracking-widest">Environmental Tracking</span>
                    {batch.data?.certifiedOrganic && (
                      <span className="px-3 py-1 rounded-full border border-border text-xs font-black uppercase tracking-widest text-gold">Certified Organic</span>
                    )}
                  </div>
                </div>
                <Link to="/sustainability" className="inline-block mt-6 text-xs font-black uppercase tracking-widest text-gold">Open Sustainability Page</Link>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default PublicExplorer;
