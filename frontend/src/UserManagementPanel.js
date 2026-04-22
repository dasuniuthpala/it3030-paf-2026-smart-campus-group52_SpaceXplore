import React, { useState, useEffect } from 'react';
import API_BASE_URL from './apiConfig';
import { useAuth } from './AuthContext';

const ROLES = ['USER', 'TECHNICIAN', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'];

const ROLE_STYLES = {
  SUPER_ADMIN: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  ADMIN:       'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  MANAGER:     'bg-sky-100    text-sky-700    dark:bg-sky-900/40    dark:text-sky-300',
  TECHNICIAN:  'bg-amber-100  text-amber-700  dark:bg-amber-900/40  dark:text-amber-400',
  USER:        'bg-slate-100  text-slate-600  dark:bg-slate-700     dark:text-slate-300',
};

function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Confirm Action</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-bold rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors shadow-md shadow-red-500/30"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function UserRow({ u, currentUser, onRoleChange, onDelete, onSaveEdit }) {
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: u.firstName, lastName: u.lastName });
  const [saving, setSaving] = useState(false);
  const isSelf = u.email === currentUser?.email;

  const handleSave = async () => {
    setSaving(true);
    await onSaveEdit(u.id, editForm);
    setSaving(false);
    setEditing(false);
  };

  const initials = `${(u.firstName || '?')[0]}${(u.lastName || '?')[0]}`.toUpperCase();
  const joined = u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
      {/* Avatar + Name */}
      <td className="py-4 pr-4 pl-2">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${ROLE_STYLES[u.role] || ROLE_STYLES.USER}`}>
            {initials}
          </div>
          {editing ? (
            <div className="flex gap-2">
              <input
                value={editForm.firstName}
                onChange={e => setEditForm(p => ({ ...p, firstName: e.target.value }))}
                className="w-28 text-sm px-2 py-1 rounded-lg border border-indigo-400 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                placeholder="First name"
              />
              <input
                value={editForm.lastName}
                onChange={e => setEditForm(p => ({ ...p, lastName: e.target.value }))}
                className="w-28 text-sm px-2 py-1 rounded-lg border border-indigo-400 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                placeholder="Last name"
              />
            </div>
          ) : (
            <span className="font-semibold text-slate-800 dark:text-white text-sm">
              {u.firstName} {u.lastName}
              {isSelf && <span className="ml-2 text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded-full uppercase tracking-widest">You</span>}
            </span>
          )}
        </div>
      </td>

      {/* Email */}
      <td className="py-4 px-4 text-sm text-slate-500 dark:text-slate-400 font-medium">{u.email}</td>

      {/* Role */}
      <td className="py-4 px-4">
        {isSelf ? (
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${ROLE_STYLES[u.role] || ROLE_STYLES.USER}`}>
            {u.role?.replace('_', ' ')}
          </span>
        ) : (
          <select
            value={u.role}
            onChange={e => onRoleChange(u.id, e.target.value)}
            className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest border-none outline-none cursor-pointer ${ROLE_STYLES[u.role] || ROLE_STYLES.USER}`}
          >
            {ROLES.map(r => (
              <option key={r} value={r}>{r.replace('_', ' ')}</option>
            ))}
          </select>
        )}
      </td>

      {/* Joined */}
      <td className="py-4 px-4 text-xs text-slate-400 font-medium">{joined}</td>

      {/* Actions */}
      <td className="py-4 px-4 text-right">
        <div className="flex items-center justify-end gap-2">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                onClick={() => { setEditing(false); setEditForm({ firstName: u.firstName, lastName: u.lastName }); }}
                className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                title="Edit name"
                className="p-1.5 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all opacity-0 group-hover:opacity-100"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              {!isSelf && (
                <button
                  onClick={() => onDelete(u.id, `${u.firstName} ${u.lastName}`)}
                  title="Delete user"
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function UserManagementPanel() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [confirmModal, setConfirmModal] = useState({ open: false, userId: null, userName: '' });

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      setError('Failed to load users. Make sure you are logged in as admin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        const updated = await res.json();
        setUsers(prev => prev.map(u => u.id === userId ? updated : u));
      }
    } catch { setError('Failed to update role.'); }
  };

  const handleSaveEdit = async (userId, editForm) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const updated = await res.json();
        setUsers(prev => prev.map(u => u.id === userId ? updated : u));
      }
    } catch { setError('Failed to update user.'); }
  };

  const handleDeleteRequest = (userId, userName) => {
    setConfirmModal({ open: true, userId, userName });
  };

  const handleDeleteConfirm = async () => {
    const { userId } = confirmModal;
    setConfirmModal({ open: false, userId: null, userName: '' });
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) setUsers(prev => prev.filter(u => u.id !== userId));
    } catch { setError('Failed to delete user.'); }
  };

  const filtered = users.filter(u => {
    const matchesSearch = `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'ALL' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const roleCounts = ROLES.reduce((acc, r) => ({ ...acc, [r]: users.filter(u => u.role === r).length }), {});

  return (
    <>
      <ConfirmModal
        isOpen={confirmModal.open}
        message={`Are you sure you want to permanently delete "${confirmModal.userName}"? This cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmModal({ open: false, userId: null, userName: '' })}
      />

      <div className="space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {ROLES.map(role => (
            <button
              key={role}
              onClick={() => setFilterRole(filterRole === role ? 'ALL' : role)}
              className={`rounded-2xl p-4 text-left border transition-all ${
                filterRole === role
                  ? 'border-indigo-400 ring-2 ring-indigo-400/30 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300'
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{role.replace('_', ' ')}</p>
              <p className={`text-3xl font-black ${ROLE_STYLES[role].split(' ')[1]}`}>{roleCounts[role] || 0}</p>
            </button>
          ))}
        </div>

        {/* Table card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700">
          {/* Search & filter header */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h3 className="text-lg font-black text-[#2b2b4f] dark:text-white">User Directory</h3>
              <p className="text-xs text-slate-400 mt-0.5">{filtered.length} of {users.length} accounts</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search users…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-56 dark:text-white"
                />
              </div>
              <button
                onClick={fetchUsers}
                className="px-4 py-2 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                ↻ Refresh
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm font-semibold">
              {error}
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  <th className="text-left text-xs font-bold uppercase tracking-widest text-slate-400 py-3 pl-2 pr-4">User</th>
                  <th className="text-left text-xs font-bold uppercase tracking-widest text-slate-400 py-3 px-4">Email</th>
                  <th className="text-left text-xs font-bold uppercase tracking-widest text-slate-400 py-3 px-4">Role</th>
                  <th className="text-left text-xs font-bold uppercase tracking-widest text-slate-400 py-3 px-4">Joined</th>
                  <th className="text-right text-xs font-bold uppercase tracking-widest text-slate-400 py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                {loading && (
                  <tr><td colSpan={5} className="py-16 text-center text-slate-400">
                    <svg className="animate-spin w-6 h-6 mx-auto mb-2 text-indigo-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Loading users…
                  </td></tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={5} className="py-16 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No users found.</td></tr>
                )}
                {!loading && filtered.map(u => (
                  <UserRow
                    key={u.id}
                    u={u}
                    currentUser={currentUser}
                    onRoleChange={handleRoleChange}
                    onDelete={handleDeleteRequest}
                    onSaveEdit={handleSaveEdit}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
