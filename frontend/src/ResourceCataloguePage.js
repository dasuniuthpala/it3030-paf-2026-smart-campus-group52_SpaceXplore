import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import logoImage from './images/logo.png';
import API_BASE_URL from './apiConfig';

function ResourceCataloguePage() {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [minCapacity, setMinCapacity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: 1
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Fetch resources from the backend API
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/resources`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        setResources(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching resources:', err);
        setError('Failed to load resources. Please ensure the backend server is running.');
        setLoading(false);
      });
  }, []);

  // Booking functions
  const openBookingModal = (resource) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Please log in to book a resource.');
      return;
    }
    setSelectedResource(resource);
    setShowBookingModal(true);
    setBookingError('');
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedResource(null);
    setBookingForm({
      date: '',
      startTime: '',
      endTime: '',
      purpose: '',
      attendees: 1
    });
  };

  const handleBookingFormChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError('');

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setBookingError('User not logged in');
      setBookingLoading(false);
      return;
    }

    // Validation
    const start = new Date(`2000-01-01T${bookingForm.startTime}`);
    const end = new Date(`2000-01-01T${bookingForm.endTime}`);
    if (end <= start) {
      setBookingError('End time must be after start time');
      setBookingLoading(false);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (bookingForm.date < today) {
      setBookingError('Booking date cannot be in the past');
      setBookingLoading(false);
      return;
    }

    if (parseInt(bookingForm.attendees) < 1) {
      setBookingError('At least 1 attendee is required');
      setBookingLoading(false);
      return;
    }

    if (parseInt(bookingForm.attendees) > selectedResource.capacity) {
      setBookingError(`Maximum capacity for this resource is ${selectedResource.capacity}`);
      setBookingLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id.toString(),
          'X-User-Email': user.email,
          'X-User-Role': user.role || 'USER'
        },
        body: JSON.stringify({
          resourceName: selectedResource.resourceName,
          date: bookingForm.date,
          startTime: bookingForm.startTime,
          endTime: bookingForm.endTime,
          purpose: bookingForm.purpose,
          attendees: parseInt(bookingForm.attendees)
        })
      });

      if (response.ok) {
        alert('Booking request submitted successfully!');
        closeBookingModal();
      } else {
        const errorData = await response.json();
        setBookingError(errorData.message || 'Failed to create booking');
      }
    } catch (err) {
      setBookingError('An error occurred. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setBookingLoading(false);
    }
  };

  const uniqueLocations = useMemo(() => {
    return Array.from(new Set(resources.map((item) => item.location)));
  }, [resources]);

  const filteredResources = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        resource.resourceName.toLowerCase().includes(normalizedSearch) ||
        resource.location.toLowerCase().includes(normalizedSearch);

      const matchesType = typeFilter === 'ALL' || resource.type === typeFilter;
      const matchesStatus = statusFilter === 'ALL' || resource.status === statusFilter;
      const matchesLocation = locationFilter === 'ALL' || resource.location === locationFilter;

      const minCap = Number(minCapacity);
      const matchesCapacity = Number.isNaN(minCap) || minCapacity === '' || resource.capacity >= minCap;

      return matchesSearch && matchesType && matchesStatus && matchesLocation && matchesCapacity;
    });
  }, [searchTerm, typeFilter, statusFilter, locationFilter, minCapacity, resources]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans selection:bg-indigo-500/30 transition-colors duration-500">
      {/* Decorative ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 flex justify-center">
        <div className="absolute top-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] h-[400px] w-[400px] rounded-full bg-purple-600/20 blur-[100px]" />
      </div>

      <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 py-4 backdrop-blur-xl transition-colors">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <img src={logoImage} alt="SpaceXplore logo" className="h-12 w-auto dark:invert drop-shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform duration-300" />
          <div className="flex items-center gap-3">
            <ThemeToggle />

          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
        {/* Header Section */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800/60 bg-white/40 dark:bg-slate-800/40 p-8 shadow-[0_5px_30px_rgba(0,0,0,0.05)] dark:shadow-2xl backdrop-blur-md sm:p-12 mb-10 transition-colors">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-[80px]"></div>
          
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
              </span>
              Facilities & Assets
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl animate-fade-in-up">
              Resource <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400">Catalogue</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl">
              Discover and book world-class smart classrooms, libraries, and tech-equipped spaces designed to elevate your collaborative experiences across the campus.
            </p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="sticky top-24 z-40 mb-10 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 p-5 shadow-xl backdrop-blur-xl transition-all hover:border-slate-300 dark:hover:border-slate-600/50">
          <div className="flex items-center gap-2 mb-5 px-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Refine Search</h2>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="relative group">
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name or location"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 shadow-inner outline-none transition-all focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500 group-hover:border-slate-300 dark:group-hover:border-slate-500"
              />
            </div>

            <div className="relative group">
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 shadow-inner outline-none transition-all focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500 group-hover:border-slate-300 dark:group-hover:border-slate-500"
              >
                <option value="ALL">All Types</option>
                <option value="ROOM">Room</option>
                <option value="LAB">Smart Lab</option>
                <option value="CLASSROOM">Classroom</option>
                <option value="EQUIPMENT">Equipment</option>
              </select>
            </div>

            <div className="relative group">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 shadow-inner outline-none transition-all focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500 group-hover:border-slate-300 dark:group-hover:border-slate-500"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active / Available</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
              </select>
            </div>

            <div className="relative group">
              <select
                value={locationFilter}
                onChange={(event) => setLocationFilter(event.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 shadow-inner outline-none transition-all focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500 group-hover:border-slate-300 dark:group-hover:border-slate-500"
              >
                <option value="ALL">All Locations</option>
                {uniqueLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative group">
              <input
                type="number"
                min="0"
                value={minCapacity}
                onChange={(event) => setMinCapacity(event.target.value)}
                placeholder="Min capacity (e.g. 20)"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 shadow-inner outline-none transition-all focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500 group-hover:border-slate-300 dark:group-hover:border-slate-500"
              />
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section>
          {loading && (
            <div className="flex h-64 flex-col items-center justify-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500"></div>
              <p className="text-slate-400 font-medium">Synchronizing facilities...</p>
            </div>
          )}

          {error && (
             <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="text-red-300 font-semibold">{error}</div>
             </div>
          )}

          {!loading && !error && (
            <>
              <div className="mb-6 flex items-center justify-between px-2">
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">Available Spaces</h3>
                <span className="flex items-center gap-2 rounded-full bg-slate-800 px-4 py-1.5 text-sm font-semibold text-slate-300 ring-1 ring-inset ring-slate-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                  {filteredResources.length} Results
                </span>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredResources.map((resource) => (
                  <article
                    key={resource.id}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/40 shadow-sm dark:shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1),0_0_15px_rgba(99,102,241,0.2)] dark:hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.5),0_0_15px_rgba(99,102,241,0.2)] hover:border-indigo-500/50"
                  >
                    {/* Image Area */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                      {resource.imageUrl ? (
                        <img 
                          src={resource.imageUrl} 
                          alt={resource.resourceName} 
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-indigo-900/20">
                          <span className="text-slate-600">No Image Preview</span>
                        </div>
                      )}
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                      
                      {/* Status Badge inside image */}
                      <div className="absolute top-4 right-4">
                         <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold backdrop-blur-md ${
                            resource.status === 'ACTIVE'
                              ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                              : 'bg-red-500/20 text-red-300 ring-1 ring-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${resource.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                          {resource.status}
                        </span>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-2">
                         <p className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">{resource.type}</p>
                         <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">{resource.resourceName}</h3>
                      </div>
                      
                      <div className="mt-auto grid flex-1 grid-cols-2 gap-4 border-t border-slate-700/50 pt-4 mt-4">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Capacity</p>
                          <p className="mt-1 flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {resource.capacity} People
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Timings</p>
                          <p className="mt-1 flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {resource.availabilityWindow}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Location</p>
                          <p className="mt-1 flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 min-w-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{resource.location}</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-5 pt-4 border-t border-slate-700/50">
                       <button 
                           disabled={resource.status !== 'ACTIVE'}
                           onClick={() => resource.status === 'ACTIVE' && openBookingModal(resource)}
                           className={`w-full rounded-xl py-3 px-4 text-sm font-bold shadow-lg transition-all 
                           ${resource.status === 'ACTIVE' 
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/25' 
                              : 'bg-slate-100 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500 cursor-not-allowed'}`}
                        >
                          {resource.status === 'ACTIVE' ? 'Book this Space' : 'Unavailable'}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {filteredResources.length === 0 && (
                <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-800/20 mt-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-xl font-bold text-slate-400">No resources matched your criteria</p>
                  <p className="text-slate-500 mt-2">Adjust your filters to find suitable spaces.</p>
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setTypeFilter('ALL');
                      setStatusFilter('ALL');
                      setLocationFilter('ALL');
                      setMinCapacity('');
                    }}
                    className="mt-6 text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-4"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Book {selectedResource?.resourceName}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Fill in the details for your booking request</p>
            </div>

            <form onSubmit={submitBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={bookingForm.date}
                  onChange={handleBookingFormChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={bookingForm.startTime}
                    onChange={handleBookingFormChange}
                    required
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={bookingForm.endTime}
                    onChange={handleBookingFormChange}
                    required
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Purpose</label>
                <input
                  type="text"
                  name="purpose"
                  value={bookingForm.purpose}
                  onChange={handleBookingFormChange}
                  required
                  placeholder="e.g., Team meeting, Workshop"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Expected Attendees</label>
                <input
                  type="number"
                  name="attendees"
                  value={bookingForm.attendees}
                  onChange={handleBookingFormChange}
                  required
                  min="1"
                  max={selectedResource?.capacity || 100}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {bookingError && (
                <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400">
                  {bookingError}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="flex-1 rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bookingLoading ? 'Submitting...' : 'Submit Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResourceCataloguePage;
