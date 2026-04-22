import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import API_BASE_URL from './apiConfig';

function OAuth2Callback() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          login(data);
          
          // Role-based redirect
          const adminRoles = ['ADMIN', 'SUPER_ADMIN'];
          if (adminRoles.includes(data.role)) {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        } else {
          setError('Failed to fetch user session from Google login.');
        }
      } catch (err) {
        console.error('OAuth2 callback error:', err);
        setError('An unexpected error occurred during Google login.');
      }
    };

    fetchUser();
  }, [login, navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-[#08080c] p-4 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-2">Login Error</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
        <button 
          onClick={() => navigate('/login')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-[#08080c] text-indigo-600 font-bold">
      <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"></div>
      <p>Finalizing your SpaceXplore session...</p>
    </div>
  );
}

export default OAuth2Callback;
