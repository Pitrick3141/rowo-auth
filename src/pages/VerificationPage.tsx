import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Mail, MessageSquare, AlertCircle, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { clsx } from 'clsx';

type VerificationMethod = 'adfs' | 'email' | 'discord' | 'manual';

const UNIVERSITY_DOMAIN = '@uwaterloo.ca';

export default function VerificationPage() {
  const [activeMethod, setActiveMethod] = useState<VerificationMethod>('email');
  const [wechatId, setWechatId] = useState('');
  const [emailPrefix, setEmailPrefix] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [manualNotes, setManualNotes] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const methods = [
    {
      id: 'adfs',
      title: 'ADFS Login',
      description: 'Primary and recommended method. Login with your university credentials.',
      icon: Shield,
      disabled: true,
      color: 'bg-indigo-100 text-indigo-600',
      border: 'border-indigo-200',
      activeBorder: 'border-indigo-500 ring-1 ring-indigo-500',
    },
    {
      id: 'email',
      title: 'Student Email',
      description: 'Receive a verification code at your .edu email address.',
      icon: Mail,
      disabled: false,
      color: 'bg-emerald-100 text-emerald-600',
      border: 'border-emerald-200',
      activeBorder: 'border-emerald-500 ring-1 ring-emerald-500',
    },
    {
      id: 'discord',
      title: 'Discord Server',
      description: 'Link your Discord account if you are already verified in the official server.',
      icon: MessageSquare,
      disabled: true,
      color: 'bg-violet-100 text-violet-600',
      border: 'border-violet-200',
      activeBorder: 'border-violet-500 ring-1 ring-violet-500',
    },
    {
      id: 'manual',
      title: 'Manual Verification',
      description: 'Contact an administrator. Use this only if other methods fail.',
      icon: AlertCircle,
      disabled: false,
      color: 'bg-amber-100 text-amber-600',
      border: 'border-amber-200',
      activeBorder: 'border-amber-500 ring-1 ring-amber-500',
    },
  ] as const;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wechatId.trim()) return;

    setStatus('loading');
    setMessage('');

    try {
      let endpoint = '';
      let body: any = { wechat_id: wechatId };

      switch (activeMethod) {
        case 'adfs':
          endpoint = `${__API_ENDPOINT__}/api/verify/adfs`;
          body = { ...body, student_id: '12345678', student_name: 'John Doe', faculty: 'Engineering', email: 'john.doe@university.edu' };
          break;
        case 'email':
          endpoint = `${__API_ENDPOINT__}/api/verify/email`;
          body = { ...body, email: `${emailPrefix}${UNIVERSITY_DOMAIN}`, code: verificationCode };
          break;
        case 'discord':
          endpoint = `${__API_ENDPOINT__}/api/verify/discord`;
          body = { ...body, discord_id: '123456789012345678' };
          break;
        case 'manual':
          endpoint = `${__API_ENDPOINT__}/api/verify/manual`;
          body = { ...body, notes: manualNotes || 'Requested manual verification.' };
          break;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.message);
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred during verification.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
          Verify Your Identity
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Choose a method below to link your student identity with your WeChat account.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Verification Methods
          </h2>
          {methods.map((method) => {
            const Icon = method.icon;
            const isActive = activeMethod === method.id;
            return (
              <button
                key={method.id}
                disabled={method.disabled}
                onClick={() => setActiveMethod(method.id as VerificationMethod)}
                className={clsx(
                  'w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-4 relative overflow-hidden',
                  isActive ? method.activeBorder : `${method.border} hover:border-slate-300 bg-white`,
                  method.disabled && 'opacity-60 cursor-not-allowed grayscale-[0.5]'
                )}
              >
                {method.disabled && (
                  <div className="absolute inset-0 bg-slate-50/20 backdrop-blur-[1px] z-10 flex items-center justify-center">
                    <span className="bg-slate-800/80 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full transform -rotate-12">
                      Coming Soon
                    </span>
                  </div>
                )}
                <div className={clsx('p-3 rounded-xl shrink-0', method.color)}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-slate-900 truncate">{method.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{method.description}</p>
                </div>
                {isActive && (
                  <div className="shrink-0 self-center">
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="md:col-span-7">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 h-full flex flex-col">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Lock className="w-6 h-6 text-slate-400" />
              {methods.find((m) => m.id === activeMethod)?.title}
            </h2>

            <form onSubmit={handleVerify} className="flex-1 flex flex-col">
              <div className="space-y-6 flex-1">
                <div>
                  <label htmlFor="wechatId" className="block text-sm font-medium text-slate-700 mb-2">
                    WeChat ID
                  </label>
                  <input
                    type="text"
                    id="wechatId"
                    required
                    value={wechatId}
                    onChange={(e) => setWechatId(e.target.value)}
                    className="block w-full px-4 py-3 rounded-xl border border-slate-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                    placeholder="Enter your WeChat ID"
                  />
                </div>

                <AnimatePresence mode="wait">
                  {activeMethod === 'email' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-6 overflow-hidden"
                    >
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                          University Email
                        </label>
                        <div className="flex gap-0">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              id="email"
                              required={activeMethod === 'email'}
                              value={emailPrefix}
                              onChange={(e) => setEmailPrefix(e.target.value)}
                              className="block w-full px-4 py-3 rounded-l-xl border border-slate-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors border-r-0"
                              placeholder="student"
                            />
                          </div>
                          <div className="inline-flex items-center px-4 py-3 rounded-r-xl border border-l-0 border-slate-300 bg-slate-50 text-slate-500 sm:text-sm font-medium">
                            {UNIVERSITY_DOMAIN}
                          </div>
                          <button
                            type="button"
                            className="ml-3 shrink-0 px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Send Code
                          </button>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="code" className="block text-sm font-medium text-slate-700 mb-2">
                          Verification Code
                        </label>
                        <input
                          type="text"
                          id="code"
                          required={activeMethod === 'email'}
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          className="block w-full px-4 py-3 rounded-xl border border-slate-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                          placeholder="114514"
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeMethod === 'adfs' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-800"
                    >
                      You will be redirected to the university's ADFS login page. After successful authentication, you will be returned here to complete the process.
                    </motion.div>
                  )}

                  {activeMethod === 'discord' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-violet-50 border border-violet-100 rounded-xl p-4 text-sm text-violet-800"
                    >
                      Clicking verify will open a popup to authenticate with Discord. Ensure you are already verified in the official student server.
                    </motion.div>
                  )}

                  {activeMethod === 'manual' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800"
                    >
                      Manual verification requires administrator approval and may take up to 48 hours. Please provide any relevant details below.
                      <textarea
                        className="mt-3 block w-full px-4 py-3 rounded-xl border border-amber-300 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-colors bg-white"
                        rows={3}
                        value={manualNotes}
                        onChange={(e) => setManualNotes(e.target.value)}
                        placeholder="Additional details..."
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {status === 'loading' ? 'Processing...' : 'Verify Now'}
                </button>

                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-emerald-50 rounded-xl flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-emerald-800 font-medium">{message}</p>
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-50 rounded-xl flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800 font-medium">{message}</p>
                  </motion.div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
