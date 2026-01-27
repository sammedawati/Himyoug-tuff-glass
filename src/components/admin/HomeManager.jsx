import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { doc, getDoc, setDoc, serverTimestamp, collection, onSnapshot, addDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { FaSave, FaPlus, FaTrash, FaCheckCircle, FaChartBar, FaQuoteLeft, FaInfoCircle, FaStar, FaDatabase, FaHandshake } from 'react-icons/fa';
import { homeFeatures as dummyFeatures, homeStats as dummyStats, homeShowcase as dummyShowcase, dummyTestimonials, dummyClients } from '../../utils/dummyData';

const HomeManager = () => {
    const [activeSection, setActiveSection] = useState('features');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    // State for Features
    const [features, setFeatures] = useState([]);
    // State for Stats
    const [stats, setStats] = useState({
        items: []
    });
    // State for Testimonials
    const [testimonials, setTestimonials] = useState([]);
    const [showcase, setShowcase] = useState({
        badge: 'Premium Showcase',
        title: 'Elite Glass Collection.',
        items: []
    });
    // State for Products (to pick from)
    const [inventory, setInventory] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState('');
    // State for Clients
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const unsubscribeFeatures = onSnapshot(doc(db, 'site_content', 'home_features'), (doc) => {
            if (doc.exists()) setFeatures(doc.data().items || []);
        });
        const unsubscribeStats = onSnapshot(doc(db, 'site_content', 'home_stats'), (doc) => {
            if (doc.exists()) setStats(doc.data());
        });
        const unsubscribeTestimonials = onSnapshot(collection(db, 'testimonials'), (snapshot) => {
            setTestimonials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        const unsubscribeShowcase = onSnapshot(doc(db, 'site_content', 'home_showcase'), (doc) => {
            if (doc.exists()) setShowcase(doc.data());
        });
        const unsubscribeInventory = onSnapshot(collection(db, 'products'), (snap) => {
            setInventory(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        const unsubscribeClients = onSnapshot(collection(db, 'clients'), (snap) => {
            setClients(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubscribeFeatures();
            unsubscribeStats();
            unsubscribeTestimonials();
            unsubscribeShowcase();
            unsubscribeInventory();
            unsubscribeClients();
        };
    }, []);

    const handleSaveFeatures = async () => {
        setLoading(true);
        try {
            await setDoc(doc(db, 'site_content', 'home_features'), { items: features, updatedAt: serverTimestamp() });
            setMsg('Features updated!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) { console.error(err); setMsg('Error saving.'); }
        setLoading(false);
    };

    const handleSaveStats = async () => {
        setLoading(true);
        try {
            await setDoc(doc(db, 'site_content', 'home_stats'), { ...stats, updatedAt: serverTimestamp() });
            setMsg('Stats updated!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) { console.error(err); setMsg('Error saving.'); }
        setLoading(false);
    };

    const handleSaveShowcase = async () => {
        setLoading(true);
        try {
            await setDoc(doc(db, 'site_content', 'home_showcase'), { ...showcase, updatedAt: serverTimestamp() });
            setMsg('Showcase updated!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) { console.error(err); setMsg('Error saving.'); }
        setLoading(false);
    };

    const handleAddTestimonial = async (e) => {
        e.preventDefault();
        const form = e.target;
        const newTest = {
            name: form.name.value,
            role: form.role.value,
            content: form.content.value,
            avatar: form.avatar.value || `https://ui-avatars.com/api/?name=${form.name.value}&background=random`,
            createdAt: serverTimestamp()
        };
        try {
            await addDoc(collection(db, 'testimonials'), newTest);
            form.reset();
            setMsg('Testimonial added!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) { console.error(err); }
    };

    const handleDeleteTestimonial = async (id) => {
        try { await deleteDoc(doc(db, 'testimonials', id)); } catch (err) { console.error(err); }
    };

    const handleAddClient = async (e) => {
        e.preventDefault();
        const form = e.target;
        try {
            await addDoc(collection(db, 'clients'), {
                name: form.clientName.value,
                logo: form.clientLogo.value,
                createdAt: serverTimestamp()
            });
            form.reset();
            setMsg('Client added!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) { console.error(err); }
    };

    const handleDeleteClient = async (id) => {
        try { await deleteDoc(doc(db, 'clients', id)); } catch (err) { console.error(err); }
    };

    const seedHomeData = async () => {
        if(window.confirm('Seed home page with industrial glass dummy data? This will overwrite current live modules.')) {
            setLoading(true);
            try {
                await setDoc(doc(db, 'site_content', 'home_features'), { items: dummyFeatures, updatedAt: serverTimestamp() });
                await setDoc(doc(db, 'site_content', 'home_stats'), { items: dummyStats, updatedAt: serverTimestamp() });
                await setDoc(doc(db, 'site_content', 'home_showcase'), { 
                    badge: 'Premium Showcase', 
                    title: 'Elite Glass Collection.', 
                    items: dummyShowcase, 
                    updatedAt: serverTimestamp() 
                });

                // Seed Testimonials if empty
                const testSnap = await getDocs(collection(db, 'testimonials'));
                if (testSnap.empty) {
                    for (const t of dummyTestimonials) {
                        await addDoc(collection(db, 'testimonials'), { ...t, createdAt: serverTimestamp() });
                    }
                }

                // Seed Clients if empty
                const clientSnap = await getDocs(collection(db, 'clients'));
                if (clientSnap.empty) {
                    for (const c of dummyClients) {
                        await addDoc(collection(db, 'clients'), { ...c, createdAt: serverTimestamp() });
                    }
                }

                setMsg('Home Node Data Seeded Successfully');
                setTimeout(() => setMsg(''), 3000);
            } catch (err) {
                console.error(err);
                setMsg('Seed Error');
            }
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Home Architecture</h2>
                    <p className="text-slate-500 font-medium">Configure the landing page's industrial modules and engagement nodes.</p>
                </div>
                <div className="flex gap-2 items-center">
                    <button onClick={seedHomeData} className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-300 hover:bg-slate-200 transition-all flex items-center gap-2">
                        <FaDatabase className="text-slate-400" /> Demo Import
                    </button>
                    <div className="bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-300">
                        Live System Active
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <button 
                    onClick={() => setActiveSection('features')} 
                    className={`p-6 rounded-[1.5rem] border-2 text-left transition-all group relative overflow-hidden ${
                        activeSection === 'features' 
                            ? 'bg-slate-900 border-slate-900 text-white shadow-xl' 
                            : 'bg-white border-slate-100 hover:border-blue-500/30 hover:shadow-lg'
                    }`}
                >
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${activeSection === 'features' ? 'bg-white/10 text-brand-400' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
                            <FaCheckCircle className="text-lg" />
                        </div>
                        <div>
                            <h3 className={`font-black uppercase tracking-wider text-xs mb-1 ${activeSection === 'features' ? 'text-white' : 'text-slate-900'}`}>Competencies</h3>
                            <p className={`text-[10px] font-medium ${activeSection === 'features' ? 'text-slate-400' : 'text-slate-500'}`}>Core Industrial Features</p>
                        </div>
                    </div>
                </button>

                <button 
                    onClick={() => setActiveSection('stats')} 
                    className={`p-6 rounded-[1.5rem] border-2 text-left transition-all group relative overflow-hidden ${
                        activeSection === 'stats' 
                            ? 'bg-slate-900 border-slate-900 text-white shadow-xl' 
                            : 'bg-white border-slate-100 hover:border-blue-500/30 hover:shadow-lg'
                    }`}
                >
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${activeSection === 'stats' ? 'bg-white/10 text-brand-400' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
                            <FaChartBar className="text-lg" />
                        </div>
                        <div>
                            <h3 className={`font-black uppercase tracking-wider text-xs mb-1 ${activeSection === 'stats' ? 'text-white' : 'text-slate-900'}`}>Statistics</h3>
                            <p className={`text-[10px] font-medium ${activeSection === 'stats' ? 'text-slate-400' : 'text-slate-500'}`}>Performance Metrics</p>
                        </div>
                    </div>
                </button>

                <button 
                    onClick={() => setActiveSection('showcase')} 
                    className={`p-6 rounded-[1.5rem] border-2 text-left transition-all group relative overflow-hidden ${
                        activeSection === 'showcase' 
                            ? 'bg-slate-900 border-slate-900 text-white shadow-xl' 
                            : 'bg-white border-slate-100 hover:border-blue-500/30 hover:shadow-lg'
                    }`}
                >
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${activeSection === 'showcase' ? 'bg-white/10 text-brand-400' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
                            <FaStar className="text-lg" />
                        </div>
                        <div>
                            <h3 className={`font-black uppercase tracking-wider text-xs mb-1 ${activeSection === 'showcase' ? 'text-white' : 'text-slate-900'}`}>Elite Showcase</h3>
                            <p className={`text-[10px] font-medium ${activeSection === 'showcase' ? 'text-slate-400' : 'text-slate-500'}`}>Premium Asset Display</p>
                        </div>
                    </div>
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-12">
                <button 
                    onClick={() => setActiveSection('testimonials')} 
                    className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 group ${
                        activeSection === 'testimonials' 
                            ? 'bg-slate-900 border-slate-900 text-white shadow-xl' 
                            : 'bg-white border-slate-100 hover:border-blue-500/30 hover:shadow-md'
                    }`}
                >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${activeSection === 'testimonials' ? 'bg-white/10 text-brand-400' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white'}`}>
                        <FaQuoteLeft className="text-xs" />
                    </div>
                    <span className={`font-black uppercase tracking-widest text-[10px] ${activeSection === 'testimonials' ? 'text-white' : 'text-slate-600'}`}>Stakeholder Feedback</span>
                </button>

                <button 
                    onClick={() => setActiveSection('clients')} 
                    className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 group ${
                        activeSection === 'clients' 
                            ? 'bg-slate-900 border-slate-900 text-white shadow-xl' 
                            : 'bg-white border-slate-100 hover:border-blue-500/30 hover:shadow-md'
                    }`}
                >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${activeSection === 'clients' ? 'bg-white/10 text-brand-400' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white'}`}>
                        <FaHandshake className="text-xs" />
                    </div>
                    <span className={`font-black uppercase tracking-widest text-[10px] ${activeSection === 'clients' ? 'text-white' : 'text-slate-600'}`}>Client Network</span>
                </button>
            </div>

            {msg && <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-2xl font-bold text-xs">{msg}</div>}

            {activeSection === 'features' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className="p-6 bg-white rounded-[2rem] border-2 border-slate-100 shadow-sm space-y-4 relative overflow-hidden group hover:border-blue-500/50 transition-all">
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <FaCheckCircle className="text-base" />
                                        </div>
                                        <div>
                                            <h3 className="text-[10px] font-black uppercase text-slate-900 tracking-[0.2em]">Node 0{i+1}</h3>
                                            <span className="text-[7px] font-bold text-slate-400 tracking-widest uppercase">Operational</span>
                                        </div>
                                    </div>
                                    <span className="text-[8px] font-black text-slate-200">SPEC_ID_0{i+1}</span>
                                </div>
                                <div className="space-y-3 relative z-10">
                                    <input 
                                        className="w-full bg-slate-50 border border-transparent p-3 rounded-xl font-bold text-xs text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all" 
                                        placeholder="Component Title"
                                        value={features[i]?.title || ''}
                                        onChange={e => {
                                            const n = [...features];
                                            n[i] = { ...n[i], title: e.target.value };
                                            setFeatures(n);
                                        }}
                                    />
                                    <textarea 
                                        className="w-full bg-slate-50 border border-transparent p-3 rounded-xl font-medium text-xs text-slate-600 focus:bg-white focus:border-blue-500 outline-none transition-all min-h-[80px]" 
                                        placeholder="Industrial advantage..."
                                        value={features[i]?.desc || ''}
                                        onChange={e => {
                                            const n = [...features];
                                            n[i] = { ...n[i], desc: e.target.value };
                                            setFeatures(n);
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end pt-2">
                        <button onClick={handleSaveFeatures} disabled={loading} className="bg-blue-600 text-white px-10 py-4 rounded-xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95">
                            <FaSave /> Commit Core Specifications
                        </button>
                    </div>
                </div>
            )}

            {activeSection === 'stats' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-sm group hover:border-slate-400 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                        <FaChartBar size={14} />
                                    </div>
                                    <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Stat Node 0{i+1}</h5>
                                </div>
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <label className="block text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1">Metric Value</label>
                                        <input 
                                            className="w-full bg-slate-50 border border-transparent p-3 rounded-xl font-black text-center text-xl text-slate-900 focus:bg-white focus:border-slate-900 outline-none transition-all" 
                                            placeholder="Value"
                                            value={stats.items?.[i]?.value || ''}
                                            onChange={e => {
                                                const n = [...(stats.items || [])];
                                                n[i] = { ...n[i], value: e.target.value };
                                                setStats({ ...stats, items: n });
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1">Label</label>
                                        <input 
                                            className="w-full bg-slate-50 border border-transparent p-3 rounded-xl font-bold text-center text-[10px] uppercase tracking-widest text-slate-600 focus:bg-white focus:border-slate-900 outline-none transition-all" 
                                            placeholder="Label"
                                            value={stats.items?.[i]?.label || ''}
                                            onChange={e => {
                                                const n = [...(stats.items || [])];
                                                n[i] = { ...n[i], label: e.target.value };
                                                setStats({ ...stats, items: n });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pt-2 flex justify-end">
                        <button onClick={handleSaveStats} disabled={loading} className="bg-slate-900 text-white px-10 py-4 rounded-xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-2 hover:bg-black transition-all shadow-lg active:scale-95">
                            <FaSave /> Update Statistics
                        </button>
                    </div>
                </div>
            )}

            {activeSection === 'showcase' && (
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                                <div className="space-y-1">
                                    <h4 className="text-slate-900 font-black text-lg uppercase tracking-tighter">Elite Asset Configuration</h4>
                                    <p className="text-slate-400 text-[10px] font-medium uppercase tracking-widest">Premium showcase identity module</p>
                                </div>
                                <FaStar className="text-blue-600 text-xl animate-pulse" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 pl-2">Section Badge</label>
                                    <input 
                                        className="w-full bg-slate-50 border border-transparent p-4 rounded-xl font-bold text-xs focus:border-blue-500 focus:bg-white outline-none transition-all" 
                                        placeholder="Upper Identification Text"
                                        value={showcase.badge}
                                        onChange={e => setShowcase({ ...showcase, badge: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 pl-2">Headline Title</label>
                                    <input 
                                        className="w-full bg-slate-50 border border-transparent p-4 rounded-xl font-bold text-xs focus:border-blue-500 focus:bg-white outline-none transition-all" 
                                        placeholder="Primary Section Title"
                                        value={showcase.title}
                                        onChange={e => setShowcase({ ...showcase, title: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 shadow-inner">
                                <div className="flex items-center justify-between mb-2">
                                    <h5 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                        Asset Staging Array
                                    </h5>
                                    <span className="text-[8px] font-bold text-slate-400 tracking-widest uppercase italic">{showcase.items?.length || 0} Nodes</span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input id="sc-url" className="w-full bg-white border border-slate-100 p-3 rounded-xl text-[10px] font-bold outline-none focus:border-blue-500 transition-all" placeholder="Media URL" />
                                    <input id="sc-title" className="w-full bg-white border border-slate-100 p-3 rounded-xl text-[10px] font-bold outline-none focus:border-blue-500 transition-all" placeholder="Display Title" />
                                    <div className="flex gap-2">
                                        <input id="sc-cat" className="w-full bg-white border border-slate-100 p-3 rounded-xl text-[10px] font-bold outline-none focus:border-blue-500 transition-all" placeholder="Category" />
                                        <button 
                                            onClick={() => {
                                                const url = document.getElementById('sc-url').value;
                                                const title = document.getElementById('sc-title').value;
                                                const cat = document.getElementById('sc-cat').value;
                                                if(url) {
                                                    const newItem = { url, title, category: cat || 'Premium' };
                                                    setShowcase(prev => ({ ...prev, items: [...(prev.items || []), newItem] }));
                                                    document.getElementById('sc-url').value = '';
                                                    document.getElementById('sc-title').value = '';
                                                    document.getElementById('sc-cat').value = '';
                                                }
                                            }}
                                            className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg active:scale-95 flex-shrink-0"
                                        >
                                            <FaPlus className="text-xs" />
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <h5 className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Or Pick from Active Inventory</h5>
                                    <div className="flex gap-2">
                                        <select 
                                            value={selectedAsset}
                                            onChange={(e) => setSelectedAsset(e.target.value)}
                                            className="flex-1 bg-white border border-slate-200 p-3 rounded-xl text-[10px] font-bold outline-none focus:border-blue-500"
                                        >
                                            <option value="">Select a Product Asset...</option>
                                            {inventory.map(p => (
                                                <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                                            ))}
                                        </select>
                                        <button 
                                            onClick={() => {
                                                const prod = inventory.find(p => p.id === selectedAsset);
                                                if(prod) {
                                                    const newItem = { 
                                                        url: prod.imageUrl, 
                                                        title: prod.name, 
                                                        category: prod.category,
                                                        desc: prod.description 
                                                    };
                                                    setShowcase(prev => ({ ...prev, items: [...(prev.items || []), newItem] }));
                                                    setSelectedAsset('');
                                                }
                                            }}
                                            className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2"
                                        >
                                            <FaPlus /> Sync Asset
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
                                    {(showcase.items || []).map((item, idx) => (
                                        <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200">
                                            <img src={item.url} className="w-full h-full object-cover" alt="" />
                                            <div className="absolute inset-0 bg-blue-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center pointer-events-none">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const next = [...showcase.items];
                                                        next.splice(idx, 1);
                                                        setShowcase({ ...showcase, items: next });
                                                    }}
                                                    className="w-6 h-6 bg-red-500 text-white rounded-lg flex items-center justify-center transition-all active:scale-90 pointer-events-auto"
                                                >
                                                    <FaTrash size={8} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-8 relative z-10">
                            <button onClick={handleSaveShowcase} disabled={loading} className="bg-blue-600 text-white px-10 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 active:scale-95">
                                <FaSave /> Sync Global Showcase
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeSection === 'testimonials' && (
                <div className="space-y-10">
                    <form onSubmit={handleAddTestimonial} className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-8">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.3)] animate-pulse"></div>
                                <h3 className="text-slate-900 font-black uppercase tracking-[0.3em] text-[10px]">New Strategic Feedback Deployment</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TestimonialInput label="Stakeholder Entity" name="name" placeholder="Full Name / Company" required />
                                <TestimonialInput label="Executive Role" name="role" placeholder="Project Director" required />
                                <TestimonialInput label="Avatar URL" name="avatar" placeholder="https://..." className="md:col-span-2" />
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 pl-2">Feedback Payload</label>
                                    <textarea name="content" required className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs font-medium outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400 min-h-[100px]" placeholder="Architectural engagement feedback..." />
                                </div>
                            </div>
                            
                            <div className="mt-8">
                                <button type="submit" className="bg-blue-600 text-white px-10 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2">
                                    <FaPlus /> Deploy Feedback Node
                                </button>
                            </div>
                        </div>
                    </form>
 
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                            <h3 className="font-black text-slate-900 uppercase tracking-tighter text-lg">Feedback Repository</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {testimonials.map(t => (
                                <div key={t.id} className="p-6 bg-blue-50/50 rounded-[2rem] border-2 border-slate-100 flex gap-4 items-center group hover:border-blue-500/30 hover:bg-white transition-all shadow-sm">
                                    <img src={t.avatar} className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-lg" alt="" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm truncate leading-none">{t.name}</h4>
                                        <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mt-1 truncate">{t.role}</p>
                                        <div className="mt-2 flex items-center gap-0.5">
                                            {[1,2,3,4,5].map(star => <div key={star} className="w-1 h-1 bg-blue-500 rounded-full"></div>)}
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteTestimonial(t.id)} className="text-slate-300 hover:text-red-500 transition-all p-2 hover:bg-red-50 rounded-lg">
                                        <FaTrash size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeSection === 'clients' && (
                <div className="space-y-12">
                     <form onSubmit={handleAddClient} className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
                                <h3 className="text-slate-900 font-black uppercase tracking-[0.4em] text-[10px]">Initialize Partner Node</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ClientInput label="Partner Entity Name" name="clientName" placeholder="Skyline Corp. Ltd" required />
                                <ClientInput label="Vector Logo URL" name="clientLogo" placeholder="https://logo.png" required />
                            </div>
                            <button type="submit" className="mt-8 bg-blue-600 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-black transition-all flex items-center gap-4 shadow-2xl shadow-blue-600/20">
                                <FaPlus /> Deploy to Terminal
                            </button>
                        </div>
                    </form>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {clients.map(c => (
                            <div key={c.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center group relative hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-500">
                                <img src={c.logo} className="h-12 w-auto object-contain grayscale group-hover:grayscale-0 transition-all" alt={c.name} />
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={() => handleDeleteClient(c.id)} className="bg-red-50 text-red-500 p-2 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                        <FaTrash size={10} />
                                    </button>
                                </div>
                                <div className="mt-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center truncate w-full">{c.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const TestimonialInput = ({ label, name, placeholder, required, className = "" }) => (
    <div className={`space-y-2 ${className}`}>
        <label className="text-[8px] font-black uppercase tracking-[0.4em] text-blue-500 pl-2">{label}</label>
        <input name={name} required={required} className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl text-slate-900 font-bold text-sm outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400" placeholder={placeholder} />
    </div>
);

const ClientInput = ({ label, name, placeholder, required, className = "" }) => (
    <div className={`space-y-2 ${className}`}>
        <label className="text-[8px] font-black uppercase tracking-[0.4em] text-blue-500 pl-2">{label}</label>
        <input name={name} required={required} className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl text-slate-900 font-bold text-sm outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400" placeholder={placeholder} />
    </div>
);

export default HomeManager;
