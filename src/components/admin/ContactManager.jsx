import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { FaSave, FaClock, FaMapMarkedAlt } from 'react-icons/fa';

const ContactManager = () => {
    const [content, setContent] = useState({
        nodesTitle: 'Network Nodes',
        mainHeading: 'Command Centers.',
        hqAddress: '123 Industrial Area, Phase II, New Delhi, India',
        hotline: '+91 98765 43210',
        hotlineHours: 'Active Mon-Sat, 09:00 - 19:00 IST',
        emailPrimary: 'info@glasstuffan.com',
        emailSecondary: 'technical@glasstuffan.com',
        latencyLabel: 'Processing Latency',
        latencyValue: 'Under 24 Business Hours',
        mapIframe: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14014.288289578768!2d77.10249015!3d28.7040592!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d03f0b0c0b0b1%3A0x0!2zMjjCsDQyJzE0LjYiTiA3N8KwMDYnMDkuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin'
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            const docSnap = await getDoc(doc(db, 'site_content', 'contact_details'));
            if (docSnap.exists()) {
                setContent(prev => ({ ...prev, ...docSnap.data() }));
            }
            setLoading(false);
        };
        fetchContent();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await setDoc(doc(db, 'site_content', 'contact_details'), {
                ...content,
                updatedAt: serverTimestamp()
            });
            setMsg('Contact page details updated!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            console.error(err);
            setMsg('Error saving.');
        }
        setLoading(false);
    };

    return (
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <h2 className="text-xl font-black mb-8 text-gray-900 uppercase tracking-tighter">Contact Page Detail Manager</h2>
            
            {msg && <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-2xl text-xs font-bold">{msg}</div>}

            <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
                {/* Structure Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 pl-1">Badge Text (e.g. Network Nodes)</label>
                        <input 
                            className="w-full border border-gray-100 p-4 rounded-2xl bg-gray-50 focus:bg-white focus:border-cyan-500 outline-none transition-all font-bold text-sm" 
                            value={content.nodesTitle}
                            onChange={e => setContent({...content, nodesTitle: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 pl-1">Main Heading</label>
                        <input 
                            className="w-full border border-gray-100 p-4 rounded-2xl bg-gray-50 focus:bg-white focus:border-cyan-500 outline-none transition-all font-bold text-sm" 
                            value={content.mainHeading}
                            onChange={e => setContent({...content, mainHeading: e.target.value})}
                        />
                    </div>
                </div>

                {/* Info Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-[2rem] border border-gray-100">
                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 pl-1">HQ Address</label>
                        <input 
                            className="w-full border border-gray-200 p-4 rounded-2xl bg-white focus:border-cyan-500 outline-none transition-all font-bold text-sm" 
                            value={content.hqAddress}
                            onChange={e => setContent({...content, hqAddress: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 pl-1">Hotline Number</label>
                        <input 
                            className="w-full border border-gray-200 p-4 rounded-2xl bg-white focus:border-cyan-500 outline-none transition-all font-bold text-sm" 
                            value={content.hotline}
                            onChange={e => setContent({...content, hotline: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 pl-1">Working Hours</label>
                        <input 
                            className="w-full border border-gray-200 p-4 rounded-2xl bg-white focus:border-cyan-500 outline-none transition-all font-bold text-sm" 
                            value={content.hotlineHours}
                            onChange={e => setContent({...content, hotlineHours: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 pl-1">Primary Email</label>
                        <input 
                            className="w-full border border-gray-200 p-4 rounded-2xl bg-white focus:border-cyan-500 outline-none transition-all font-bold text-sm" 
                            value={content.emailPrimary}
                            onChange={e => setContent({...content, emailPrimary: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 pl-1">Secondary Email</label>
                        <input 
                            className="w-full border border-gray-200 p-4 rounded-2xl bg-white focus:border-cyan-500 outline-none transition-all font-bold text-sm" 
                            value={content.emailSecondary}
                            onChange={e => setContent({...content, emailSecondary: e.target.value})}
                        />
                    </div>
                </div>

                {/* Latency & Map */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-900 tracking-widest px-2">
                            <FaClock className="text-cyan-500" /> Latency Badge
                        </h3>
                        <input 
                            className="w-full border border-gray-100 p-4 rounded-2xl bg-gray-50 focus:bg-white focus:border-cyan-500 outline-none transition-all font-bold text-sm" 
                            value={content.latencyValue}
                            onChange={e => setContent({...content, latencyValue: e.target.value})}
                            placeholder="Latency Value (e.g. Under 24 Hours)"
                        />
                    </div>
                    <div className="space-y-4">
                        <h3 className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-900 tracking-widest px-2">
                            <FaMapMarkedAlt className="text-cyan-500" /> Map Coordinates (Iframe URL)
                        </h3>
                        <input 
                            className="w-full border border-gray-100 p-4 rounded-2xl bg-gray-50 focus:bg-white focus:border-cyan-500 outline-none transition-all font-bold text-sm" 
                            value={content.mapIframe}
                            onChange={e => setContent({...content, mapIframe: e.target.value})}
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-50">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-slate-900 text-white px-10 py-4 rounded-2xl flex items-center gap-3 hover:bg-black disabled:opacity-50 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-slate-900/20 transition-all active:scale-95"
                    >
                        <FaSave /> Save Contact Configuration
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactManager;
