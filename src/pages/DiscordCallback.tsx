import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Loader2, MessageSquare, ShieldCheck } from 'lucide-react';

export default function DiscordCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'input_wechat' | 'connecting' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your Discord identity...');
  const [discordData, setDiscordData] = useState<{ discord_id: string; username: string; avatar?: string } | null>(null);
  const [wechatId, setWechatId] = useState('');

  const code = searchParams.get('code');

  useEffect(() => {
    if (!code) {
      setStatus('error');
      setMessage('No authorization code found. Please try again.');
      return;
    }

    const verifyDiscord = async () => {
      try {
        const res = await fetch(`${__API_ENDPOINT__}/api/verify/discord/callback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });
        const data = await res.json();

        if (data.success) {
          setDiscordData({ 
            discord_id: data.discord_id, 
            username: data.username,
            avatar: data.avatar 
          });
          setStatus('input_wechat');
          setMessage('Discord verified! Now enter your WeChat ID to complete the link.');
        } else {
          setStatus('error');
          setMessage(data.message || 'Failed to verify Discord identity.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred while communicating with the server.');
      }
    };

    verifyDiscord();
  }, [code]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wechatId.trim() || !discordData) return;

    setStatus('connecting');
    setMessage('Connecting your accounts...');

    try {
      const res = await fetch(`${__API_ENDPOINT__}/api/verify/discord/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wechat_id: wechatId,
          discord_id: discordData.discord_id,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setMessage('Successfully verified! Your WeChat account is now linked to your student status.');
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to connect accounts.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred while connecting your accounts.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 text-center"
      >
        {status === 'verifying' || status === 'connecting' ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            <h2 className="text-2xl font-bold text-slate-900">{status === 'verifying' ? 'Verifying Discord' : 'Connecting Accounts'}</h2>
            <p className="text-slate-500">{message}</p>
          </div>
        ) : status === 'input_wechat' ? (
          <div className="flex flex-col items-center gap-6">
            {discordData?.avatar ? (
              <div className="relative">
                <img 
                  src={`https://cdn.discordapp.com/avatars/${discordData.discord_id}/${discordData.avatar}.png?size=128`} 
                  alt={discordData.username}
                  className="w-20 h-20 rounded-full shadow-md border-2 border-violet-200"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-1 -right-1 bg-violet-600 text-white p-1.5 rounded-full border-2 border-white">
                  <MessageSquare className="w-3 h-3" />
                </div>
              </div>
            ) : (
              <div className="bg-violet-100 p-4 rounded-2xl text-violet-600">
                <MessageSquare className="w-10 h-10" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Link WeChat ID</h2>
              <p className="text-slate-500 mt-2">Logged in as <span className="font-semibold text-slate-900">{discordData?.username}</span></p>
            </div>
            <form onSubmit={handleConnect} className="w-full space-y-4">
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
