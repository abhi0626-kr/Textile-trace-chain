import { useState } from 'react';
import axios from 'axios';
import API_URL from '../api/config';

const Sustainability = () => {
  const [batchId, setBatchId] = useState('');
  const [batch, setBatch] = useState(null);
  const [error, setError] = useState('');

  const fetchBatch = async () => {
    if (!batchId) return;

    try {
      const response = await axios.get(`${API_URL}/api/batch/${batchId}`);
      setBatch(response.data);
      setError('');
    } catch {
      setBatch(null);
      setError('Batch not found. Try a valid Batch ID.');
    }
  };

  const carbonFootprint = batch?.data?.carbonFootprintKg || 42.8;
  const variety = batch?.data?.variety || 'Standard Cotton';
  const isOrganic = (variety || '').toLowerCase().includes('organic');

  return (
    <div className="min-h-screen bg-background text-primary px-4 sm:px-6 md:px-8 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <section className="bg-surface border border-border rounded-3xl p-6 sm:p-8">
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-gold mb-2">Sustainability</p>
          <h1 className="text-3xl font-black mb-3">ESG & Environmental Impact View</h1>
          <p className="text-secondary font-medium">Check carbon footprint and certification indicators for any textile batch.</p>
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <input
              value={batchId}
              onChange={(event) => setBatchId(event.target.value)}
              placeholder="Enter Batch ID"
              className="flex-1 bg-background border border-border rounded-xl p-3 font-semibold focus:outline-none focus:border-gold"
            />
            <button onClick={fetchBatch} className="bg-gold text-black px-6 py-3 rounded-xl font-black uppercase tracking-widest">Load Batch</button>
          </div>
          {error && <p className="text-red-500 font-bold text-sm mt-3">{error}</p>}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface border border-border rounded-2xl p-5">
            <p className="text-[10px] uppercase tracking-widest font-black text-secondary">Carbon Footprint</p>
            <p className="text-2xl font-black text-gold mt-1">{carbonFootprint} kg CO₂e</p>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-5">
            <p className="text-[10px] uppercase tracking-widest font-black text-secondary">Material Type</p>
            <p className="text-xl font-black mt-1">{variety}</p>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-5">
            <p className="text-[10px] uppercase tracking-widest font-black text-secondary">Sustainability Badge</p>
            <p className="text-xl font-black text-gold mt-1">{isOrganic ? 'Certified Organic' : 'Standard Compliance'}</p>
          </div>
        </section>

        <section className="bg-surface border border-border rounded-3xl p-6 sm:p-8">
          <h2 className="text-xl font-black mb-4">Visible ESG Indicators</h2>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full border border-border text-xs font-black uppercase tracking-widest">Environmental Tracking</span>
            <span className="px-3 py-1 rounded-full border border-border text-xs font-black uppercase tracking-widest">Impact Score Enabled</span>
            <span className="px-3 py-1 rounded-full border border-border text-xs font-black uppercase tracking-widest">Supply Chain Traceability</span>
            {isOrganic && <span className="px-3 py-1 rounded-full border border-border text-xs font-black uppercase tracking-widest text-gold">Certified Organic</span>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Sustainability;
