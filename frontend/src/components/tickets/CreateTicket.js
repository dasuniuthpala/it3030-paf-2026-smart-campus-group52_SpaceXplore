import React, { useState } from 'react';
import ticketService from '../../services/ticketService';

const CreateTicket = ({ onTicketCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM',
        category: '',
        resourceLocation: '',
        contactEmail: '',
        contactPhone: '',
    });
    
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [imagePreviews, setImagePreviews] = useState([]);

    const categories = [
        'Hardware', 'Software', 'Network', 
        'Facility', 'Furniture', 'Electrical', 
        'Plumbing', 'Other'
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError('');
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        
        if (selectedFiles.length > 3) {
            setError('You can only upload up to 3 images');
            return;
        }
        
        const invalidFiles = selectedFiles.filter(file => !file.type.startsWith('image/'));
        if (invalidFiles.length > 0) {
            setError('Only image files are allowed');
            return;
        }
        
        const largeFiles = selectedFiles.filter(file => file.size > 5 * 1024 * 1024);
        if (largeFiles.length > 0) {
            setError('Each image must be less than 5MB');
            return;
        }
        
        setFiles(selectedFiles);
        
        const previews = selectedFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const removeImage = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setFiles(newFiles);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!formData.title.trim()) {
            setError('Title is required');
            setLoading(false);
            return;
        }
        if (!formData.description.trim()) {
            setError('Description is required');
            setLoading(false);
            return;
        }
        if (!formData.category) {
            setError('Category is required');
            setLoading(false);
            return;
        }
        if (!formData.resourceLocation.trim()) {
            setError('Resource location is required');
            setLoading(false);
            return;
        }

        try {
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('description', formData.description);
            submitData.append('priority', formData.priority);
            submitData.append('category', formData.category);
            submitData.append('resourceLocation', formData.resourceLocation);
            submitData.append('contactEmail', formData.contactEmail);
            submitData.append('contactPhone', formData.contactPhone);
            
            files.forEach(file => {
                submitData.append('files', file);
            });
            
            const response = await ticketService.createTicket(submitData);
            setSuccess(`Ticket #${response.ticketId} created successfully!`);
            
            setFormData({
                title: '',
                description: '',
                priority: 'MEDIUM',
                category: '',
                resourceLocation: '',
                contactEmail: '',
                contactPhone: '',
            });
            setFiles([]);
            setImagePreviews([]);
            
            if (onTicketCreated) {
                setTimeout(() => onTicketCreated(), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create ticket');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                    <h2 className="text-xl font-bold text-white">Report an Incident</h2>
                    <p className="text-indigo-100 text-sm mt-1">Submit a new maintenance or incident ticket</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-r-lg">
                            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                        </div>
                    )}
                    
                    {success && (
                        <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 p-4 rounded-r-lg">
                            <p className="text-green-700 dark:text-green-400 text-sm">{success}</p>
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Brief summary of the issue"
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Priority <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="URGENT">Urgent</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Resource/Location <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="resourceLocation"
                            value={formData.resourceLocation}
                            onChange={handleChange}
                            placeholder="e.g., Room 201, Lab 3, Projector A"
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Detailed description of the issue..."
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 resize-none"
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Contact Email
                            </label>
                            <input
                                type="email"
                                name="contactEmail"
                                value={formData.contactEmail}
                                onChange={handleChange}
                                placeholder="your@email.com"
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Contact Phone
                            </label>
                            <input
                                type="tel"
                                name="contactPhone"
                                value={formData.contactPhone}
                                onChange={handleChange}
                                placeholder="Phone number"
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Attachments <span className="text-slate-400 font-normal">(Up to 3 images, max 5MB each)</span>
                        </label>
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-xl cursor-pointer bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition">
                            <div className="flex flex-col items-center justify-center gap-1 pointer-events-none">
                                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">Click to upload images</span>
                                <span className="text-xs text-slate-400">PNG, JPG, GIF up to 5MB</span>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                        {imagePreviews.length > 0 && (
                            <div className="flex gap-3 mt-3 flex-wrap">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img src={preview} alt={`Preview ${index + 1}`} className="w-24 h-24 object-cover rounded-lg border border-slate-300 dark:border-slate-700" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition shadow"
                                        >
                                            ×
                                        </button>
                                        <span className="absolute bottom-1 left-1 right-1 text-center text-xs text-white bg-black/50 rounded px-1 truncate">
                                            {files[index]?.name}
                                        </span>
                                    </div>
                                ))}
                                {imagePreviews.length < 3 && (
                                    <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-indigo-400 transition text-slate-400 hover:text-indigo-400">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span className="text-xs mt-1">Add more</span>
                                        <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                                    </label>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating...' : 'Submit Ticket'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTicket;