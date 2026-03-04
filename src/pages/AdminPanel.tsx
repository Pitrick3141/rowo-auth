import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Search, MoreVertical, X, AlertTriangle, ShieldOff, Save, ShieldCheck, Key, CheckCircle, Info, Plus, Edit2, Trash2, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import ReactMarkdown from 'react-markdown';

interface AccountInfo {
  id: number;
  wechat_id: string;
  color: string;
  icon: string;
  title: string;
  body: string;
  creator: string;
  created_at: string;
  updated_at: string;
  visibility: string;
}

interface AccountData {
  wechat_id: string;
  verified_status: number;
  verification_method: string;
  verification_time: string;
  student_id?: string;
  student_name?: string;
  faculty?: string;
  email?: string;
  discord_id?: string;
  notes?: string;
  manual_status?: string;
  manual_reason?: string;
  manual_admin?: string;
  manual_time?: string;
  blacklisted?: boolean;
  blacklist?: null | {
    wechat_id: string;
    reason: string;
    added_by: string;
    added_at: string;
  };
}

export default function AdminPanel() {
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<AccountData | null>(null);
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [currentAdmin, setCurrentAdmin] = useState<{username: string, role: string} | null>(null);
  const [confirmRotateOpen, setConfirmRotateOpen] = useState(false);
  const [newTokenAlert, setNewTokenAlert] = useState<{isOpen: boolean, token: string}>({isOpen: false, token: ''});
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'accounts' | 'blacklist'>('accounts');
  const [blacklist, setBlacklist] = useState<any[]>([]);
  const [loadingBlacklist, setLoadingBlacklist] = useState(false);

  const fetchAccounts = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await fetch(`${__API_ENDPOINT__}/api/admin/accounts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAccounts(data.accounts);
        setCurrentAdmin(data.admin);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Failed to fetch accounts', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  const fetchBlacklist = async () => {
    setLoadingBlacklist(true);
    try {
      const res = await fetch(`${__API_ENDPOINT__}/api/admin/blacklist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setBlacklist(data.blacklist);
      }
    } catch (error) {
      console.error('Failed to fetch blacklist', error);
    } finally {
      setLoadingBlacklist(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'accounts') fetchAccounts();
      else fetchBlacklist();
    }
  }, [activeTab, isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    try {
      const res = await fetch(`${__API_ENDPOINT__}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('admin_token', token);
        setIsAuthenticated(true);
      } else {
        setLoginError(data.message);
        setLoading(false);
      }
    } catch (error) {
      setLoginError('Login failed');
      setLoading(false);
    }
  };

  const handleRotateTokenClick = () => {
    setConfirmRotateOpen(true);
  };

  const executeRotateToken = async () => {
    setConfirmRotateOpen(false);
    try {
      const res = await fetch(`${__API_ENDPOINT__}/api/admin/rotate-token`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setNewTokenAlert({isOpen: true, token: data.token});
        setToken(data.token);
        localStorage.setItem('admin_token', data.token);
      }
    } catch (error) {
      console.error('Failed to rotate token', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="text-center mb-8">
          <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <Key className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin / Mod Access</h1>
          <p className="text-slate-500 mt-2">Enter your access token to continue</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="block w-full px-4 py-3 rounded-xl border border-slate-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              placeholder="Access Token"
              required
            />
          </div>
          {loginError && <p className="text-red-600 text-sm">{loginError}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Verifying...' : 'Access Panel'}
          </button>
        </form>
      </div>
    );
  }

  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.wechat_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.student_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{currentAdmin?.role === 'moderator' ? 'Moderator Panel' : 'Admin Panel'}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {currentAdmin?.role === 'moderator' ? 'Review pending manual verifications' : 'Manage verified student accounts and security'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {currentAdmin && (
            <div className="text-sm text-slate-600 font-medium hidden sm:block">
              Logged in as <span className="text-indigo-600">{currentAdmin.username}</span> ({currentAdmin.role})
            </div>
          )}
          <button
            onClick={handleRotateTokenClick}
            className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1.5"
            title="Warning: This will invalidate your current token"
          >
            <AlertTriangle className="w-4 h-4" />
            Rotate Token
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('accounts')}
          className={clsx(
            "px-4 py-2 text-sm font-medium transition-colors relative",
            activeTab === 'accounts' ? "text-indigo-600" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Accounts
          {activeTab === 'accounts' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
        </button>
        {currentAdmin?.role === 'admin' && (
          <button
            onClick={() => setActiveTab('blacklist')}
            className={clsx(
              "px-4 py-2 text-sm font-medium transition-colors relative",
              activeTab === 'blacklist' ? "text-indigo-600" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Blacklist Management
            {activeTab === 'blacklist' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
          </button>
        )}
      </div>

      {activeTab === 'accounts' || currentAdmin?.role !== 'admin' ? (
        <>
          <div className="flex items-center justify-end gap-2 mb-4">
            <button
              onClick={() => fetchAccounts(true)}
              disabled={loading || refreshing}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh user list"
            >
              <RotateCcw className={clsx("w-5 h-5", refreshing && "animate-spin")} />
            </button>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full sm:w-64 pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                placeholder="Search accounts..."
              />
            </div>
          </div>

          <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      WeChat ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Student Info
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                        Loading accounts...
                      </td>
                    </tr>
                  ) : filteredAccounts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                        No accounts found.
                      </td>
                    </tr>
                  ) : (
                    filteredAccounts.map((account) => (
                      <tr key={account.wechat_id} className={clsx("hover:bg-slate-50 transition-colors", account.manual_status === 'pending' && "bg-amber-50/50")}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900 flex items-center gap-2">
                            {account.wechat_id}
                            {account.manual_status === 'pending' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                Pending
                              </span>
                            )}
                            {account.blacklisted && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                Blacklisted
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500">{format(new Date(account.verification_time), 'MMM d, yyyy')}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900">{account.student_name || account.email || account.discord_id || 'N/A'}</div>
                          <div className="text-xs text-slate-500">{account.student_id || account.faculty || ''}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                            {account.verification_method}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {account.verified_status === 1 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                              Verified
                            </span>
                          ) : account.verified_status === 2 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Revoked
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                              Unverified
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setSelectedAccount(account)}
                            className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <BlacklistTab token={token} blacklist={blacklist} loading={loadingBlacklist} onUpdate={fetchBlacklist} />
      )}

      <AnimatePresence>
        {selectedAccount && (
          <AccountModal
            account={selectedAccount}
            token={token}
            role={currentAdmin?.role || 'admin'}
            onClose={() => setSelectedAccount(null)}
            onUpdate={() => {
              fetchAccounts();
              setSelectedAccount(null);
            }}
          />
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={confirmRotateOpen}
        title="Rotate Access Token"
        message="Are you sure you want to rotate your access token? You will need to use the new token to log in next time."
        onConfirm={executeRotateToken}
        onCancel={() => setConfirmRotateOpen(false)}
        confirmText="Rotate Token"
        isDangerous={true}
      />
      <AlertDialog
        isOpen={newTokenAlert.isOpen}
        title="Token Rotated Successfully"
        message={`Your new access token is:\n\n${newTokenAlert.token}\n\nPlease save it securely.`}
        onClose={() => setNewTokenAlert({isOpen: false, token: ''})}
        icon={CheckCircle}
        iconColor="text-emerald-500"
        iconBg="bg-emerald-100"
      />
    </div>
  );
}

function AccountModal({
  account,
  token,
  role,
  onClose,
  onUpdate,
}: {
  account: AccountData;
  token: string;
  role: string;
  onClose: () => void;
  onUpdate: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectAlertOpen, setRejectAlertOpen] = useState(false);
  
  const [infoItems, setInfoItems] = useState<AccountInfo[]>([]);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [editingInfo, setEditingInfo] = useState<Partial<AccountInfo> | null>(null);

  useEffect(() => {
    fetchInfo();
  }, [account.wechat_id]);

  const fetchInfo = async () => {
    setLoadingInfo(true);
    try {
      const res = await fetch(`${__API_ENDPOINT__}/api/admin/accounts/${encodeURIComponent(account.wechat_id)}/info`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setInfoItems(data.info);
      }
    } catch (error) {
      console.error('Failed to fetch info', error);
    } finally {
      setLoadingInfo(false);
    }
  };

  const handleSaveInfo = async () => {
    if (!editingInfo?.title || !editingInfo?.body) return;
    setSaving(true);
    try {
      if (editingInfo.id) {
        await fetch(`${__API_ENDPOINT__}/api/admin/info/${editingInfo.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(editingInfo),
        });
      } else {
        await fetch(`${__API_ENDPOINT__}/api/admin/accounts/${encodeURIComponent(account.wechat_id)}/info`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...editingInfo,
            color: editingInfo.color || 'blue',
            icon: editingInfo.icon || 'info',
            visibility: editingInfo.visibility || 'public'
          }),
        });
      }
      setEditingInfo(null);
      fetchInfo();
    } catch (error) {
      console.error('Failed to save info', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteInfo = async (id: number) => {
    if (!confirm('Are you sure you want to delete this information?')) return;
    setSaving(true);
    try {
      await fetch(`${__API_ENDPOINT__}/api/admin/info/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchInfo();
    } catch (error) {
      console.error('Failed to delete info', error);
    } finally {
      setSaving(false);
    }
  };

  const handleRevoke = async () => {
    setSaving(true);
    try {
      await fetch(`${__API_ENDPOINT__}/api/admin/accounts/${encodeURIComponent(account.wechat_id)}/revoke`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      onUpdate();
    } catch (error) {
      console.error('Failed to revoke account', error);
      setSaving(false);
    }
  };

  const handleUnrevoke = async () => {
    setSaving(true);
    try {
      await fetch(`${__API_ENDPOINT__}/api/admin/accounts/${encodeURIComponent(account.wechat_id)}/unrevoke`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      onUpdate();
    } catch (error) {
      console.error('Failed to un-revoke account', error);
      setSaving(false);
    }
  };

  const handleManualAction = async (action: 'approve' | 'reject') => {
    if (action === 'reject' && !rejectReason.trim()) {
      setRejectAlertOpen(true);
      return;
    }
    setSaving(true);
    try {
      await fetch(`${__API_ENDPOINT__}/api/admin/accounts/${encodeURIComponent(account.wechat_id)}/manual`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action, reason: rejectReason }),
      });
      onUpdate();
    } catch (error) {
      console.error(`Failed to ${action} application`, error);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Manage Account</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Account Details</h3>
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">WeChat ID</span>
                <span className="text-sm font-medium text-slate-900">{account.wechat_id}</span>
              </div>
              {account.student_name && (
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Name</span>
                  <span className="text-sm font-medium text-slate-900">{account.student_name}</span>
                </div>
              )}
              {account.student_id && (
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Student ID</span>
                  <span className="text-sm font-medium text-slate-900">{account.student_id}</span>
                </div>
              )}
              {account.email && (
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Email</span>
                  <span className="text-sm font-medium text-slate-900">{account.email}</span>
                </div>
              )}
              {account.manual_admin && (
                <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                  <span className="text-sm text-slate-500">Processed By</span>
                  <span className="text-sm font-medium text-slate-900">
                    {account.manual_admin} on {account.manual_time ? format(new Date(account.manual_time), 'MMM d, yyyy') : 'Unknown'}
                  </span>
                </div>
              )}
              {account.manual_status === 'rejected' && account.manual_reason && (
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Rejection Reason</span>
                  <span className="text-sm font-medium text-red-600">{account.manual_reason}</span>
                </div>
              )}
              {account.blacklisted && account.blacklist && (
                <div className="flex flex-col border-t border-red-100 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-red-600 font-bold">Blacklisted</span>
                    <span className="text-xs text-slate-500">{format(new Date(account.blacklist.added_at), 'MMM d, yyyy')}</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1 bg-red-50 p-2 rounded-lg">
                    Reason: {account.blacklist.reason}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Added by {account.blacklist.added_by}</p>
                </div>
              )}
            </div>
          </div>

          {account.manual_status === 'pending' && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h3 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Pending Manual Verification
              </h3>
              <p className="text-sm text-amber-700 mb-4">
                This user has requested manual verification. Please review their details and approve or reject the application.
              </p>
              {account.notes && (
                <div className="mb-4 bg-white border border-amber-200 rounded-lg p-3">
                  <h4 className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">User Notes</h4>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{account.notes}</p>
                </div>
              )}
              <div className="space-y-3">
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Reason for rejection (required if rejecting)..."
                  className="w-full text-sm p-2 border border-amber-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-white"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleManualAction('approve')}
                    disabled={saving}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                  <button
                    onClick={() => handleManualAction('reject')}
                    disabled={saving || !rejectReason.trim()}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-700">Information Items</h3>
              {role === 'admin' && (
                <button
                  onClick={() => setEditingInfo({ color: 'blue', icon: 'info', visibility: 'public' })}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add Info
                </button>
              )}
            </div>

            {editingInfo && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 mb-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={editingInfo.title || ''}
                      onChange={(e) => setEditingInfo({ ...editingInfo, title: e.target.value })}
                      className="block w-full px-2 py-1 border border-slate-300 rounded focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      placeholder="Title"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Visibility</label>
                    <select
                      value={editingInfo.visibility || 'public'}
                      onChange={(e) => setEditingInfo({ ...editingInfo, visibility: e.target.value })}
                      className="block w-full px-2 py-1 border border-slate-300 rounded focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private (Admin Only)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Color</label>
                    <select
                      value={editingInfo.color || 'blue'}
                      onChange={(e) => setEditingInfo({ ...editingInfo, color: e.target.value })}
                      className="block w-full px-2 py-1 border border-slate-300 rounded focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    >
                      <option value="blue">Blue</option>
                      <option value="orange">Orange</option>
                      <option value="yellow">Yellow</option>
                      <option value="red">Red</option>
                      <option value="purple">Purple</option>
                      <option value="emerald">Emerald</option>
                      <option value="slate">Slate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Icon</label>
                    <select
                      value={editingInfo.icon || 'info'}
                      onChange={(e) => setEditingInfo({ ...editingInfo, icon: e.target.value })}
                      className="block w-full px-2 py-1 border border-slate-300 rounded focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    >
                      <option value="info">Info</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                      <option value="checkmark">Checkmark</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Body (Markdown)</label>
                  <textarea
                    value={editingInfo.body || ''}
                    onChange={(e) => setEditingInfo({ ...editingInfo, body: e.target.value })}
                    rows={4}
                    className="block w-full px-2 py-1 border border-slate-300 rounded focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono"
                    placeholder="Markdown supported..."
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditingInfo(null)}
                    className="px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveInfo}
                    disabled={saving || !editingInfo.title || !editingInfo.body}
                    className="px-3 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Info'}
                  </button>
                </div>
              </div>
            )}

            {loadingInfo ? (
              <div className="text-sm text-slate-500 text-center py-4">Loading info...</div>
            ) : infoItems.length === 0 ? (
              <div className="text-sm text-slate-500 text-center py-4 border border-dashed border-slate-300 rounded-xl">No information items.</div>
            ) : (
              <div className="space-y-3">
                {infoItems.map(info => {
                  const IconComp = info.icon === 'warning' ? AlertTriangle : info.icon === 'error' ? X : info.icon === 'checkmark' ? CheckCircle : Info;
                  const colorClasses = {
                    blue: 'bg-blue-50 border-blue-200 text-blue-800',
                    orange: 'bg-orange-50 border-orange-200 text-orange-800',
                    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
                    red: 'bg-red-50 border-red-200 text-red-800',
                    purple: 'bg-purple-50 border-purple-200 text-purple-800',
                    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800',
                    slate: 'bg-slate-50 border-slate-200 text-slate-800',
                  }[info.color] || 'bg-slate-50 border-slate-200 text-slate-800';
                  
                  const iconColor = {
                    blue: 'text-blue-600',
                    orange: 'text-orange-600',
                    yellow: 'text-yellow-600',
                    red: 'text-red-600',
                    purple: 'text-purple-600',
                    emerald: 'text-emerald-600',
                    slate: 'text-slate-600',
                  }[info.color] || 'text-slate-600';

                  return (
                    <div key={info.id} className={`border rounded-xl p-3 ${colorClasses}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <IconComp className={`w-4 h-4 ${iconColor}`} />
                          <h4 className="font-bold text-sm">{info.title}</h4>
                          <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/50 font-semibold">
                            {info.visibility}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {role === 'admin' && (
                            <>
                              <button onClick={() => setEditingInfo(info)} className="p-1 hover:bg-white/50 rounded text-slate-600">
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button onClick={() => handleDeleteInfo(info.id)} className="p-1 hover:bg-white/50 rounded text-red-600">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-sm opacity-90 prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2">
                        <ReactMarkdown>{info.body}</ReactMarkdown>
                      </div>
                      <div className="mt-2 pt-2 border-t border-black/5 flex justify-between text-[10px] opacity-70">
                        <span>By {info.creator}</span>
                        <span>{format(new Date(info.updated_at), 'MMM d, yyyy HH:mm')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
          {role === 'admin' && (
            <div className="flex gap-2">
              {account.verified_status === 1 ? (
                <button
                  onClick={handleRevoke}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  <ShieldOff className="w-4 h-4" />
                  Revoke Status
                </button>
              ) : (
                <button
                    onClick={handleUnrevoke}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Restore Status
                </button>
              )}
            </div>
          )}
          
          <div className={`flex gap-3 ${role !== 'admin' ? 'w-full justify-end' : ''}`}>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>

      <AlertDialog
        isOpen={rejectAlertOpen}
        title="Reason Required"
        message="Please provide a reason for rejection."
        onClose={() => setRejectAlertOpen(false)}
      />
    </div>
  );
}

function BlacklistTab({ token, blacklist, loading, onUpdate }: { token: string; blacklist: any[]; loading: boolean; onUpdate: () => void }) {
  const [wechatId, setWechatId] = useState('');
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wechatId.trim() || !reason.trim()) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${__API_ENDPOINT__}/api/admin/accounts/${encodeURIComponent(wechatId)}/blacklist`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (data.success) {
        setWechatId('');
        setReason('');
        onUpdate();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to add to blacklist');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch(`${__API_ENDPOINT__}/api/admin/accounts/${encodeURIComponent(id)}/unblacklist`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        onUpdate();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Failed to unblacklist', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-600" />
          Add to Blacklist
        </h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-4">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">WeChat ID</label>
            <input
              type="text"
              value={wechatId}
              onChange={(e) => setWechatId(e.target.value)}
              placeholder="e.g. wxid_12345"
              className="block w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
            />
          </div>
          <div className="sm:col-span-6">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Reason</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for blacklisting..."
              className="block w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
            />
          </div>
          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={saving || !wechatId.trim() || !reason.trim()}
              className="w-full py-2 px-4 bg-slate-900 hover:bg-black text-white font-medium rounded-xl shadow-sm transition-colors disabled:opacity-50"
            >
              {saving ? 'Adding...' : 'Blacklist'}
            </button>
          </div>
        </form>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">WeChat ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Added By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">Loading blacklist...</td></tr>
              ) : blacklist.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">No accounts blacklisted.</td></tr>
              ) : (
                blacklist.map((item) => (
                  <tr key={item.wechat_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-slate-900">{item.wechat_id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate" title={item.reason}>{item.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.added_by}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{format(new Date(item.added_at), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRemove(item.wechat_id)}
                        disabled={saving}
                        className="text-red-600 hover:text-red-900 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        Unblacklist
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AlertDialog({ isOpen, title, message, onClose, icon: Icon = AlertTriangle, iconColor = "text-amber-500", iconBg = "bg-amber-100" }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col"
          >
            <div className="p-6 text-center">
              <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${iconBg} mb-4`}>
                <Icon className={`h-6 w-6 ${iconColor}`} />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 whitespace-pre-wrap">{message}</p>
            </div>
            <div className="px-6 py-4 bg-slate-50 flex justify-center">
              <button
                onClick={onClose}
                className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:text-sm transition-colors"
              >
                OK
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", isDangerous = false }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col"
          >
            <div className="p-6 text-center">
              <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${isDangerous ? 'bg-red-100' : 'bg-amber-100'} mb-4`}>
                <AlertTriangle className={`h-6 w-6 ${isDangerous ? 'text-red-600' : 'text-amber-600'}`} />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 whitespace-pre-wrap">{message}</p>
            </div>
            <div className="px-6 py-4 bg-slate-50 flex gap-3 justify-end">
              <button
                onClick={onCancel}
                className="w-full inline-flex justify-center rounded-xl border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none sm:text-sm transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none sm:text-sm transition-colors ${isDangerous ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
