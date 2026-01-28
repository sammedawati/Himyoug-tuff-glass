import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaDatabase, FaCalendarAlt, FaMapMarkerAlt, FaBell, FaFilter, FaSearch, FaTimes, FaGlobeAmericas, FaClock } from 'react-icons/fa';
import { dummyEvents } from '../../utils/dummyData';

const EventsManager = () => {
    const [events, setEvents] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        location: '',
        description: '',
        type: 'Exhibition' // Default type
    });
    
    // Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [activeType, setActiveType] = useState('All');
    
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const eventTypes = [
        'Exhibition', 
        'Product Launch', 
        'Technical Seminar', 
        'Corporate Gathering', 
        'Factory Visit'
    ];

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'events'), snapshot => {
            const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
                .sort((a, b) => new Date(b.date) - new Date(a.date));
            setEvents(list);
        });
        return () => unsubscribe();
    }, []);

    const seedData = async () => {
        if(window.confirm('Sync demo event protocols?')) {
             setLoading(true);
             const promises = dummyEvents.map(e => addDoc(collection(db, 'events'), { ...e, createdAt: serverTimestamp(), type: 'Global Showcase' }));
             await Promise.all(promises);
             setLoading(false);
        }
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();
        if(!formData.title || !formData.date) return;
        setLoading(true);
        try {
            await addDoc(collection(db, 'events'), {
                ...formData,
                createdAt: serverTimestamp()
            });
            setFormData({ title: '', date: '', location: '', description: '', type: 'Exhibition' });
            setShowModal(false);
            setMsg('Event Log Indexed');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if(window.confirm('De-index this entire event entry?')) {
            await deleteDoc(doc(db, 'events', id));
        }
    };

    // Filtering Logic
    const filteredEvents = events.filter(ev => {
        const matchesSearch = !searchTerm || 
            ev.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            ev.location?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = !filterDate || ev.date === filterDate;
        const matchesType = activeType === 'All' || ev.type === activeType;
        return matchesSearch && matchesDate && matchesType;
    });

    return (
        <div className="space-y-8 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">Strategic Events</h2>
                    <div className="flex items-center gap-3 mt-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Corporate Timeline Management</p>
                    </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button 
                        onClick={seedData} 
                        className="px-6 py-3 bg-white text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3 border border-slate-200"
                    >
                        <FaDatabase className="text-slate-300" /> Demo Sync
                    </button>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="flex-1 md:flex-initial px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 active:scale-95 border border-slate-900"
                    >
                        <FaPlus /> Initialize Event
                    </button>
                </div>
            </div>

            {/* Notification Toast */}
            <AnimatePresence>
                {msg && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20, height: 0 }} 
                        animate={{ opacity: 1, y: 0, height: 'auto' }} 
                        exit={{ opacity: 0, height: 0 }}
                        className="px-6 py-4 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-3"
                    >
                        <FaBell /> {msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Glass Filter Toolbar */}
            <div className="bg-white/80 backdrop-blur-xl p-2 rounded-[1.5rem] border border-white/40 shadow-xl shadow-slate-200/50 flex flex-col lg:flex-row gap-2 sticky top-4 z-30 transition-all">
                <div className="relative flex-grow group">
                    <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                        className="w-full bg-slate-50/80 border-2 border-transparent p-4 pl-14 rounded-2xl font-bold text-xs text-slate-900 focus:bg-white focus:border-blue-100 outline-none transition-all placeholder:text-slate-300" 
                        placeholder="Search protocols..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 custom-scrollbar">
                    <div className="relative min-w-[180px]">
                        <FaCalendarAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input 
                            type="date"
                            className="w-full bg-slate-50/80 border-2 border-transparent p-4 pl-12 rounded-2xl font-bold text-[10px] text-slate-600 focus:bg-white focus:border-blue-100 outline-none transition-all uppercase"
                            value={filterDate}
                            onChange={e => setFilterDate(e.target.value)}
                        />
                    </div>
                    
                    <div className="relative min-w-[200px]">
                        <FaFilter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                        <select
                            value={activeType}
                            onChange={e => setActiveType(e.target.value)}
                            className="w-full bg-slate-50/80 border-2 border-transparent p-4 pl-12 pr-10 rounded-2xl font-black text-[10px] text-slate-900 uppercase tracking-widest focus:bg-white focus:border-blue-100 outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option value="All">All Classifications</option>
                            {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <FaTimes className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 text-xs ${activeType === 'All' ? 'opacity-0' : 'opacity-100 cursor-pointer hover:text-red-500'}`} onClick={() => setActiveType('All')} />
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredEvents.map((ev, idx) => (
                        <motion.div 
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: idx * 0.05 }}
                            key={ev.id} 
                            className="bg-white rounded-[2.5rem] p-2 border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-500/20 transition-all group relative"
                        >
                            {/* Card Content */}
                            <div className="p-5 pb-14 relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex flex-col items-center min-w-[60px]">
                                        <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">{new Date(ev.date).toLocaleString('default', { month: 'short' })}</span>
                                        <span className="text-xl font-black text-slate-900">{new Date(ev.date).getDate()}</span>
                                    </div>
                                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[7px] font-black uppercase tracking-widest border border-blue-100">
                                        {ev.type || 'Standard'}
                                    </span>
                                </div>
                                
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight mb-2 line-clamp-2 min-h-[2.5rem]">
                                    {ev.title}
                                </h3>
                                
                                <div className="space-y-2 border-t border-slate-50 pt-3">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <FaMapMarkerAlt className="text-rose-400 text-xs" />
                                        <span className="text-[9px] font-bold uppercase tracking-wide truncate">{ev.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <FaClock className="text-amber-400 text-xs" />
                                        <span className="text-[9px] font-bold uppercase tracking-wide">09:00 AM - 18:00 PM</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Hover Actions */}
                            <div className="absolute inset-x-2 bottom-2 bg-slate-50 rounded-xl p-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all translate-y-2 md:translate-y-4 group-hover:translate-y-0 flex items-center justify-between z-20 border border-slate-100">
                                <div className="px-3 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                    ID: {ev.id.slice(0,6)}
                                </div>
                                <button 
                                    onClick={() => handleDelete(ev.id)}
                                    className="w-8 h-8 bg-white text-rose-500 rounded-lg flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-slate-200"
                                >
                                    <FaTrash size={10} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredEvents.length === 0 && (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center text-center opacity-50">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
                            <FaGlobeAmericas size={40} />
                        </div>
                        <h3 className="text-xl font-black text-slate-300 uppercase tracking-tighter">No Protocols Found</h3>
                        <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-2">Adjust search parameters or initialize new event.</p>
                    </div>
                )}
            </div>

            {/* Add Event Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 100 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ scale: 0.9, opacity: 0, y: 100 }}
                            className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden border border-slate-100"
                        >
                            <div className="p-10 pb-0">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Initiate Event</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Add entry to corporate calendar</p>
                                    </div>
                                    <button onClick={() => setShowModal(false)} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                                        <FaTimes />
                                    </button>
                                </div>
                                
                                <form onSubmit={handleAddEvent} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Event Title</label>
                                        <input 
                                            className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl font-bold text-sm text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all" 
                                            placeholder="e.g. International Glass Expo"
                                            value={formData.title}
                                            onChange={e => setFormData({...formData, title: e.target.value})}
                                            required autoFocus
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Date</label>
                                            <input 
                                                type="date"
                                                className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl font-bold text-sm text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all uppercase" 
                                                value={formData.date}
                                                onChange={e => setFormData({...formData, date: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Category</label>
                                            <select 
                                                className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl font-bold text-sm text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all" 
                                                value={formData.type}
                                                onChange={e => setFormData({...formData, type: e.target.value})}
                                            >
                                                {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Location</label>
                                        <div className="relative">
                                            <FaMapMarkerAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-rose-500" />
                                            <input 
                                                className="w-full bg-slate-50 border-2 border-transparent p-4 pl-12 rounded-2xl font-bold text-sm text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all" 
                                                placeholder="e.g. Convention Center, Hall B"
                                                value={formData.location}
                                                onChange={e => setFormData({...formData, location: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="p-10 -mx-10 bg-slate-50 border-t border-slate-100 flex gap-4 mt-8">
                                        <button 
                                            type="button" 
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 py-4 text-slate-400 font-bold uppercase tracking-widest text-xs hover:text-slate-900 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={loading}
                                            className="flex-[2] bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs py-4 hover:bg-blue-600 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                        >
                                            Save Event
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EventsManager;
