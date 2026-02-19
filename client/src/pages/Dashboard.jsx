import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import API_URL from '../api/config';
import QRCode from 'react-qr-code';
import QRScanner from '../components/QRScanner';
import { motion } from 'framer-motion';
import BlockchainStatusBadge from '../components/BlockchainStatusBadge';

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

    const getImpactScore = (variety) => {
        const value = (variety || '').toLowerCase();
        if (value.includes('organic')) return 96;
        if (value.includes('recycled')) return 92;
        return 65;
    };

    const handleUpload = async () => {
        if (!selectedFile) return toast.error("Please select a file first");
        setUploading(true);
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('document', selectedFile);

        try {
            await axios.post(`${API_URL}/api/batch/${selectedBatch.batchId}/upload`, formData, {
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
            const res = await axios.get(`${API_URL}/api/batch?showArchived=${archivedStatus}`, {
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
            const res = await axios.put(`${API_URL}/api/batch/${batchId}/archive`, {}, {
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
            await axios.put(`${API_URL}/api/batch/${selectedBatch.batchId}/update`, {
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

    const totalBatches = batches.length;
    const activeTransfers = batches.filter((batch) => !batch.isArchived && batch.stage !== 'SHIPPED').length;
    const verifiedCount = batches.filter((batch) => batch.isSynced).length;
    const verifiedPercent = totalBatches ? Math.round((verifiedCount / totalBatches) * 100) : 0;
    const avgConfirmationTime = totalBatches
        ? Math.round(
            batches.reduce((acc, batch) => {
                const latestEvent = Array.isArray(batch.history) && batch.history.length > 0
                    ? batch.history[batch.history.length - 1]
                    : null;
                if (!latestEvent?.timestamp || !batch.updatedAt) return acc + 2;
                const diffMs = Math.abs(new Date(batch.updatedAt).getTime() - new Date(latestEvent.timestamp).getTime());
                return acc + Math.max(1, Math.round(diffMs / 60000));
            }, 0) / totalBatches
        )
        : 0;

    if (!user) {
        return (
            <div className="text-center px-4 sm:px-6 mt-12 sm:mt-20">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Textile Supply Chain Tracking</h1>
                <p className="mb-6 sm:mb-8 text-sm sm:text-base text-secondary max-w-2xl mx-auto">Trace your garments from Farm to Fashion specifically for Tamil Nadu's industry.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
                    <Link to="/login" className="w-full sm:w-auto bg-indigo-600 text-white px-5 sm:px-6 py-3 rounded-lg shadow font-medium text-center hover:bg-indigo-700 transition-colors">
                        Login
                    </Link>
                    <button onClick={() => setShowScanner(!showScanner)} className="w-full sm:w-auto bg-surface text-primary border border-border px-5 sm:px-6 py-3 rounded-lg shadow font-medium hover:bg-surface/80 transition-colors">
                        {showScanner ? 'Hide Scanner' : 'Scan QR Code'}
                    </button>
                    <Link to="/explorer/COT-DEMO-ITALY-001" className="w-full sm:w-auto bg-gold text-black px-5 sm:px-6 py-3 rounded-lg shadow font-bold text-center hover:opacity-90 transition-opacity">
                        Try Demo Data
                    </Link>
                </div>
                {showScanner && <div className="mt-6 sm:mt-8"><QRScanner /></div>}

                <div className="mt-8 sm:mt-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5">
                        <p className="text-[10px] uppercase tracking-widest font-black text-secondary mb-2">Supply Chain Flow</p>
                        <p className="font-black text-gold">Farmer → Mill → Manufacturer → Exporter → Buyer → Consumer</p>
                    </div>
                    <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5">
                        <p className="text-[10px] uppercase tracking-widest font-black text-secondary mb-2">How It Works</p>
                        <p className="font-bold">1) Register Batch • 2) Record Stage Updates • 3) Blockchain Verification • 4) QR-Based Consumer Check</p>
                    </div>
                </div>

                {/* Manual Verification Fallback */}
                <div className="mt-6 sm:mt-8 max-w-md mx-auto px-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            placeholder="Or enter Batch ID (e.g., COT-2026-001)"
                            className="flex-1 bg-surface border border-border text-primary placeholder:text-secondary p-3 rounded-xl text-sm sm:text-base focus:outline-none focus:border-gold transition-colors"
                            id="manualBatchId"
                        />
                        <button
                            onClick={() => {
                                const id = document.getElementById('manualBatchId').value;
                                if (id) window.location.href = `/verify/${id}`;
                            }}
                            className="bg-indigo-600 text-white px-4 sm:px-6 py-3 rounded-xl whitespace-nowrap hover:bg-indigo-700 transition-colors"
                        >
                            Verify
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-primary transition-colors duration-300">
            {/* Luxury Header */}
            <div className="bg-surface text-primary px-3 sm:px-4 md:px-8 py-6 sm:py-8 md:py-10 mb-6 sm:mb-8 rounded-b-3xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] relative overflow-hidden border-b border-border transition-colors duration-300">
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-gold rounded-full opacity-10 blur-3xl"></div>
                <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-[#decba4] rounded-full opacity-5 blur-3xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:gap-6 md:gap-0">
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold tracking-tight mb-2">
                            Dashboard <span className="text-gold opacity-80 hidden sm:inline">/ Explorer</span>
                        </h1>
                        <p className="text-secondary font-medium text-xs sm:text-sm md:text-base">Auditing {batches.length} secure supply chain batches</p>
                    </div>
                    <div className="text-left md:text-right w-full sm:w-auto">
                        <span className="block text-[9px] sm:text-xs uppercase tracking-widest text-secondary mb-1 font-bold">Authenticated Node</span>
                        <div className="flex items-center space-x-2 sm:space-x-3 bg-white/5 p-2 pl-3 sm:pl-4 rounded-full border border-white/10 w-fit text-sm sm:text-base">
                            <span className="font-bold truncate">{user.name}</span>
                            <span className="bg-gold text-black px-2 sm:px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-black whitespace-nowrap">{user.role}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-3 sm:px-4 md:px-8 pb-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12">
                    {[
                        { label: 'Total Batches', value: `${totalBatches}`, color: 'border-gold' },
                        { label: 'Active Transfers', value: `${activeTransfers}`, color: 'border-border' },
                        { label: 'Blockchain Verified %', value: `${verifiedPercent}%`, color: 'border-border' },
                        { label: 'Avg Confirmation Time', value: `${avgConfirmationTime} min`, color: 'border-green-500/50' }
                    ].map((stat, i) => (
                        <div key={i} className={`bg-surface/50 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-sm border-b-2 ${stat.color} hover:translate-y-[-4px] transition-transform duration-300 border-x border-t border-border`}>
                            <h3 className="text-secondary text-[9px] sm:text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
                            <p className="text-2xl sm:text-3xl font-black text-primary">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 md:gap-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full md:w-auto">
                        <h2 className="text-2xl font-black text-primary tracking-tight">Supply Chain Inventory</h2>
                        <div className="flex items-center bg-surface border border-border rounded-full p-1 pl-4 shadow-inner">
                            <span className="text-xs font-bold text-secondary uppercase tracking-tighter mr-3">Show Archived</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showArchived}
                                    onChange={() => setShowArchived(!showArchived)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-background peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                            </label>
                        </div>
                    </div>
                    {user.role === 'FARMER' && (
                        <Link to="/create-batch" className="w-full md:w-auto justify-center bg-gold text-black px-6 py-3 rounded-xl font-bold hover:bg-[#decba4] shadow-lg shadow-gold/20 transition-all flex items-center space-x-2">
                            <span className="text-xl">+</span>
                            <span>Mint New Batch</span>
                        </Link>
                    )}
                </div>

                {/* Interactive Inventory Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {batches.map((batch, index) => (
                        <motion.div 
                            key={batch.batchId} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="group bg-surface/50 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border border-border overflow-hidden hover:border-gold/50 transition-all duration-500 relative"
                        >
                            {batch.isArchived && (
                                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 bg-red-900/40 text-red-400 border border-red-500/20 px-2 sm:px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-black tracking-widest uppercase">Archived</div>
                            )}

                            {/* Card Header */}
                            <div className="bg-white/5 p-4 sm:p-6 border-b border-border flex justify-between items-start gap-3">
                                <div className="min-w-0 flex-1">
                                    <span className="text-[8px] sm:text-[10px] uppercase tracking-widest font-black text-secondary block">Trace ID</span>
                                    <h3 className="text-base sm:text-xl font-black text-gold font-mono tracking-tighter leading-none mt-1 break-all">{batch.batchId}</h3>
                                </div>
                                <div className="bg-white p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-white/10 shadow-sm cursor-pointer hover:bg-gold/10 transition-colors flex-shrink-0"
                                    onClick={() => { setSelectedBatch(batch); setActionType('QR'); }}>
                                    <QRCode value={`${window.location.origin}/verify/${batch.batchId}`} size={28} bgColor="transparent" fgColor="#d4af37" />
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-4 sm:p-6">
                                <div className="mb-4 sm:mb-6">
                                    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3 sm:mb-4">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="px-2 sm:px-3 py-1 bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 rounded-lg text-[8px] sm:text-[10px] font-black uppercase tracking-widest">
                                                Stage: {batch.stage.replace('_', ' ')}
                                            </div>
                                            <BlockchainStatusBadge status={batch.isSynced ? 'VERIFIED' : 'PENDING'} />
                                        </div>
                                        <span className="text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase">{new Date(batch.updatedAt).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 sm:space-x-3 text-slate-400">
                                        <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-black flex items-center justify-center text-[#d4af37] border border-[#d4af37]/30 font-bold text-xs flex-shrink-0">
                                            {batch.currentOwner?.charAt(0) || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[8px] sm:text-[10px] uppercase font-black text-secondary tracking-tighter leading-none">Verified Custodian</p>
                                            <p className="text-xs sm:text-sm font-bold text-primary truncate">{batch.currentOwner}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2 text-[10px]">
                                        <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                                            <p className="uppercase tracking-widest text-secondary font-black">Impact Score</p>
                                            <p className="text-gold font-black mt-1">{getImpactScore(batch.data?.variety)}/100</p>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                                            <p className="uppercase tracking-widest text-secondary font-black">Last Tx</p>
                                            <p className="text-gold font-black mt-1 truncate" title={batch.history?.[batch.history?.length - 1]?.txId || 'No hash'}>
                                                {(batch.history?.[batch.history?.length - 1]?.txId || 'Pending').slice(0, 12)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Bar */}
                                <div className="flex flex-col gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-white/5">
                                    <Link to={`/verify/${batch.batchId}`} className="flex items-center justify-center bg-[#d4af37]/10 text-[#d4af37] py-2 sm:py-3 rounded-lg sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-[#d4af37]/20 transition-colors border border-[#d4af37]/10">
                                        Audit History
                                    </Link>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            onClick={() => { setSelectedBatch(batch); setIsUploadOpen(true); }}
                                            className="bg-white/5 text-[#decba4] p-2 sm:p-3 rounded-lg sm:rounded-2xl hover:bg-[#d4af37] hover:text-black transition-all flex items-center justify-center border border-white/5"
                                            title="Upload Proof"
                                        >
                                            <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                        </button>
                                        <button onClick={() => { setSelectedBatch(batch); setActionType('UPDATE'); }} className="bg-white/5 text-slate-400 p-2 sm:p-3 rounded-lg sm:rounded-2xl hover:bg-[#d4af37] hover:text-black transition-all flex items-center justify-center border border-white/5" title="Record Processing">
                                            <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                        </button>
                                        <button onClick={() => { setSelectedBatch(batch); setActionType('TRANSFER'); }} className="bg-white/5 text-slate-400 p-2 sm:p-3 rounded-lg sm:rounded-2xl hover:bg-white hover:text-black transition-all flex items-center justify-center border border-white/5" title="Transfer Ownership">
                                            <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleArchive(batch.batchId)}
                                    className="w-full mt-3 sm:mt-4 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-[#d4af37] transition-colors text-center"
                                >
                                    {batch.isArchived ? 'Restore to Inventory' : 'Archive Record'}
                                </button>
                            </div>
                        </motion.div>
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
            <div className="mx-3 sm:mx-4 md:mx-8 mb-12 sm:mb-20 bg-surface/50 p-1 rounded-2xl sm:rounded-3xl border border-border mt-8 sm:mt-12">
                <div className="bg-surface/80 backdrop-blur-xl p-4 sm:p-8 md:p-12 rounded-[inherit] flex flex-col md:flex-row items-center justify-between space-y-6 sm:space-y-8 md:space-y-0">
                    <div className="w-full md:w-auto">
                        <h3 className="text-xl sm:text-3xl font-black text-primary mb-2 tracking-tight">Rapid Verification</h3>
                        <p className="text-gold font-medium italic text-sm sm:text-base">Direct ledger lookup via Batch Trace ID</p>
                    </div>
                    <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2 sm:gap-0 bg-white/5 p-2 rounded-2xl border border-border shadow-2xl backdrop-blur-md">
                        <input
                            type="text"
                            placeholder="e.g. COT-2026-X"
                            className="bg-transparent border-none text-gold placeholder-secondary p-3 sm:p-4 focus:ring-0 font-mono w-full sm:w-80 font-bold text-sm sm:text-base"
                            id="authManualBatchId"
                        />
                        <button
                            onClick={() => {
                                const id = document.getElementById('authManualBatchId').value;
                                if (id) window.location.href = `/verify/${id}`;
                            }}
                            className="bg-gold text-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-black text-sm sm:text-base uppercase tracking-widest hover:bg-[#decba4] transition-all shadow-lg shadow-black/20"
                        >
                            Audit
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal for Actions - Luxury Styled */}
            {selectedBatch && (
                <div className="fixed inset-0 backdrop-blur-xl bg-black/80 flex justify-center items-center z-50 p-4 sm:p-6 overflow-auto">
                    <div className="bg-surface rounded-[2.5rem] shadow-[0_0_100px_rgba(212,175,55,0.15)] w-full max-w-lg overflow-hidden border border-border my-auto">
                        <div className="bg-background p-6 sm:p-8 text-primary relative border-b border-border">
                            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 cursor-pointer hover:rotate-90 transition-transform duration-300 text-secondary hover:text-gold" onClick={() => setSelectedBatch(null)}>
                                <svg className="w-6 sm:w-8 h-6 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter">
                                {actionType === 'UPDATE' ? 'Record Process' :
                                    actionType === 'TRANSFER' ? 'Transfer Control' :
                                        'Ledger Passport'}
                            </h2>
                            <p className="text-gold font-bold uppercase text-[8px] sm:text-[10px] tracking-widest mt-2">{selectedBatch.batchId}</p>
                        </div>

                        <div className="p-6 sm:p-10">
                            {actionType === 'QR' ? (
                                <div className="flex flex-col items-center">
                                    <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-4 border-gold/20">
                                        <QRCode value={`${window.location.origin}/verify/${selectedBatch.batchId}`} size={240} fgColor="#d4af37" bgColor="transparent" />
                                    </div>
                                    <div className="mt-8 text-center">
                                        <p className="text-xl font-black text-primary mb-1 uppercase tracking-widest">Authenticated QR Passport</p>
                                        <p className="text-sm text-secondary font-medium italic">Instant access to immutable supply chain logs</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedBatch(null)}
                                        className="mt-10 w-full py-5 bg-white/5 border border-border rounded-3xl font-black uppercase tracking-widest text-gold hover:bg-gold/5 transition-all"
                                    >
                                        Dismiss Record
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleAction} className="space-y-6">
                                    {actionType === 'UPDATE' ? (
                                        <>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-gold mb-2 opacity-60">Next Processing Stage</label>
                                                <div className="relative">
                                                    <select
                                                        className="w-full bg-background border-2 border-border p-5 rounded-2xl appearance-none focus:border-gold transition-all font-bold text-primary"
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
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-gold mb-2 opacity-60">Verified GPS Entry</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-background border-2 border-border p-5 rounded-2xl focus:border-gold transition-all font-bold text-primary"
                                                    placeholder="e.g. Tirupur Industrial Hub, TN"
                                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="bg-gold/10 p-6 rounded-3xl border border-gold/20">
                                                <p className="text-gold text-xs font-bold leading-relaxed">
                                                    <span className="font-black">Notice:</span> Validating ownership transition across the distributed network.
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-gold mb-2 opacity-60">New Custodian Network ID</label>
                                                <input
                                                    type="email"
                                                    className="w-full bg-background border-2 border-border p-5 rounded-2xl focus:border-gold transition-all font-bold text-primary"
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
                                            className="flex-1 py-5 border-2 border-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-secondary hover:text-gold hover:border-gold/40 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-[2] py-5 bg-gold text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#decba4] shadow-xl shadow-gold/10 transition-all"
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
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 overflow-auto">
                    <div className="bg-surface w-full max-w-lg rounded-[2.5rem] shadow-[0_0_100px_rgba(212,175,55,0.15)] border border-border p-6 sm:p-10 relative overflow-hidden my-auto">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <svg className="w-20 h-20 text-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L8 9.414V13H5.5z" /><path d="M9 13h2v5a1 1 0 11-2 0v-5z" /></svg>
                        </div>
                        <h3 className="text-2xl font-black text-primary mb-2 italic">Physical Proof Hub</h3>
                        <p className="text-gold font-black uppercase text-[10px] tracking-widest mb-8">Anchor Certificates to Batch {selectedBatch?.batchId}</p>

                        <div className="space-y-6">
                            <div className="border-2 border-dashed border-gold/20 rounded-3xl p-12 text-center hover:border-gold/50 transition-all group cursor-pointer relative">
                                <input
                                    type="file"
                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <div className="space-y-4">
                                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                    </div>
                                    <p className="text-secondary font-bold uppercase text-[10px] tracking-widest">
                                        {selectedFile ? selectedFile.name : "Select Certification / Lab Report"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex space-x-4 pt-4">
                                <button
                                    onClick={() => { setIsUploadOpen(false); setSelectedFile(null); }}
                                    className="flex-1 bg-white/5 text-secondary py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-red-900/20 hover:text-red-400 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    className="flex-2 bg-gold text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#decba4] transition-all shadow-xl shadow-gold/20 disabled:opacity-50"
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
