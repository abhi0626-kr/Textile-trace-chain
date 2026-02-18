import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const Menu = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-background text-primary flex flex-col relative">
            {/* Header with close button */}
            <div className="flex justify-between items-center px-4 md:px-8 py-4 md:py-5 border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur-xl">
                <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tighter">
                    Network <span className="text-gold">Menu</span>
                </h1>
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                    <X size={28} className="text-gold" />
                </button>
            </div>

            {/* Menu Content */}
            <div className="flex-1 flex flex-col items-center justify-start pt-16 md:pt-24 px-4 space-y-6">
                {/* Main Navigation */}
                <button
                    onClick={() => handleNavigation('/')}
                    className="w-full max-w-sm px-6 py-6 md:py-8 bg-gradient-to-br from-white/10 to-white/5 border border-border rounded-2xl hover:border-gold hover:bg-gradient-to-br hover:from-gold/10 hover:to-gold/5 transition-all shadow-lg hover:shadow-gold/20"
                >
                    <div className="flex flex-col items-start">
                        <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em] mb-2">Navigation</span>
                        <h2 className="text-2xl md:text-3xl font-black text-primary tracking-tighter">Network Explorer</h2>
                        <p className="text-sm text-secondary mt-2">View supply chain dashboard</p>
                    </div>
                </button>

                <button
                    onClick={() => handleNavigation('/analytics')}
                    className="w-full max-w-sm px-6 py-6 md:py-8 bg-gradient-to-br from-white/10 to-white/5 border border-border rounded-2xl hover:border-gold hover:bg-gradient-to-br hover:from-gold/10 hover:to-gold/5 transition-all shadow-lg hover:shadow-gold/20"
                >
                    <div className="flex flex-col items-start">
                        <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em] mb-2">Analytics</span>
                        <h2 className="text-2xl md:text-3xl font-black text-primary tracking-tighter">Network Intelligence</h2>
                        <p className="text-sm text-secondary mt-2">Real-time network statistics</p>
                    </div>
                </button>

                {/* Conditional Menu Items */}
                {token ? (
                    <>
                        <button
                            onClick={() => handleNavigation('/create-batch')}
                            className="w-full max-w-sm px-6 py-6 md:py-8 bg-gradient-to-br from-gold/20 to-gold/10 border border-gold/50 rounded-2xl hover:border-gold hover:bg-gradient-to-br hover:from-gold/30 hover:to-gold/20 transition-all shadow-lg hover:shadow-gold/30"
                        >
                            <div className="flex flex-col items-start">
                                <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em] mb-2">Action</span>
                                <h2 className="text-2xl md:text-3xl font-black text-gold tracking-tighter">Mint Batch</h2>
                                <p className="text-sm text-secondary mt-2">Create new supply chain batch</p>
                            </div>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full max-w-sm px-6 py-6 md:py-8 bg-gradient-to-br from-red-900/20 to-red-900/10 border border-red-500/30 rounded-2xl hover:border-red-500 hover:bg-gradient-to-br hover:from-red-900/30 hover:to-red-900/20 transition-all shadow-lg hover:shadow-red-500/20"
                        >
                            <div className="flex flex-col items-start">
                                <span className="text-[10px] font-black text-red-400 uppercase tracking-[0.3em] mb-2">Account</span>
                                <h2 className="text-2xl md:text-3xl font-black text-red-400 tracking-tighter">Node Logout</h2>
                                <p className="text-sm text-secondary mt-2">Disconnect from network</p>
                            </div>
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => handleNavigation('/login')}
                        className="w-full max-w-sm px-6 py-6 md:py-8 bg-gradient-to-br from-gold/30 to-gold/20 border border-gold rounded-2xl hover:border-gold hover:bg-gradient-to-br hover:from-gold/40 hover:to-gold/30 transition-all shadow-xl hover:shadow-gold/40"
                    >
                        <div className="flex flex-col items-start">
                            <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em] mb-2">Secure</span>
                            <h2 className="text-2xl md:text-3xl font-black text-black tracking-tighter">Secure Access</h2>
                            <p className="text-sm text-black/70 mt-2">Login to network</p>
                        </div>
                    </button>
                )}
            </div>

            {/* Footer */}
            <div className="px-4 py-8 text-center text-secondary text-xs border-t border-border">
                <p>TextileTrace Supply Chain Network • {new Date().getFullYear()}</p>
            </div>
        </div>
    );
};

export default Menu;
