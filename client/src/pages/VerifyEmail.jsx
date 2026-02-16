import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../api/config';

const VerifyEmail = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('verifying'); // verifying, success, error

    useEffect(() => {
        const verify = async () => {
            try {
                await axios.post(`${API_URL}/api/auth/verify-email`, { token });
                setStatus('success');
            } catch (err) {
                console.error(err);
                setStatus('error');
            }
        };
        verify();
    }, [token]);

    return (
        <div className="min-h-screen bg-background text-primary flex items-center justify-center p-6 transition-colors duration-300">
            <div className="max-w-md w-full bg-surface rounded-[2.5rem] shadow-[0_0_100px_rgba(212,175,55,0.1)] border border-border p-10 text-center">
                {status === 'verifying' && (
                    <>
                        <div className="w-20 h-20 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <h2 className="text-2xl font-black mb-2">Verifying...</h2>
                        <p className="text-secondary">Securing your node identity on the ledger.</p>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h2 className="text-2xl font-black mb-2">Verified!</h2>
                        <p className="text-secondary mb-8">Your email has been confirmed. You may now access the network.</p>
                        <Link to="/login" className="inline-block bg-gold text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-[#decba4] transition-all shadow-lg shadow-gold/20">
                            Proceed to Login
                        </Link>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                        </div>
                        <h2 className="text-2xl font-black mb-2">Verification Failed</h2>
                        <p className="text-secondary mb-8">The token is invalid or has expired.</p>
                        <Link to="/login" className="text-gold font-bold hover:underline">
                            Return to Login
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
