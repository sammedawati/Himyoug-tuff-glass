import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { FaSave, FaInfoCircle, FaIndustry, FaBullseye, FaFlag, FaGem, FaHistory, FaUserShield, FaCheckDouble, FaShieldAlt, FaMicrochip, FaAward, FaDatabase } from 'react-icons/fa';
import { dummyAbout } from '../../utils/dummyData';
import { motion } from 'framer-motion';

const AboutManager = () => {
    const [content, setContent] = useState({
        title: 'About Glass Tuffan',
        description: '',
        companySubheading: 'Excellence in every Reflection.',
        estYear: '2008',
        clientCount: '500+',
        visionTitle: 'Our Vision',
        visionText: '',
        missionTitle: 'Our Mission',
        missionText: '',
        imageUrl: '',
        values: [
            { icon: 'FaGem', title: 'Optical Clarity', desc: 'Utilizing low-iron technology and advanced de-ionized washing systems.' },
            { icon: 'FaHistory', title: 'Thermal Resistance', desc: 'Engineered for extreme performance, our glass reduces solar heat gain.' },
            { icon: 'FaUserShield', title: 'Structural Integrity', desc: 'Every toughened sheet is tested for surface compression.' },
            { icon: 'FaCheckDouble', title: 'Safety Engineering', desc: 'Our laminated glass is designed to maintain structural wholeness.' }
        ]
    });

    const iconOptions = [
        { label: 'Gem / Crystal', value: 'FaGem' },
        { label: 'History / Clock', value: 'FaHistory' },
        { label: 'User Shield', value: 'FaUserShield' },
        { label: 'Double Check', value: 'FaCheckDouble' },
        { label: 'Industry / Factory', value: 'FaIndustry' },
        { label: 'Safety Shield', value: 'FaShieldAlt' },
        { label: 'Microchip / High Tech', value: 'FaMicrochip' },
        { label: 'Award / Quality', value: 'FaAward' }
    ];

    const IconPreview = ({ name }) => {
        const icons = {
            FaGem: <FaGem />,
            FaHistory: <FaHistory />,
            FaUserShield: <FaUserShield />,
            FaCheckDouble: <FaCheckDouble />,
            FaIndustry: <FaIndustry />,
            FaShieldAlt: <FaShieldAlt />,
            FaMicrochip: <FaMicrochip />,
            FaAward: <FaAward />
        };
        return icons[name] || <FaGem />;
    };
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            const docSnap = await getDoc(doc(db, 'site_content', 'about'));
            if (docSnap.exists()) {
                const data = docSnap.data();
                setContent(prev => ({ 
                    ...prev, 
                    ...data,
                    // Ensure values array exists even if old data doesn't have it
                    values: data.values || prev.values 
                }));
            }
            setLoading(false);
        };
        fetchContent();
    }, []);

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            // Save to site_content/about
            await setDoc(doc(db, 'site_content', 'about'), {
                ...content,
                updatedAt: serverTimestamp()
            }, { merge: true });

            setMsg('Complete strategic alignment updated!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            console.error(err);
            setMsg('Save sequence failed.');
        }
        setLoading(false);
    };

    const seedAboutData = async () => {
        if(window.confirm('Seed About Page with industrial heritage data?')) {
            setLoading(true);
            try {
                await setDoc(doc(db, 'site_content', 'about'), {
                    ...dummyAbout,
                    updatedAt: serverTimestamp()
                });
                setContent(dummyAbout);
                setMsg('About Narrative Synchronized');
                setTimeout(() => setMsg(''), 3000);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        }
    };

    const handleValueChange = (index, field, value) => {
        const newValues = [...content.values];
        newValues[index] = { ...newValues[index], [field]: value };
        setContent({ ...content, values: newValues });
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header Identity */}
            <div className="flex justify-between items-center px-2">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">About Node Management</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Full-spectrum control of About Page narratives and assets.</p>
                </div>
                <div className="flex gap-2 items-center">
                    <button onClick={seedAboutData} className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-300 hover:bg-slate-200 transition-all flex items-center gap-2">
                        <FaDatabase className="text-slate-400" /> Demo Import
                    </button>
                    {msg && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="px-6 py-2 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-500/20">
                            {msg}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* 2. Company Narratives & Stats */}
            <div className="p-8 bg-blue-50/50 rounded-[2.5rem] border-2 border-blue-100 space-y-8 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                
                {/* Main Content Node */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-800/60 ml-1">
                                <FaInfoCircle className="text-blue-600" /> Company Subsection Heading
                            </label>
                            <input 
                                className="w-full bg-white border-2 border-blue-100 p-4 rounded-2xl font-bold text-lg text-blue-900 focus:border-blue-500 outline-none transition-all shadow-inner" 
                                placeholder="Corporate Heading"
                                value={content.companySubheading}
                                onChange={e => setContent({...content, companySubheading: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-blue-800/60 ml-1">
                                Main Description Payload
                            </label>
                            <textarea 
                                className="w-full bg-white border-2 border-blue-100 p-5 rounded-2xl font-medium text-sm text-blue-900 focus:border-blue-500 outline-none transition-all shadow-inner h-32 resize-none" 
                                placeholder="Narrative text..."
                                value={content.description}
                                onChange={e => setContent({...content, description: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-white rounded-3xl border border-blue-100">
                                <label className="text-[9px] font-black uppercase tracking-widest text-blue-400 block mb-2">Establishment Year</label>
                                <input 
                                    className="w-full text-2xl font-black text-blue-900 border-b-2 border-blue-50 focus:border-blue-500 outline-none transition-all" 
                                    value={content.estYear}
                                    onChange={e => setContent({...content, estYear: e.target.value})}
                                />
                            </div>
                            <div className="p-6 bg-white rounded-3xl border border-blue-100">
                                <label className="text-[9px] font-black uppercase tracking-widest text-blue-400 block mb-2">Global Clients</label>
                                <input 
                                    className="w-full text-2xl font-black text-blue-900 border-b-2 border-blue-50 focus:border-blue-500 outline-none transition-all" 
                                    value={content.clientCount}
                                    onChange={e => setContent({...content, clientCount: e.target.value})}
                                />
                            </div>
                        </div>
                        
                        <div className="p-6 bg-white/40 rounded-3xl border border-blue-100/50">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-800/60 mb-2">
                                <FaIndustry className="text-blue-600" /> Side Image Asset
                            </label>
                            <input 
                                className="w-full bg-white border-2 border-blue-50 border-dashed p-3 rounded-xl font-bold text-[10px] text-blue-400 focus:border-blue-500 focus:border-solid outline-none transition-all" 
                                placeholder="Image URL..."
                                value={content.imageUrl}
                                onChange={e => setContent({...content, imageUrl: e.target.value})}
                            />
                            {content.imageUrl && (
                                <div className="mt-4 h-24 w-full rounded-2xl overflow-hidden border-2 border-white shadow-lg">
                                    <img src={content.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tactical Vision Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 pt-8 border-t border-blue-100/50">
                    <div className="p-6 bg-white rounded-3xl border border-blue-100 space-y-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                <FaBullseye size={18} />
                            </div>
                            <input 
                                className="flex-1 bg-transparent border-none font-black text-[13px] text-blue-900 focus:ring-0 uppercase tracking-widest" 
                                value={content.visionTitle}
                                onChange={e => setContent({...content, visionTitle: e.target.value})}
                            />
                        </div>
                        <textarea 
                            className="w-full bg-blue-50/50 border border-transparent p-3 rounded-xl font-medium text-xs text-blue-700 h-20 resize-none outline-none focus:bg-white focus:border-blue-200" 
                            value={content.visionText}
                            onChange={e => setContent({...content, visionText: e.target.value})}
                        />
                    </div>

                    <div className="p-6 bg-white rounded-3xl border border-blue-100 space-y-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                <FaFlag size={18} />
                            </div>
                            <input 
                                className="flex-1 bg-transparent border-none font-black text-[13px] text-indigo-950 focus:ring-0 uppercase tracking-widest" 
                                value={content.missionTitle}
                                onChange={e => setContent({...content, missionTitle: e.target.value})}
                            />
                        </div>
                        <textarea 
                            className="w-full bg-indigo-50/30 border border-transparent p-3 rounded-xl font-medium text-xs text-indigo-800 h-20 resize-none outline-none focus:bg-white focus:border-indigo-200" 
                            value={content.missionText}
                            onChange={e => setContent({...content, missionText: e.target.value})}
                        />
                    </div>
                </div>
            </div>

            {/* 3. Core Values Grid Manager */}
            <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 px-2">Core Foundations Matrix</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {content.values.map((v, i) => (
                        <div key={i} className="p-5 rounded-3xl bg-gray-50 border border-gray-100 space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Foundation 0{i+1}</span>
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-600 shadow-sm border border-gray-100">
                                    <IconPreview name={v.icon} />
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-[7px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Symbol Indicator</label>
                                    <select 
                                        className="w-full bg-white border-2 border-gray-100 p-2 rounded-xl text-[10px] font-bold text-gray-700 focus:border-blue-500 outline-none transition-all cursor-pointer"
                                        value={v.icon}
                                        onChange={e => handleValueChange(i, 'icon', e.target.value)}
                                    >
                                        {iconOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[7px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Strategy Title</label>
                                    <input 
                                        className="w-full bg-white border-2 border-gray-100 p-3 rounded-xl font-black text-xs text-gray-900 focus:ring-0 focus:border-blue-500 uppercase tracking-tight" 
                                        value={v.title}
                                        onChange={e => handleValueChange(i, 'title', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[7px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Description Payload</label>
                                    <textarea 
                                        className="w-full bg-white border-2 border-gray-100 p-3 rounded-xl font-medium text-[10px] text-gray-500 h-24 resize-none focus:ring-0 focus:border-blue-500" 
                                        value={v.desc}
                                        onChange={e => handleValueChange(i, 'desc', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button 
                    onClick={handleSave} 
                    disabled={loading}
                    className="bg-slate-900 text-white px-16 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-4 hover:bg-black transition-all shadow-2xl disabled:opacity-50 active:scale-95"
                >
                    <FaSave /> Commit Complete Strategic Dataset
                </button>
            </div>
        </div>
    );
};

export default AboutManager;
