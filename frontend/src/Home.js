import React from 'react';
import { useNavigate } from 'react-router-dom';
import libraryImage from './images/lab.png';
import logoImage from './images/logo.png';

const features = [
  {
    title: 'Easy Booking',
    description:
      'Reserve lecture halls, labs, and equipment with a fast and simple workflow.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6">
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M8 2v4M16 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    title: 'Real-time Availability',
    description:
      'See live availability before you request a booking and avoid double allocations.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    title: 'Smart Notifications',
    description:
      'Receive booking and maintenance updates directly from the system notification panel.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6">
        <path d="M18 8a6 6 0 10-12 0v4.2c0 .6-.2 1.1-.6 1.5L4 15h16l-1.4-1.3c-.4-.4-.6-.9-.6-1.5V8z" />
        <path d="M10 18a2 2 0 004 0" />
      </svg>
    ),
  },
  {
    title: 'Maintenance Reporting',
    description:
      'Create and track fault tickets with status updates and assignment visibility.',
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

  const goToResources = () => {
    navigate('/resources');
  };

  const goToLogin = () => {
    navigate('/login');
  };

  const goToRegister = () => {
    navigate('/register');
  };

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
            <li><a href="#home" className="transition-colors hover:text-[#3B82F6]">Home</a></li>
            <li>
              <button
                type="button"
                onClick={goToResources}
                className="transition-colors hover:text-[#3B82F6]"
              >
                Resources
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigate('/bookings')}
                className="transition-colors hover:text-[#3B82F6]"
              >
                Bookings
              </button>
            </li>
            <li><a href="#contact" className="transition-colors hover:text-[#3B82F6]">Contact</a></li>
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={goToLogin}
              className="rounded-lg border border-[#3B82F6] px-3 py-2 text-xs font-semibold text-[#3B82F6] transition hover:bg-blue-50 sm:px-4 sm:text-sm"
            >
              Login
            </button>
            <button
              type="button"
              onClick={goToRegister}
              className="rounded-lg bg-[#3B82F6] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-600 sm:px-4 sm:text-sm"
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      <header id="home" className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1.2fr_1fr] lg:px-8">
        <div>
          <p className="mb-4 inline-flex items-center rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#3B82F6] shadow-sm">
            Smart Campus Operations Hub
          </p>
          <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Explore and Book Your Campus Spaces Easily
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Manage rooms, labs, and equipment with one streamlined platform. Track approvals, submit
            maintenance incidents, and stay updated in real time.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={goToLogin}
              className="rounded-xl bg-[#3B82F6] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-600"
            >
              Get Started
            </button>
            <button
              type="button"
              onClick={goToResources}
              className="rounded-xl border border-[#8B5CF6] px-6 py-3 text-center text-sm font-semibold text-[#8B5CF6] transition duration-200 hover:-translate-y-0.5 hover:bg-[#8B5CF6] hover:text-white"
            >
              View Resources
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-5 -top-6 h-28 w-28 rounded-full bg-blue-200/50 blur-2xl" />
          <div className="absolute -bottom-8 -right-6 h-32 w-32 rounded-full bg-violet-200/50 blur-2xl" />

          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-300/50">
            <img
              src={libraryImage}
              alt="Modern university library"
              className="h-[250px] w-full object-cover sm:h-[300px] lg:h-[360px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B]/70 via-[#1E293B]/15 to-transparent" />
          </div>
        </div>
      </header>

      <section id="resources" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-8 text-center">
          <h3 className="text-3xl font-black">Core Features</h3>
          <p className="mt-2 text-slate-600">Designed for students, staff, and campus operations teams.</p>
          <button
            type="button"
            onClick={goToResources}
            className="mt-4 inline-flex rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            Open Facilities and Assets Catalogue
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex rounded-xl bg-blue-50 p-3 text-[#3B82F6] transition group-hover:bg-[#3B82F6] group-hover:text-white">
                {feature.icon}
              </div>
              <h4 className="text-lg font-bold">{feature.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="bookings" className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
          <h3 className="text-3xl font-black">About SpaceXplore</h3>
          <p className="mx-auto mt-4 max-w-3xl text-slate-600">
            SpaceXplore is a modern campus platform for booking and maintenance workflows. It keeps
            operations transparent with role-based access, approval flows, and reliable notifications.
          </p>
        </div>
      </section>

      <footer id="contact" className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-slate-600 sm:px-6 md:flex-row lg:px-8">
          <p className="font-bold text-[#1E293B]">SpaceXplore</p>
          <div className="flex items-center gap-5">
            <a href="/privacy" className="transition-colors hover:text-[#3B82F6]">Privacy</a>
            <a href="/contact" className="transition-colors hover:text-[#3B82F6]">Contact</a>
          </div>
          <p>Copyright {new Date().getFullYear()} SpaceXplore.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;