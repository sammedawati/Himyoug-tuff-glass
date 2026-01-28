import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaDatabase, FaTools, FaWarehouse, FaMicrochip } from 'react-icons/fa';
import { dummyFacilities } from '../../utils/dummyData';

const FacilitiesManager = () => {
    const [facilities, setFacilities] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: ''
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [techNodes, setTechNodes] = useState([]);
    const [editTech, setEditTech] = useState(false);

    const seedData = async () => {
        if (window.confirm('Add sample facilities?')) {
            const promises = dummyFacilities.map(f => addDoc(collection(db, 'facilities'), { ...f, createdAt: serverTimestamp() }));
            await Promise.all(promises);
        }
    };

    useEffect(() => {
        const unsubscribeFacs = onSnapshot(collection(db, 'facilities'), snapshot => {
            setFacilities(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        const unsubscribeTech = onSnapshot(doc(db, 'site_content', 'facilities'), d => {
            if (d.exists()) setTechNodes(d.data().techNodes || []);
        });
        return () => {
            unsubscribeFacs();
            unsubscribeTech();
        };
    }, []);

    const handleSaveTechNodes = async () => {
        setLoading(true);
        try {
            await updateDoc(doc(db, 'site_content', 'facilities'), {
                techNodes: techNodes,
                updatedAt: serverTimestamp()
            });
            setMsg('Technical Infrastructure Synced');
            setTimeout(() => setMsg(''), 3000);
            setEditTech(false);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title) return;
        setLoading(true);
        try {
            await addDoc(collection(db, 'facilities'), {
                ...formData,
                createdAt: serverTimestamp()
            });
            setFormData({ title: '', description: '', imageUrl: '' });
            setMsg('Facility Node Deployed');
            setShowModal(false);
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete facility?')) {
            await deleteDoc(doc(db, 'facilities', id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 px-2 gap-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Infrastructure Inventory</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Management of industrial units and technical facilities.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    {msg && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="px-4 py-2 bg-blue-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg">
                            {msg}
                        </motion.div>
                    )}
                    <button
                        onClick={() => setEditTech(!editTech)}
                        className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border ${editTech
                                ? 'bg-slate-900 text-cyan-400 border-slate-900 shadow-xl'
                                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        <FaMicrochip /> {editTech ? 'Close Tech Nodes' : 'Manage Tech Highlights'}
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex-1 md:flex-initial px-6 py-2 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 border border-blue-500"
                    >
                        <FaPlus /> Deploy New Asset
                    </button>
                    <button onClick={seedData} className="px-4 py-2 bg-slate-100 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2 border border-slate-200">
                        <FaDatabase className="text-slate-400" /> Demo Import
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {editTech ? (
                    <motion.div
                        key="tech-editor"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2 mb-8 overflow-hidden"
                    >
                        {techNodes.map((node, idx) => (
                            <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Highlight 0{idx + 1}</span>
                                <input
                                    className="w-full bg-white border-none p-2 rounded-lg font-black text-[10px] uppercase text-slate-900"
                                    value={node.title}
                                    onChange={e => {
                                        const n = [...techNodes];
                                        n[idx] = { ...n[idx], title: e.target.value };
                                        setTechNodes(n);
                                    }}
                                />
                                <textarea
                                    className="w-full bg-white border-none p-2 rounded-lg font-medium text-[9px] h-16 resize-none"
                                    value={node.desc}
                                    onChange={e => {
                                        const n = [...techNodes];
                                        n[idx] = { ...n[idx], desc: e.target.value };
                                        setTechNodes(n);
                                    }}
                                />
                                <div className="flex justify-end">
                                    <button onClick={handleSaveTechNodes} className="text-[8px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                                        Sync Node
                                    </button>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                ) : null}
            </AnimatePresence>

            {/* Asset Staging Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 pb-20">
                {facilities.map(item => (
                    <motion.div
                        layout
                        key={item.id}
                        className="p-6 bg-white rounded-[2rem] border border-gray-100 flex flex-col items-start relative group hover:border-blue-500/30 transition-all shadow-sm overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 z-10">
                            <button onClick={() => handleDelete(item.id)} className="w-8 h-8 bg-rose-50 text-rose-400 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white">
                                <FaTrash size={12} />
                            </button>
                        </div>

                        <div className="w-full aspect-video rounded-2xl overflow-hidden mb-6 bg-slate-50 border border-slate-100">
                            {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-200 bg-slate-50">
                                    <FaWarehouse size={40} />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 w-full">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active System Node</span>
                            </div>
                            <h4 className="font-black text-slate-900 uppercase tracking-tighter text-lg leading-none mb-3 truncate">{item.title}</h4>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">{item.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Tactical Deployment Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                        ></motion.div>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-slate-900 w-full max-w-xl rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden z-10"
                        >
                            <form onSubmit={handleSubmit} className="p-10 space-y-6 relative z-10">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-3 text-cyan-400/60 font-black text-[10px] uppercase tracking-[0.4em]">
                                        <FaTools size={12} /> Unit Deployment Module
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-all"
                                    >
                                        <FaPlus className="rotate-45" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Facility Designation</label>
                                        <input
                                            className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl font-bold text-sm text-white focus:border-cyan-500 outline-none transition-all shadow-inner"
                                            placeholder="e.g. Tempering Furnace XT-500"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Asset Asset URL (Image)</label>
                                        <input
                                            className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl font-bold text-[10px] text-cyan-400 focus:border-cyan-500 outline-none transition-all shadow-inner"
                                            placeholder="https://..."
                                            value={formData.imageUrl}
                                            onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Operational Summary</label>
                                        <textarea
                                            className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl font-medium text-xs text-slate-400 focus:border-cyan-500 outline-none transition-all h-32 resize-none shadow-inner"
                                            placeholder="Describe machinery capacity or function..."
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 bg-white/5 text-white/60 p-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 transition-all active:scale-95"
                                    >
                                        Abort Deployment
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-[2] bg-blue-600 text-white p-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50"
                                    >
                                        <FaPlus /> Deploy Asset Node
                                    </button>
                                </div>
                            </form>

                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FacilitiesManager;
