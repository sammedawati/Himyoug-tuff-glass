import React, { useState, useEffect } from 'react';
import { FaBox, FaEnvelope, FaSignOutAlt, FaImages, FaCalendarAlt, FaCogs, FaInfoCircle, FaIndustry, FaExternalLinkAlt, FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../../services/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import ProductManager from '../../components/admin/ProductManager';
import GalleryManager from '../../components/admin/GalleryManager';
import EventsManager from '../../components/admin/EventsManager';
import SiteSettingsManager from '../../components/admin/SiteSettingsManager';
import AboutManager from '../../components/admin/AboutManager';
import FacilitiesManager from '../../components/admin/FacilitiesManager';
import PageContentManager from '../../components/admin/PageContentManager';
import ContactManager from '../../components/admin/ContactManager';
import FooterManager from '../../components/admin/FooterManager';
import HomeManager from '../../components/admin/HomeManager';
import { staggerContainer, fadeInUp } from '../../utils/animations';
import { FaPhone, FaLayerGroup, FaHome } from 'react-icons/fa';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('inquiries');

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/admin/login');
    };

    const renderContent = () => {
        return (
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
            >
                {(() => {
                    switch (activeTab) {
                        case 'inquiries': return <InquiriesModule />;
                        case 'products': return <ProductManager />;
                        case 'gallery': return <GalleryManager />;
                        case 'events': return <EventsManager />;
                        case 'about': return <AboutManager />;
                        case 'facilities': return <FacilitiesManager />;
                        case 'contact': return <ContactManager />;
                        case 'footer': return <FooterManager />;
                        case 'home': return <HomeManager />;
                        case 'page_heros': return <PageContentManager />;
                        case 'settings': return <SiteSettingsManager />;
                        default: return <div className="text-center text-gray-500 mt-20">Select a module from the sidebar.</div>;
                    }
                })()}
            </motion.div>
        );
    };

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col shadow-2xl border-r border-white/5">
                <div className="py-4 px-6 border-b border-white/5">
                    <h1 className="text-lg font-black tracking-tighter uppercase whitespace-nowrap italic">Admin <span className="text-brand-500">Workspace</span></h1>
                </div>
                <nav className="mt-4 flex-1 space-y-1 px-3 overflow-y-auto custom-scrollbar">
                    <div className="px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 mt-4">Command Center</div>
                    <SidebarItem icon={<FaEnvelope />} label="Inquiries" id="inquiries" active={activeTab} set={setActiveTab} />

                    <div className="px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 mt-4">Site Management</div>
                    <SidebarItem icon={<FaHome />} label="Home" id="home" active={activeTab} set={setActiveTab} />
                    <SidebarItem icon={<FaInfoCircle />} label="About" id="about" active={activeTab} set={setActiveTab} />
                    <SidebarItem icon={<FaBox />} label="Products" id="products" active={activeTab} set={setActiveTab} />
                    <SidebarItem icon={<FaIndustry />} label="Facilities" id="facilities" active={activeTab} set={setActiveTab} />
                    <SidebarItem icon={<FaImages />} label="Gallery" id="gallery" active={activeTab} set={setActiveTab} />
                    <SidebarItem icon={<FaCalendarAlt />} label="Events" id="events" active={activeTab} set={setActiveTab} />
                    <SidebarItem icon={<FaPhone />} label="Contact" id="contact" active={activeTab} set={setActiveTab} />
                    <SidebarItem icon={<FaImages />} label="Hero Sections" id="page_heros" active={activeTab} set={setActiveTab} />
                    <SidebarItem icon={<FaLayerGroup />} label="Footer" id="footer" active={activeTab} set={setActiveTab} />
                    <SidebarItem icon={<FaCogs />} label="Platform Config" id="settings" active={activeTab} set={setActiveTab} />
                </nav>
                <div className="p-3 bg-slate-950/50 border-t border-white/5 space-y-1">
                    <Link to="/" className="flex items-center space-x-3 text-gray-400 hover:text-white w-full px-4 py-1.5 rounded-xl hover:bg-white/5 transition-all text-[11px] font-black uppercase tracking-widest">
                        <FaExternalLinkAlt className="text-[10px]" /> <span>Visit Website</span>
                    </Link>
                    <button onClick={handleLogout} className="flex items-center space-x-3 bg-red-500 text-white w-full px-4 py-2 rounded-xl hover:bg-red-600 transition-all text-[11px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20">
                        <FaSignOutAlt className="text-[10px]" /> <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen relative">
                <header className="bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-30 px-10 py-5 flex justify-between items-center md:hidden">
                    <h1 className="font-black text-xl uppercase tracking-tighter">Admin Control</h1>
                    <button onClick={handleLogout} className="text-red-500"><FaSignOutAlt size={24} /></button>
                </header>
                <div className="p-10 max-w-7xl mx-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

