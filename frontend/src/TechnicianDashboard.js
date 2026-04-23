import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import ThemeToggle from './ThemeToggle';
import logoImage from './images/logo.png';
import ticketService from './services/ticketService';
import TechnicianTicketDetail from './TechnicianTicketDetail';

// ── colour helpers ────────────────────────────────────────────────────────────

const PRIORITY_COLORS = {
    LOW: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    URGENT: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    CRITICAL: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
};

const STATUS_COLORS = {
    OPEN: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    IN_PROGRESS: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    RESOLVED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    CLOSED: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

// ── stat card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, color, icon }) {
    return (
        <div className={`bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{value ?? '—'}</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
            </div>
        </div>
    );
}

// ── reject modal ──────────────────────────────────────────────────────────────

function RejectModal({ onConfirm, onCancel, loading }) {
    const [reason, setReason] = useState('');
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Reject Ticket</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Please provide a reason for rejecting this ticket.</p>
                <textarea
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="Rejection reason (required)..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 resize-none mb-4"
                />
                <div className="flex gap-3 justify-end">
                    <button onClick={onCancel} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                        Cancel
                    </button>
                    <button
                        onClick={() => reason.trim() && onConfirm(reason)}
                        disabled={!reason.trim() || loading}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Rejecting…' : 'Reject Ticket'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── ticket row ────────────────────────────────────────────────────────────────

function TicketRow({ ticket, currentUserName, onAccept, onReject, onView, actionLoading }) {
    const isAssignedToMe = ticket.assignedTo === currentUserName;
    const isUnassigned = !ticket.assignedTo;
    const isOpen = ticket.status === 'OPEN';

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-shadow">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">#{ticket.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[ticket.status] || STATUS_COLORS.OPEN}`}>
                            {ticket.status.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${PRIORITY_COLORS[ticket.priority] || PRIORITY_COLORS.MEDIUM}`}>
                            {ticket.priority}
                        </span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug truncate">{ticket.title}</h3>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 shrink-0">
                    {isOpen && isUnassigned && (
                        <>
                            <button
                                onClick={() => onAccept(ticket.id)}
                                disabled={actionLoading === ticket.id}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition disabled:opacity-50"
                            >
                                {actionLoading === ticket.id ? '…' : 'Accept'}
                            </button>
                            <button
                                onClick={() => onReject(ticket.id)}
                                disabled={actionLoading === ticket.id}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition disabled:opacity-50"
                            >
                                Reject
                            </button>
                        </>
                    )}
                    {isAssignedToMe && (
                        <button
                            onClick={() => onView(ticket.id)}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition"
                        >
                            View & Update
                        </button>
                    )}
                    {!isOpen && !isAssignedToMe && (
                        <button
                            onClick={() => onView(ticket.id)}
                            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg transition"
                        >
                            View
                        </button>
                    )}
                </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{ticket.description}</p>

            {/* Attachments thumbnails */}
            {ticket.attachments && ticket.attachments.length > 0 && (
                <div className="flex gap-2 mb-3 flex-wrap">
                    {ticket.attachments.map(att => (
                        <img
                            key={att.id}
                            src={`http://localhost:8086${att.fileUrl}`}
                            alt={att.fileName}
                            className="w-14 h-14 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                        />
                    ))}
                </div>
            )}

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                <span>📍 {ticket.resourceLocation || '—'}</span>
                <span>👤 {ticket.createdBy}</span>
                <span>🕒 {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : '—'}</span>
                <span className={ticket.assignedTo ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''}>
                    🔧 {ticket.assignedTo || 'Unassigned'}
                </span>
            </div>
        </div>
    );
}

// ── main component ────────────────────────────────────────────────────────────

