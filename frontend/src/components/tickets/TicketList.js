import React, { useState, useEffect } from 'react';
import TicketCard from './TicketCard';
import ticketService from '../../services/ticketService';

const TicketList = ({ userRole, onSelectTicket }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [error, setError] = useState('');

    const filters = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];

    useEffect(() => {
        fetchTickets();
    }, [userRole]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            let data;
            if (userRole === 'ADMIN') {
                data = await ticketService.getAllTickets();
            } else if (userRole === 'TECHNICIAN') {
                data = await ticketService.getTicketsAssignedToMe();
            } else {
                data = await ticketService.getMyTickets();
            }
            setTickets(data);
        } catch (err) {
            setError('Failed to load tickets');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filterTickets = () => {
        if (activeFilter === 'ALL') return tickets;
        return tickets.filter(ticket => ticket.status === activeFilter);
    };

    const filteredTickets = filterTickets();

    if (loading) return (
        <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );
    
    if (error) return (
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 m-4 rounded-r-lg">
            <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Incident Tickets</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Track and manage all incident reports</p>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
                {filters.map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            activeFilter === filter
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                    >
                        {filter.replace('_', ' ')}
                    </button>
                ))}
            </div>
            
            {/* Ticket Grid */}
            {filteredTickets.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                    <svg className="w-16 h-16 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-slate-500 dark:text-slate-400">No tickets found</p>
                    <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Create a new ticket to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredTickets.map(ticket => (
                        <TicketCard 
                            key={ticket.id} 
                            ticket={ticket} 
                            onClick={onSelectTicket}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TicketList;