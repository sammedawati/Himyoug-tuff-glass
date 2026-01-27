import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { FaSave, FaImage, FaHome, FaBox, FaCalendarAlt, FaIndustry, FaEnvelope, FaGlobe, FaRocket, FaImages, FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const PageContentManager = () => {
    const [activePage, setActivePage] = useState('home');
    const [content, setContent] = useState({
        title: '',
        subtitle: '',
        bgImage: '',
        badge: ''
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const pages = [
        { id: 'home', label: 'Home Page', icon: <FaHome /> },
        { id: 'about', label: 'About Page', icon: <FaInfoCircle /> },
        { id: 'products', label: 'Products', icon: <FaBox /> },
        { id: 'gallery', label: 'Gallery', icon: <FaImages /> },
        { id: 'events', label: 'Events Feed', icon: <FaCalendarAlt /> },
        { id: 'facilities', label: 'Facilities', icon: <FaIndustry /> },
        { id: 'contact', label: 'Contact', icon: <FaEnvelope /> },
        { id: 'quote', label: 'Strategic Quote', icon: <FaRocket /> }
    ];

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            const docSnap = await getDoc(doc(db, 'page_content', activePage));
            if (docSnap.exists()) {
                setContent(prev => ({ ...prev, badge: '', ...docSnap.data() }));
            } else {
                setContent({ title: '', subtitle: '', bgImage: '', badge: '' });
            }
            setLoading(false);
        };
        fetchContent();
    }, [activePage]);

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            await setDoc(doc(db, 'page_content', activePage), {
                ...content,
                updatedAt: serverTimestamp()
            }, { merge: true });
            setMsg('Hero Meta Index Updated');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            console.error(err);
            setMsg('Sync Failure');
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Identity Management</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Configuring Hero Narratives and Background Assets.</p>
                </div>
                {msg && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="px-6 py-2 bg-slate-900 text-cyan-400 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                        {msg}
                    </motion.div>
                )}
            </div>

            {/* Industrial Navigation Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {pages.map(p => (
                    <button
                        key={p.id}
                        onClick={() => setActivePage(p.id)}
                        className={`group p-4 rounded-2xl border transition-all flex flex-col items-start gap-4 ${
                            activePage === p.id 
                                ? 'bg-slate-900 border-slate-900 shadow-xl shadow-slate-900/20' 
                                : 'bg-white border-gray-100 hover:border-slate-300 hover:shadow-sm'
                        }`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm transition-all ${
                            activePage === p.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white'
                        }`}>
                            {p.icon}
                        </div>
                        <div className="text-left">
                            <h4 className={`text-[10px] font-black uppercase tracking-widest ${activePage === p.id ? 'text-white' : 'text-slate-900'}`}>{p.label}</h4>
                            <span className={`text-[8px] font-bold uppercase tracking-widest ${activePage === p.id ? 'text-slate-500' : 'text-slate-400'}`}>Node Endpoint</span>
                        </div>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Preview Node */}
                <div className="lg:col-span-1">
                    <div className="p-8 bg-slate-950 rounded-[2.5rem] border border-slate-900 shadow-2xl relative overflow-hidden group h-full flex flex-col">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-[60px] animate-pulse"></div>
                        
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2">
                                    <FaGlobe className="text-cyan-500" /> Asset Staging
                                </span>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                            </div>

                            <div className="flex-1 rounded-[2rem] overflow-hidden border border-white/5 bg-slate-900/50 relative shadow-inner">
                                {content.bgImage ? (
                                    <img src={content.bgImage} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 transform group-hover:scale-110" alt="Preview" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 space-y-3">
                                        <FaImage size={24} className="opacity-20" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest">Missing Media Payload</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <span className="text-[7px] font-black text-blue-400 uppercase tracking-[0.3em] block mb-2">{activePage} identity</span>
                                    <p className="text-[10px] font-bold text-white uppercase tracking-tight line-clamp-2">{content.title || 'Untitled Node'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Configuration Inputs */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSave} className="p-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8 relative overflow-hidden h-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Badge Designation
                                    </label>
                                    <input 
                                        className="w-full bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl font-bold text-sm text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-inner" 
                                        value={content.badge}
                                        onChange={e => setContent({...content, badge: e.target.value})}
                                        placeholder="e.g. Industrial Excellence"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Payload Title</label>
                                    <input 
                                        className="w-full bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl font-black text-lg text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-inner" 
                                        value={content.title}
                                        onChange={e => setContent({...content, title: e.target.value})}
                                        placeholder="Main Heading"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Asset Management (URL)</label>
                                    <input 
                                        className="w-full bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl font-bold text-[10px] text-blue-600 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-inner" 
                                        value={content.bgImage}
                                        onChange={e => setContent({...content, bgImage: e.target.value})}
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Strategy Narrative (Subtitle)</label>
                                    <textarea 
                                        className="w-full bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl font-medium text-xs text-slate-500 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-inner h-24 resize-none" 
                                        value={content.subtitle}
                                        onChange={e => setContent({...content, subtitle: e.target.value})}
                                        placeholder="Supporting text..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-50 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-4 hover:bg-black transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                            >
                                <FaSave className="text-cyan-400" /> Commmit Identity Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PageContentManager;
