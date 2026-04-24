import React, { useState, useEffect, useCallback } from 'react';
import ticketService from './services/ticketService';

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

// ── resolve modal ─────────────────────────────────────────────────────────────

function ResolveModal({ onConfirm, onCancel, loading }) {
    const [notes, setNotes] = useState('');
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Mark as Resolved</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Describe how the issue was fixed (required).</p>
                <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Resolution notes..."
                    rows={4}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-green-500 resize-none mb-4"
                />
                <div className="flex gap-3 justify-end">
                    <button onClick={onCancel} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                        Cancel
                    </button>
                    <button
                        onClick={() => notes.trim() && onConfirm(notes)}
                        disabled={!notes.trim() || loading}
                        className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving…' : 'Mark Resolved'}
                    </button>
                </div>
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
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Provide a reason for rejection (required).</p>
                <textarea
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="Rejection reason..."
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

// ── full image modal ──────────────────────────────────────────────────────────

function ImageModal({ src, alt, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="relative max-w-4xl max-h-full" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute -top-10 right-0 text-white text-2xl font-bold hover:text-gray-300">×</button>
                <img src={src} alt={alt} className="max-w-full max-h-[90vh] rounded-xl object-contain" />
            </div>
        </div>
    );
}

// ── main component ────────────────────────────────────────────────────────────

export default function TechnicianTicketDetail({ ticketId, currentUserName, onBack }) {
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionError, setActionError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const [showResolveModal, setShowResolveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [resolveLoading, setResolveLoading] = useState(false);
    const [rejectLoading, setRejectLoading] = useState(false);

    const [newComment, setNewComment] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [editingComment, setEditingComment] = useState(null);
    const [editContent, setEditContent] = useState('');

    const [previewImage, setPreviewImage] = useState(null);

    const fetchTicket = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await ticketService.getTicketById(ticketId);
            setTicket(data);
        } catch {
            setError('Failed to load ticket details.');
        } finally {
            setLoading(false);
        }
    }, [ticketId]);

    useEffect(() => { fetchTicket(); }, [fetchTicket]);

    const isAssignedToMe = ticket?.assignedTo === currentUserName;

    // ── status actions ─────────────────────────────────────────────────────────

    const handleAccept = async () => {
        setActionLoading(true);
        setActionError('');
        try {
            await ticketService.acceptTicket(ticketId);
            await fetchTicket();
        } catch {
            setActionError('Failed to accept ticket.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleResolveConfirm = async (notes) => {
        setResolveLoading(true);
        try {
            // updateStatus with reason = notes stores resolutionNotes AND changes status
            await ticketService.updateStatus(ticketId, 'RESOLVED', notes);
            setShowResolveModal(false);
            await fetchTicket();
        } catch {
            setActionError('Failed to resolve ticket.');
        } finally {
            setResolveLoading(false);
        }
    };

    const handleRejectConfirm = async (reason) => {
        setRejectLoading(true);
        try {
            await ticketService.updateStatus(ticketId, 'REJECTED', reason);
            setShowRejectModal(false);
            await fetchTicket();
        } catch {
            setActionError('Failed to reject ticket.');
        } finally {
            setRejectLoading(false);
        }
    };

    const handleClose = async () => {
        setActionLoading(true);
        setActionError('');
        try {
            await ticketService.updateStatus(ticketId, 'CLOSED');
            await fetchTicket();
        } catch {
            setActionError('Failed to close ticket.');
        } finally {
            setActionLoading(false);
        }
    };

    // ── comments ───────────────────────────────────────────────────────────────

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        setCommentLoading(true);
        try {
            await ticketService.addComment(ticketId, newComment, 'TECHNICIAN');
            setNewComment('');
            await fetchTicket();
        } catch {
            setActionError('Failed to add comment.');
        } finally {
            setCommentLoading(false);
        }
    };

    const handleEditComment = async (commentId) => {
        if (!editContent.trim()) return;
        try {
            await ticketService.editComment(commentId, editContent);
            setEditingComment(null);
            setEditContent('');
            await fetchTicket();
        } catch {
            setActionError('Failed to edit comment.');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Delete this comment?')) return;
        try {
            await ticketService.deleteComment(commentId);
            await fetchTicket();
        } catch {
            setActionError('Failed to delete comment.');
        }
    };

    // ── render guards ──────────────────────────────────────────────────────────

    if (loading) return (
        <div className="flex flex-col min-h-screen bg-[#f4f7fe] dark:bg-slate-950">
            <div className="flex justify-center items-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col min-h-screen bg-[#f4f7fe] dark:bg-slate-950 p-8">
            <button onClick={onBack} className="mb-4 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium text-sm hover:underline">
                ← Back to Dashboard
            </button>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-red-700 dark:text-red-400">{error}</div>
        </div>
    );

    if (!ticket) return null;

    const isClosed = ticket.status === 'CLOSED';
    const isRejected = ticket.status === 'REJECTED';
    const isReadOnly = isClosed || isRejected;

    return (
        <div className="flex flex-col min-h-screen bg-[#f4f7fe] dark:bg-slate-950 p-6 md:p-8">
            {/* Back */}
            <button
                onClick={onBack}
                className="mb-6 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:text-indigo-700 dark:hover:text-indigo-300 transition w-fit"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
            </button>

            {/* Action error */}
            {actionError && (
                <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 flex items-center justify-between">
                    <p className="text-red-700 dark:text-red-400 text-sm">{actionError}</p>
                    <button onClick={() => setActionError('')} className="text-red-500 text-lg leading-none ml-3">×</button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">

                {/* ── Left: ticket info ────────────────────────────────────────── */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Header card */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <p className="text-indigo-200 text-xs font-semibold mb-1">Ticket #{ticket.id}</p>
                                    <h1 className="text-xl font-bold text-white leading-snug">{ticket.title}</h1>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[ticket.status] || STATUS_COLORS.OPEN}`}>
                                        {ticket.status.replace('_', ' ')}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${PRIORITY_COLORS[ticket.priority] || PRIORITY_COLORS.MEDIUM}`}>
                                        {ticket.priority}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoField label="Category" value={ticket.category} />
                            <InfoField label="Location" value={ticket.resourceLocation} />
                            <InfoField label="Reported By" value={ticket.createdBy} />
                            <InfoField label="Assigned To" value={ticket.assignedTo || 'Unassigned'} highlight={!!ticket.assignedTo} />
                            <InfoField label="Created" value={ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : '—'} />
                            <InfoField label="Last Updated" value={ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleString() : '—'} />
                            {ticket.contactEmail && <InfoField label="Contact Email" value={ticket.contactEmail} />}
                            {ticket.contactPhone && <InfoField label="Contact Phone" value={ticket.contactPhone} />}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Description</h2>
                        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
                    </div>

                    {/* Attachments */}
                    {ticket.attachments && ticket.attachments.length > 0 && (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                                Attachments ({ticket.attachments.length})
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {ticket.attachments.map(att => (
                                    <button
                                        key={att.id}
                                        onClick={() => setPreviewImage({ src: `http://localhost:8086${att.fileUrl}`, alt: att.fileName })}
                                        className="group relative focus:outline-none"
                                    >
                                        <img
                                            src={`http://localhost:8086${att.fileUrl}`}
                                            alt={att.fileName}
                                            className="w-28 h-28 object-cover rounded-xl border border-slate-200 dark:border-slate-700 group-hover:opacity-80 transition"
                                        />
                                        <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] px-1 py-0.5 rounded-b-xl truncate text-center">
                                            {att.fileName}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Resolution / Rejection notes */}
                    {ticket.resolutionNotes && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-5">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-green-700 dark:text-green-400 mb-2">Resolution Notes</h2>
                            <p className="text-sm text-green-800 dark:text-green-300 whitespace-pre-wrap">{ticket.resolutionNotes}</p>
                        </div>
                    )}

                    {ticket.rejectionReason && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-5">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400 mb-2">Rejection Reason</h2>
                            <p className="text-sm text-red-800 dark:text-red-300 whitespace-pre-wrap">{ticket.rejectionReason}</p>
                        </div>
                    )}

                    {/* Comments */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                            Comments ({ticket.comments?.length || 0})
                        </h2>

                        {/* Add comment */}
                        <div className="flex gap-3 mb-5">
                            <textarea
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                placeholder="Add a comment…"
                                rows={2}
                                className="flex-1 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 resize-none"
                            />
                            <button
                                onClick={handleAddComment}
                                disabled={!newComment.trim() || commentLoading}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition disabled:opacity-50 self-end"
                            >
                                {commentLoading ? '…' : 'Post'}
                            </button>
                        </div>

                        {/* Comments list */}
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {ticket.comments && ticket.comments.length > 0 ? ticket.comments.map(c => (
                                <div key={c.id} className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4">
                                    {editingComment === c.id ? (
                                        <div>
                                            <textarea
                                                value={editContent}
                                                onChange={e => setEditContent(e.target.value)}
                                                rows={2}
                                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm mb-2 resize-none"
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEditComment(c.id)} className="text-xs text-green-600 hover:text-green-700 font-semibold">Save</button>
                                                <button onClick={() => setEditingComment(null)} className="text-xs text-slate-500 hover:text-slate-600">Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-slate-900 dark:text-white text-sm">{c.author}</span>
                                                    {c.authorRole && (
                                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold">
                                                            {c.authorRole}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                                                    {new Date(c.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-700 dark:text-slate-300">{c.content}</p>
                                            {c.canEdit && (
                                                <div className="flex gap-3 mt-2">
                                                    <button
                                                        onClick={() => { setEditingComment(c.id); setEditContent(c.content); }}
                                                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button onClick={() => handleDeleteComment(c.id)} className="text-xs text-red-600 hover:text-red-700 font-medium">
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )) : (
                                <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-4">No comments yet</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Right: actions panel ─────────────────────────────────────── */}
                <div className="space-y-5">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 sticky top-6">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Actions</h2>

                        {isReadOnly ? (
                            <div className="text-center py-4">
                                <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${STATUS_COLORS[ticket.status]}`}>
                                    {ticket.status} — No further actions
                                </span>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {/* OPEN: unassigned — accept or reject */}
                                {ticket.status === 'OPEN' && !ticket.assignedTo && (
                                    <>
                                        <ActionButton
                                            label="Accept Ticket"
                                            onClick={handleAccept}
                                            loading={actionLoading}
                                            color="emerald"
                                            description="Assign this ticket to yourself and start working on it."
                                        />
                                        <ActionButton
                                            label="Reject Ticket"
                                            onClick={() => setShowRejectModal(true)}
                                            color="red"
                                            description="Reject with a required reason."
                                        />
                                    </>
                                )}

                                {/* IN_PROGRESS: resolve, close, or reject */}
                                {ticket.status === 'IN_PROGRESS' && isAssignedToMe && (
                                    <>
                                        <ActionButton
                                            label="Mark as Resolved"
                                            onClick={() => setShowResolveModal(true)}
                                            color="green"
                                            description="Provide resolution notes (required) and mark this ticket resolved."
                                        />
                                        <ActionButton
                                            label="Close Ticket"
                                            onClick={handleClose}
                                            loading={actionLoading}
                                            color="gray"
                                            description="Skip to closed without resolution notes."
                                        />
                                        <ActionButton
                                            label="Reject Ticket"
                                            onClick={() => setShowRejectModal(true)}
                                            color="red"
                                            description="Cannot fix — provide a rejection reason."
                                        />
                                    </>
                                )}

                                {/* RESOLVED: close */}
                                {ticket.status === 'RESOLVED' && isAssignedToMe && (
                                    <ActionButton
                                        label="Close Ticket"
                                        onClick={handleClose}
                                        loading={actionLoading}
                                        color="gray"
                                        description="Mark this ticket as fully closed."
                                    />
                                )}

                                {/* Assigned to someone else — read-only message */}
                                {ticket.assignedTo && !isAssignedToMe && (
                                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-2">
                                        Assigned to <span className="font-semibold text-slate-700 dark:text-slate-300">{ticket.assignedTo}</span>
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Ticket metadata summary */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/50">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Quick Info</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500 dark:text-slate-400">Status</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[ticket.status]}`}>
                                    {ticket.status.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500 dark:text-slate-400">Priority</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${PRIORITY_COLORS[ticket.priority]}`}>
                                    {ticket.priority}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500 dark:text-slate-400">Attachments</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{ticket.attachments?.length || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500 dark:text-slate-400">Comments</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{ticket.comments?.length || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showResolveModal && (
                <ResolveModal
                    onConfirm={handleResolveConfirm}
                    onCancel={() => setShowResolveModal(false)}
                    loading={resolveLoading}
                />
            )}
            {showRejectModal && (
                <RejectModal
                    onConfirm={handleRejectConfirm}
                    onCancel={() => setShowRejectModal(false)}
                    loading={rejectLoading}
                />
            )}
            {previewImage && (
                <ImageModal
                    src={previewImage.src}
                    alt={previewImage.alt}
                    onClose={() => setPreviewImage(null)}
                />
            )}
        </div>
    );
}

// ── tiny helpers ──────────────────────────────────────────────────────────────

function InfoField({ label, value, highlight }) {
    return (
        <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">{label}</p>
            <p className={`text-sm font-medium ${highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'}`}>
                {value || '—'}
            </p>
        </div>
    );
}

function ActionButton({ label, onClick, loading, color, description }) {
    const colorMap = {
        emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        green: 'bg-green-600 hover:bg-green-700 text-white',
        red: 'bg-red-600 hover:bg-red-700 text-white',
        gray: 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200',
    };
    return (
        <div>
            <button
                onClick={onClick}
                disabled={loading}
                className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition disabled:opacity-50 ${colorMap[color] || colorMap.gray}`}
            >
                {loading ? 'Processing…' : label}
            </button>
            {description && <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 text-center">{description}</p>}
        </div>
    );
}
