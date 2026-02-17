import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import API_URL from '../api/config';
import { motion } from 'framer-motion';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [seeding, setSeeding] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
    }, []);

    const handleSeedData = async () => {
        setSeeding(true);
        const token = localStorage.getItem('token');
        
        try {
            const res = await axios.post(`${API_URL}/api/seed/batches`, 
                { count: 10 }, 
                { headers: { 'x-auth-token': token } }
            );
            toast.success(res.data.msg);
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.msg || err.message;
            toast.error(`Seeding failed: ${errorMsg}`);
        } finally {
            setSeeding(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Not Logged In</h2>
                    <Link to="/login" className="bg-[#d4af37] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#decba4] transition-all">
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-black p-10 rounded-[3rem] shadow-[0_0_100px_rgba(212,175,55,0.1)] border border-[#d4af37]/20 relative overflow-hidden mb-8"
                >
                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#d4af37] rounded-full opacity-10 blur-3xl"></div>
                    
                    <div className="relative z-10">
                        <h1 className="text-4xl font-black text-white tracking-tighter mb-2 italic">Network Profile</h1>
                        <p className="text-[#d4af37] font-black uppercase text-[10px] tracking-[0.2em]">Authenticated Node Identity</p>
                    </div>
                </motion.div>

                {/* Profile Card */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-black/50 backdrop-blur-md rounded-[2.5rem] shadow-xl border border-white/5 overflow-hidden p-10"
                >
                    <div className="flex items-center space-x-6 mb-8">
                        <div className="w-24 h-24 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] border-4 border-[#d4af37]/30 font-black text-3xl">
                            {user.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white mb-1">{user.name}</h2>
                            <span className="bg-[#d4af37] text-black px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                                {user.role}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                            <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Email Address</span>
                            <p className="text-white font-bold">{user.email}</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                            <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Node Role</span>
                            <p className="text-white font-bold">{user.role}</p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                        <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4">Developer Tools</h3>
                        <div className="bg-[#d4af37]/10 p-6 rounded-2xl border border-[#d4af37]/20">
                            <p className="text-slate-400 text-sm mb-4 font-medium">
                                Generate test data to populate the dashboard with sample batches. This will create 10 batches with randomized stages and histories.
                            </p>
                            <button
                                onClick={handleSeedData}
                                disabled={seeding}
                                className="bg-[#d4af37] text-black px-6 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-[#decba4] transition-all shadow-lg shadow-[#d4af37]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {seeding ? 'Seeding...' : '🌱 Seed Test Data'}
                            </button>
                        </div>
                    </div>

                    <Link 
                        to="/" 
                        className="mt-8 w-full block text-center text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition-colors"
                    >
                        Return to Dashboard
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
