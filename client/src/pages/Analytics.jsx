import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../api/config';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const GOLD_COLORS = ['#d4af37', '#decba4', '#8a6d3b', '#c5a028', '#decba4'];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/batch/stats/summary`);
                setData(res.data);
            } catch (err) {
                console.error("Failed to fetch statistics", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-slate-800 border-t-[#d4af37] rounded-full animate-spin mx-auto mb-4 shadow-[0_0_15px_rgba(212,175,55,0.2)]"></div>
                <p className="text-[#d4af37] font-black uppercase tracking-widest text-xs animate-pulse">Synchronizing Intelligence...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-slate-300 p-8 md:p-16">
            <div className="max-w-7xl mx-auto">
                <header className="mb-16">
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-2 italic">Network Intelligence</h1>
                    <p className="text-[#d4af37] font-black uppercase text-[12px] tracking-[0.3em]">Enterprise Ecosystem Surveillance</p>
                </header>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {[
                        { label: 'Total Supply Chain Units', value: data?.summary?.totalUnits || 0, sub: 'Immutable Batches' },
                        { label: 'Network Node Count', value: data?.summary?.activeNodes || 0, sub: 'Authorized Oracles' },
                        { label: 'Ledger Health Index', value: `${data?.summary?.healthScore || 0}%`, sub: 'Real-time Synchronization' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md relative overflow-hidden group">
                            <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-[#d4af37] rounded-full opacity-5 blur-2xl group-hover:opacity-10 transition-opacity"></div>
                            <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{stat.label}</span>
                            <p className="text-4xl font-black text-[#d4af37] mb-1">{stat.value}</p>
                            <p className="text-[10px] font-bold text-slate-600 uppercase italic">{stat.sub}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                    {/* Throughput Trend */}
                    <div className="bg-black/40 border border-white/5 p-10 rounded-[3rem] shadow-2xl relative">
                        <h3 className="text-sm font-black uppercase tracking-widest text-white mb-8 flex items-center">
                            <span className="w-2 h-2 bg-[#d4af37] rounded-full mr-3 animate-pulse"></span>
                            7-Day Network Throughput
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data?.activityTrend}>
                                    <XAxis dataKey="name" stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ background: '#121212', border: '1px solid #d4af37', borderRadius: '1rem', color: '#fff' }}
                                        itemStyle={{ color: '#d4af37' }}
                                    />
                                    <Line type="monotone" dataKey="value" stroke="#d4af37" strokeWidth={4} dot={{ fill: '#d4af37', r: 6 }} activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Stage Distribution */}
                    <div className="bg-black/40 border border-white/5 p-10 rounded-[3rem] shadow-2xl relative">
                        <h3 className="text-sm font-black uppercase tracking-widest text-white mb-8 flex items-center">
                            <span className="w-2 h-2 bg-[#d4af37] rounded-full mr-3 animate-pulse"></span>
                            Supply Chain Lifecycle Distribution
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data?.stageData}
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data?.stageData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={GOLD_COLORS[index % GOLD_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ background: '#121212', border: 'none', borderRadius: '1rem' }}
                                    />
                                    <Legend verticalAlign="bottom" align="center" iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Node Roles Bar Chart */}
                <div className="bg-black/40 border border-white/5 p-10 rounded-[3rem] shadow-2xl relative">
                    <h3 className="text-sm font-black uppercase tracking-widest text-white mb-8 flex items-center">
                        <span className="w-2 h-2 bg-[#d4af37] rounded-full mr-3 animate-pulse"></span>
                        Authorized Participant Demographics
                    </h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.nodeData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                <XAxis dataKey="name" stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ background: '#121212', border: '1px solid #d4af37', borderRadius: '1rem', color: '#fff' }} />
                                <Bar dataKey="value" fill="#d4af37" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <footer className="mt-16 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-600">
                    <span>Ledger Consensus Status: Active</span>
                    <span className="text-[#d4af37]">Live Relay Synchronized</span>
                </footer>
            </div>
        </div>
    );
};

export default Analytics;
