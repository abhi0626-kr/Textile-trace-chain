import React from 'react';

const STAGES = [
    { id: 'RAW_COTTON', label: 'Primary Producer', icon: '👨‍🌾' },
    { id: 'GINNED', label: 'Processing Mill', icon: '🏭' },
    { id: 'SPUN_YARN', label: 'Spinning Mill', icon: '🧶' },
    { id: 'WOVEN_FABRIC', label: 'Weaver/Knitter', icon: '🧵' },
    { id: 'GARMENT_FINISHED', label: 'Manufacturer', icon: '👕' },
    { id: 'SHIPPED', label: 'Distribution', icon: '📦' }
];

const TraceTimeline = ({ currentStage }) => {
    const currentIndex = STAGES.findIndex(s => s.id === currentStage);

    return (
        <div className="w-full py-8">
            <div className="flex items-center justify-between relative px-2">
                {/* Background Connector Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 z-0"></div>

                {/* Progress Connector Line (Gold) */}
                <div
                    className="absolute top-1/2 left-0 h-1 bg-[#d4af37] -translate-y-1/2 z-0 transition-all duration-700 ease-in-out"
                    style={{ width: `${(currentIndex / (STAGES.length - 1)) * 100}%` }}
                ></div>

                {STAGES.map((stage, index) => {
                    const isActive = index <= currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                        <div key={stage.id} className="relative z-10 flex flex-col items-center">
                            {/* Node */}
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isCurrent ? 'bg-black border-[#d4af37] scale-125 shadow-[0_0_15px_rgba(212,175,55,0.4)]' :
                                    isActive ? 'bg-[#d4af37] border-[#d4af37]' :
                                        'bg-slate-900 border-slate-700'
                                    }`}
                            >
                                {isActive && !isCurrent ? (
                                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <span className="text-xl">{stage.icon}</span>
                                )}
                            </div>

                            {/* Label */}
                            <div className="absolute top-12 w-32 text-center">
                                <p className={`text-[10px] font-black uppercase tracking-widest ${isCurrent ? 'text-[#d4af37]' :
                                    isActive ? 'text-[#decba4]' : 'text-slate-600'
                                    }`}>
                                    {stage.label}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-16 bg-black p-5 rounded-2xl shadow-inner border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <span className="w-3 h-3 bg-[#d4af37] rounded-full animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.6)]"></span>
                    <span className="text-xs font-black uppercase tracking-widest text-[#decba4]">Verified Node: {STAGES[currentIndex]?.label || 'Initial'}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">"Secured via Gold-Standard Ledger"</p>
            </div>
        </div>
    );
};

export default TraceTimeline;
