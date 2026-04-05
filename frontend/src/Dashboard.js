import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import logoImage from './images/logo.png';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Check auth
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
        setUser({ firstName: 'Alex', lastName: 'Parker', role: 'Student', email: 'alex.parker@student.spacexplore.edu' });
    } else {
        setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { id: 'bookings', name: 'My Bookings', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { id: 'facilities', name: 'Facilities', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
    { id: 'profile', name: 'My Profile', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
    { id: 'settings', name: 'Settings', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  ];

  return (
    <div className="flex h-screen w-full bg-[#f4f7fe] dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200">
      
      {/* ---------------- Sidebar ---------------- */}
      <aside className="w-64 shrink-0 bg-[#2b2b4f] dark:bg-slate-900 text-white flex flex-col transition-colors duration-300">
        <div className="flex h-20 items-center justify-center border-b border-indigo-400/20 px-6 dark:border-white/10">
          <div className="flex items-center gap-3">
             <img src={logoImage} alt="Logo" className="w-8 h-8 object-contain filter invert opacity-90" />
             <span className="text-xl font-bold tracking-wide">SpaceXplore</span>
          </div>
        </div>

        <div className="flex-1 px-4 py-8 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                     if (item.id === 'facilities') { navigate('/resources'); return; }
                     setActiveTab(item.id);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === item.id 
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

        <div className="p-4 mt-auto border-t border-indigo-400/20 dark:border-white/10">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-4 px-4 py-3 text-indigo-200 hover:bg-white/10 hover:text-white rounded-xl transition-all"
           >
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
             <span className="font-medium text-sm">Log out</span>
           </button>
        </div>
      </aside>

      {/* ---------------- Main Content ---------------- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="flex h-20 items-center justify-between bg-transparent px-8 shrink-0">
          <div>
            <h1 className="text-3xl font-black text-[#2b2b4f] dark:text-white tracking-tight rounded-t-sm">
              {activeTab === 'dashboard' && `Hello, ${user?.firstName || 'Student'}!`}
              {activeTab === 'profile' && 'My Profile'}
              {activeTab === 'settings' && 'Account Settings'}
              {activeTab === 'bookings' && 'My Reservations'}
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              {activeTab === 'dashboard' 
                  ? new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', weekday: 'long' })
                  : 'Manage your space and preferences'}
            </p>
          </div>

          <div className="flex items-center gap-6">
             <div className="relative hidden md:block">
               <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               <input 
                 type="text" 
                 placeholder="Search" 
                 className="pl-10 pr-4 py-2.5 rounded-full bg-white dark:bg-slate-800 border-none shadow-sm text-sm w-[300px] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
               />
             </div>
             
             <ThemeToggle />

             <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
               <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[#f4f7fe] dark:ring-slate-950"></span>
             </button>

             <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveTab('profile')}>
                <div className="w-10 h-10 rounded-full bg-indigo-100 overflow-hidden border-2 border-white shadow-sm dark:border-slate-800">
                  <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=64&q=80" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-bold text-[#2b2b4f] dark:text-white leading-none">{user?.firstName} {user?.lastName}</p>
                  <p className="text-[11px] font-medium text-slate-500 mt-1 uppercase tracking-widest">{user?.role || 'Student'}</p>
                </div>
             </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-8 pt-4">
          
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Left Column (Stats & Schedule) */}
               <div className="lg:col-span-2 space-y-8">
                  {/* Stats Row */}
                  <section>
                     <div className="flex justify-between items-end mb-4">
                       <h3 className="text-lg font-bold text-[#2b2b4f] dark:text-white">Progress Overview</h3>
                     </div>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Stat Card 1 */}
                        <div className="bg-white dark:bg-slate-800 rounded-[1.25rem] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center border border-slate-100 dark:border-slate-700/50">
                           <p className="text-xs font-semibold text-slate-500 mb-4">Upcoming</p>
                           <div className="w-16 h-16 rounded-full border-[3px] border-indigo-500 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(79,70,229,0.2)]">
                             <span className="text-xl font-black text-[#2b2b4f] dark:text-white">2/5</span>
                           </div>
                           <p className="text-[10px] text-slate-400 font-medium">Bookings this week</p>
                        </div>
                        {/* Stat Card 2 */}
                        <div className="bg-white dark:bg-slate-800 rounded-[1.25rem] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center border border-slate-100 dark:border-slate-700/50">
                           <p className="text-xs font-semibold text-slate-500 mb-4">Study Hours</p>
                           <div className="w-16 h-16 rounded-full border-[3px] border-purple-500 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                             <span className="text-xl font-black text-[#2b2b4f] dark:text-white">15</span>
                           </div>
                           <p className="text-[10px] text-slate-400 font-medium">Keep up progress!</p>
                        </div>
                        {/* Stat Card 3 */}
                        <div className="bg-white dark:bg-slate-800 rounded-[1.25rem] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center border border-slate-100 dark:border-slate-700/50">
                           <p className="text-xs font-semibold text-slate-500 mb-4">Account Rating</p>
                           <div className="w-16 h-16 rounded-full border-[3px] border-blue-500 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                             <span className="text-xl font-black text-[#2b2b4f] dark:text-white">98%</span>
                           </div>
                           <p className="text-[10px] text-slate-400 font-medium">Excellent standing</p>
                        </div>
                        {/* Stat Card 4 */}
                        <div className="bg-white dark:bg-slate-800 rounded-[1.25rem] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center border border-slate-100 dark:border-slate-700/50">
                           <p className="text-xs font-semibold text-slate-500 mb-4">Lab Sessions</p>
                           <div className="w-16 h-16 rounded-full border-[3px] border-emerald-500 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                             <span className="text-xl font-black text-[#2b2b4f] dark:text-white">8/8</span>
                           </div>
                           <p className="text-[10px] text-slate-400 font-medium">Required completed</p>
                        </div>
                     </div>
                  </section>
  
                  {/* Schedule & Calendar */}
                  <section>
                     <div className="flex justify-between items-end mb-4">
                       <h3 className="text-lg font-bold text-[#2b2b4f] dark:text-white">Schedule</h3>
                     </div>
                     <div className="grid md:grid-cols-2 gap-4">
                       {/* Calendar visual mock */}
                       <div className="bg-white dark:bg-slate-800 rounded-[1.25rem] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col border border-slate-100 dark:border-slate-700/50">
                          <div className="flex justify-between items-center mb-4">
                             <button className="text-slate-400"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                             <h4 className="font-bold text-[#2b2b4f] dark:text-white text-sm">March 2026</h4>
                             <button className="text-slate-400"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                          </div>
                          <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-400 mb-2">
                             <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                          </div>
                          <div className="grid grid-cols-7 text-center text-sm font-medium gap-y-2 text-[#2b2b4f] dark:text-slate-200">
                             <div className="text-slate-300 dark:text-slate-600">26</div><div className="text-slate-300 dark:text-slate-600">27</div><div className="text-slate-300 dark:text-slate-600">28</div><div className="text-slate-300 dark:text-slate-600">1</div><div>2</div><div>3</div><div>4</div>
                             <div>5</div><div>6</div><div className="bg-indigo-600 text-white w-7 h-7 mx-auto rounded-full flex items-center justify-center shadow-md shadow-indigo-500/30">7</div><div>8</div><div>9</div><div>10</div><div>11</div>
                             <div>12</div><div>13</div><div>14</div><div>15</div><div>16</div><div>17</div><div>18</div>
                             <div>19</div><div>20</div><div>21</div><div>22</div><div>23</div><div>24</div><div>25</div>
                          </div>
                       </div>
                       
                       {/* Events list */}
                       <div className="flex flex-col gap-3">
                          <div className="bg-indigo-600 rounded-[1.25rem] p-4 text-white shadow-xl shadow-indigo-600/30 flex gap-4 items-center">
                             <div className="w-12 text-center border-r border-indigo-400/30 pr-4 shrink-0">
                               <div className="text-2xl font-black leading-none">07</div>
                             </div>
                             <div className="flex-1">
                                <h4 className="font-bold text-sm tracking-wide">Smart Lab F1205</h4>
                                <p className="text-[10px] text-indigo-100 mt-1">2 hours reserved</p>
                             </div>
                             <div className="text-sm font-black">10:00</div>
                          </div>
                          <div className="bg-white dark:bg-slate-800 rounded-[1.25rem] p-4 flex gap-4 items-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 dark:border-slate-700/50">
                             <div className="w-12 text-center border-r border-slate-200 dark:border-slate-700 pr-4 shrink-0">
                               <div className="text-2xl font-black text-[#2b2b4f] dark:text-white leading-none">12</div>
                             </div>
                             <div className="flex-1">
                                <h4 className="font-bold text-[#2b2b4f] dark:text-white text-sm tracking-wide">Meeting Room A405</h4>
                                <p className="text-[10px] text-slate-400 mt-1">Group Project</p>
                             </div>
                             <div className="text-sm font-black text-slate-800 dark:text-slate-200">14:00</div>
                          </div>
                          <div className="bg-white dark:bg-slate-800 rounded-[1.25rem] p-4 flex gap-4 items-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 dark:border-slate-700/50">
                             <div className="w-12 text-center border-r border-slate-200 dark:border-slate-700 pr-4 shrink-0">
                               <div className="text-2xl font-black text-[#2b2b4f] dark:text-white leading-none">14</div>
                             </div>
                             <div className="flex-1">
                                <h4 className="font-bold text-[#2b2b4f] dark:text-white text-sm tracking-wide">Library Quiet Room</h4>
                                <p className="text-[10px] text-slate-400 mt-1">Individual Study</p>
                             </div>
                             <div className="text-sm font-black text-slate-800 dark:text-slate-200">09:00</div>
                          </div>
                       </div>
                     </div>
                  </section>
               </div>
  
               {/* Right Column */}
               <div className="space-y-8">
                  {/* Upcoming Events */}
                  <section>
                     <div className="flex justify-between items-end mb-4">
                       <h3 className="text-lg font-bold text-[#2b2b4f] dark:text-white">Upcoming Events</h3>
                       <button className="text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors">View more</button>
                     </div>
                     <div className="bg-white dark:bg-slate-800 rounded-[1.25rem] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4 border border-slate-100 dark:border-slate-700/50">
                        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                           <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shrink-0 shadow-md"></div>
                           <div className="flex-1">
                              <h4 className="font-bold text-sm text-[#2b2b4f] dark:text-white leading-tight">AI and Big Data Seminar</h4>
                              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                                 <span>08.03.2026</span> <span>18:00 - 20:00</span>
                              </p>
                           </div>
                           <button className="text-slate-400 hover:text-indigo-500"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg></button>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                           <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-900 to-slate-900 shrink-0 shadow-md"></div>
                           <div className="flex-1">
                              <h4 className="font-bold text-sm text-[#2b2b4f] dark:text-white leading-tight">Student Council Meetup</h4>
                              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                                 <span>17.03.2026</span> <span>10:00 - 16:00</span>
                              </p>
                           </div>
                           <button className="text-slate-400 hover:text-indigo-500"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg></button>
                        </div>
                     </div>
                  </section>
  
                  {/* Suggested Facilities */}
                  <section>
                     <div className="flex justify-between items-end mb-4">
                       <h3 className="text-lg font-bold text-[#2b2b4f] dark:text-white">Top Facilities</h3>
                       <button className="text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors" onClick={() => navigate('/resources')}>Catalogue</button>
                     </div>
                     <div className="bg-white dark:bg-slate-800 rounded-[1.25rem] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4 border border-slate-100 dark:border-slate-700/50">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center shrink-0">🏛️</div>
                           <div className="flex-1">
                              <h4 className="font-bold text-sm text-[#2b2b4f] dark:text-white">Smart Classroom F1205</h4>
                              <p className="text-[10px] text-slate-400 shrink-0">Available now</p>
                           </div>
                           <button className="shrink-0 w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 flex items-center justify-center hover:bg-indigo-100 transition-colors">
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                           </button>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center shrink-0">📚</div>
                           <div className="flex-1">
                              <h4 className="font-bold text-sm text-[#2b2b4f] dark:text-white">Main Library Study Room</h4>
                              <p className="text-[10px] text-slate-400 shrink-0">Waitlist open</p>
                           </div>
                           <button className="shrink-0 w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 flex items-center justify-center hover:bg-indigo-100 transition-colors">
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                           </button>
                        </div>
                     </div>
                  </section>
               </div>
             </div>
          )}

          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
             <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                {/* Profile Header */}
                <div className="bg-white dark:bg-slate-800 rounded-[1.25rem] p-8 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-slate-100 dark:border-slate-700/50 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                   <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 mt-12 w-full text-center sm:text-left">
                      <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 bg-indigo-100 overflow-hidden shadow-xl shrink-0">
                         <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=256&q=80" alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 pb-2">
                         <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{user?.firstName} {user?.lastName}</h2>
                         <p className="text-indigo-600 dark:text-indigo-400 font-bold tracking-wide mt-1">{user?.role || 'Undergraduate Student'}</p>
                         <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">{user?.email || 'student@spacexplore.edu'}</p>
                      </div>
                      <div className="pb-2">
                         <button className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 font-bold py-2.5 px-6 rounded-xl transition-colors border border-indigo-100 dark:border-indigo-500/20 text-sm w-full sm:w-auto">
                            Edit Avatar
                         </button>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* Personal Info */}
                   <div className="bg-white dark:bg-slate-800 rounded-[1.25rem] p-8 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-slate-100 dark:border-slate-700/50">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Personal Details</h3>
                      <div className="space-y-4">
                         <div>
                            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Full Name</label>
                            <p className="font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800">{user?.firstName} {user?.lastName}</p>
                         </div>
                         <div>
                            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Email Address</label>
                            <p className="font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800">{user?.email || 'N/A'}</p>
                         </div>
                         <div>
                            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Student ID / Reference</label>
                            <p className="font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800">IT21${Math.floor(Math.random() * 90000) + 10000}</p>
                         </div>
                         <div>
                            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Primary Campus</label>
                            <p className="font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800">Main Tech Campus Building A</p>
                         </div>
                      </div>
                      <button className="mt-6 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition-colors w-full bg-indigo-50 dark:bg-indigo-500/10 py-3 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                         Update Personal Information
                      </button>
                   </div>
                   
                   {/* Academic Mock */}
                   <div className="bg-white dark:bg-slate-800 rounded-[1.25rem] p-8 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-slate-100 dark:border-slate-700/50">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Academic Program</h3>
                      
                      <div className="mb-6 p-5 border border-purple-100 dark:border-purple-500/20 bg-purple-50 dark:bg-purple-500/5 rounded-xl">
                         <h4 className="font-black text-purple-900 dark:text-purple-300">BSc (Hons) Software Engineering</h4>
                         <p className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-1 uppercase tracking-widest">Year 3 - Semester 2</p>
                      </div>

                      <div className="space-y-5">
                         <div>
                            <div className="flex justify-between items-center mb-2">
                               <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Degree Progress</p>
                               <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">75%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                               <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-[75%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                            </div>
                         </div>
                         <div>
                            <div className="flex justify-between items-center mb-2">
                               <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Lab Credits</p>
                               <span className="text-xs font-black text-emerald-500">12 / 16</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                               <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 w-[75%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                            </div>
                         </div>
                      </div>
                      
                      <div className="mt-8 border-t border-slate-100 dark:border-slate-700/50 pt-6">
                         <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Enrolled Modules</h4>
                         <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded-lg">PAF - IT3030</span>
                            <span className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded-lg">DS - IT3040</span>
                            <span className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded-lg">MLB - IT3050</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
             <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                <div>
                   <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Account Settings</h2>
                   <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Manage your campus platform preferences and security.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   
                   {/* Settings Nav */}
                   <div className="col-span-1">
                      <div className="bg-white dark:bg-slate-800 rounded-[1.25rem] p-4 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-slate-100 dark:border-slate-700/50 sticky top-4">
                         <button className="w-full text-left px-4 py-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl mb-2 text-sm border-l-4 border-indigo-600">
                            General Preferences
                         </button>
                         <button className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 font-semibold rounded-xl mb-2 text-sm transition-colors border-l-4 border-transparent">
                            Security & Login
                         </button>
                         <button className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 font-semibold rounded-xl mb-2 text-sm transition-colors border-l-4 border-transparent">
                            Notifications
                         </button>
                         <button className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 font-semibold rounded-xl mb-2 text-sm transition-colors border-l-4 border-transparent">
                            Billing & Plans
                         </button>
                      </div>
                   </div>

                   {/* Settings Content */}
                   <div className="col-span-1 md:col-span-2 space-y-8">
                      
                      {/* Theme Setting */}
                      <div className="bg-white dark:bg-slate-800 rounded-[1.25rem] p-8 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-slate-100 dark:border-slate-700/50">
                         <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Appearance</h3>
                         <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">Customize how SpaceXplore looks on your device.</p>
                         
                         <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div>
                               <h4 className="font-bold text-slate-800 dark:text-white">Global Theme</h4>
                               <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mt-1">Light / Dark toggle</p>
                            </div>
                            <div className="scale-125 origin-right">
                               <ThemeToggle />
                            </div>
                         </div>
                      </div>

                      {/* Notifications */}
                      <div className="bg-white dark:bg-slate-800 rounded-[1.25rem] p-8 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-slate-100 dark:border-slate-700/50">
                         <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Alerts & Notifications</h3>
                         <div className="space-y-4">
                            
                            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700/50">
                               <div>
                                  <h4 className="font-bold text-slate-800 dark:text-white text-sm">Booking Confirmations</h4>
                                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Receive emails when your room booking is approved.</p>
                               </div>
                               <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] right-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                               </label>
                            </div>

                            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700/50">
                               <div>
                                  <h4 className="font-bold text-slate-800 dark:text-white text-sm">Maintenance Alerts</h4>
                                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Get notified if a facility you booked goes out of service.</p>
                               </div>
                               <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] right-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                               </label>
                            </div>

                            <div className="flex items-center justify-between p-4">
                               <div>
                                  <h4 className="font-bold text-slate-800 dark:text-white text-sm">Weekly Report</h4>
                                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Activity summary for your campus utilization.</p>
                               </div>
                               <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" value="" className="sr-only peer" />
                                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] right-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                               </label>
                            </div>
                         </div>
                      </div>

                   </div>
                </div>
             </div>
          )}

          {/* TAB: BOOKINGS (Placeholder) */}
          {activeTab === 'bookings' && (
             <div className="h-64 flex flex-col items-center justify-center text-center">
                 <div className="w-20 h-20 mb-6 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                 </div>
                 <h2 className="text-2xl font-black mb-2 text-slate-800 dark:text-white">My Reservations</h2>
                 <p className="text-slate-500 max-w-md">Your future bookings will appear here once you reserve a smart space or laboratory.</p>
                 <button onClick={() => navigate('/resources')} className="mt-8 bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/30">Browse Facilities</button>
             </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default Dashboard;
