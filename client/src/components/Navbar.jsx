import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import API_URL from '../api/config';
import logo from '../assets/logo.jpg';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        const userStr = localStorage.getItem('user');
        if (!userStr) return;

        const user = JSON.parse(userStr);
        setUser(user);

        const socket = io(API_URL);

        socket.on('connect', () => {
            // Join private channel based on email (used for transfers)
            socket.emit('join', user.email);
        });

        socket.on('notification', (data) => {
            setNotifications(prev => [{ ...data, id: Date.now(), read: false }, ...prev].slice(0, 10));
            toast.custom((t) => (
                <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max - w - md w - full bg - black / 90 border border - [#d4af37] / 40 shadow - 2xl rounded - [2rem] pointer - events - auto flex ring - 1 ring - black ring - opacity - 5 p - 6 backdrop - blur - xl`}>
                    <div className="flex-1 w-0">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                                <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                </div>
                            </div>
                            <div className="ml-4 flex-1">
                                <p className="text-sm font-black text-[#d4af37] uppercase tracking-widest">{data.type} Alert</p>
                                <p className="mt-1 text-sm font-bold text-white mb-2">{data.msg}</p>
                                <Link to={`/ verify / ${data.batchId} `} className="text-[10px] font-black uppercase text-slate-500 hover:text-[#d4af37] transition-colors" onClick={() => toast.dismiss(t.id)}>Audit Transaction →</Link>
                            </div>
                        </div>
                    </div>
                </div>
            ), { duration: 5000 });
        });

        return () => socket.disconnect();
    }, []);

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <nav className="bg-black border-b border-[#d4af37]/20 px-8 py-5 flex justify-between items-center sticky top-0 z-40 backdrop-blur-xl bg-black/90">
            <Link to="/" className="flex items-center space-x-3 group">
                <img src={logo} alt="Logo" className="w-10 h-10 rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.3)] group-hover:scale-110 transition-transform object-cover border border-[#d4af37]/30" />
                <span className="text-xl font-black text-white tracking-tighter">
                    Textile<span className="text-[#d4af37]">Trace</span>
                </span>
            </Link>

            <div className="flex items-center space-x-8 font-bold text-xs uppercase tracking-widest text-slate-500">
                <Link to="/" className="hover:text-[#d4af37] transition-colors">Network Explorer</Link>
                <Link to="/analytics" className="hover:text-[#d4af37] transition-colors">Network Intelligence</Link>

                {localStorage.getItem('token') ? (
                    <div className="flex items-center space-x-6 pl-6 border-l border-white/10 relative">
                        {/* Notification Bell */}
                        <div className="relative">
                            <button
                                onClick={() => { setShowNotifications(!showNotifications); markAllRead(); }}
                                className={`relative p - 2 rounded - xl transition - all ${showNotifications ? 'bg-[#d4af37] text-black' : 'hover:bg-white/5 text-slate-400 hover:text-[#d4af37]'} `}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-600 text-white text-[8px] flex items-center justify-center rounded-full border-2 border-black animate-pulse">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-4 w-80 bg-[#121212] border border-[#d4af37]/20 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-6 overflow-hidden">
                                    <h3 className="text-[10px] font-black uppercase text-[#d4af37] tracking-[0.3em] mb-6 opacity-60">Network Activity</h3>
                                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                        {notifications.length === 0 ? (
                                            <p className="text-slate-600 text-[10px] italic py-4">No recent ledger events...</p>
                                        ) : (
                                            notifications.map(n => (
                                                <div key={n.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-[#d4af37]/5 transition-colors group">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-[8px] font-black text-[#d4af37] tracking-[0.2em]">{n.type}</span>
                                                        <span className="text-[8px] text-slate-600">{new Date(n.timestamp).toLocaleTimeString()}</span>
                                                    </div>
                                                    <p className="text-[11px] font-bold text-slate-300 leading-relaxed mb-2">{n.msg}</p>
                                                    <Link to={`/ verify / ${n.batchId} `} className="text-[9px] font-black text-slate-500 hover:text-[#d4af37] uppercase tracking-tighter" onClick={() => setShowNotifications(false)}>Audit Record →</Link>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link to="/create-batch" className="text-[#d4af37] hover:text-[#decba4] transition-colors">Mint Batch</Link>
                        <button
                            onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                window.location.href = '/';
                            }}
                            className="bg-white/5 text-slate-400 px-5 py-2.5 rounded-xl hover:bg-red-900/40 hover:text-red-400 transition-all border border-white/5 hover:border-red-500/20"
                        >
                            Node Logout
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className="bg-[#d4af37] text-black px-6 py-3 rounded-xl hover:bg-[#decba4] transition-all shadow-lg shadow-[#d4af37]/10">
                        Secure Access
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
