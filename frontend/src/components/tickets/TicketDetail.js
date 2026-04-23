import React, { useState, useEffect } from 'react';
import ticketService from '../../services/ticketService';

const TicketDetail = ({ ticketId, userRole, userName, onBack }) => {
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showResolutionModal, setShowResolutionModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [technicianName, setTechnicianName] = useState('');
    const [resolutionNotes, setResolutionNotes] = useState('');
    const [rejectReason, setRejectReason] = useState('');
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState(null);
    const [editContent, setEditContent] = useState('');

    useEffect(() => {
        fetchTicket();
    }, [ticketId]);

    const fetchTicket = async () => {
        setLoading(true);
        try {
            const data = await ticketService.getTicketById(ticketId);
            setTicket(data);
        } catch (err) {
            setError('Failed to load ticket details');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        try {
            await ticketService.updateStatus(ticketId, newStatus);
            setShowStatusModal(false);
            fetchTicket();
        } catch (err) {
            setError('Failed to update status');
        }
    };

    const handleReject = async () => {
        try {
            await ticketService.updateStatus(ticketId, 'REJECTED', rejectReason);
            setShowRejectModal(false);
            setRejectReason('');
            fetchTicket();
        } catch (err) {
            setError('Failed to reject ticket');
        }
    };

    const handleAssign = async () => {
        try {
            await ticketService.assignTechnician(ticketId, technicianName);
            setShowAssignModal(false);
            setTechnicianName('');
            fetchTicket();
        } catch (err) {
            setError('Failed to assign technician');
        }
    };

    const handleAddResolution = async () => {
        if (!resolutionNotes.trim()) return;
        try {
            // Single call: stores resolutionNotes AND sets status to RESOLVED
            await ticketService.updateStatus(ticketId, 'RESOLVED', resolutionNotes);
            setShowResolutionModal(false);
            setResolutionNotes('');
            fetchTicket();
        } catch (err) {
            setError('Failed to resolve ticket');
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            await ticketService.addComment(ticketId, newComment, userRole);
            setNewComment('');
            fetchTicket();
        } catch (err) {
            setError('Failed to add comment');
        }
    };

    const handleEditComment = async (commentId) => {
        if (!editContent.trim()) return;
        try {
            await ticketService.editComment(commentId, editContent);
            setEditingComment(null);
            setEditContent('');
            fetchTicket();
        } catch (err) {
            setError('Failed to edit comment');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await ticketService.deleteComment(commentId);
                fetchTicket();
            } catch (err) {
                setError('Failed to delete comment');
            }
        }
    };

    const getPriorityColor = (priority) => {
        const colors = {
            LOW: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
            MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
            URGENT: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
            CRITICAL: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
        };
        return colors[priority] || colors.MEDIUM;
    };

    const getStatusColor = (status) => {
        const colors = {
            OPEN: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            IN_PROGRESS: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
            RESOLVED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            CLOSED: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
            REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        };
        return colors[status] || colors.OPEN;
    };

    const getStatusActions = () => {
        if (!ticket) return [];
        const { status } = ticket;
        const isPrivileged = userRole === 'ADMIN' || userRole === 'TECHNICIAN';
        const actions = [];

        if (status === 'OPEN' && isPrivileged) {
            actions.push({ label: 'Start Progress', status: 'IN_PROGRESS' });
            actions.push({ label: 'Reject', status: 'REJECTED', isReject: true });
        } else if (status === 'IN_PROGRESS' && isPrivileged) {
            actions.push({ label: 'Resolve', status: 'RESOLVED', isResolve: true });
            actions.push({ label: 'Close', status: 'CLOSED' });
            actions.push({ label: 'Reject', status: 'REJECTED', isReject: true });
        } else if (status === 'RESOLVED' && isPrivileged) {
            actions.push({ label: 'Close', status: 'CLOSED' });
        }
        return actions;
    };

    if (loading) return (
        <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );
    
    if (error) return (
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 m-4 rounded-r-lg">
            <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
    );
    
    if (!ticket) return (
        <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">Ticket not found</p>
        </div>
    );

    const statusActions = getStatusActions();

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <button 
                onClick={onBack} 
                className="mb-6 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Tickets
            </button>
            
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                    <div className="flex justify-between items-start">
                        <h1 className="text-xl font-bold text-white">{ticket.title}</h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {ticket.status.replace('_', ' ')}
                        </span>
                    </div>
                </div>
                
                <div className="p-6 space-y-6">
                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Priority</label>
                            <p className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority}
                            </p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</label>
                            <p className="mt-1 text-slate-900 dark:text-white">{ticket.category}</p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Location</label>
                            <p className="mt-1 text-slate-900 dark:text-white">{ticket.resourceLocation}</p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Reported By</label>
                            <p className="mt-1 text-slate-900 dark:text-white">{ticket.createdBy}</p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Created</label>
                            <p className="mt-1 text-slate-900 dark:text-white">{new Date(ticket.createdAt).toLocaleString()}</p>
                        </div>
                        {ticket.assignedTo && (
                            <div>
                                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Assigned To</label>
                                <p className="mt-1 text-slate-900 dark:text-white">{ticket.assignedTo}</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Description */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</label>
                        <p className="mt-2 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                            {ticket.description}
                        </p>
                    </div>
                    
                    {/* Attachments */}
                    {ticket.attachments && ticket.attachments.length > 0 && (
                        <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Attachments</label>
                            <div className="flex gap-3 mt-2 flex-wrap">
                                {ticket.attachments.map((att) => (
                                    <a
                                        key={att.id}
                                        href={`http://localhost:8086${att.fileUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative"
                                    >
                                        <img
                                            src={`http://localhost:8086${att.fileUrl}`}
                                            alt={att.fileName}
                                            className="w-28 h-28 object-cover rounded-lg border border-slate-300 dark:border-slate-700 group-hover:opacity-80 transition"
                                        />
                                        <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-1 py-0.5 rounded-b-lg truncate text-center">
                                            {att.fileName}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Resolution Notes */}
                    {ticket.resolutionNotes && (
                        <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Resolution Notes</label>
                            <p className="mt-2 text-slate-700 dark:text-slate-300 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
                                {ticket.resolutionNotes}
                            </p>
                        </div>
                    )}
                    
                    {/* Rejection Reason */}
                    {ticket.rejectionReason && (
                        <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rejection Reason</label>
                            <p className="mt-2 text-slate-700 dark:text-slate-300 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border-l-4 border-red-500">
                                {ticket.rejectionReason}
                            </p>
                        </div>
                    )}
                    
                    {/* Action Buttons */}
                    {(userRole === 'ADMIN' || userRole === 'TECHNICIAN') && statusActions.length > 0 && (
                        <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">Actions</label>
                            <div className="flex flex-wrap gap-3">
                                {statusActions.map((action, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (action.isReject) {
                                                setShowRejectModal(true);
                                            } else if (action.isResolve) {
                                                setShowResolutionModal(true);
                                            } else {
                                                setNewStatus(action.status);
                                                setShowStatusModal(true);
                                            }
                                        }}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition text-white ${
                                            action.isReject ? 'bg-red-600 hover:bg-red-700' :
                                            action.isResolve ? 'bg-green-600 hover:bg-green-700' :
                                            action.status === 'CLOSED' ? 'bg-slate-500 hover:bg-slate-600' :
                                            'bg-indigo-600 hover:bg-indigo-700'
                                        }`}
                                    >
                                        {action.label}
                                    </button>
                                ))}
                                {!ticket.assignedTo && userRole === 'ADMIN' && (
                                    <button 
                                        onClick={() => setShowAssignModal(true)}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition"
                                    >
                                        Assign Technician
                                    </button>
                                )}
                                {ticket.status === 'IN_PROGRESS' && (
                                    <button 
                                        onClick={() => setShowResolutionModal(true)}
                                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition"
                                    >
                                        Add Resolution Notes
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {/* Comments Section */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">Comments</label>
                        
                        {/* Add Comment */}
                        <div className="flex gap-3 mb-4">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 resize-none"
                                rows="2"
                            />
                            <button
                                onClick={handleAddComment}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition self-end"
                            >
                                Post
                            </button>
                        </div>
                        
                        {/* Comments List */}
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {ticket.comments && ticket.comments.map(comment => (
                                <div key={comment.id} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                                    {editingComment === comment.id ? (
                                        <div>
                                            <textarea
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 mb-2"
                                                rows="2"
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEditComment(comment.id)} className="text-sm text-green-600 hover:text-green-700">Save</button>
                                                <button onClick={() => setEditingComment(null)} className="text-sm text-gray-500 hover:text-gray-600">Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <span className="font-semibold text-slate-900 dark:text-white text-sm">{comment.author}</span>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">({comment.authorRole})</span>
                                                </div>
                                                <span className="text-xs text-slate-400 dark:text-slate-500">
                                                    {new Date(comment.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-slate-700 dark:text-slate-300 text-sm">{comment.content}</p>
                                            {comment.canEdit && (
                                                <div className="flex gap-3 mt-2">
                                                    <button 
                                                        onClick={() => {
                                                            setEditingComment(comment.id);
                                                            setEditContent(comment.content);
                                                        }}
                                                        className="text-xs text-indigo-600 hover:text-indigo-700"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                        className="text-xs text-red-600 hover:text-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                            {(!ticket.comments || ticket.comments.length === 0) && (
                                <p className="text-slate-400 dark:text-slate-500 text-sm text-center py-4">No comments yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Modals */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Update Status</h3>
                        <p className="mb-4">Change status to {newStatus.replace('_', ' ')}?</p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setShowStatusModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                            <button onClick={handleStatusUpdate} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
            
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-1 text-slate-900 dark:text-white">Reject Ticket</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Rejection reason is required.</p>
                        <textarea
                            placeholder="Reason for rejection..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white mb-4"
                            rows="3"
                        />
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300">Cancel</button>
                            <button
                                onClick={handleReject}
                                disabled={!rejectReason.trim()}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Reject Ticket
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {showAssignModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Assign Technician</h3>
                        <input
                            type="text"
                            placeholder="Technician name"
                            value={technicianName}
                            onChange={(e) => setTechnicianName(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border mb-4"
                        />
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setShowAssignModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                            <button onClick={handleAssign} className="px-4 py-2 bg-green-600 text-white rounded-lg">Assign</button>
                        </div>
                    </div>
                </div>
            )}
            
            {showResolutionModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-1 text-slate-900 dark:text-white">Mark as Resolved</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Resolution notes are required.</p>
                        <textarea
                            placeholder="How was this issue resolved?"
                            value={resolutionNotes}
                            onChange={(e) => setResolutionNotes(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white mb-4"
                            rows="3"
                        />
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setShowResolutionModal(false)} className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300">Cancel</button>
                            <button
                                onClick={handleAddResolution}
                                disabled={!resolutionNotes.trim()}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Resolve Ticket
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketDetail;