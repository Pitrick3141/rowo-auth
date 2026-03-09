import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Loader2, ShieldCheck } from 'lucide-react';

export default function AdfsCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'input_wechat' | 'verifying' | 'success' | 'error'>('input_wechat');
  const [message, setMessage] = useState('');
  const [wechatId, setWechatId] = useState('');

  const code = searchParams.get('code');

  if (!code && status !== 'error') {
    setStatus('error');
    setMessage('ADFS verification failed. Please try again or contact support.');
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wechatId.trim() || !code) return;

    setStatus('verifying');
    setMessage('Verifying your student identity...');

    try {
      const res = await fetch(`${__API_ENDPOINT__}/api/verify/adfs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wechat_id: wechatId,
          code: code,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.reverified) {
          setStatus('success');
          setMessage('Successfully reverified! Redirecting to rename page...');
          setTimeout(() => {
            navigate(`/rename?token=${data.rename_token}&expiry=${data.rename_token_expires_at}`);
          }, 1500);
          return;
        }
        setStatus('success');
        setMessage(data.message || 'Your WeChat account is now verified with ADFS!');
      } else {
        setStatus('error');
        if (data.blacklisted && data.blacklist) {
          setMessage(`Verification blocked: This account is blacklisted. Reason: ${data.blacklist.reason}`);
        } else {
          setMessage(data.message || 'Failed to verify student identity.');
        }
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred while communicating with the server.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 text-center"
      >
        {status === 'verifying' ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            <h2 className="text-2xl font-bold text-slate-900">Verifying Identity</h2>
            <p className="text-slate-500">{message}</p>
          </div>
        ) : status === 'input_wechat' ? (
          <div className="flex flex-col items-center gap-6">
            <div className="bg-indigo-100 p-4 rounded-2xl text-indigo-600">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Link WeChat ID</h2>
              <p className="text-slate-500 mt-2">ADFS Authentication successful! Now please enter your WeChat ID to complete the verification.</p>
            </div>
            <form onSubmit={handleVerify} className="w-full space-y-4">
              <input
                type="text"
                value={wechatId}
                onChange={(e) => setWechatId(e.target.value)}
                placeholder="Enter your WeChat ID"
                required
                className="block w-full px-4 py-3 rounded-xl border border-slate-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              />
              <button
                type="submit"
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-sm transition-colors"
              >
                Complete Verification
              </button>
            </form>
          </div>
        ) : status === 'success' ? (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500" />
            <h2 className="text-2xl font-bold text-slate-900">Verification Successful</h2>
            <p className="text-slate-600 mb-6">{message}</p>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl shadow-sm transition-colors"
            >
              Return Home
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <XCircle className="w-16 h-16 text-red-500" />
            <h2 className="text-2xl font-bold text-slate-900">Verification Failed</h2>
            <p className="text-slate-600 mb-6">{message}</p>
            <button
              onClick={() => navigate('/verify')}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-sm transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
