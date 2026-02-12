import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import QRCode from 'react-qr-code';
import QRScanner from '../components/QRScanner';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [batches, setBatches] = useState([]);
    const [showScanner, setShowScanner] = useState(false);
    const [showArchived, setShowArchived] = useState(false);

    // Action State
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [actionType, setActionType] = useState(''); // 'UPDATE' or 'TRANSFER'
    const [formData, setFormData] = useState({ stage: '', newOwnerId: '', location: '' });

    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    const handleUpload = async () => {
        if (!selectedFile) return toast.error("Please select a file first");
        setUploading(true);
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('document', selectedFile);

        try {
            await axios.post(`http://localhost:5000/api/batch/${selectedBatch.batchId}/upload`, formData, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("Document anchors securely to the ledger");
            setIsUploadOpen(false);
            setSelectedFile(null);
            fetchBatches(user, showArchived); // Pass user and showArchived to fetchBatches
        } catch (err) {
            console.error(err);
            toast.error("Cloud anchoring failed");
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const u = JSON.parse(userStr);
            setUser(u);
            fetchBatches(u, showArchived);
        }
    }, [showArchived]);

    const fetchBatches = async (u, archivedStatus = false) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/batch?showArchived=${archivedStatus}`, {
                headers: { 'x-auth-token': token }
            });
            setBatches(res.data);
        } catch (err) {
            console.error("Failed to fetch batches", err);
        }
    };

    const handleArchive = async (batchId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`http://localhost:5000/api/batch/${batchId}/archive`, {}, {
                headers: { 'x-auth-token': token }
            });
            toast.success(res.data.msg);
            fetchBatches(user, showArchived);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update archive status");
        }
    };

    const handleAction = async (e) => {
        e.preventDefault();
        if (!selectedBatch) return;

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/batch/${selectedBatch.batchId}/update`, {
                stage: actionType === 'UPDATE' ? formData.stage : undefined,
                newOwnerId: actionType === 'TRANSFER' ? formData.newOwnerId : undefined,
                data: actionType === 'UPDATE' ? { location: formData.location } : undefined
            }, {
                headers: { 'x-auth-token': token }
            });
            toast.success('Action Successful!');
            setSelectedBatch(null);
            fetchBatches(user);
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.msg || err.message;
            toast.error(`Action Failed: ${errorMsg}`);
        }
    };

    if (!user) {
        return (
            <div className="text-center mt-20">
                <h1 className="text-4xl font-bold mb-4">Textile Supply Chain Tracking</h1>
                <p className="mb-8 text-gray-600">Trace your garments from Farm to Fashion specifically for Tamil Nadu's industry.</p>
                <div className="space-x-4">
                    <Link to="/login" className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow font-medium">
                        Login
                    </Link>
                    <button onClick={() => setShowScanner(!showScanner)} className="bg-gray-800 text-white px-6 py-3 rounded-lg shadow font-medium">
                        {showScanner ? 'Hide Scanner' : 'Scan QR Code'}
                    </button>
                </div>
                {showScanner && <div className="mt-8"><QRScanner /></div>}

                {/* Manual Verification Fallback */}
                <div className="mt-8 max-w-md mx-auto">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Or enter Batch ID (e.g., COT-2026-001)"
                            className="flex-1 border p-2 rounded"
                            id="manualBatchId"
                        />
                        <button
                            onClick={() => {
                                const id = document.getElementById('manualBatchId').value;
                                if (id) window.location.href = `/verify/${id}`;
                            }}
                            className="bg-indigo-600 text-white px-4 py-2 rounded"
                        >
                            Verify
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">
            {/* Luxury Header */}
            <div className="bg-black text-white px-8 py-10 mb-8 rounded-b-3xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden border-b border-[#d4af37]/20">
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#d4af37] rounded-full opacity-10 blur-3xl"></div>
                <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-[#decba4] rounded-full opacity-5 blur-3xl"></div>

                <div className="relative z-10 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                            Dashboard <span className="text-[#d4af37] opacity-80">/ Explorer</span>
                        </h1>
                        <p className="text-slate-400 font-medium">Auditing {batches.length} secure supply chain batches</p>
                    </div>
                    <div className="text-right">
                        <span className="block text-xs uppercase tracking-widest text-slate-500 mb-1 font-bold">Authenticated Node</span>
                        <div className="flex items-center space-x-3 bg-white/5 p-2 pl-4 rounded-full border border-white/10">
                            <span className="font-bold">{user.name}</span>
                            <span className="bg-[#d4af37] text-black px-3 py-1 rounded-full text-[10px] font-black">{user.role}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-8 pb-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Network Volume', value: batches.length + ' Units', color: 'border-[#d4af37]' },
                        { label: 'On-Chain Sync', value: '100%', color: 'border-slate-700' },
                        { label: 'Active Oracles', value: '24 Nodes', color: 'border-slate-700' },
                        { label: 'Security Alerts', value: '0', color: 'border-green-500/50' }
                    ].map((stat, i) => (
                        <div key={i} className={`bg-black/40 backdrop-blur-md p-6 rounded-2xl shadow-sm border-b-2 ${stat.color} hover:translate-y-[-4px] transition-transform duration-300 border-x border-t border-white/5`}>
                            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
                            <p className="text-3xl font-black text-white">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-6">
                        <h2 className="text-2xl font-black text-white tracking-tight">Supply Chain Inventory</h2>
                        <div className="flex items-center bg-black/60 border border-slate-800 rounded-full p-1 pl-4 shadow-inner">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter mr-3">Show Archived</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showArchived}
                                    onChange={() => setShowArchived(!showArchived)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
                            </label>
                        </div>
                    </div>
                    {user.role === 'FARMER' && (
                        <Link to="/create-batch" className="bg-[#d4af37] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#decba4] shadow-lg shadow-[#d4af37]/20 transition-all flex items-center space-x-2">
                            <span className="text-xl">+</span>
                            <span>Mint New Batch</span>
                        </Link>
                    )}
                </div>

                {/* Interactive Inventory Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {batches.map((batch) => (
                        <div key={batch.batchId} className="group bg-black/50 backdrop-blur-md rounded-3xl shadow-xl border border-white/5 overflow-hidden hover:border-[#d4af37]/50 transition-all duration-500 relative">
                            {batch.isArchived && (
                                <div className="absolute top-4 right-4 z-10 bg-red-900/40 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">Archived</div>
                            )}

                            {/* Card Header */}
                            <div className="bg-white/5 p-6 border-b border-white/5 flex justify-between items-start">
                                <div>
                                    <span className="text-[10px] uppercase tracking-widest font-black text-slate-500">Trace ID</span>
                                    <h3 className="text-xl font-black text-[#d4af37] font-mono tracking-tighter leading-none mt-1">{batch.batchId}</h3>
                                </div>
                                <div className="bg-white p-2 rounded-xl border border-white/10 shadow-sm cursor-pointer hover:bg-[#d4af37]/10 transition-colors"
                                    onClick={() => { setSelectedBatch(batch); setActionType('QR'); }}>
                                    <QRCode value={`http://localhost:5173/verify/${batch.batchId}`} size={32} bgColor="transparent" fgColor="#d4af37" />
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6">
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="px-3 py-1 bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                            Stage: {batch.stage.replace('_', ' ')}
                                        </div>
                                        <span className="text-[10px] text-slate-500 font-bold uppercase">{new Date(batch.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-slate-400">
                                        <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-[#d4af37] border border-[#d4af37]/30 font-bold text-xs">
                                            {batch.currentOwner?.charAt(0) || 'U'}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] uppercase font-black text-slate-600 tracking-tighter leading-none">Verified Custodian</p>
                                            <p className="text-sm font-bold text-slate-300 truncate">{batch.currentOwner}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Bar */}
                                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                                    <Link to={`/verify/${batch.batchId}`} className="flex items-center justify-center bg-[#d4af37]/10 text-[#d4af37] py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#d4af37]/20 transition-colors border border-[#d4af37]/10">
                                        Audit History
                                    </Link>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            onClick={() => { setSelectedBatch(batch); setIsUploadOpen(true); }}
                                            className="bg-white/5 text-[#decba4] p-3 rounded-2xl hover:bg-[#d4af37] hover:text-black transition-all flex items-center justify-center border border-white/5"
                                            title="Upload Proof"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                        </button>
                                        <button onClick={() => { setSelectedBatch(batch); setActionType('UPDATE'); }} className="bg-white/5 text-slate-400 p-3 rounded-2xl hover:bg-[#d4af37] hover:text-black transition-all flex items-center justify-center border border-white/5" title="Record Processing">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                        </button>
                                        <button onClick={() => { setSelectedBatch(batch); setActionType('TRANSFER'); }} className="bg-white/5 text-slate-400 p-3 rounded-2xl hover:bg-white hover:text-black transition-all flex items-center justify-center border border-white/5" title="Transfer Ownership">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleArchive(batch.batchId)}
                                    className="w-full mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-[#d4af37] transition-colors text-center"
                                >
                                    {batch.isArchived ? 'Restore to Inventory' : 'Archive Record'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {batches.length === 0 && (
                    <div className="mt-12 text-center bg-black/40 backdrop-blur-md p-20 rounded-[3rem] border-2 border-dashed border-slate-800">
                        <div className="text-6xl mb-6 grayscale opacity-40">🧺</div>
                        <h3 className="text-2xl font-black text-slate-700 uppercase tracking-widest">No Batches Registered</h3>
                        <p className="text-slate-500 font-medium">Mint a new cotton batch to initialize the distributed ledger</p>
                    </div>
                )}
            </div>

            {/* Verification Section */}
            <div className="mx-8 mb-20 bg-gradient-to-r from-black via-[#d4af37]/20 to-black p-1 rounded-3xl border border-white/10">
                <div className="bg-black/80 backdrop-blur-xl p-12 rounded-[inherit] flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0">
                    <div>
                        <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Rapid Verification</h3>
                        <p className="text-[#decba4] font-medium italic">Direct ledger lookup via Batch Trace ID</p>
                    </div>
                    <div className="flex w-full md:w-auto bg-white/5 p-2 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
                        <input
                            type="text"
                            placeholder="e.g. COT-2026-X"
                            className="bg-transparent border-none text-[#d4af37] placeholder-slate-700 p-4 focus:ring-0 font-mono w-full md:w-80 font-bold"
                            id="authManualBatchId"
                        />
                        <button
                            onClick={() => {
                                const id = document.getElementById('authManualBatchId').value;
                                if (id) window.location.href = `/verify/${id}`;
                            }}
                            className="bg-[#d4af37] text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#decba4] transition-all shadow-lg shadow-black"
                        >
                            Audit
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal for Actions - Luxury Styled */}
            {selectedBatch && (
                <div className="fixed inset-0 backdrop-blur-xl bg-black/80 flex justify-center items-center z-50 p-6">
                    <div className="bg-[#121212] rounded-[2.5rem] shadow-[0_0_100px_rgba(212,175,55,0.15)] w-full max-w-lg overflow-hidden border border-[#d4af37]/20">
                        <div className="bg-black p-8 text-white relative border-b border-[#d4af37]/20">
                            <div className="absolute top-4 right-4 cursor-pointer hover:rotate-90 transition-transform duration-300 text-slate-500 hover:text-[#d4af37]" onClick={() => setSelectedBatch(null)}>
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </div>
                            <h2 className="text-3xl font-black tracking-tighter">
                                {actionType === 'UPDATE' ? 'Record Process' :
                                    actionType === 'TRANSFER' ? 'Transfer Control' :
                                        'Ledger Passport'}
                            </h2>
                            <p className="text-[#d4af37] font-bold uppercase text-[10px] tracking-widest mt-2">{selectedBatch.batchId}</p>
                        </div>

                        <div className="p-10">
                            {actionType === 'QR' ? (
                                <div className="flex flex-col items-center">
                                    <div className="bg-black p-8 rounded-[3rem] shadow-2xl border-4 border-[#d4af37]/20">
                                        <QRCode value={`http://localhost:5173/verify/${selectedBatch.batchId}`} size={240} fgColor="#d4af37" bgColor="transparent" />
                                    </div>
                                    <div className="mt-8 text-center">
                                        <p className="text-xl font-black text-[#d4af37] mb-1 uppercase tracking-widest">Authenticated QR Passport</p>
                                        <p className="text-sm text-slate-500 font-medium italic">Instant access to immutable supply chain logs</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedBatch(null)}
                                        className="mt-10 w-full py-5 bg-white/5 border border-white/10 rounded-3xl font-black uppercase tracking-widest text-[#d4af37] hover:bg-[#d4af37]/5 transition-all"
                                    >
                                        Dismiss Record
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleAction} className="space-y-6">
                                    {actionType === 'UPDATE' ? (
                                        <>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-2 opacity-60">Next Processing Stage</label>
                                                <div className="relative">
                                                    <select
                                                        className="w-full bg-black border-2 border-white/5 p-5 rounded-2xl appearance-none focus:border-[#d4af37] transition-all font-bold text-slate-300"
                                                        onChange={e => setFormData({ ...formData, stage: e.target.value })}
                                                        required
                                                    >
                                                        <option value="">Select Phase...</option>
                                                        <option value="GINNED">Ginned (Processing)</option>
                                                        <option value="SPUN_YARN">Spun Yarn (Spinning)</option>
                                                        <option value="WOVEN_FABRIC">Woven Fabric (Weaving)</option>
                                                        <option value="DYED">Dyed (Finishing)</option>
                                                        <option value="GARMENT_FINISHED">Garment Finished</option>
                                                        <option value="SHIPPED">Shipped (Logistics)</option>
                                                    </select>
                                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#d4af37]">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-2 opacity-60">Verified GPS Entry</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-black border-2 border-white/5 p-5 rounded-2xl focus:border-[#d4af37] transition-all font-bold text-slate-300"
                                                    placeholder="e.g. Tirupur Industrial Hub, TN"
                                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="bg-[#d4af37]/10 p-6 rounded-3xl border border-[#d4af37]/20">
                                                <p className="text-[#d4af37] text-xs font-bold leading-relaxed">
                                                    <span className="font-black">Notice:</span> Validating ownership transition across the distributed network.
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-2 opacity-60">New Custodian Network ID</label>
                                                <input
                                                    type="email"
                                                    className="w-full bg-black border-2 border-white/5 p-5 rounded-2xl focus:border-[#d4af37] transition-all font-bold text-slate-300"
                                                    placeholder="e.g. operator@textiletrace.com"
                                                    onChange={e => setFormData({ ...formData, newOwnerId: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex space-x-4 pt-6">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedBatch(null)}
                                            className="flex-1 py-5 border-2 border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-[#d4af37] hover:border-[#d4af37]/40 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-[2] py-5 bg-[#d4af37] text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#decba4] shadow-xl shadow-[#d4af37]/10 transition-all"
                                        >
                                            Commit to Ledger
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Secure Document Repository Modal */}
            {isUploadOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <div className="bg-[#121212] w-full max-w-lg rounded-[2.5rem] shadow-[0_0_100px_rgba(212,175,55,0.15)] border border-[#d4af37]/20 p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <svg className="w-20 h-20 text-[#d4af37]" fill="currentColor" viewBox="0 0 20 20"><path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L8 9.414V13H5.5z" /><path d="M9 13h2v5a1 1 0 11-2 0v-5z" /></svg>
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2 italic">Physical Proof Hub</h3>
                        <p className="text-[#d4af37] font-black uppercase text-[10px] tracking-widest mb-8">Anchor Certificates to Batch {selectedBatch?.batchId}</p>

                        <div className="space-y-6">
                            <div className="border-2 border-dashed border-[#d4af37]/20 rounded-3xl p-12 text-center hover:border-[#d4af37]/50 transition-all group cursor-pointer relative">
                                <input
                                    type="file"
                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <div className="space-y-4">
                                    <div className="w-16 h-16 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                        <svg className="w-8 h-8 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                    </div>
                                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                                        {selectedFile ? selectedFile.name : "Select Certification / Lab Report"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex space-x-4 pt-4">
                                <button
                                    onClick={() => { setIsUploadOpen(false); setSelectedFile(null); }}
                                    className="flex-1 bg-white/5 text-slate-400 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-red-900/20 hover:text-red-400 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    className="flex-2 bg-[#d4af37] text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#decba4] transition-all shadow-xl shadow-[#d4af37]/20 disabled:opacity-50"
                                >
                                    {uploading ? "Anchoring..." : "Commit Document"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
