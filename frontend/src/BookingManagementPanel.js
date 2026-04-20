import React, { useState, useEffect } from 'react';
import API_BASE_URL from './apiConfig';

function ActionModal({ isOpen, actionType, onConfirm, onCancel }) {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const isApprove = actionType === 'approve';
  const accentColor = isApprove ? 'indigo' : 'red';
  const title = isApprove ? 'Approve Booking' : 'Reject Booking';
  const icon = isApprove ? (
    <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ) : (
    <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transform transition-all">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isApprove ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
              <p className="text-xs text-slate-500">Provide a brief reason for this decision.</p>
            </div>
          </div>

          <textarea
            autoFocus
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={isApprove ? "e.g. Valid academic requirement..." : "e.g. Facility under maintenance..."}
            className="w-full h-32 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6 transition-all"
          />

          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-5 py-2.5 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all font-sans"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(reason)}
              className={`px-6 py-2.5 text-sm font-bold rounded-xl text-white transition-all shadow-lg shadow-${accentColor}-500/20 ${isApprove ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-red-500 hover:bg-red-600'}`}
            >
              Confirm {isApprove ? 'Approve' : 'Reject'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingManagementPanel() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);
  const [activeAction, setActiveAction] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/bookings`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (err) {
      setError('An error occurred while fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const initiateAction = (id, action) => {
    setActiveBooking(id);
    setActiveAction(action);
    setModalOpen(true);
  };

  const handleConfirmAction = async (reason) => {
    const id = activeBooking;
    const action = activeAction;
    
    setModalOpen(false); // Close modal immediately
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/bookings/${id}/${action}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ reason: reason || (action === 'approve' ? 'Approved by admin' : 'Rejected by admin') })
      });

      if (response.ok) {
        fetchBookings();
      } else {
        alert(`Failed to ${action} booking`);
      }
    } catch (err) {
      alert(`Error during ${action}`);
    } finally {
      setActiveBooking(null);
      setActiveAction(null);
    }
  };

  const filteredBookings = filterStatus === 'ALL' 
    ? bookings 
    : bookings.filter(b => b.status === filterStatus);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-indigo-600">
        <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"></div>
        <p className="font-bold">Loading Bookings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ActionModal 
        isOpen={modalOpen}
        actionType={activeAction}
        onConfirm={handleConfirmAction}
        onCancel={() => setModalOpen(false)}
      />
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div>
          <h3 className="text-xl font-bold text-[#2b2b4f] dark:text-white">Booking Management</h3>
          <p className="text-sm text-slate-500">Review and manage facility reservations</p>
        </div>
        <div className="flex gap-4">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Only</option>
            <option value="APPROVED">Approved Only</option>
            <option value="REJECTED">Rejected Only</option>
          </select>
          <button 
            onClick={fetchBookings}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-all shadow-md active:scale-95"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm font-bold">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 border-b border-slate-100 dark:border-slate-700">
                <th className="py-4 px-6 font-bold uppercase tracking-wider text-[10px]">Reference</th>
                <th className="py-4 px-6 font-bold uppercase tracking-wider text-[10px]">Resource</th>
                <th className="py-4 px-6 font-bold uppercase tracking-wider text-[10px]">User / Email</th>
                <th className="py-4 px-6 font-bold uppercase tracking-wider text-[10px]">Date & Time</th>
                <th className="py-4 px-6 font-bold uppercase tracking-wider text-[10px]">Status</th>
                <th className="py-4 px-6 font-bold uppercase tracking-wider text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 font-bold tracking-widest uppercase">
                    No bookings found matching filters.
                  </td>
                </tr>
              )}
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-6 font-mono text-xs text-indigo-600">#BK-{b.id}</td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-[#2b2b4f] dark:text-white">{b.resourceName}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{b.purpose}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-sm">{b.requestedByEmail}</p>
                    <p className="text-[10px] text-slate-400">ID: {b.requestedByUserId}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium">{b.date}</p>
                    <p className="text-[10px] text-slate-400">{b.startTime} - {b.endTime}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      b.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                      b.status === 'PENDING' ? 'bg-amber-100 text-amber-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    {b.status === 'PENDING' && (
                      <>
                        <button 
                          onClick={() => initiateAction(b.id, 'approve')}
                          className="bg-green-500 hover:bg-green-600 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg transition-all"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => initiateAction(b.id, 'reject')}
                          className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg transition-all"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {b.status !== 'PENDING' && (
                      <p className="text-[10px] text-slate-400 italic">Actioned</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BookingManagementPanel;
