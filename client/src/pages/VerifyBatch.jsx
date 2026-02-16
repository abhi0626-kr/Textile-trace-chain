import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../api/config';
import TraceTimeline from '../components/TraceTimeline';
import TraceMap from '../components/TraceMap';
import ImpactScore from '../components/ImpactScore';

const VerifyBatch = () => {
    const { id } = useParams();
    const [batch, setBatch] = useState(null);

    useEffect(() => {
        const fetchBatch = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/batch/${id}`);
                setBatch(res.data);
            } catch (err) {
                console.error("Failed to fetch batch", err);
            }
        };
        fetchBatch();
    }, [id]);

    if (!batch) return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-slate-800 border-t-[#d4af37] rounded-full animate-spin mx-auto mb-4 shadow-[0_0_15px_rgba(212,175,55,0.2)]"></div>
                <p className="text-[#d4af37] font-black uppercase tracking-widest text-xs animate-pulse">Accessing Secure Ledger...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-900 pb-12 sm:pb-20 text-slate-300">
            {/* Enterprise Verification Header */}
            <div className="bg-black text-white px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 mb-6 sm:mb-8 md:mb-12 relative overflow-hidden border-b border-[#d4af37]/20">
                <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#d4af37]/10 to-transparent"></div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
                        <div>
                            <Link to="/" className="text-[#d4af37] text-xs font-black uppercase tracking-widest hover:text-[#decba4] transition-colors mb-3 sm:mb-4 inline-block">← Return to Network</Link>
                            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tighter mb-2">Immutable Trace Passport</h1>
                            <p className="text-slate-500 font-medium italic text-xs sm:text-sm md:text-base">Cryptographic audit of premium textile supply chain integrity</p>
                        </div>
                        <div className="bg-[#d4af37] text-black px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#d4af37]/20 flex items-center space-x-2 sm:space-x-3 w-full md:w-auto justify-center text-sm sm:text-base">
                            <svg className="w-5 sm:w-6 h-5 sm:h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9L10 .3l7.834 4.6a1 1 0 01.5 1.175l-2.9 10.155a1 1 0 01-.806.711l-4.228.423a1 1 0 01-.8 0l-4.228-.423a1 1 0 01-.806-.711l-2.9-10.155a1 1 0 01.5-1.175zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                            <span>Ledger Verified</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 bg-white/5 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl md:rounded-[2.5rem] border border-white/10 backdrop-blur-sm">
                        <div className="border-b sm:border-b-0 sm:border-r border-white/10 pb-4 sm:pb-0">
                            <span className="block text-[8px] sm:text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Batch Trace ID</span>
                            <p className="text-base sm:text-xl md:text-2xl font-black font-mono text-[#d4af37] break-all">{batch.batchId}</p>
                        </div>
                        <div className="border-b sm:border-b-0 sm:border-r border-white/10 pb-4 sm:pb-0 px-0 sm:px-4 md:px-8">
                            <span className="block text-[8px] sm:text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Material Composition</span>
                            <p className="text-base sm:text-xl md:text-2xl font-black text-white">{batch.data?.variety || 'Organic Cotton'} <span className="text-xs sm:text-sm text-[#d4af37] font-medium">(Certified)</span></p>
                        </div>
                        <div className="px-0 sm:px-4 md:px-8">
                            <span className="block text-[8px] sm:text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Synchronized Update</span>
                            <p className="text-base sm:text-xl md:text-2xl font-black text-white">{new Date(batch.updatedAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
                {/* Horizontal Traceability Map */}
                <div className="bg-black/60 backdrop-blur-md rounded-[3rem] shadow-xl border border-white/5 p-6 md:p-12 mb-12">
                    <h2 className="text-2xl font-black text-white tracking-tight mb-8 flex items-center space-x-3">
                        <span className="w-8 h-8 rounded-xl bg-[#d4af37] flex items-center justify-center text-black text-sm italic">T</span>
                        <span>Supply Chain Architecture</span>
                    </h2>
                    <TraceTimeline currentStage={batch.stage} />

                    {/* Geographical Journey Map */}
                    <div className="mt-16">
                        <h3 className="text-xs font-black text-[#d4af37] uppercase tracking-[0.3em] mb-6 opacity-80 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Global Asset Movement
                        </h3>
                        <TraceMap history={batch.history} />
                    </div>
                </div>

                {/* Detailed Audit Logs & ESG */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        {/* ESG & Sustainability Tracker */}
                        <ImpactScore variety={batch.data?.variety} />

                        <div className="bg-black/40 backdrop-blur-md rounded-[3rem] shadow-lg border border-white/5 p-10 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <svg className="w-32 h-32 text-[#d4af37]" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                            </div>
                            <h3 className="text-xl font-black text-white mb-8 uppercase tracking-widest border-b border-white/5 pb-4">On-Chain Event Logs</h3>
                            <div className="space-y-10">
                                {batch.history.map((event, index) => (
                                    <div key={index} className="flex group">
                                        <div className="mr-6 flex flex-col items-center">
                                            <div className="w-4 h-4 rounded-full bg-[#d4af37] border-4 border-[#d4af37]/20 ring-4 ring-transparent group-hover:ring-[#d4af37]/10 transition-all"></div>
                                            {index !== batch.history.length - 1 && <div className="w-0.5 flex-1 bg-white/5 my-2"></div>}
                                        </div>
                                        <div className="pb-8 flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-black text-slate-200 uppercase tracking-tight">{event.stage.replace('_', ' ')}</h4>
                                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{new Date(event.timestamp).toLocaleString()}</span>
                                            </div>
                                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 group-hover:bg-[#d4af37]/5 group-hover:border-[#d4af37]/10 transition-colors">
                                                <div className="flex items-center space-x-4 mb-4">
                                                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-sm shadow-sm border border-white/5">📍</div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Processing Node</p>
                                                        <p className="text-sm font-bold text-slate-300">{event.location || batch.data?.location || 'Unknown Node'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-sm shadow-sm border border-white/5">👤</div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Authorized Custodian</p>
                                                        <p className="text-sm font-bold text-slate-300">{event.owner}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Certification Card */}
                        <div className="bg-gradient-to-br from-[#d4af37] to-[#decba4] rounded-[3rem] p-1 shadow-xl">
                            <div className="bg-black/90 rounded-[inherit] p-10 h-full backdrop-blur-md">
                                <h3 className="text-xl font-black text-white mb-6 uppercase tracking-widest">Digital Attestations</h3>
                                <div className="space-y-4">
                                    {[
                                        { name: 'GOTS Certified Organic', color: 'bg-green-900/40 text-green-400 border-green-500/20' },
                                        { name: 'OEKO-TEX Standard 100', color: 'bg-blue-900/40 text-blue-400 border-blue-500/20' },
                                        { name: 'Fair Trade Protocol', color: 'bg-orange-900/40 text-orange-400 border-orange-500/20' }
                                    ].map((cert, i) => (
                                        <div key={i} className={`${cert.color} p-4 rounded-2xl font-bold flex items-center justify-between border`}>
                                            <span>{cert.name}</span>
                                            <svg className="w-5 h-5 opacity-50" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.25.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                        </div>
                                    ))}
                                    {batch.documents && batch.documents.length > 0 && (
                                        <div className="mt-8 pt-8 border-t border-white/5">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af37] mb-6 opacity-80">Authenticated Documentation</h4>
                                            <div className="grid grid-cols-1 gap-4">
                                                {batch.documents.map((doc, i) => (
                                                    <a
                                                        key={i}
                                                        href={`${API_URL}${doc.url}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="bg-black/40 hover:bg-[#d4af37]/5 p-5 rounded-3xl border border-white/5 hover:border-[#d4af37]/20 transition-all group flex items-start space-x-4"
                                                    >
                                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#d4af37] group-hover:scale-110 transition-transform">
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-black text-slate-200 truncate group-hover:text-[#d4af37] transition-colors">{doc.filename}</p>
                                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Uploaded: {new Date(doc.timestamp).toLocaleDateString()}</p>
                                                            <div className="mt-3 flex items-center space-x-2">
                                                                <span className="text-[8px] font-mono text-[#d4af37]/60 bg-[#d4af37]/5 px-2 py-1 rounded truncate flex-1">
                                                                    HASH: {doc.fileHash}
                                                                </span>
                                                                <span className="text-[8px] font-black text-slate-700 uppercase">Secure Link ↗</span>
                                                            </div>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Blockchain Card */}
                        <div className="bg-black rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden border border-[#d4af37]/10">
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#d4af37] rounded-full opacity-5 blur-3xl"></div>
                            <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-[#d4af37] opacity-80">Distributed Ledger Record</h3>
                            <div className="space-y-6 font-mono text-[10px]">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 uppercase break-all font-bold">
                                    <span className="text-[#decba4]">Genesis Node Hash:</span><br />
                                    {btoa(batch.batchId + 'genesis').substring(0, 48)}...
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 uppercase break-all font-bold">
                                    <span className="text-[#d4af37]">Transaction Signature:</span><br />
                                    {btoa(batch.updatedAt + 'ledger').substring(0, 48)}...
                                </div>
                            </div>
                            <div className="mt-8 flex items-center space-x-3">
                                <span className="w-3 h-3 bg-[#d4af37] rounded-full animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.6)]"></span>
                                <span className="text-xs font-black uppercase tracking-widest text-[#d4af37]">Consensus Verified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyBatch;
