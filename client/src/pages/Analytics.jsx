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
        <div className="min-h-screen bg-background text-primary p-4 sm:p-6 md:p-8 lg:p-16 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 sm:mb-12 lg:mb-16">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary tracking-tighter mb-2 italic">Network Intelligence</h1>
                    <p className="text-gold font-black uppercase text-[10px] sm:text-[12px] tracking-[0.3em]">Enterprise Ecosystem Surveillance</p>
                </header>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
                    {[
                        { label: 'Total Supply Chain Units', value: data?.summary?.totalUnits || 0, sub: 'Immutable Batches' },
                        { label: 'Network Node Count', value: data?.summary?.activeNodes || 0, sub: 'Authorized Oracles' },
                        { label: 'Ledger Health Index', value: `${data?.summary?.healthScore || 0}%`, sub: 'Real-time Synchronization' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-surface/50 border border-border p-6 sm:p-8 rounded-2xl sm:rounded-[2.5rem] backdrop-blur-md relative overflow-hidden group hover:border-gold/30 transition-colors">
                            <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-gold rounded-full opacity-5 blur-2xl group-hover:opacity-10 transition-opacity"></div>
                            <span className="block text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-secondary mb-2">{stat.label}</span>
                            <p className="text-3xl sm:text-4xl font-black text-gold mb-1">{stat.value}</p>
                            <p className="text-[8px] sm:text-[10px] font-bold text-secondary uppercase italic">{stat.sub}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
                    {/* Throughput Trend */}
                    <div className="bg-surface/30 border border-border p-4 sm:p-6 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl relative backdrop-blur-sm">
                        <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-6 sm:mb-8 flex items-center">
                            <span className="w-2 h-2 bg-gold rounded-full mr-3 animate-pulse"></span>
                            7-Day Network Throughput
                        </h3>
                        <div className="h-[250px] sm:h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data?.activityTrend}>
                                    <XAxis dataKey="name" stroke="var(--color-secondary)" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="var(--color-secondary)" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-gold)', borderRadius: '1rem', color: 'var(--color-primary)', fontSize: '12px' }}
                                        itemStyle={{ color: 'var(--color-gold)' }}
                                    />
                                    <Line type="monotone" dataKey="value" stroke="var(--color-gold)" strokeWidth={4} dot={{ fill: 'var(--color-gold)', r: 6 }} activeDot={{ r: 8, stroke: 'var(--color-background)', strokeWidth: 2 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Stage Distribution */}
                    <div className="bg-surface/30 border border-border p-4 sm:p-6 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl relative backdrop-blur-sm">
                        <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-6 sm:mb-8 flex items-center">
                            <span className="w-2 h-2 bg-gold rounded-full mr-3 animate-pulse"></span>
                            Supply Chain Lifecycle Distribution
                        </h3>
                        <div className="h-[250px] sm:h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data?.stageData}
                                        innerRadius={50}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data?.stageData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={GOLD_COLORS[index % GOLD_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '1rem', color: 'var(--color-primary)', fontSize: '12px' }}
                                        itemStyle={{ color: 'var(--color-primary)' }}
                                    />
                                    <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ color: 'var(--color-secondary)', fontSize: '10px', paddingTop: '20px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Node Roles Bar Chart */}
                <div className="bg-surface/30 border border-border p-4 sm:p-6 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl relative backdrop-blur-sm">
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-6 sm:mb-8 flex items-center">
                        <span className="w-2 h-2 bg-gold rounded-full mr-3 animate-pulse"></span>
                        Authorized Participant Demographics
                    </h3>
                    <div className="h-[250px] sm:h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.nodeData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                                <XAxis dataKey="name" stroke="var(--color-secondary)" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--color-secondary)" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'var(--color-surface)', opacity: 0.1 }} contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-gold)', borderRadius: '1rem', color: 'var(--color-primary)', fontSize: '12px' }} />
                                <Bar dataKey="value" fill="var(--color-gold)" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <footer className="mt-8 sm:mt-12 lg:mt-16 pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-secondary">
                    <span>Ledger Consensus Status: Active</span>
                    <span className="text-gold">Live Relay Synchronized</span>
                </footer>
            </div>
        </div>
    );
};

export default Analytics;
