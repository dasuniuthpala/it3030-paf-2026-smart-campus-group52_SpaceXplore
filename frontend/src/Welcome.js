import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from './images/logo.png';

function Welcome() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    
    try {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    } catch (err) {
      console.error('Error parsing user data:', err);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const goToResources = () => {
    navigate('/resources');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B82F6]" />
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B]">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[320px] bg-gradient-to-b from-blue-100/80 via-indigo-50/70 to-transparent" />

      <nav className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <img
            src={logoImage}
            alt="SpaceXplore logo"
            className="h-20 w-auto sm:h-21"
          />

          <ul className="hidden items-center gap-8 text-sm font-semibold md:flex">
            <li><a href="#dashboard" className="transition-colors hover:text-[#3B82F6]">Dashboard</a></li>
            <li>
              <button
                type="button"
                onClick={goToResources}
                className="transition-colors hover:text-[#3B82F6]"
              >
                Book Resources
              </button>
            </li>
            <li><a href="#my-bookings" className="transition-colors hover:text-[#3B82F6]">My Bookings</a></li>
            <li>
              <button
                type="button"
                onClick={() => navigate('/bookings')}
                className="transition-colors hover:text-[#3B82F6]"
              >
                Booking Center
              </button>
            </li>
          </ul>

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-600">
              {user?.firstName} {user?.lastName}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Welcome Card */}
          <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:col-span-2">
            <h1 className="text-4xl font-black mb-2">
              Welcome, {user?.firstName}!
            </h1>
            <p className="text-slate-600 mb-6">
              You're now logged into SpaceXplore. Here you can manage your bookings, view available resources, and track your activities.
            </p>
            <button
              type="button"
              onClick={goToResources}
              className="rounded-lg bg-[#3B82F6] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Browse and Book Resources
            </button>
          </div>

          {/* Quick Stats Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-slate-600">Active Bookings</span>
                <span className="text-2xl font-bold text-[#3B82F6]">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Total Bookings</span>
                <span className="text-2xl font-bold text-[#3B82F6]">0</span>
              </div>
            </div>
          </div>

          {/* My Bookings Empty State */}
          <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black mb-4">My Bookings</h2>
            <div className="text-center py-12">
              <div className="mb-4 inline-flex rounded-full bg-blue-50 p-3">
                <svg
                  className="h-8 w-8 text-[#3B82F6]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold mb-2">No bookings yet</h3>
              <p className="text-slate-600 mb-6">
                You haven't made any bookings yet. Start by browsing and booking your first resource.
              </p>
              <button
                type="button"
                onClick={goToResources}
                className="inline-flex rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                View Resources
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black mb-6">Quick Actions</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <button
                type="button"
                onClick={goToResources}
                className="group rounded-lg border border-slate-200 p-4 transition hover:border-[#3B82F6] hover:bg-blue-50"
              >
                <div className="mb-2 inline-flex rounded-lg bg-blue-50 p-2 text-[#3B82F6] group-hover:bg-[#3B82F6] group-hover:text-white">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m0 0h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold">New Booking</h4>
                <p className="text-xs text-slate-600">Book a resource</p>
              </button>

              <button
                type="button"
                className="group rounded-lg border border-slate-200 p-4 transition hover:border-[#3B82F6] hover:bg-blue-50"
              >
                <div className="mb-2 inline-flex rounded-lg bg-blue-50 p-2 text-[#3B82F6] group-hover:bg-[#3B82F6] group-hover:text-white">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold">My Approvals</h4>
                <p className="text-xs text-slate-600">Pending approvals</p>
              </button>

              <button
                type="button"
                className="group rounded-lg border border-slate-200 p-4 transition hover:border-[#3B82F6] hover:bg-blue-50"
              >
                <div className="mb-2 inline-flex rounded-lg bg-blue-50 p-2 text-[#3B82F6] group-hover:bg-[#3B82F6] group-hover:text-white">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 2m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold">Maintenance</h4>
                <p className="text-xs text-slate-600">Report issues</p>
              </button>

              <button
                type="button"
                className="group rounded-lg border border-slate-200 p-4 transition hover:border-[#3B82F6] hover:bg-blue-50"
              >
                <div className="mb-2 inline-flex rounded-lg bg-blue-50 p-2 text-[#3B82F6] group-hover:bg-[#3B82F6] group-hover:text-white">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.283 2.323-1.283 2.748 0l.584 1.752c.123.37.388.643.763.743l1.815.39c1.283.274 1.781 1.874.886 2.888l-1.414 1.414c-.263.263-.37.675-.246 1.035l.384 1.823c.276 1.281-1.243 2.28-2.411 1.583l-1.738-.945c-.36-.194-.81-.194-1.17 0l-1.738.945c-1.168.697-2.687-.302-2.411-1.583l.384-1.823c.124-.36.017-.772-.246-1.035l-1.414-1.414c-.895-1.014-.397-2.614.886-2.888l1.815-.39c.375-.1.64-.373.763-.743l.584-1.752z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold">Notifications</h4>
                <p className="text-xs text-slate-600">View updates</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
