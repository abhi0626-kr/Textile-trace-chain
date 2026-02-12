import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CreateBatch = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        batchId: '',
        location: 'Salem, Tamil Nadu',
        variety: 'MCU-5',
        harvestDate: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('You must be logged in to create a batch.');
            navigate('/login');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            await axios.post('http://localhost:5000/api/batch', {
                batchId: formData.batchId,
                data: {
                    location: formData.location,
                    variety: formData.variety,
                    harvestDate: formData.harvestDate
                }
            }, {
                headers: { 'x-auth-token': token }
            });
            toast.success('Batch Created Successfully!');
            navigate('/');
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.msg || err.message;
            toast.error(`Error creating batch: ${errorMsg}`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 p-8 flex items-center justify-center">
            <div className="max-w-2xl w-full bg-black p-10 rounded-[3rem] shadow-[0_0_100px_rgba(212,175,55,0.1)] border border-[#d4af37]/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <svg className="w-24 h-24 text-[#d4af37]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" /></svg>
                </div>

                <div className="mb-10">
                    <h2 className="text-3xl font-black text-white tracking-tighter mb-2 italic">Mint New Asset</h2>
                    <p className="text-[#d4af37] font-black uppercase text-[10px] tracking-[0.2em]">Record Original Cotton Origin to the Ledger</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Unique Batch Trace ID</label>
                        <input
                            type="text"
                            className="w-full bg-white/5 border-2 border-white/5 p-5 rounded-2xl focus:border-[#d4af37] transition-all font-mono font-bold text-[#d4af37] placeholder-slate-700 outline-none"
                            placeholder="e.g. COT-2026-XXXX"
                            value={formData.batchId}
                            onChange={e => setFormData({ ...formData, batchId: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Origin Location (Geotagged)</label>
                        <input
                            type="text"
                            className="w-full bg-white/5 border-2 border-white/5 p-5 rounded-2xl focus:border-[#d4af37] transition-all font-bold text-white placeholder-slate-800 outline-none"
                            value={formData.location}
                            placeholder="Salem Industrial District, TN"
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Fiber Grade / Variety</label>
                            <input
                                type="text"
                                className="w-full bg-white/5 border-2 border-white/5 p-5 rounded-2xl focus:border-[#d4af37] transition-all font-bold text-white outline-none"
                                value={formData.variety}
                                onChange={e => setFormData({ ...formData, variety: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Harvest Timestamp</label>
                            <input
                                type="date"
                                className="w-full bg-white/5 border-2 border-white/5 p-5 rounded-2xl focus:border-[#d4af37] transition-all font-bold text-slate-300 outline-none"
                                value={formData.harvestDate}
                                onChange={e => setFormData({ ...formData, harvestDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-8">
                        <button type="submit" className="w-full bg-[#d4af37] text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-[#decba4] shadow-2xl shadow-[#d4af37]/10 transition-all flex items-center justify-center space-x-3">
                            <span className="text-xl">⬡</span>
                            <span>Initialize Trace</span>
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="w-full text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition-colors mt-4"
                    >
                        Discard Transaction
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateBatch;
