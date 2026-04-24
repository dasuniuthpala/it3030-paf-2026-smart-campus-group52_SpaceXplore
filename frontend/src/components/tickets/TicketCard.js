import React from 'react';

const priorityColors = {
    LOW: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    URGENT: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
};

const statusColors = {
    OPEN: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    IN_PROGRESS: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    RESOLVED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    CLOSED: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
    REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
};

const TicketCard = ({ ticket, onClick }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div 
            onClick={() => onClick(ticket.id)}
            className="bg-white dark:bg-slate-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-200 dark:border-slate-800 overflow-hidden group hover:scale-[1.02]"
        >
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-lg line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {ticket.title}
                    </h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[ticket.priority] || priorityColors.MEDIUM}`}>
                        {ticket.priority}
                    </span>
                </div>
                
                <div className="space-y-2 mb-3">
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {ticket.resourceLocation}
                    </div>
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                        </svg>
                        {ticket.category}
                    </div>
                </div>
                
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4">
                    {ticket.description}
                </p>
                
                <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[ticket.status] || statusColors.OPEN}`}>
                        {ticket.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                        {formatDate(ticket.createdAt)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TicketCard;