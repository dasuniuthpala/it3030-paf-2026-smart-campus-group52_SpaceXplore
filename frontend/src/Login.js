import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import ThemeToggle from './ThemeToggle';
import logoImage from './images/logo.png';
import heroImage from './images/hero_smart_campus.png';
import API_BASE_URL from './apiConfig';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoogleLogin = () => {
    // Redirect to backend OAuth2 initiation endpoint
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        login(data);
        // Role-based redirect: admins → /admin, regular users → /dashboard
        const adminRoles = ['ADMIN', 'SUPER_ADMIN'];
        if (adminRoles.includes(data.role)) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          setError(errorData.message || 'Login failed. Please check your credentials.');
        } else {
          setError(`Login failed (${response.status}). Please try again.`);
        }
      }
    } catch (err) {
      setError('Cannot reach server. Make sure backend is running on port 8086.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#08080c] text-slate-800 dark:text-slate-200 font-sans transition-colors duration-500 selection:bg-indigo-500/30">

      {/* === LEFT SIDE: Form === */}
      <div className="flex w-full flex-col justify-center px-6 sm:px-12 lg:px-16 lg:w-1/2 xl:w-[45%] relative z-10">

        {/* Simple Navbar overlay */}
        <div className="absolute top-0 left-0 w-full px-8 py-6 flex justify-between items-center">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img src={logoImage} alt="SpaceXplore" className="h-10 w-auto dark:invert opacity-90" />
          </Link>
          <ThemeToggle />
        </div>

        {/* Form Container */}
        <div className="mx-auto w-full max-w-sm mt-12">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-indigo-50 border border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest origin-left animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Welcome Back
            </div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Sign in to <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">SpaceXplore</span>
            </h2>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
              Enter your credentials below to access the campus hub and manage your schedule.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 text-sm flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span className="text-red-700 dark:text-red-400 font-semibold">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="group">
              <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
                Email Address
              </label>
              <div className="relative flex items-center">
                <svg className="w-5 h-5 absolute left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm outline-none transition-all focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-900 dark:text-white shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Password
                </label>
                <button type="button" className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">Forgot your password?</button>
              </div>
              <div className="relative flex items-center">
                <svg className="w-5 h-5 absolute left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm outline-none transition-all focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-900 dark:text-white shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium tracking-widest"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 text-slate-400 hover:text-indigo-500 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3l18 18M10.585 10.587A2 2 0 0013.414 13.415M9.879 5.093A9.77 9.77 0 0112 4.875c4.478 0 8.268 2.943 9.542 7-1.104 3.508-4.115 6.154-7.846 6.847M6.228 6.228C4.405 7.463 3.028 9.302 2.458 11.875a9.964 9.964 0 002.365 3.935" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.522 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7s-8.268-2.943-9.542-7z" />
                      <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-2xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white transition-all hover:bg-indigo-500 disabled:opacity-50 mt-8 shadow-[0_5px_15px_-3px_rgba(79,70,229,0.4)]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign in to account
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </span>
              )}
            </button>
            <button 
              type="button"
              onClick={handleGoogleLogin} 
              className="flex w-full justify-center items-center gap-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
          </form>

          <div className="mt-10 text-center text-sm font-medium text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-6">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors">
              Register here
            </Link>
          </div>
        </div>
      </div>

      {/* === RIGHT SIDE: Premium Splash Visuals === */}
      <div className="hidden lg:block lg:w-1/2 xl:w-[55%] relative overflow-hidden bg-[#030305] p-3">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-transparent to-purple-800/40 mix-blend-screen z-10 pointer-events-none"></div>
        <div className="relative w-full h-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl z-20">

          {/* Decorative Ambient Blobs behind image inside container */}
          <div className="absolute -top-[20%] -right-[20%] w-[70%] h-[70%] rounded-full bg-indigo-500/20 blur-[100px] z-0 pointer-events-none"></div>

          {/* Image gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080c]/95 via-[#08080c]/30 to-transparent z-10 pointer-events-none"></div>

          <img src={heroImage} className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[20s] ease-out opacity-80" alt="Smart Campus Technology" />

          {/* Overlay Content */}
          <div className="absolute bottom-16 left-16 right-16 z-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest">
              Next Generation Facilities
            </div>
            <h3 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-4">
              Empowering the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Collaboration.</span>
            </h3>
            <p className="text-slate-300 font-medium text-lg max-w-xl">
              Join over 10,000 students and faculty who streamline their academic resources through our intelligent infrastructure platform.
            </p>

            {/* Decorative avatars/social proof */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-4">
                <img className="w-10 h-10 rounded-full border-2 border-[#08080c]" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-[#08080c]" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-[#08080c]" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64" alt="User" />
                <div className="w-10 h-10 rounded-full border-2 border-[#08080c] bg-indigo-600 flex items-center justify-center text-xs font-bold text-white z-10">4.9+</div>
              </div>
              <p className="text-sm font-bold text-indigo-300">Rated Excellent by Students</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Login;