const SidebarItem = ({ icon, label, id, active, set }) => (
    <button
        onClick={() => set(id)}
        className={`w-full text-left px-4 py-2.5 rounded-xl flex items-center space-x-3 transition-all duration-300 group ${active === id
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
    >
        <div className={`text-sm transition-transform duration-500 group-hover:rotate-12 ${active === id ? 'text-white' : 'text-gray-500 group-hover:text-brand-400'}`}>
            {icon}
        </div>
        <span className="font-black text-[11px] uppercase tracking-[0.15em]">{label}</span>
    </button>
);

const InquiriesModule = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterDate, setFilterDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeType, setActiveType] = useState('All');

    useEffect(() => {
        const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().createdAt?.toDate() || new Date()
            }));
            setData(items);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const types = ['All', 'General', 'Technical', 'Sales', 'Strategic'];

    const filteredInquiries = data.filter(item => {
        const matchesDate = !filterDate || item.date.toISOString().split('T')[0] === filterDate;
        const matchesSearch = !searchTerm ||
            item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.message?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = activeType === 'All' || item.type === activeType.toLowerCase() + '_inquiry';
        return matchesDate && matchesSearch && matchesType;
    });

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 bg-white shadow-sm border border-gray-100 rounded-none">
            <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Node Cluster...</p>
        </div>
    );

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-8"
        >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                    <motion.h2 variants={fadeInUp} className="text-4xl font-black text-gray-900 tracking-tight uppercase">Intelligence Feed</motion.h2>
                    <motion.p variants={fadeInUp} className="text-gray-500 font-medium tracking-tight uppercase text-[10px]">Strategic monitoring of commercial and technical transmissions.</motion.p>
                </div>

                <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    {/* Search Node */}
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 flex-1 lg:flex-initial min-w-[280px]">
                        <FaSearch className="text-slate-300 text-xs" />
                        <input
                            type="text"
                            placeholder="SEARCH STAKEHOLDERS..."
                            className="bg-transparent border-none text-[10px] font-black p-0 focus:ring-0 w-full placeholder:text-slate-300 uppercase"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Date Logic */}
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Log Date</span>
                        <input
                            type="date"
                            className="bg-transparent border-none text-[10px] font-black p-0 focus:ring-0 cursor-pointer uppercase"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                        />
                    </div>

                    <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Active</span>
                    </div>
                </motion.div>
            </div>

            {/* Category Transmission Filter */}
            <motion.div variants={fadeInUp} className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {types.map(t => (
                    <button
                        key={t}
                        onClick={() => setActiveType(t)}
                        className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${activeType === t
                                ? 'bg-slate-900 text-cyan-400 border-slate-900 shadow-lg'
                                : 'bg-white text-slate-400 border-gray-100 hover:border-slate-300'
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden border border-gray-100 rounded-none">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead>
                            <tr className="bg-slate-900 text-white">
                                <th className="px-8 py-3 text-left text-[9px] font-black uppercase tracking-[0.3em] border-r border-white/5">Stakeholder</th>
                                <th className="px-8 py-3 text-left text-[9px] font-black uppercase tracking-[0.3em] border-r border-white/5">Primary Email</th>
                                <th className="px-8 py-3 text-left text-[9px] font-black uppercase tracking-[0.3em] border-r border-white/5">Mobile No</th>
                                <th className="px-8 py-3 text-left text-[9px] font-black uppercase tracking-[0.3em] border-r border-white/5">Payload Summary</th>
                                <th className="px-8 py-3 text-left text-[9px] font-black uppercase tracking-[0.3em]">Entry Log</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-50/50">
                            {filteredInquiries.length > 0 ? filteredInquiries.map((item, idx) => (
                                <motion.tr
                                    key={item.id}
                                    className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
                                    whileHover={{ backgroundColor: 'rgba(225, 230, 236, 0.4)' }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <td className="px-8 py-4 whitespace-nowrap border-r border-gray-50/50">
                                        <div className="font-black text-gray-900 uppercase tracking-tight text-xs">{item.name}</div>
                                        <div className="text-[8px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">Commercial Intel</div>
                                    </td>
                                    <td className="px-8 py-4 whitespace-nowrap border-r border-gray-50/50">
                                        <div className="text-xs font-bold text-gray-600 tracking-tight">{item.email}</div>
                                    </td>
                                    <td className="px-8 py-4 whitespace-nowrap border-r border-gray-50/50">
                                        <div className="text-xs font-black text-slate-900 tracking-tighter tabular-nums">{item.phone}</div>
                                    </td>
                                    <td className="px-8 py-4 border-r border-gray-50/50">
                                        <div className="text-xs text-gray-500 font-medium line-clamp-1 max-w-xs italic tracking-tight">
                                            {item.message}
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 whitespace-nowrap text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] tabular-nums">
                                        {item.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                                    </td>
                                </motion.tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-10 text-center text-xs font-black uppercase text-gray-400 tracking-widest">
                                        No inquiries found for selected date payload.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AdminDashboard;
