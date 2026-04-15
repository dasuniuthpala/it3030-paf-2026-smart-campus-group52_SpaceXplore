import axios from 'axios';

const API_BASE_URL = 'http://localhost:8086/api';

// Configure axios with credentials for OAuth
axios.defaults.withCredentials = true;

const ticketService = {
    // Create a new ticket with attachments
    createTicket: async (formData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/tickets`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating ticket:', error);
            throw error;
        }
    },

    // Get all tickets (Admin only)
    getAllTickets: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/tickets`);
            return response.data;
        } catch (error) {
            console.error('Error fetching tickets:', error);
            throw error;
        }
    },

    // Get my tickets (logged in user)
    getMyTickets: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/tickets/my`);
            return response.data;
        } catch (error) {
            console.error('Error fetching my tickets:', error);
            throw error;
        }
    },

    // Get ticket by ID
    getTicketById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/tickets/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching ticket:', error);
            throw error;
        }
    },

    // Get tickets by status
    getTicketsByStatus: async (status) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/tickets/status/${status}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching tickets by status:', error);
            throw error;
        }
    },

    // Get tickets assigned to me
    getTicketsAssignedToMe: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/tickets/assigned-to-me`);
            return response.data;
        } catch (error) {
            console.error('Error fetching assigned tickets:', error);
            throw error;
        }
    },

    // Update ticket status
    updateStatus: async (id, status, reason = null) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/tickets/${id}/status`, {
                status,
                reason,
            });
            return response.data;
        } catch (error) {
            console.error('Error updating status:', error);
            throw error;
        }
    },

    // Assign technician
    assignTechnician: async (id, technicianName) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/tickets/${id}/assign`, {
                technicianName,
            });
            return response.data;
        } catch (error) {
            console.error('Error assigning technician:', error);
            throw error;
        }
    },

    // Add resolution notes
    addResolutionNotes: async (id, notes) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/tickets/${id}/resolution`, {
                notes,
            });
            return response.data;
        } catch (error) {
            console.error('Error adding resolution notes:', error);
            throw error;
        }
    },

    // Add comment
    addComment: async (ticketId, content, authorRole) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/tickets/${ticketId}/comments`, {
                content,
                authorRole,
            });
            return response.data;
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    },

    // Get comments
    getComments: async (ticketId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/tickets/${ticketId}/comments`);
            return response.data;
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    },

    // Edit comment
    editComment: async (commentId, content) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/tickets/comments/${commentId}`, {
                content,
            });
            return response.data;
        } catch (error) {
            console.error('Error editing comment:', error);
            throw error;
        }
    },

    // Delete comment
    deleteComment: async (commentId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/tickets/comments/${commentId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    },
};

export default ticketService;