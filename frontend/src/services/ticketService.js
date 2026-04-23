import axios from 'axios';

const API_BASE_URL = 'http://localhost:8086/api';

axios.defaults.withCredentials = true;

const getAuthHeaders = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        return {
            'X-User-Email': user.email || '',
            'X-User-Name': name || 'Unknown User',
            'X-User-Role': user.role || 'USER',
        };
    } catch {
        return {};
    }
};

const ticketService = {
    createTicket: async (formData) => {
        const response = await axios.post(`${API_BASE_URL}/tickets`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...getAuthHeaders(),
            },
        });
        return response.data;
    },

    getAllTickets: async () => {
        const response = await axios.get(`${API_BASE_URL}/tickets`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    },

    getMyTickets: async () => {
        const response = await axios.get(`${API_BASE_URL}/tickets/my`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    },

    getTicketById: async (id) => {
        const response = await axios.get(`${API_BASE_URL}/tickets/${id}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    },

    getTicketsByStatus: async (status) => {
        const response = await axios.get(`${API_BASE_URL}/tickets/status/${status}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    },

    // Returns tickets assigned to current technician + all OPEN unassigned tickets
    getTicketsAssignedToMe: async () => {
        const response = await axios.get(`${API_BASE_URL}/tickets/assigned-to-me`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    },

    // Dashboard stats: { totalAssigned, openCount, inProgressCount, resolvedCount, closedCount }
    getDashboardStats: async () => {
        const response = await axios.get(`${API_BASE_URL}/tickets/technician/dashboard`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    },

    updateStatus: async (id, status, reason = null) => {
        const response = await axios.put(`${API_BASE_URL}/tickets/${id}/status`, {
            status,
            reason,
        }, {
            headers: getAuthHeaders(),
        });
        return response.data;
    },

    // Accept a ticket: assign to current technician (auto sets status to IN_PROGRESS)
    acceptTicket: async (id) => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown Technician';
            const response = await axios.put(`${API_BASE_URL}/tickets/${id}/assign`, {
                technicianName: name,
            }, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    assignTechnician: async (id, technicianName) => {
        const response = await axios.put(`${API_BASE_URL}/tickets/${id}/assign`, {
            technicianName,
        }, {
            headers: getAuthHeaders(),
        });
        return response.data;
    },

    addResolutionNotes: async (id, notes) => {
        const response = await axios.put(`${API_BASE_URL}/tickets/${id}/resolution`, {
            notes,
        }, {
            headers: getAuthHeaders(),
        });
        return response.data;
    },

    addComment: async (ticketId, content, authorRole) => {
        const response = await axios.post(`${API_BASE_URL}/tickets/${ticketId}/comments`, {
            content,
            authorRole,
        }, {
            headers: getAuthHeaders(),
        });
        return response.data;
    },

    getComments: async (ticketId) => {
        const response = await axios.get(`${API_BASE_URL}/tickets/${ticketId}/comments`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    },

    editComment: async (commentId, content) => {
        const response = await axios.put(`${API_BASE_URL}/tickets/comments/${commentId}`, {
            content,
        }, {
            headers: getAuthHeaders(),
        });
        return response.data;
    },

    deleteComment: async (commentId) => {
        const response = await axios.delete(`${API_BASE_URL}/tickets/comments/${commentId}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    },
};

export default ticketService;
