import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import ThemeToggle from './ThemeToggle';
import logoImage from './images/logo.png';
import API_BASE_URL from './apiConfig';
import UserManagementPanel from './UserManagementPanel';
import BookingManagementPanel from './BookingManagementPanel';
import AdminOverviewPanel from './AdminOverviewPanel';

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationFilter, setNotificationFilter] = useState('all');

  useEffect(() => {
    if (user?.id) fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications`, {
        headers: { 'X-User-Id': user.id.toString() }
      });
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const markNotificationAsRead = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'X-User-Id': user.id.toString() }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
        method: 'PUT',
        headers: { 'X-User-Id': user.id.toString() }
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (e, id) => {
    e.stopPropagation();
    try {
      await fetch(`${API_BASE_URL}/api/notifications/${id}`, {
        method: 'DELETE',
        headers: { 'X-User-Id': user.id.toString() }
      });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " mins ago";
    return Math.floor(seconds) + " seconds ago";
  };

  // Form state for adding/editing a room
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [roomForm, setRoomForm] = useState({
    resourceName: '',
    type: 'CLASSROOM',
    capacity: '',
    location: '',
    status: 'AVAILABLE',
    availabilityWindow: '08:00 - 18:00',
    imageUrl: 'https://images.unsplash.com/photo-1577414341908-1423403a45c3?q=80&w=600&auto=format&fit=crop'
  });
  const [formStatus, setFormStatus] = useState({ loading: false, error: null, success: false });

  // Resources list
  const [resources, setResources] = useState([]);

  useEffect(() => {
    if (activeTab === 'rooms') {
      fetchResources();
    }
  }, [activeTab]);

  const fetchResources = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/resources`, {
        credentials: 'include'
      });
      const data = await response.json();
      setResources(data);
    } catch (err) {
      console.error("Failed to fetch resources");
    }
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRoomChange = (e) => {
    const { name, value } = e.target;
    setRoomForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (res) => {
    setEditingRoomId(res.id);
    setRoomForm({
      resourceName: res.resourceName,
      type: res.type,
      capacity: res.capacity,
      location: res.location,
      status: res.status,
      availabilityWindow: res.availabilityWindow || '08:00 - 18:00',
      imageUrl: res.imageUrl || 'https://images.unsplash.com/photo-1577414341908-1423403a45c3?q=80&w=600&auto=format&fit=crop'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingRoomId(null);
    setRoomForm({
      resourceName: '', type: 'CLASSROOM', capacity: '', location: '', status: 'AVAILABLE', availabilityWindow: '08:00 - 18:00', imageUrl: 'https://images.unsplash.com/photo-1577414341908-1423403a45c3?q=80&w=600&auto=format&fit=crop'
    });
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Are you sure you want to logically delete this resource? This cannot be undone.')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/resources/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to delete resource');
      fetchResources();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, error: null, success: false });

    // If editingRoomId is set, we use PUT, else we use POST to create
    const method = editingRoomId ? 'PUT' : 'POST';
    const url = editingRoomId ? `${API_BASE_URL}/api/resources/${editingRoomId}` : `${API_BASE_URL}/api/resources`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...roomForm,
          capacity: parseInt(roomForm.capacity, 10)
        }),
      });

      if (!response.ok) throw new Error(`Failed to ${editingRoomId ? 'update' : 'create'} room`);

      setFormStatus({ loading: false, error: null, success: true });
      fetchResources();

      // Reset form smoothly
      handleCancelEdit();
      setTimeout(() => setFormStatus(prev => ({ ...prev, success: false })), 3000);
    } catch (err) {
      setFormStatus({ loading: false, error: err.message, success: false });
    }
  };

  const menuItems = [
    { id: 'dashboard', name: 'Overview', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { id: 'rooms', name: 'Manage Rooms', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
    { id: 'maintenance', name: 'Maintenance', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { id: 'bookings', name: 'Booking Requests', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { id: 'users', name: 'User Directory', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
    { id: 'notifications', name: 'Notifications', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> },
  ];

  return (
    <div className="flex h-screen w-full bg-[#f4f7fe] dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200">

      {/* ---------------- Admin Sidebar ---------------- */}
      <aside className="w-64 shrink-0 bg-[#2b2b4f] dark:bg-slate-900 text-white flex flex-col transition-colors duration-300 border-r border-indigo-500/20">
        <div className="flex h-20 items-center justify-center border-b border-indigo-400/20 px-6 dark:border-white/10">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="Logo" className="w-8 h-8 object-contain filter invert opacity-90" />
            <span className="text-xl font-bold tracking-wide">AdminPanel</span>
          </div>
        </div>

        <div className="flex-1 px-4 py-8 overflow-y-auto">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-4 px-4">Management Base.</p>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === item.id
                    ? 'bg-indigo-600/90 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]'
                    : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  {item.icon}
                  <span className="font-medium text-sm">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 mt-auto border-t border-indigo-400/20 dark:border-slate-700/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 text-indigo-200 hover:bg-white/10 hover:text-white rounded-xl transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span className="font-medium text-sm">Log out Admin</span>
          </button>
        </div>
      </aside>

      {/* ---------------- Main Content ---------------- */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Top Header */}
        <header className="flex h-20 items-center justify-between bg-white/50 dark:bg-slate-900/50 px-8 shrink-0 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-black text-[#2b2b4f] dark:text-white tracking-tight">
              {activeTab === 'dashboard' && 'Admin Overview'}
              {activeTab === 'rooms' && 'Facilities & Assets'}
              {activeTab === 'maintenance' && 'Maintenance Hub'}
              {activeTab === 'bookings' && 'Booking Management'}
              {activeTab === 'users' && 'User Directory'}
              {activeTab === 'notifications' && 'Notifications'}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <ThemeToggle />

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 ring-2 ring-[#f4f7fe] dark:ring-slate-950 text-[10px] text-white flex items-center justify-center font-bold">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 animate-fade-in-up">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
                    <div className="flex gap-3">
                      <button onClick={() => { setShowNotifications(false); setActiveTab('notifications'); }} className="text-xs text-indigo-500 font-semibold hover:text-indigo-600">View all</button>
                      {notifications.filter(n => !n.read).length > 0 && (
                        <button onClick={markAllNotificationsAsRead} className="text-xs text-indigo-500 font-semibold hover:text-indigo-600">Mark all read</button>
                      )}
                      <button onClick={() => setShowNotifications(false)} className="text-xs text-slate-500 font-semibold hover:text-slate-600">Close</button>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">No notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => !n.read && markNotificationAsRead(n.id)}
                          className={`p-4 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors block ${!n.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <p className={`text-sm font-bold ${!n.read ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-white'}`}>{n.title}</p>
                            <div className="flex items-center gap-2">
                              {!n.read && <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0"></span>}
                              <button onClick={(e) => deleteNotification(e, n.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{n.message}</p>
                          <p className="text-[10px] text-slate-400 mt-2">{formatTimeAgo(n.createdAt)}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 ml-4 border-l border-slate-200 dark:border-slate-700 pl-6 cursor-pointer">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-[#2b2b4f] dark:text-white leading-none">
                  {user ? `${user.firstName} ${user.lastName}` : 'Admin'}
                </p>
                <p className="text-[10px] font-bold text-indigo-500 mt-1 uppercase tracking-widest">
                  {user?.role?.replace('_', ' ') || 'Admin'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 overflow-hidden border-2 border-indigo-500 shadow-sm flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-300 text-sm">
                {user ? `${(user.firstName || 'A')[0]}${(user.lastName || 'D')[0]}` : 'AD'}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-8 pt-6">

          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && <AdminOverviewPanel resourcesCount={resources.length} />}

          {/* TAB: ADD/EDIT ROOMS (Manage Resources) */}
          {activeTab === 'rooms' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Add/Edit Form */}
              <div className="xl:col-span-1 border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-fit sticky top-6">
                <h3 className="text-xl font-bold mb-4 text-indigo-500 flex justify-between items-center">
                  {editingRoomId ? 'Update Configuration' : 'Deploy New Asset'}
                  {editingRoomId && (
                    <button onClick={handleCancelEdit} className="text-xs font-bold tracking-widest uppercase text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full">
                      Cancel Edit
                    </button>
                  )}
                </h3>

                {formStatus.success && <div className="mb-4 p-3 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 text-sm font-bold">Resource {editingRoomId ? 'updated' : 'created'} successfully!</div>}
                {formStatus.error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 border border-red-200 text-sm font-bold">Error: {formStatus.error}</div>}

                <form onSubmit={handleSaveRoom} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Resource Name / ID</label>
                    <input required type="text" name="resourceName" value={roomForm.resourceName} onChange={handleRoomChange} placeholder="e.g. F1205" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Type</label>
                      <select name="type" value={roomForm.type} onChange={handleRoomChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200">
                        <option value="CLASSROOM">Classroom</option>
                        <option value="LAB">Laboratory</option>
                        <option value="LIBRARY_ROOM">Library Room</option>
                        <option value="LECTURE_HALL">Lecture Hall</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Capacity</label>
                      <input required type="number" name="capacity" value={roomForm.capacity} onChange={handleRoomChange} placeholder="Max pax" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Location / Building</label>
                    <input required type="text" name="location" value={roomForm.location} onChange={handleRoomChange} placeholder="e.g. Computing Faculty Level 4" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Status</label>
                      <select name="status" value={roomForm.status} onChange={handleRoomChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200">
                        <option value="AVAILABLE">Available</option>
                        <option value="MAINTENANCE">Maintenance</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Available Hours</label>
                      <input type="text" name="availabilityWindow" value={roomForm.availabilityWindow} onChange={handleRoomChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200" />
                    </div>
                  </div>

                  <button disabled={formStatus.loading} type="submit" className={`w-full mt-2 font-bold py-2.5 rounded-lg transition-colors shadow-md ${editingRoomId ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30'}`}>
                    {formStatus.loading ? (editingRoomId ? 'Updating...' : 'Deploying...') : (editingRoomId ? 'Save Changes' : '+ Add Resource')}
                  </button>
                </form>
              </div>

              {/* Existing Rooms List */}
              <div className="xl:col-span-2 border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <h3 className="text-xl font-bold text-[#2b2b4f] dark:text-white mb-4">Current Asset Catalogue</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400">
                        <th className="font-bold py-3 pr-4">ID / Name</th>
                        <th className="font-bold py-3 px-4">Type</th>
                        <th className="font-bold py-3 px-4">Capacity</th>
                        <th className="font-bold py-3 px-4">Status</th>
                        <th className="font-bold py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                      {resources.length === 0 && <tr><td colSpan="5" className="py-8 text-center text-slate-400 font-bold tracking-widest uppercase">No assets found in database.</td></tr>}
                      {resources.map((res) => (
                        <tr key={res.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="py-3 pr-4 font-semibold text-[#2b2b4f] dark:text-slate-200">{res.resourceName}</td>
                          <td className="py-3 px-4 text-slate-500">{res.type}</td>
                          <td className="py-3 px-4 text-slate-500">{res.capacity} Pax</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${res.status === 'AVAILABLE' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'}`}>
                              {res.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-3">
                            <button onClick={() => handleEditClick(res)} className="text-slate-400 hover:text-indigo-500 transition-colors" title="Edit Resource">
                              <svg className="w-5 h-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                            <button onClick={() => handleDeleteRoom(res.id)} className="text-slate-400 hover:text-red-500 transition-colors" title="Delete Resource">
                              <svg className="w-5 h-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MAINTENANCE */}
          {activeTab === 'maintenance' && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#2b2b4f] dark:text-white">Maintenance Tickets</h3>
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-red-500/30 text-sm">
                  Report Outage
                </button>
              </div>

              <div className="grid gap-4">
                <div className="border border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/5 rounded-xl p-5 flex items-start gap-5">
                  <div className="bg-red-500 text-white p-2.5 rounded-lg shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-red-700 dark:text-red-400">Projector malfunction in F1206</h4>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Created 2h ago</span>
                    </div>
                    <p className="text-sm mt-1 text-slate-600 dark:text-slate-300">The primary HDMI port is unresponsive. The bulb indicates low lifespan.</p>
                    <div className="mt-4 flex gap-2">
                      <span className="px-2 py-1 bg-red-200 text-red-800 dark:bg-red-900/40 dark:text-red-300 rounded text-xs font-bold">Severity: High</span>
                      <span className="px-2 py-1 bg-slate-200 text-[#2b2b4f] dark:bg-slate-700 dark:text-slate-300 rounded text-xs font-bold">Tech Dispatched</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: BOOKINGS */}
          {activeTab === 'bookings' && <BookingManagementPanel />}

          {/* TAB: USERS - handled by dedicated UserManagementPanel */}
          {activeTab === 'users' && <UserManagementPanel />}

          {/* TAB: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="max-w-4xl mx-auto animate-fade-in-up">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    {notificationFilter === 'unread' ? 'Unread Notifications' : notificationFilter === 'read' ? 'Read Notifications' : 'All Notifications'}
                  </h2>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl">
                      <button onClick={() => setNotificationFilter('all')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${notificationFilter === 'all' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>All</button>
                      <button onClick={() => setNotificationFilter('unread')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${notificationFilter === 'unread' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Unread</button>
                      <button onClick={() => setNotificationFilter('read')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${notificationFilter === 'read' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Read</button>
                    </div>
                    {notifications.filter(n => !n.read).length > 0 && (
                      <button onClick={markAllNotificationsAsRead} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-400 py-2 px-4 rounded-xl transition-colors">
                        Mark all as read
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {notifications.filter(n => notificationFilter === 'all' ? true : notificationFilter === 'unread' ? !n.read : n.read).length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-700">
                        <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                      </div>
                      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
                        {notificationFilter === 'unread' ? 'No unread notifications' : 'You\'re all caught up!'}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">There are no notifications to show in this view.</p>
                    </div>
                  ) : (
                    notifications.filter(n => notificationFilter === 'all' ? true : notificationFilter === 'unread' ? !n.read : n.read).map(n => (
                      <div 
                        key={n.id}
                        onClick={() => !n.read && markNotificationAsRead(n.id)}
                        className={`p-5 rounded-xl border ${n.read ? 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700' : 'bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800 cursor-pointer hover:shadow-md transition-shadow'}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-4">
                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${n.read ? 'bg-slate-200 dark:bg-slate-700' : 'bg-indigo-600 dark:bg-indigo-400'}`}></div>
                            <div>
                              <h4 className={`text-base font-bold ${n.read ? 'text-slate-700 dark:text-slate-300' : 'text-indigo-900 dark:text-indigo-200'}`}>{n.title}</h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{n.message}</p>
                              <p className="text-xs text-slate-400 mt-3 font-medium flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {formatTimeAgo(n.createdAt)}
                              </p>
                            </div>
                          </div>
                          <button onClick={(e) => deleteNotification(e, n.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
