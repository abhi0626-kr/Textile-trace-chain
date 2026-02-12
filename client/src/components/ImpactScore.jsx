import React from 'react';

const ImpactScore = ({ variety }) => {
    // Basic Logic for ESG Metrics
    const isOrganic = (variety || '').toLowerCase().includes('organic');
    const isRecycled = (variety || '').toLowerCase().includes('recycled');

    // Multipliers for conventional vs sustainable (simulated per 500kg batch)
    const metrics = {
        water: isOrganic ? 2500 : (isRecycled ? 3000 : 250),
        co2: isOrganic ? 12.5 : (isRecycled ? 15.0 : 1.2),
        pesticide: isOrganic ? 500 : (isRecycled ? 100 : 25),
        score: isOrganic ? 96 : (isRecycled ? 92 : 45)
    };

    return (
        <div className="bg-black/80 backdrop-blur-xl rounded-[2.5rem] border border-[#d4af37]/20 p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#d4af37] rounded-full opacity-5 blur-3xl group-hover:opacity-10 transition-opacity"></div>

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xl font-black text-white tracking-tight uppercase">Environmental Impact</h3>
                    <p className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.2em] mt-1">Sustainability Score Card</p>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-[#d4af37]/20 flex items-center justify-center relative">
                    <span className="text-xl font-black text-white">{metrics.score}</span>
                    <div className="absolute inset-0 rounded-full border-t-4 border-[#d4af37] animate-spin-slow"></div>
                </div>
            </div>

            <div className="space-y-6">
                {/* Water Saving */}
                <div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                        <span>Water Conservation</span>
                        <span className="text-[#d4af37]">{metrics.water}L SAVED</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#d4af37] to-[#decba4] transition-all duration-1000"
                            style={{ width: `${Math.min(100, (metrics.water / 3000) * 100)}%` }}
                        ></div>
                    </div>
                </div>

                {/* CO2 Offset */}
                <div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                        <span>Carbon Footprint Offset</span>
                        <span className="text-[#d4af37]">{metrics.co2}kg REDUCED</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#d4af37] to-[#decba4] transition-all duration-1000 delay-200"
                            style={{ width: `${Math.min(100, (metrics.co2 / 15) * 100)}%` }}
                        ></div>
                    </div>
                </div>

                {/* Pesticides */}
                <div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                        <span>Pesticide Avoidance</span>
                        <span className="text-[#d4af37]">{metrics.pesticide}g DIVERTED</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#d4af37] to-[#decba4] transition-all duration-1000 delay-400"
                            style={{ width: `${Math.min(100, (metrics.pesticide / 500) * 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${metrics.score > 80 ? 'bg-green-500' : 'bg-orange-500'} animate-pulse shadow-lg`}></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">
                        {metrics.score > 80 ? 'Certified Ethical' : 'Standard Compliance'}
                    </span>
                </div>
                <span className="text-[10px] font-black text-slate-600 uppercase">Per 500kg Unit</span>
            </div>
        </div>
    );
};

export default ImpactScore;