export default function TechnicianDashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [stats, setStats] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [actionLoading, setActionLoading] = useState(null);
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectLoading, setRejectLoading] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState(null);

    const currentUserName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '';

    const fetchStats = useCallback(async () => {
        setStatsLoading(true);
        try {
            const data = await ticketService.getDashboardStats();
            setStats(data);
        } catch (err) {
            console.error('Failed to load stats', err);
        } finally {
            setStatsLoading(false);
        }
    }, []);

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await ticketService.getTicketsAssignedToMe();
            setTickets(data);
        } catch (err) {
            setError('Failed to load tickets. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
        fetchTickets();
    }, [fetchStats, fetchTickets]);

    const handleAccept = async (id) => {
        setActionLoading(id);
        try {
            await ticketService.acceptTicket(id);
            await Promise.all([fetchTickets(), fetchStats()]);
        } catch (err) {
            setError('Failed to accept ticket.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleRejectConfirm = async (reason) => {
        setRejectLoading(true);
        try {
            await ticketService.updateStatus(rejectingId, 'REJECTED', reason);
            setRejectingId(null);
            await Promise.all([fetchTickets(), fetchStats()]);
        } catch (err) {
            setError('Failed to reject ticket.');
        } finally {
            setRejectLoading(false);
        }
    };

    const handleBackFromDetail = () => {
        setSelectedTicketId(null);
        fetchTickets();
        fetchStats();
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const FILTERS = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];

    const filteredTickets = activeFilter === 'ALL'
        ? tickets
        : tickets.filter(t => t.status === activeFilter);

    // ── detail view ─────────────────────────────────────────────────────────────
    if (selectedTicketId) {
        return (
            <TechnicianTicketDetail
                ticketId={selectedTicketId}
                currentUserName={currentUserName}
                onBack={handleBackFromDetail}
            />
        );
    }

    // ── dashboard view ───────────────────────────────────────────────────────────
    return (
        <div className="flex h-screen w-full bg-[#f4f7fe] dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200">

            {/* Sidebar */}
            <aside className="w-64 shrink-0 bg-[#2b2b4f] dark:bg-slate-900 text-white flex flex-col">
                <div className="flex h-20 items-center justify-center border-b border-indigo-400/20 dark:border-white/10 px-6">
                    <div className="flex items-center gap-3">
                        <img src={logoImage} alt="Logo" className="w-8 h-8 object-contain filter invert opacity-90" />
                        <span className="text-xl font-bold tracking-wide">SpaceXplore</span>
                    </div>
                </div>

                <div className="flex-1 px-4 py-8 overflow-y-auto space-y-2">
                    <div className="px-4 py-3 bg-indigo-600/90 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)] rounded-xl flex items-center gap-4">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="font-medium text-sm">Ticket Dashboard</span>
                    </div>
                </div>

                <div className="p-4 border-t border-indigo-400/20 dark:border-white/10 space-y-2">
                    <div className="px-4 py-3 rounded-xl bg-white/5">
                        <p className="text-sm font-bold text-white leading-none">{user?.firstName} {user?.lastName}</p>
                        <p className="text-[11px] text-indigo-300 mt-1 uppercase tracking-widest">Technician</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 text-indigo-200 hover:bg-white/10 hover:text-white rounded-xl transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="font-medium text-sm">Log out</span>
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="flex h-20 items-center justify-between bg-transparent px-8 shrink-0">
                    <div>
                        <h1 className="text-3xl font-black text-[#2b2b4f] dark:text-white tracking-tight">
                            Technician Dashboard
                        </h1>
                        <p className="text-sm text-slate-500 font-medium mt-0.5">
                            Manage and resolve maintenance tickets
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <button
                            onClick={() => { fetchTickets(); fetchStats(); }}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 pt-2 space-y-6">

                    {/* Error banner */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center justify-between">
                            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                            <button onClick={() => setError('')} className="text-red-500 hover:text-red-700 text-lg leading-none">×</button>
                        </div>
                    )}

                    {/* Stats Cards */}
                    <section>
                        <h2 className="text-base font-bold text-slate-700 dark:text-slate-300 mb-3">Overview</h2>
                        {statsLoading ? (
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {Array(5).fill(0).map((_, i) => (
                                    <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-5 h-20 animate-pulse border border-slate-100 dark:border-slate-700/50" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <StatCard
                                    label="Total Assigned"
                                    value={stats?.totalAssigned}
                                    color="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                                    icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                                />
                                <StatCard
                                    label="Open (Unassigned)"
                                    value={stats?.openCount}
                                    color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                                    icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                                />
                                <StatCard
                                    label="In Progress"
                                    value={stats?.inProgressCount}
                                    color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                    icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                                />
                                <StatCard
                                    label="Resolved"
                                    value={stats?.resolvedCount}
                                    color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                    icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                />
                                <StatCard
                                    label="Closed"
                                    value={stats?.closedCount}
                                    color="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                                    icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                                />
                            </div>
                        )}
                    </section>

                    {/* Filter + Ticket List */}
                    <section>
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                            <h2 className="text-base font-bold text-slate-700 dark:text-slate-300">
                                Tickets ({filteredTickets.length})
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {FILTERS.map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setActiveFilter(f)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                            activeFilter === f
                                                ? 'bg-indigo-600 text-white shadow'
                                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                                        }`}
                                    >
                                        {f.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-16">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
                            </div>
                        ) : filteredTickets.length === 0 ? (
                            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                                <svg className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">No tickets found</p>
                                <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
                                    {activeFilter === 'ALL' ? 'No tickets are available right now.' : `No ${activeFilter.replace('_', ' ')} tickets.`}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredTickets.map(ticket => (
                                    <TicketRow
                                        key={ticket.id}
                                        ticket={ticket}
                                        currentUserName={currentUserName}
                                        onAccept={handleAccept}
                                        onReject={id => setRejectingId(id)}
                                        onView={id => setSelectedTicketId(id)}
                                        actionLoading={actionLoading}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>

            {/* Reject modal */}
            {rejectingId && (
                <RejectModal
                    onConfirm={handleRejectConfirm}
                    onCancel={() => setRejectingId(null)}
                    loading={rejectLoading}
                />
            )}
        </div>
    );
}
