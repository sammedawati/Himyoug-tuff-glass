import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { FaSave, FaGlobe, FaShieldAlt, FaShareAlt, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaLink, FaDatabase } from 'react-icons/fa';
import { initializeFirebaseData } from '../../FirebaseInitializer';

const SiteSettingsManager = () => {
    const [settings, setSettings] = useState({
        general: { siteName: 'Glass Tuffan', logoUrl: '' },
        contact: { phone: '', email: '', address: '', mapUrl: '' },
        social: { facebook: '', instagram: '', linkedin: '', twitter: '' },
        youtube: { apiKey: '', channelId: '' }
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
             const docRef = doc(db, 'site_settings', 'config');
             const docSnap = await getDoc(docRef);
             if (docSnap.exists()) {
                 setSettings(prev => ({ ...prev, ...docSnap.data() }));
             }
        };
        fetchSettings();
    }, []);

    const handleChange = (section, field, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            await setDoc(doc(db, 'site_settings', 'config'), settings, { merge: true });
            setMsg('Global Configuration Synced');
            setTimeout(() => setMsg(''), 3000);
        } catch (error) {
            console.error(error);
            setMsg('Sync Failed');
        }
        setLoading(false);
    };

    const handleInitializeData = async () => {
        setLoading(true);
        setMsg('Initializing Data Sync...');
        try {
            await initializeFirebaseData();
            setMsg('Data Systems Synchronized');
            setTimeout(() => setMsg(''), 3000);
        } catch (error) {
            console.error(error);
            setMsg('Sync Failed');
        }
        setLoading(false);
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center px-2">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Site Core Console</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Advanced control for global branding and contact nodes.</p>
                </div>
                {msg && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="px-6 py-2 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-500/20">
                        {msg}
                    </motion.div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Global Identity Node */}
                <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-slate-800 space-y-8 relative overflow-hidden shadow-2xl">
                    <div className="flex items-center gap-3 text-cyan-400/60 font-black text-[10px] uppercase tracking-[0.4em]">
                        <FaGlobe size={14} /> Global Identity Node
                    </div>
                    
                    <div className="space-y-6">
                        <SettingInput 
                            label="Corporate Entity Name" 
                            value={settings.general.siteName} 
                            onChange={(v) => handleChange('general', 'siteName', v)}
                            placeholder="Glass Tuffan"
                            dark
                        />
                        <SettingInput 
                            label="Meta Identity URL (Favicon/Logo)" 
                            value={settings.general.logoUrl} 
                            onChange={(v) => handleChange('general', 'logoUrl', v)}
                            placeholder="https://..."
                            dark
                        />
                    </div>

                    <div className="p-6 bg-slate-800/40 rounded-3xl border border-slate-800 flex items-center gap-6">
                        <div className="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center text-slate-500 font-black text-lg">GT</div>
                        <div>
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Brand Signature Preview</span>
                            <h4 className="text-white font-black uppercase tracking-tight">{settings.general.siteName}</h4>
                        </div>
                    </div>
                </div>

                {/* 2. Strategic Contact Nodes */}
                <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 space-y-8 relative overflow-hidden shadow-sm">
                    <div className="flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-[0.4em]">
                        <FaShieldAlt size={14} /> Strategic Contact Nodes
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SettingInput 
                            label="Command Center Phone" 
                            icon={<FaPhoneAlt />}
                            value={settings.contact.phone} 
                            onChange={(v) => handleChange('contact', 'phone', v)}
                        />
                        <SettingInput 
                            label="Direct Dispatch Email" 
                            icon={<FaEnvelope />}
                            value={settings.contact.email} 
                            onChange={(v) => handleChange('contact', 'email', v)}
                        />
                    </div>
                    <SettingInput 
                        label="Physical HQ Location" 
                        icon={<FaMapMarkerAlt />}
                        value={settings.contact.address} 
                        onChange={(v) => handleChange('contact', 'address', v)}
                        className="w-full"
                    />
                </div>

                {/* 3. Digital Outreach Matrix */}
                <div className="lg:col-span-2 p-10 bg-blue-50/50 rounded-[3rem] border border-blue-100 space-y-8 backdrop-blur-sm relative overflow-hidden">
                    <div className="flex items-center gap-3 text-blue-500/60 font-black text-[10px] uppercase tracking-[0.4em]">
                        <FaShareAlt size={14} /> Digital Outreach Matrix
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <SettingInput label="Facebook Logic" value={settings.social.facebook} onChange={(v) => handleChange('social', 'facebook', v)} />
                        <SettingInput label="Instagram Index" value={settings.social.instagram} onChange={(v) => handleChange('social', 'instagram', v)} />
                        <SettingInput label="Twitter / X Stream" value={settings.social.twitter} onChange={(v) => handleChange('social', 'twitter', v)} />
                        <SettingInput label="LinkedIn Network" value={settings.social.linkedin} onChange={(v) => handleChange('social', 'linkedin', v)} />
                    </div>
                </div>

                {/* 3.1 Strategic Media Integration */}
                <div className="lg:col-span-2 p-10 bg-red-50/30 rounded-[3rem] border border-red-100 space-y-8 backdrop-blur-sm relative overflow-hidden">
                    <div className="flex items-center gap-3 text-red-600/60 font-black text-[10px] uppercase tracking-[0.4em]">
                        <FaLink size={14} /> Strategic Media Integration
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SettingInput 
                            label="YouTube Data API Key" 
                            value={settings.youtube?.apiKey} 
                            onChange={(v) => handleChange('youtube', 'apiKey', v)} 
                            placeholder="Enter Google Cloud API Key"
                        />
                        <SettingInput 
                            label="YouTube Channel ID" 
                            value={settings.youtube?.channelId} 
                            onChange={(v) => handleChange('youtube', 'channelId', v)} 
                            placeholder="UC..."
                        />
                    </div>
                    <div className="p-4 bg-red-50 rounded-2xl border border-red-100/50">
                        <p className="text-[9px] font-bold text-red-700 uppercase tracking-widest leading-relaxed">
                            Configuration of these keys enables real-time synchronization of your entire YouTube channel with the public Gallery page. Ensure the API has "YouTube Data API v3" permissions enabled.
                        </p>
                    </div>
                </div>

                {/* 4. Data Systems Maintenance */}
                <div className="lg:col-span-2 p-10 bg-slate-50 rounded-[3rem] border border-gray-100 space-y-8 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-slate-400 font-black text-[10px] uppercase tracking-[0.4em]">
                            <FaDatabase size={14} /> Data Systems Maintenance
                        </div>
                        <div className="px-3 py-1 bg-amber-100 text-amber-700 text-[8px] font-black uppercase tracking-widest rounded-full">Developer Mode</div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
                        <div className="space-y-2">
                            <h4 className="text-slate-900 font-black uppercase tracking-tight">Sync Dummy Content Reservoir</h4>
                            <p className="text-xs text-slate-500 font-medium">Inject missing dummy records across all modules (Products, Gallery, Events, etc.) if they are empty.</p>
                        </div>
                        <button 
                            onClick={handleInitializeData}
                            disabled={loading}
                            className="whitespace-nowrap bg-slate-900 border border-slate-800 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-black transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                        >
                            <FaDatabase className="text-cyan-400" /> Execute Initialize
                        </button>
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-gray-100 flex justify-end">
                <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-4 hover:bg-black transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                >
                    <FaSave className="text-cyan-400" /> Commit Global Parameters
                </button>
            </div>
        </div>
    );
};

const SettingInput = ({ label, value, onChange, placeholder, dark = false, icon, className = "" }) => (
    <div className={`space-y-2 ${className}`}>
        <label className={`text-[9px] font-black uppercase tracking-widest ml-1 ${dark ? 'text-slate-500' : 'text-gray-400'}`}>
            {label}
        </label>
        <div className="relative">
            {icon && (
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${dark ? 'text-slate-600' : 'text-gray-300'}`}>
                    {icon}
                </div>
            )}
            <input 
                className={`w-full ${dark ? 'bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600' : 'bg-white border-gray-100 text-gray-900 shadow-sm'} border-2 ${icon ? 'pl-12' : 'p-4'} p-4 rounded-2xl font-bold text-xs outline-none focus:border-blue-500 transition-all`} 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </div>
    </div>
);

export default SiteSettingsManager;
