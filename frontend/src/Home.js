import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import libraryImage from './images/lab.png';
import logoImage from './images/logo.png';

const features = [
  {
    title: 'Easy Booking',
    description: 'Reserve lecture halls, labs, and equipment with a fast and simple workflow.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6">
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M8 2v4M16 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    title: 'Real-time Availability',
    description: 'See live availability before you request a booking and avoid double allocations.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    title: 'Smart Notifications',
    description: 'Receive booking and maintenance updates directly from the system notification panel.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6">
        <path d="M18 8a6 6 0 10-12 0v4.2c0 .6-.2 1.1-.6 1.5L4 15h16l-1.4-1.3c-.4-.4-.6-.9-.6-1.5V8z" />
        <path d="M10 18a2 2 0 004 0" />
      </svg>
    ),
  },
  {
    title: 'Maintenance Reporting',
    description: 'Create and track fault tickets with status updates and assignment visibility.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6">
        <path d="M10 3h4l1 2h3a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h3l1-2z" />
        <path d="M9 12h6M12 9v6" />
      </svg>
    ),
  },
];

function Home() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check local storage or system preference on mount
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 font-sans selection:bg-indigo-500/30">
      
      {/* Decorative ambient background */}
      <div className="pointer-events-none fixed inset-x-0 -top-20 -z-10 flex justify-center opacity-70">
        <div className="absolute top-0 h-[600px] w-[600px] rounded-full bg-blue-300/30 blur-[120px] dark:bg-indigo-600/20" />
        <div className="absolute -top-20 right-[10%] h-[500px] w-[500px] rounded-full bg-purple-300/30 blur-[100px] dark:bg-purple-600/20" />
      </div>

      <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 py-4 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/70 transition-colors duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <img
            src={logoImage}
            alt="SpaceXplore logo"
            className="h-12 w-auto transition-all duration-300 hover:scale-105 dark:invert dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          />

          <ul className="hidden items-center gap-8 text-sm font-semibold md:flex">
            <li><a href="#home" className="transition-colors hover:text-indigo-500 dark:hover:text-indigo-400">Home</a></li>
            <li>
              <button onClick={() => navigate('/resources')} className="transition-colors hover:text-indigo-500 dark:hover:text-indigo-400">
                Resources
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/bookings')} className="transition-colors hover:text-indigo-500 dark:hover:text-indigo-400">
                Bookings
              </button>
            </li>
            <li><a href="#contact" className="transition-colors hover:text-indigo-500 dark:hover:text-indigo-400">Contact</a></li>
          </ul>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="group relative rounded-full p-2 text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-300 drop-shadow-[0_0_10px_rgba(252,211,77,0.8)]" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => navigate('/login')}
              className="rounded-xl border border-indigo-500/30 px-5 py-2 text-sm font-semibold text-indigo-600 transition-all hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(99,102,241,0.6)]"
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      <header id="home" className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.2fr_1fr] lg:px-8">
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-600 shadow-sm dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300 dark:shadow-[0_0_15px_rgba(99,102,241,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
            </span>
            Smart Campus Hub
          </div>
          <h1 className="text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Explore & Book <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400">
              Campus Spaces
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 sm:text-xl">
            Manage rooms, labs, and equipment with one sleek platform. Track approvals, submit
            maintenance incidents, and stay updated in real-time.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => navigate('/login')}
              className="group flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/40"
            >
              Get Started Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => navigate('/resources')}
              className="rounded-2xl border-2 border-indigo-200 bg-white/50 px-8 py-4 text-center text-base font-bold text-indigo-700 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500 hover:bg-white dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:border-indigo-400 dark:hover:bg-slate-800"
            >
              View Catalogue
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 -top-8 h-40 w-40 rounded-full bg-blue-400/30 blur-3xl dark:bg-indigo-500/20" />
          <div className="absolute -bottom-10 -right-8 h-48 w-48 rounded-full bg-violet-400/30 blur-3xl dark:bg-purple-600/20" />

          <div className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/50 p-2 shadow-2xl backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/30 dark:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.6)]">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-indigo-500/20"></div>
            <img
              src={libraryImage}
              alt="Modern university library"
              className="h-[300px] w-full rounded-[1.5rem] object-cover sm:h-[400px] lg:h-[460px]"
            />
            <div className="absolute bottom-6 mx-auto inset-x-6 flex items-center gap-4 rounded-2xl border border-white/20 bg-black/40 p-4 backdrop-blur-md dark:bg-slate-900/60 transition duration-300 group-hover:bg-black/50">
               <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
               </div>
               <div>
                  <p className="text-sm font-bold text-white">Space Available</p>
                  <p className="text-xs text-slate-300">Smart Lab L3 - Books Instantly</p>
               </div>
            </div>
          </div>
        </div>
      </header>

      <section id="resources" className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-16 text-center">
          <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">Discover What's Inside</h2>
          <h3 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Feature-Rich Operations</h3>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">Designed intimately for students, faculty staff, and comprehensive campus management teams.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => (
            <article
              key={feature.title}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/60 p-8 shadow-sm backdrop-blur-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-slate-700/50 dark:bg-slate-800/40 dark:hover:border-indigo-500/50 dark:hover:shadow-[0_20px_40px_-10px_rgba(99,102,241,0.15)]"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-100 dark:from-indigo-500/20"></div>
              
              <div className="relative z-10 mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-500/20 transition-colors duration-300 group-hover:bg-indigo-600 group-hover:text-white dark:bg-slate-800 dark:text-indigo-400 dark:ring-slate-700 dark:group-hover:bg-indigo-500">
                {feature.icon}
              </div>
              <h4 className="relative z-10 text-xl font-bold dark:text-white transition-colors duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{feature.title}</h4>
              <p className="relative z-10 mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-900 py-24 text-white dark:bg-slate-950">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/20 blur-[120px]"></div>
        
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h3 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Elevate your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Campus Experience</span>
          </h3>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            SpaceXplore transforms confusing facility logistics into one modern, seamless platform. See it for yourself.
          </p>
          <div className="mt-10">
            <button
              onClick={() => navigate('/register')}
              className="rounded-2xl bg-white px-8 py-4 text-lg font-bold text-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
            >
              Join the Hub Today
            </button>
          </div>
        </div>
      </section>

      <footer id="contact" className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-colors duration-300">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 text-sm text-slate-500 dark:text-slate-400 sm:px-6 md:flex-row lg:px-8">
          <div className="flex items-center gap-3">
             <img src={logoImage} alt="SpaceXplore logo" className="h-8 w-auto dark:invert opacity-80" />
             <p className="font-bold text-slate-800 dark:text-slate-200">SpaceXplore Operations</p>
          </div>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="transition-colors hover:text-indigo-500 dark:hover:text-indigo-400">Privacy Policy</a>
            <a href="/terms" className="transition-colors hover:text-indigo-500 dark:hover:text-indigo-400">Terms of Service</a>
            <a href="/contact" className="transition-colors hover:text-indigo-500 dark:hover:text-indigo-400">Contact Support</a>
          </div>
          <p className="font-medium">© {new Date().getFullYear()} SpaceXplore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;