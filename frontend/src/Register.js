import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import logoImage from './images/logo.png';
import API_BASE_URL from './apiConfig';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data));
        alert('Registration successful! Please login now.');
        navigate('/login');
      } else {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          setError(errorData.message || 'Registration failed');
        } else {
          setError(`Registration failed (${response.status}). Please try again.`);
        }
      }
    } catch (err) {
      setError('Cannot reach server. Make sure backend is running on port 8086.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#08080c] text-slate-800 dark:text-slate-200 font-sans transition-colors duration-500 selection:bg-indigo-500/30 overflow-hidden">
      
      {/* === LEFT SIDE: Form === */}
      <div className="flex w-full flex-col h-full overflow-y-auto px-6 sm:px-12 lg:px-16 lg:w-1/2 xl:w-[45%] relative z-10 custom-scrollbar">
         
         {/* Simple Navbar overlay */}
         <div className="w-full flex justify-between items-center pt-6 pb-6 shrink-0 sticky top-0 bg-slate-50/90 dark:bg-[#08080c]/90 backdrop-blur-md z-20">
            <Link to="/" className="hover:opacity-80 transition-opacity">
               <img src={logoImage} alt="SpaceXplore" className="h-10 w-auto dark:invert opacity-90" />
            </Link>
            <ThemeToggle />
         </div>

         {/* Form Container */}
         <div className="mx-auto w-full max-w-sm mt-4 mb-12">
            <div className="mb-8">
               <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-indigo-50 border border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest origin-left animate-fade-in-up">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  Unlock Your Campus
               </div>
               <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
                  Create an Profile
               </h2>
               <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Register your account below to access smart environments, labs, and modern learning spaces.
               </p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 text-sm flex items-start gap-3">
                 <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                 <span className="text-red-700 dark:text-red-400 font-semibold">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                 <div className="group">
                    <label htmlFor="firstName" className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">First Name</label>
                    <input
                      type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm outline-none transition-all focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-900 dark:text-white shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium"
                      placeholder="John"
                    />
                 </div>
                 <div className="group">
                    <label htmlFor="lastName" className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Last Name</label>
                    <input
                      type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm outline-none transition-all focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-900 dark:text-white shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium"
                      placeholder="Doe"
                    />
                 </div>
              </div>

              <div className="group">
                <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Email Address</label>
                <div className="relative flex items-center">
                    <svg className="w-5 h-5 absolute left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                    <input
                      type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm outline-none transition-all focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-900 dark:text-white shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium"
                      placeholder="you@example.com"
                    />
                </div>
              </div>

              <div className="group">
                <label htmlFor="role" className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Platform Role</label>
                <div className="relative flex items-center">
                    <svg className="w-5 h-5 absolute left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <select
                      id="role" name="role" value={formData.role} onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm outline-none transition-all focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-900 dark:text-white shadow-sm font-medium appearance-none"
                    >
                      <option value="STUDENT">Enrolled Student</option>
                      <option value="STAFF">Academic Staff</option>
                      <option value="ADMIN">System Administrator</option>
                    </select>
                </div>
              </div>

              <div className="group">
                <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Password</label>
                <div className="relative flex items-center">
                    <svg className="w-5 h-5 absolute left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    <input
                      type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange}
                      className="w-full pl-12 pr-12 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm outline-none transition-all focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-900 dark:text-white shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium tracking-widest"
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

              <div className="group">
                <label htmlFor="confirmPassword" className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Confirm Password</label>
                <div className="relative flex items-center">
                    <svg className="w-5 h-5 absolute left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                      className="w-full pl-12 pr-12 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm outline-none transition-all focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-900 dark:text-white shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium tracking-widest"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-4 text-slate-400 hover:text-indigo-500 transition-colors"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? (
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
                        Processing...
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        Create Account
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </span>
                )}
              </button>
            </form>

            <div className="mt-10 text-center text-sm font-medium text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-6">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors">
                Sign in here
              </Link>
            </div>
         </div>
      </div>

      {/* === RIGHT SIDE: Premium Splash Visuals === */}
      <div className="hidden lg:block lg:w-1/2 xl:w-[55%] relative overflow-hidden bg-[#030305] p-3">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-transparent to-indigo-800/40 mix-blend-screen z-10 pointer-events-none"></div>
          <div className="relative w-full h-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl z-20">
             
             {/* Decorative Ambient Blobs behind image inside container */}
             <div className="absolute -bottom-[20%] -left-[20%] w-[70%] h-[70%] rounded-full bg-purple-500/20 blur-[120px] z-0 pointer-events-none"></div>
             
             {/* Image gradient overlay */}
             <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-[#08080c]/40 to-transparent z-10 pointer-events-none"></div>
             
             <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[20s] ease-out opacity-70" alt="High Tech Learning" />
             
             {/* Overlay Content */}
             <div className="absolute bottom-16 left-16 right-16 z-20">
                 <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest">
                     <span className="text-emerald-400 mr-1">●</span> Always Online
                 </div>
                 <h3 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-4">
                    Your Central Intelligence <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">Hub.</span>
                 </h3>
                 <p className="text-slate-300 font-medium text-lg max-w-xl">
                    Whether you are an administrator assigning lecture halls or a student reserving study spaces, everything happens seamlessly right here natively.
                 </p>
                 
                 <div className="flex gap-6 mt-10">
                    <div className="flex flex-col gap-1">
                       <h4 className="text-2xl font-black text-white">10k+</h4>
                       <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Students</span>
                    </div>
                    <div className="h-10 w-px bg-white/20"></div>
                    <div className="flex flex-col gap-1">
                       <h4 className="text-2xl font-black text-white">450+</h4>
                       <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Assets</span>
                    </div>
                    <div className="h-10 w-px bg-white/20"></div>
                    <div className="flex flex-col gap-1">
                       <h4 className="text-2xl font-black text-white">99.9%</h4>
                       <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Uptime</span>
                    </div>
                 </div>
             </div>
          </div>
      </div>

    </div>
  );
}

export default Register;
