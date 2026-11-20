import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Phone, AlertCircle } from 'lucide-react';

export default function ForgotPassword() {
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1);
    const [devOtp, setDevOtp] = useState('');
    const [error, setError] = useState('');
    const [captcha, setCaptcha] = useState({ id: '', question: '' });
    const [captchaAnswer, setCaptchaAnswer] = useState('');

    useEffect(() => {
        axios.get('/api/auth/captcha').then(res => setCaptcha(res.data)).catch(() => {});
    }, []);

    const refreshCaptcha = () => {
        axios.get('/api/auth/captcha').then(res => { setCaptcha(res.data); setCaptchaAnswer(''); }).catch(() => {});
    };

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const isEmail = identifier.includes('@');

    const requestOtp = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            const payload = isEmail ? { email: identifier, captchaId: captcha.id, captchaAnswer } : { phone: identifier, captchaId: captcha.id, captchaAnswer };
            const res = await axios.post('/api/auth/forgot-password', payload);
            setMessage(res.data.message || 'OTP sent.');
            if (res.data.devOtp) setDevOtp(res.data.devOtp);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally { setLoading(false); }
    const verifyOtp = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            const payload = { ...(isEmail ? { email: identifier } : { phone: identifier }), otp };
            const res = await axios.post('/api/auth/verify-otp', payload);
            setResetToken(res.data.resetToken);
            setMessage(res.data.message || 'OTP verified.');
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
        } finally { setLoading(false); }
    };

    const resetPass = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            await axios.post('/api/auth/reset-password', { resetToken, newPassword });
            setMessage('Password reset successful. Redirecting to login...');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Reset failed');
        } finally { setLoading(false); }
    };

    return (
        <div className="bg-[#F4F2F1] min-h-[80vh] flex items-center justify-center p-6 py-12">
            <div className="w-full max-w-md bg-white border border-[#E6E2E0] rounded-[24px] p-8 shadow-xl">
                <h2 className="text-[26px] font-extrabold text-[#2E2C2A] mb-2">Forgot password</h2>
                <p className="text-[#9E9894] text-[13.5px] mb-5">Reset your password using a one-time code.</p>

                {error && <div className="mb-4 p-3 bg-[#FEE2E2] border border-[#FECACA] rounded-xl text-[#DC2626] text-[13px] flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</div>}
                {message && <div className="mb-4 p-3 bg-[#F4F2F1] border border-[#DDD8FF] rounded-xl text-[#3B32B0] text-[13px]">{message}</div>}
                {devOtp && <div className="mb-4 p-3 bg-[#EEF2FF] border border-[#C7D2FE] rounded-xl text-[#3730A3] text-[13px]">Dev OTP: <b>{devOtp}</b></div>}

                {step === 1 && (
                    <form onSubmit={requestOtp} className="space-y-4">
                        <div>
                            <label className="block text-[13px] font-bold mb-1.5">Email or phone</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    {isEmail ? <Mail className="h-5 w-5 text-[#9B98A8]" /> : <Phone className="h-5 w-5 text-[#9B98A8]" />}
                                </div>
                                <input required value={identifier} onChange={e => setIdentifier(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-[#F4F2F1] border border-[#E6E2E0] rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2E2C2A]"
                                    placeholder="you@example.com or +1..." />
                        <div className="bg-[#F4F2F1] border border-[#E6E2E0] rounded-xl p-3">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[12.5px] font-bold text-[#2E2C2A]">{captcha.question || 'Loading captcha...'}</span>
                                <button type="button" onClick={refreshCaptcha} className="text-[11px] font-bold text-[#3B32B0]">Refresh</button>
                            </div>
                            <input value={captchaAnswer} onChange={e => setCaptchaAnswer(e.target.value)} placeholder="Answer"
                                className="w-full px-3 py-2 bg-white border border-[#E6E2E0] rounded-lg text-[13px]" />
                        </div>

                            </div>
                        </div>
                        <button disabled={loading} className="w-full py-3.5 bg-[#2E2C2A] hover:bg-[#4F4945] text-white font-bold rounded-xl">
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={verifyOtp} className="space-y-4">
                        <div>
                            <label className="block text-[13px] font-bold mb-1.5">Enter OTP</label>
                            <input required value={otp} onChange={e => setOtp(e.target.value)} maxLength={6}
                                className="block w-full px-4 py-3 bg-[#F4F2F1] border border-[#E6E2E0] rounded-xl text-[14px] text-center tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-[#2E2C2A]" />
                        </div>
                        <button disabled={loading} className="w-full py-3.5 bg-[#2E2C2A] hover:bg-[#4F4945] text-white font-bold rounded-xl">
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={resetPass} className="space-y-4">
                        <div>
                            <label className="block text-[13px] font-bold mb-1.5">New password</label>
                            <input type="password" required minLength={6} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                                className="block w-full px-4 py-3 bg-[#F4F2F1] border border-[#E6E2E0] rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2E2C2A]" />
                        </div>
                        <button disabled={loading} className="w-full py-3.5 bg-[#2E2C2A] hover:bg-[#2E2C2A] text-white font-bold rounded-xl">
                            {loading ? 'Resetting...' : 'Reset password'}
                        </button>
                    </form>
                )}

                <div className="mt-5 text-center text-[13px]">
                    <Link to="/login" className="font-bold text-[#3B32B0]">Back to login</Link>
                </div>
            </div>
        </div>
    );
}

    };


