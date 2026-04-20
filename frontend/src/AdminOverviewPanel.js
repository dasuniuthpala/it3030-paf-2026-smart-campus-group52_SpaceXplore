import React from 'react';

function AdminOverviewPanel({ resourcesCount }) {
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const stats = [
    { label: 'Total Facilities', value: resourcesCount || 0, trend: '+2 this month', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ), color: 'indigo' },
    { label: 'Active Bookings', value: '142', trend: '+12% from last week', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ), color: 'sky' },
    { label: 'System Health', value: '99.8%', trend: 'Operational', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ), color: 'emerald' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-900 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/20">
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2">{getTimeOfDay()}, Admin!</h2>
          <p className="text-indigo-100 max-w-md opacity-90">
            Welcome to your command center. Everything is looking good today! You have <span className="font-bold underline decoration-indigo-400">12 pending</span> booking requests to review.
          </p>
        </div>
        {/* Abstract background elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="group bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${s.color}-50 dark:bg-${s.color}-900/20 text-${s.color}-600 dark:text-${s.color}-400 group-hover:scale-110 transition-transform`}>
                {s.icon}
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'} dark:bg-slate-700`}>
                {s.trend}
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-8 h-1 bg-indigo-600 rounded-full"></span>
              Recent System Activity
            </h4>
            <button className="text-xs font-bold text-indigo-600 hover:underline">View All Logs</button>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 divide-y divide-slate-50 dark:divide-slate-700/50 overflow-hidden shadow-sm">
            {[
              { time: '10:45 AM', user: 'Shyamal', action: 'Approved booking', target: 'Lab F1205', status: 'success' },
              { time: '09:12 AM', user: 'System', action: 'New User Registered', target: 'mica@gmail.com', status: 'info' },
              { time: '08:00 AM', user: 'Alert', action: 'Sensor Offline', target: 'Main Library HVAC', status: 'danger' },
              { time: 'Yesterday', user: 'Admin', action: 'Updated Resource', target: 'Projector Room A4', status: 'info' },
            ].map((log, i) => (
              <div key={i} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <span className="text-[10px] uppercase font-bold text-slate-400 w-16 text-right shrink-0">{log.time}</span>
                <div className={`w-2 h-2 rounded-full shrink-0 ${log.status === 'success' ? 'bg-emerald-500' : log.status === 'danger' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-slate-900 dark:text-white">{log.user}</span> {log.action}: <span className="font-medium text-indigo-600">{log.target}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* System Occupancy - Visual only logic */}
        <div className="space-y-4">
          <h4 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-8 h-1 bg-sky-500 rounded-full"></span>
            Resource Utilization
          </h4>
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
            <div className="space-y-6">
              {[
                { name: 'Study Rooms', percentage: 85, color: 'indigo' },
                { name: 'Labs', percentage: 42, color: 'sky' },
                { name: 'Conference', percentage: 12, color: 'emerald' },
              ].map((res, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-500">{res.name}</span>
                    <span className={`text-${res.color}-600`}>{res.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-${res.color}-500 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-${res.color}-500/20`}
                      style={{ width: `${res.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center">
              <p className="text-xs text-slate-400 mb-4">You have reached <span className="text-slate-900 dark:text-white font-bold">85%</span> of your target occupancy this month.</p>
              <button className="w-full py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all">
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOverviewPanel;
