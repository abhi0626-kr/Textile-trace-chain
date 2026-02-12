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
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            toast.success(isLogin ? 'Login Successful!' : 'Registration Successful!');
            navigate('/');
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.msg || 'Something went wrong';
            toast.error(`${isLogin ? 'Login' : 'Registration'} Failed: ${errorMsg}`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-black rounded-[2.5rem] shadow-[0_0_100px_rgba(212,175,55,0.1)] border border-[#d4af37]/20 p-10 mt-10">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tighter leading-none">
                            {isLogin ? 'Access' : 'Network'}
                        </h2>
                        <span className="text-[#d4af37] font-black uppercase text-[10px] tracking-widest">
                            {isLogin ? 'Secure Portal' : 'Enrollment'}
                        </span>
                    </div>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-[#decba4] text-[10px] font-black uppercase tracking-widest hover:text-[#d4af37] transition-colors border-b border-[#d4af37]/30 pb-1"
                    >
                        {isLogin ? 'Enroll Node' : 'Existing Node Login'}
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Authenticated Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border-2 border-white/5 p-4 rounded-2xl focus:border-[#d4af37] transition-all font-bold text-white outline-none"
                                    placeholder="Enter full legal name"
                                    required={!isLogin}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Network Role</label>
                                <div className="relative">
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border-2 border-white/5 p-4 rounded-2xl focus:border-[#d4af37] appearance-none transition-all font-bold text-slate-300 outline-none"
                                    >
                                        <option value="FARMER" className="bg-slate-900 text-white">Farmer (Producer)</option>
                                        <option value="MILL" className="bg-slate-900 text-white">Spinning Mill</option>
                                        <option value="MANUFACTURER" className="bg-slate-900 text-white">Garment Manufacturer</option>
                                        <option value="EXPORTER" className="bg-slate-900 text-white">Exporter</option>
                                        <option value="BUYER" className="bg-slate-900 text-white">Global Buyer</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#d4af37]">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Security ID (Email)</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-white/5 border-2 border-white/5 p-4 rounded-2xl focus:border-[#d4af37] transition-all font-bold text-white outline-none"
                            placeholder="node@network.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Cryptographic Key (Password)</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-white/5 border-2 border-white/5 p-4 rounded-2xl focus:border-[#d4af37] transition-all font-bold text-white outline-none"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button className="w-full bg-[#d4af37] text-black py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#decba4] transition-all shadow-xl shadow-[#d4af37]/10 mt-8">
                        {isLogin ? 'Initialize Access' : 'Commit Credentials'}
                    </button>

                    <p className="text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-6">
                        Secured by Distributed Ledger Technology
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
