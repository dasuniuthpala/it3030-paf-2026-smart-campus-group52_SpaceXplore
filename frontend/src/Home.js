import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import heroImage from './images/hero_smart_campus.png';
import logoImage from './images/logo.png';

function Home() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const capabilities = [
    {
      id: 0,
      title: 'Facility Booking',
      desc: 'Reserve intelligent spaces, smart labs, and high-tech hardware with an unobstructed workflow.',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
        </svg>
      )
    },
    {
      id: 1,
      title: 'Live Telemetry',
      desc: 'Real-time sensors and schedules prevent collision blocks and ensure seamless operations globally.',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
           <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
           <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
        </svg>
      )
    },
    {
      id: 2,
      title: 'Incident Nodes',
      desc: 'Autonomous ticketing dispatches instant automated maintenance notifications for hardware faults.',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
           <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M5.25 12h13.5m-13.5 3.75h13.5m-6.75 3.75h3" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100 text-slate-800 transition-colors duration-500 dark:bg-black dark:text-slate-100 font-sans selection:bg-indigo-500/30">
      
      {/* -------------------- Fixed Left Sidebar -------------------- */}
      <aside className="relative z-40 flex w-20 md:w-80 shrink-0 flex-col border-r border-slate-200/50 bg-white/70 backdrop-blur-3xl transition-all duration-500 dark:border-white/5 dark:bg-slate-900/40">
        
        {/* Brand Header */}
        <div className="flex h-[88px] shrink-0 items-center justify-center md:justify-start px-0 md:px-8 border-b border-slate-200/50 dark:border-white/5 bg-gradient-to-r from-transparent to-white/10 dark:to-white/5">
          <img src={logoImage} alt="SpaceXplore logo" className="h-10 w-auto transition-transform hover:scale-110 dark:invert dark:opacity-90" />
        </div>

        {/* Sidebar Navigation & Features */}
        <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden p-4 md:p-6 scrollbar-hide">
          <h2 className="hidden md:block text-[10px] font-black uppercase tracking-widest text-indigo-500/80 dark:text-indigo-400 mb-6 px-2">Operational Nodes</h2>
          
          <div className="flex flex-col gap-4">
            {capabilities.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group relative flex flex-row items-center md:items-start gap-4 rounded-2xl p-3 md:p-4 text-left transition-all duration-500 overflow-hidden ${
                  activeTab === item.id
                    ? 'border-transparent shadow-[0_10px_30px_-10px_rgba(99,102,241,0.3)] bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/20 dark:to-purple-500/10'
                    : 'border-transparent hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                {/* Visual Active Indicator overlay */}
                {activeTab === item.id && (
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-500"></div>
                )}
                
                <div className={`mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-500 ${
                  activeTab === item.id 
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/40' 
                    : 'bg-white/50 text-slate-400 border border-slate-200 dark:bg-black/20 dark:border-white/10 dark:text-slate-500 group-hover:text-indigo-400'
                }`}>
                  {item.icon}
                </div>

                <div className="hidden md:block">
                  <h4 className={`text-base font-bold transition-colors ${
                    activeTab === item.id ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                  }`}>
                    {item.title}
                  </h4>
                  <p className={`mt-1 text-xs leading-relaxed transition-opacity duration-300 ${activeTab === item.id ? 'text-indigo-900/60 dark:text-indigo-200/60 opacity-100' : 'text-slate-500 dark:text-slate-500 opacity-0 group-hover:opacity-100'}`}>
                    {item.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Quick Actions (Sidebar bottom) */}
          <div className="mt-auto hidden md:flex flex-col gap-3 border-t border-slate-200/50 dark:border-white/5 pt-6 px-2">
             <button onClick={() => navigate('/resources')} className="w-full rounded-xl bg-slate-900 py-3.5 text-xs font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-indigo-600 dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-400">Launch Catalogue</button>
          </div>
        </div>
      </aside>


      {/* -------------------- Main Visual Content (Hero Right Side) -------------------- */}
      <main className="relative flex flex-1 flex-col overflow-hidden">
        
        {/* Absolute Background Image Layer */}
        <div className="absolute inset-0 z-0">
           <img src={heroImage} alt="Futuristic Hub" className="h-full w-full object-cover transition-transform duration-[20s] ease-out scale-100 hover:scale-110" />
           {/* Complex Gradient Overlays for readability and mood */}
           <div className="absolute inset-0 bg-gradient-to-r from-slate-50/90 via-slate-50/50 to-transparent dark:from-black/90 dark:via-black/60 dark:to-black/30"></div>
           <div className="absolute inset-0 bg-gradient-to-t from-slate-100/90 via-transparent to-transparent dark:from-black dark:via-transparent to-transparent"></div>
        </div>
        
        {/* Top Navbar overlapping the Hero */}
        <nav className="relative z-30 flex h-[88px] items-center justify-end px-8 border-b border-transparent dark:border-white/5 transition-colors">
          <div className="flex items-center gap-4 rounded-full bg-white/40 border border-white/40 dark:bg-black/40 dark:border-white/10 backdrop-blur-xl px-2 py-2 pr-6">
            
            {/* Theme Toggle Button */}
            <ThemeToggle />

            <div className="h-5 w-px bg-slate-300 dark:bg-slate-700 mx-2"></div>

            <button onClick={() => navigate('/login')} className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
              Sign In
            </button>
          </div>
        </nav>

        {/* Hero Content positioned over the image */}
        <div className="relative z-10 flex flex-1 flex-col justify-center px-8 lg:px-16 xl:px-24">
          <div className="max-w-3xl">
             <div className="mb-6 inline-flex overflow-hidden rounded-full border border-indigo-200/50 bg-white/30 backdrop-blur-md p-1 shadow-2xl dark:border-indigo-500/30 dark:bg-black/30">
               <span className="flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:bg-indigo-600 dark:text-white">
                 <span className="relative flex h-1.5 w-1.5">
                   <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75 dark:bg-white"></span>
                   <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-white"></span>
                 </span>
                 SpaceXplore Core
               </span>
               <span className="px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300">Operations Hub</span>
             </div>

             <h1 className="text-6xl font-black leading-[1.05] tracking-tight text-slate-900 dark:text-white sm:text-7xl lg:text-[5.5rem]">
               Command Your <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-300">
                 Campus Grid.
               </span>
             </h1>

             <p className="mt-8 max-w-xl text-lg font-medium leading-relaxed text-slate-600 dark:text-slate-400 sm:text-xl">
               Step into the future of facility management. We merge beautiful architectural orchestration with deep systems integrations to bring you a flawless workflow.
             </p>

             <div className="mt-12 flex flex-col sm:flex-row gap-5">
               <button
                 onClick={() => navigate('/register')}
                 className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-slate-900 px-8 py-4.5 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(0,0,0,0.3)] dark:bg-white dark:text-black dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
               >
                 <span className="relative z-10">Deploy Now</span>
                 <svg xmlns="http://www.w3.org/2000/svg" className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1.5" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                 </svg>
                 <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                 <span className="relative z-10 absolute inset-0 flex items-center justify-center gap-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 text-white">
                    Deploy Now
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform translate-x-0 group-hover:translate-x-1.5" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                   </svg>
                 </span>
               </button>

               {/* Quick Info card floating in hero */}
               <div className="hidden lg:flex items-center gap-5 rounded-2xl border border-slate-200/50 bg-white/40 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/40 shadow-xl">
                  <div className="flex -space-x-4">
                     <div className="flex overflow-hidden rounded-full border-2 border-white dark:border-slate-800">
                        <img className="inline-block h-10 w-10 rounded-full object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&q=80" alt="" />
                     </div>
                     <div className="flex overflow-hidden rounded-full border-2 border-white dark:border-slate-800">
                        <img className="inline-block h-10 w-10 rounded-full object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&q=80" alt="" />
                     </div>
                     <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-indigo-100 text-xs font-bold text-indigo-700 dark:border-slate-800 dark:bg-indigo-900 dark:text-indigo-300">
                       +1k
                     </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">Active Users</p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400">Booking spaces today</p>
                  </div>
               </div>
             </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default Home;
