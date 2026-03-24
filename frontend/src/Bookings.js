import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from './images/logo.png';

function Bookings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    resourceName: 'Study Room A1',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: 1,
  });

  const resourceOptions = [
    'Study Room A1',
    'Study Room B2',
    'Smart Lab L3',
    'Smart Lab L4',
    'Classroom C101',
    'Classroom C204',
    'Projector Kit P12',
    'Camera Kit CAM-05',
  ];
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      navigate('/login');
      return;
    }
    const parsed = JSON.parse(stored);
    setUser(parsed);
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    fetchBookings();
  }, [user]);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'X-User-Id': user?.id?.toString() || '',
    'X-User-Role': user?.role || 'USER',
    'X-User-Email': user?.email || '',
  });

  const fetchBookings = async () => {
    try {
      const endpoint = user?.role === 'ADMIN' ? 'http://localhost:8080/api/bookings' : 'http://localhost:8080/api/bookings/my';
      const response = await fetch(endpoint, { headers: getHeaders() });
      if (!response.ok) {
        throw new Error('Could not load bookings');
      }
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings');
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const createBooking = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!form.resourceName || !form.date || !form.startTime || !form.endTime || !form.purpose) {
      setError('All fields are required');
      return;
    }

    if (form.startTime >= form.endTime) {
      setError('End time must be after start time');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          resourceName: form.resourceName,
          date: form.date,
          startTime: form.startTime,
          endTime: form.endTime,
          purpose: form.purpose,
          attendees: Number(form.attendees),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Booking creation failed');
      }

      setForm({ resourceName: '', date: '', startTime: '', endTime: '', purpose: '', attendees: 1 });
      setMessage('Booking request submitted - pending approval');
      fetchBookings();
    } catch (err) {
      setError(err.message || 'Failed to request booking.');
    }
  };

  const actionBooking = async (id, actionType) => {
    setError('');
    setMessage('');
    try {
      let url = `http://localhost:8080/api/bookings/${id}/${actionType}`;
      const body = actionType === 'cancel' ? null : JSON.stringify({ reason: actionType === 'approve' ? 'Auto-approved' : 'Rejected by admin' });

      const method = 'PUT';
      const options = { method, headers: getHeaders() };
      if (body) options.body = body;

      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${actionType}`);
      }

      setMessage(`Booking ${actionType}d`);
      fetchBookings();
    } catch (err) {
      setError(err.message || 'Action failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B]">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[260px] bg-gradient-to-b from-blue-100/80 via-indigo-50/70 to-transparent" />

      <nav className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <img src={logoImage} alt="SpaceXplore logo" className="h-20 w-auto sm:h-24" />
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg border border-[#3B82F6] px-4 py-2 text-sm font-semibold text-[#3B82F6] transition hover:bg-blue-50"
              onClick={() => navigate('/welcome')}
            >
              Back
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black mb-5">Booking Management</h1>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Request Booking</h2>

            {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
            {message && <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}

            <form className="space-y-3" onSubmit={createBooking}>
              <label className="text-sm font-semibold">Resource</label>
              <select
                name="resourceName"
                value={form.resourceName}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                {resourceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <input name="date" type="date" value={form.date} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              <div className="grid gap-3 sm:grid-cols-2">
                <input name="startTime" type="time" value={form.startTime} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                <input name="endTime" type="time" value={form.endTime} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              </div>
              <textarea name="purpose" value={form.purpose} onChange={handleChange} rows="3" placeholder="Purpose" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              <input name="attendees" type="number" min="1" value={form.attendees} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              <button type="submit" className="rounded-lg bg-[#3B82F6] px-5 py-2 text-sm font-semibold text-white hover:bg-blue-600">Send Request</button>
            </form>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">My {user?.role === 'ADMIN' ? 'All' : 'My'} Bookings</h2>

            {bookings.length === 0 && <p className="text-slate-500">No bookings yet.</p>}

            <div className="space-y-3">
              {bookings.map((b) => (
                <div key={b.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="font-bold">{b.resourceName} &ndash; {b.date} ({b.startTime} - {b.endTime})</p>
                  <p className="text-sm text-slate-600">{b.purpose}</p>
                  <p className="text-xs text-slate-500">Attendees: {b.attendees} | Status: {b.status}</p>
                  {b.decisionReason && <p className="text-xs text-slate-500">Reason: {b.decisionReason}</p>}

                  {user?.role === 'ADMIN' && b.status === 'PENDING' && (
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => actionBooking(b.id, 'approve')} className="rounded-md bg-emerald-600 px-3 py-1 text-xs text-white">Approve</button>
                      <button onClick={() => actionBooking(b.id, 'reject')} className="rounded-md bg-rose-600 px-3 py-1 text-xs text-white">Reject</button>
                    </div>
                  )}

                  {(user?.role !== 'ADMIN' && b.status === 'APPROVED') && (
                    <button onClick={() => actionBooking(b.id, 'cancel')} className="mt-2 rounded-md bg-orange-500 px-3 py-1 text-xs text-white">Cancel</button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Bookings;
