import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import API_URL from '../api/config';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'FARMER',
        organizationId: 'Org1'
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const payload = isLogin
            ? { email: formData.email, password: formData.password }
            : formData;

        try {
            const res = await axios.post(`${API_URL}${endpoint}`, payload);
            if (isLogin) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                toast.success('Login Successful!');
                navigate('/');
            } else {
                toast.success(res.data.msg || 'Registration Successful! Check email.');
                // Don't auto-login. Let them stay on login page or verify.
                setIsLogin(true); // Switch to login view
            }
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.msg || 'Something went wrong';
            toast.error(`${isLogin ? 'Login' : 'Registration'} Failed: ${errorMsg}`);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-3 sm:p-4 md:p-6 transition-colors duration-500">
            <div className="max-w-md w-full bg-surface rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_0_100px_rgba(212,175,55,0.1)] border border-[#d4af37]/20 p-5 sm:p-8 md:p-10 mt-6 md:mt-10 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 sm:mb-8 md:mb-10 gap-3 sm:gap-4 md:gap-0">
                    <div>
                        <h2 className="text-2xl sm:text-2xl md:text-3xl font-black text-primary tracking-tighter leading-none">
                            {isLogin ? 'Access' : 'Network'}
                        </h2>
                        <span className="text-gold font-black uppercase text-[9px] sm:text-[10px] tracking-widest">
                            {isLogin ? 'Secure Portal' : 'Enrollment'}
                        </span>
                    </div>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-gold text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:text-[#decba4] transition-colors border-b border-gold/30 pb-1 self-start md:self-auto whitespace-nowrap"
                    >
                        {isLogin ? 'Enroll Node' : 'Existing Node Login'}
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                    {!isLogin && (
                        <>
                            <div>
                                <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Authenticated Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-background border-2 border-border p-3 sm:p-4 rounded-xl sm:rounded-2xl focus:border-gold transition-all font-bold text-primary placeholder:text-secondary outline-none text-sm sm:text-base"
                                    placeholder="Enter full legal name"
                                    required={!isLogin}
                                />
                            </div>
                            <div>
                                <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Network Role</label>
                                <div className="relative">
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full bg-background border-2 border-border p-3 sm:p-4 rounded-xl sm:rounded-2xl focus:border-gold appearance-none transition-all font-bold text-primary outline-none text-sm sm:text-base"
                                    >
                                        <option value="FARMER" className="bg-surface text-primary">Farmer (Producer)</option>
                                        <option value="MILL" className="bg-surface text-primary">Spinning Mill</option>
                                        <option value="MANUFACTURER" className="bg-surface text-primary">Garment Manufacturer</option>
                                        <option value="EXPORTER" className="bg-surface text-primary">Exporter</option>
                                        <option value="BUYER" className="bg-surface text-primary">Global Buyer</option>
                                    </select>
                                    <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gold">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Security ID (Email)</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-background border-2 border-border p-4 rounded-2xl focus:border-gold transition-all font-bold text-primary placeholder:text-secondary outline-none"
                            placeholder="node@network.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Cryptographic Key (Password)</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-background border-2 border-border p-3 sm:p-4 rounded-xl sm:rounded-2xl focus:border-gold transition-all font-bold text-primary placeholder:text-secondary outline-none text-sm sm:text-base"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button className="w-full bg-gold text-black py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest hover:bg-[#decba4] transition-all shadow-xl shadow-gold/10 mt-6 sm:mt-8 text-sm sm:text-base">
                        {isLogin ? 'Initialize Access' : 'Commit Credentials'}
                    </button>

                    <p className="text-center text-[8px] sm:text-[10px] font-bold text-secondary uppercase tracking-widest mt-4 sm:mt-6">
                        Secured by Distributed Ledger Technology
                    </p>
                </form>

                {isLogin && (
                    <div className="mt-3 sm:mt-4 text-center">
                         <button 
                            onClick={async () => {
                                if (!formData.email) return toast.error("Please enter email to resend verification");
                                try {
                                    const res = await axios.post(`${API_URL}/api/auth/resend-verification`, { email: formData.email });
                                    toast.success(res.data.msg);
                                } catch (err) {
                                    toast.error(err.response?.data?.msg || "Failed to resend");
                                }
                            }}
                            className="text-[#d4af37] text-xs font-bold hover:underline"
                        >
                            Or: Resend Verification Email
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
