import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import logoImage from './images/logo.png';

const resourcesSeed = [
  {
    resourceName: 'Study Room A1',
    type: 'ROOM',
    capacity: 8,
    location: 'Main Library - Floor 1',
    status: 'ACTIVE',
    availabilityWindow: '08:00 - 20:00',
  },
  {
    resourceName: 'Study Room B2',
    type: 'ROOM',
    capacity: 6,
    location: 'Main Library - Floor 2',
    status: 'ACTIVE',
    availabilityWindow: '09:00 - 19:00',
  },
  {
    resourceName: 'Smart Lab L3',
    type: 'LAB',
    capacity: 30,
    location: 'Computing Block - Level 3',
    status: 'ACTIVE',
    availabilityWindow: '08:30 - 17:30',
  },
  {
    resourceName: 'Smart Lab L4',
    type: 'LAB',
    capacity: 25,
    location: 'Computing Block - Level 4',
    status: 'OUT_OF_SERVICE',
    availabilityWindow: '08:30 - 17:30',
  },
  {
    resourceName: 'Classroom C101',
    type: 'CLASSROOM',
    capacity: 60,
    location: 'Engineering Building - Floor 1',
    status: 'ACTIVE',
    availabilityWindow: '07:30 - 18:30',
  },
  {
    resourceName: 'Classroom C204',
    type: 'CLASSROOM',
    capacity: 45,
    location: 'Engineering Building - Floor 2',
    status: 'ACTIVE',
    availabilityWindow: '07:30 - 18:30',
  },
  {
    resourceName: 'Projector Kit P12',
    type: 'ROOM',
    capacity: 1,
    location: 'AV Center',
    status: 'ACTIVE',
    availabilityWindow: '08:00 - 17:00',
  },
  {
    resourceName: 'Camera Kit CAM-05',
    type: 'LAB',
    capacity: 1,
    location: 'Media Unit',
    status: 'ACTIVE',
    availabilityWindow: '09:00 - 16:00',
  },
];

function ResourceCataloguePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [minCapacity, setMinCapacity] = useState('');

  const uniqueLocations = useMemo(() => {
    return Array.from(new Set(resourcesSeed.map((item) => item.location)));
  }, []);

  const filteredResources = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return resourcesSeed.filter((resource) => {
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
  }, [searchTerm, typeFilter, statusFilter, locationFilter, minCapacity]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B]">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[260px] bg-gradient-to-b from-blue-100/80 via-indigo-50/70 to-transparent" />

      <nav className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <img src={logoImage} alt="SpaceXplore logo" className="h-14 w-auto" />
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="rounded-lg border border-[#3B82F6] px-4 py-2 text-sm font-semibold text-[#3B82F6] transition hover:bg-blue-50"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#3B82F6]">
             Facilities and Assets Catalogue
          </p>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl">Resource Management</h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            Manage all bookable resources with required metadata: resource name, type, capacity,
            location, availability windows, and status. Use search and filters to quickly find suitable
            resources.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold">Search and Filters</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name or location"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#3B82F6]"
            />

            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#3B82F6]"
            >
              <option value="ALL">All Types</option>
              <option value="ROOM">ROOM</option>
              <option value="LAB">LAB</option>
              <option value="CLASSROOM">CLASSROOM</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#3B82F6]"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
            </select>

            <select
              value={locationFilter}
              onChange={(event) => setLocationFilter(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#3B82F6]"
            >
              <option value="ALL">All Locations</option>
              {uniqueLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="0"
              value={minCapacity}
              onChange={(event) => setMinCapacity(event.target.value)}
              placeholder="Minimum capacity"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#3B82F6]"
            />
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Catalogue Results</h2>
            <p className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
              {filteredResources.length} Resources
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredResources.map((resource) => (
              <article
                key={resource.resourceName}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold">{resource.resourceName}</h3>
                  <span
                    className={
                      resource.status === 'ACTIVE'
                        ? 'rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700'
                        : 'rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700'
                    }
                  >
                    {resource.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Type</p>
                    <p className="font-semibold">{resource.type}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Capacity</p>
                    <p className="font-semibold">{resource.capacity}</p>
                  </div>
                  <div className="col-span-2 rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Location</p>
                    <p className="font-semibold">{resource.location}</p>
                  </div>
                  <div className="col-span-2 rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Availability Window</p>
                    <p className="font-semibold">{resource.availabilityWindow}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
              No resources found. Try broadening your filters.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default ResourceCataloguePage;
