import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaSearch, FaFilter, FaBox, FaLayerGroup, FaImage, FaTools, FaDatabase, FaShieldAlt, FaTemperatureHigh, FaVial, FaBuilding, FaCogs, FaChevronRight, FaArrowLeft } from 'react-icons/fa';
import { dummyProducts } from '../../utils/dummyData';

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [adminView, setAdminView] = useState('nexus'); // 'nexus' (grid) or 'registry' (list)
    const [selectedAdminCategory, setSelectedAdminCategory] = useState(null);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        imageUrl: '',
        specs: '',
        parentType: ''
    });
    
    // Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const [categories, setCategories] = useState([]);
    const [editCategories, setEditCategories] = useState(false);

    useEffect(() => {
        const unsubscribeProds = onSnapshot(collection(db, 'products'), (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(list);
        });
        const unsubscribeCats = onSnapshot(doc(db, 'site_content', 'product_categories'), (doc) => {
            if (doc.exists()) setCategories(doc.data().items || []);
        });
        return () => {
            unsubscribeProds();
            unsubscribeCats();
        };
    }, []);

    const handleSaveCategories = async () => {
        setLoading(true);
        try {
            await updateDoc(doc(db, 'site_content', 'product_categories'), {
                items: categories,
                updatedAt: serverTimestamp()
            });
            setMsg('Category Architecture Synchronized');
            setTimeout(() => setMsg(''), 3000);
            setEditCategories(false);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const CategoryIcon = ({ iconName }) => {
        const icons = {
            FaShieldAlt: <FaShieldAlt />,
            FaLayerGroup: <FaLayerGroup />,
            FaTemperatureHigh: <FaTemperatureHigh />,
            FaVial: <FaVial />,
            FaBuilding: <FaBuilding />,
            FaCogs: <FaCogs />,
            FaTools: <FaTools />,
            FaBox: <FaBox />
        };
        return icons[iconName] || <FaBox />;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSave = {
                ...formData,
                category: selectedAdminCategory ? selectedAdminCategory.name : formData.category,
                parentType: selectedAdminCategory ? selectedAdminCategory.id : (formData.parentType || '')
            };

            if (currentProduct) {
                await updateDoc(doc(db, 'products', currentProduct.id), {
                    ...dataToSave,
                    updatedAt: serverTimestamp()
                });
                setMsg('Registry Node Updated');
            } else {
                await addDoc(collection(db, 'products'), {
                    ...dataToSave,
                    createdAt: serverTimestamp()
                });
                setMsg('New Asset Indexed');
            }
            setTimeout(() => setMsg(''), 3000);
            closeForm();
        } catch (error) {
            console.error("Error saving product:", error);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this asset from registry permanently?')) {
            try {
                await deleteDoc(doc(db, 'products', id));
            } catch (error) {
                console.error("Error deleting:", error);
            }
        }
    };

    const openEdit = (product) => {
        setCurrentProduct(product);
        setFormData(product);
        setIsEditing(true);
    };

    const closeForm = () => {
        setIsEditing(false);
        setCurrentProduct(null);
        setFormData({ name: '', category: '', description: '', imageUrl: '', specs: '', parentType: '' });
    };

    const seedProducts = async () => {
        if(window.confirm('Import structural reference assets?')) {
            setLoading(true);
            try {
                const promises = dummyProducts.map(p => addDoc(collection(db, 'products'), { ...p, createdAt: serverTimestamp() }));
                await Promise.all(promises);
                setMsg('Reference Data Imported');
                setTimeout(() => setMsg(''), 3000);
            } catch (err) {
                console.error(err);
                setMsg('Import Failed');
            }
            setLoading(false);
        }
    };

    const getCount = (catId) => products.filter(p => (p.parentType || '').toLowerCase() === catId.toLowerCase() || (p.category || '').toLowerCase().includes(catId.toLowerCase())).length;

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedAdminCategory || 
                                (p.parentType || '').toLowerCase() === selectedAdminCategory.id.toLowerCase() || 
                                (p.category || '').toLowerCase().includes(selectedAdminCategory.id.toLowerCase());
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8 pb-20">
            {/* Admin Header Context */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-3 text-brand-600 text-[10px] font-black uppercase tracking-[0.5em] mb-3">
                        <div className="w-2 h-2 bg-brand-600 rounded-full animate-pulse shadow-[0_0_15px_rgba(37,99,235,0.6)]"></div> Asset Master Control
                    </div>
                    <h2 className="text-4xl font-black text-slate-950 uppercase tracking-tighter italic">
                        {adminView === 'nexus' ? 'Main Portfolio Index' : `${selectedAdminCategory?.name} Registry`}
                    </h2>
                </div>
                
                <div className="flex gap-4">
                    <button 
                        onClick={() => setEditCategories(!editCategories)}
                        className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 border ${
                            editCategories 
                                ? 'bg-slate-900 text-cyan-400 border-slate-900' 
                                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                        <FaLayerGroup /> {editCategories ? 'Close Categories' : 'Manage Categories'}
                    </button>
                    {adminView === 'registry' && (
                        <button 
                            onClick={() => { setAdminView('nexus'); setSelectedAdminCategory(null); }}
                            className="px-6 py-3 bg-slate-100 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-3 border border-slate-200"
                        >
                            <FaArrowLeft className="text-slate-400" /> Back to Nexus
                        </button>
                    )}
                    <button 
                        onClick={seedProducts}
                        className="px-6 py-3 bg-white text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3 border border-slate-200"
                    >
                        <FaDatabase className="text-slate-300" /> Demo Sync
                    </button>
                    <button 
                        onClick={() => { setIsEditing(true); if(!selectedAdminCategory) setFormData({...formData, category: 'General'}); }}
                        className="px-8 py-3 bg-brand-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-700 transition-all flex items-center gap-3 shadow-xl shadow-brand-600/20"
                    >
                        <FaPlus /> Index New Asset
                    </button>
                </div>
            </div>

            {msg && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-slate-900 text-cyan-400 rounded-2xl text-center font-black uppercase tracking-widest text-[10px] shadow-2xl">
                    {msg}
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                {editCategories ? (
                    <motion.div 
                        key="cat-manager"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.map((cat, idx) => (
                                <div key={cat.id || idx} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="w-10 h-10 bg-slate-50 text-brand-600 rounded-xl flex items-center justify-center border border-slate-100">
                                            <CategoryIcon iconName={cat.icon} />
                                        </div>
                                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">CAT_NODE_{idx+1}</span>
                                    </div>
                                    <input 
                                        className="w-full bg-slate-50 border-none p-3 rounded-xl font-black text-xs uppercase"
                                        value={cat.name}
                                        onChange={e => {
                                            const n = [...categories];
                                            n[idx] = { ...n[idx], name: e.target.value };
                                            setCategories(n);
                                        }}
                                        placeholder="Category Name"
                                    />
                                    <textarea 
                                        className="w-full bg-slate-50 border-none p-3 rounded-xl font-medium text-[10px] h-16 resize-none"
                                        value={cat.desc}
                                        onChange={e => {
                                            const n = [...categories];
                                            n[idx] = { ...n[idx], desc: e.target.value };
                                            setCategories(n);
                                        }}
                                        placeholder="Description..."
                                    />
                                    <input 
                                        className="w-full bg-slate-50 border-none p-3 rounded-xl font-bold text-[8px] text-blue-500"
                                        value={cat.image}
                                        onChange={e => {
                                            const n = [...categories];
                                            n[idx] = { ...n[idx], image: e.target.value };
                                            setCategories(n);
                                        }}
                                        placeholder="Image URL"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end">
                            <button onClick={handleSaveCategories} disabled={loading} className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3">
                                <FaSave /> Save Category Architecture
                            </button>
                        </div>
                    </motion.div>
                ) : isEditing ? (
                    <motion.div 
                        key="edit-form"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent pointer-events-none"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-12">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">
                                        {currentProduct ? 'Modify Asset Data' : 'Initialize New Registry Node'}
                                    </h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic">
                                        Target: {selectedAdminCategory?.name || 'Global Unassigned'}
                                    </p>
                                </div>
                                <button onClick={closeForm} className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                                    <FaTimes size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Asset Designation</label>
                                        <input 
                                            className="w-full bg-slate-50 border-2 border-slate-50 p-5 rounded-3xl font-black text-lg text-slate-950 focus:bg-white focus:border-brand-500 outline-none transition-all shadow-inner" 
                                            value={formData.name || formData.title} 
                                            onChange={e => setFormData({...formData, name: e.target.value, title: e.target.value})} 
                                            placeholder="e.g. V7-Industrial Tempered"
                                            required 
                                        />
                                    </div>

                                    {!selectedAdminCategory && (
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Master Category Mapping</label>
                                            <select 
                                                className="w-full bg-slate-50 border-2 border-slate-50 p-5 rounded-3xl font-black text-xs text-slate-950 focus:bg-white focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer"
                                                value={formData.parentType || formData.category}
                                                onChange={e => {
                                                    const selected = categories.find(c => c.name === e.target.value);
                                                    setFormData({...formData, parentType: selected ? selected.id : '', category: e.target.value});
                                                }}
                                            >
                                                <option value="">Select Master Node</option>
                                                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                            </select>
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Digital Asset (Image URL)</label>
                                        <div className="relative group">
                                            <FaImage className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-600 transition-colors" />
                                            <input 
                                                className="w-full bg-slate-50 border-2 border-slate-50 p-5 pl-14 rounded-3xl font-bold text-[10px] text-brand-600 focus:bg-white focus:border-brand-500 outline-none transition-all" 
                                                type="url"
                                                placeholder="Enter full HTTPS image source..."
                                                value={formData.imageUrl} 
                                                onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Infrastructure Narrative (Description)</label>
                                        <textarea 
                                            className="w-full bg-slate-50 border-2 border-slate-50 p-6 rounded-3xl font-medium text-xs text-slate-600 focus:bg-white focus:border-brand-500 outline-none transition-all h-36 resize-none shadow-inner leading-relaxed" 
                                            value={formData.description} 
                                            onChange={e => setFormData({...formData, description: e.target.value})} 
                                            placeholder="Supporting structural glass technical details..."
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Performance Standards (Specs)</label>
                                        <input 
                                            className="w-full bg-slate-50 border-2 border-slate-50 p-5 rounded-3xl font-bold text-xs text-slate-950 focus:bg-white focus:border-brand-500 outline-none transition-all shadow-inner" 
                                            placeholder="e.g. 12mm thick, V2-Calibration"
                                            value={formData.specs} 
                                            onChange={e => setFormData({...formData, specs: e.target.value})} 
                                        />
                                    </div>

                                    <div className="flex gap-6 pt-6">
                                        <button 
                                            type="submit" 
                                            disabled={loading}
                                            className="flex-[2] bg-slate-950 text-white p-6 rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-4 hover:bg-black transition-all shadow-2xl disabled:opacity-50"
                                        >
                                            <FaSave className="text-cyan-400" /> Commit to Node
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={closeForm}
                                            className="flex-1 bg-slate-100 text-slate-500 p-6 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                ) : adminView === 'nexus' ? (
                    <motion.div 
                        key="admin-nexus"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {categories.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                whileHover={{ scale: 1.02, y: -5 }}
                                className="group relative h-80 rounded-[3rem] overflow-hidden cursor-pointer border-[3px] border-white shadow-xl hover:border-brand-600/30 transition-all duration-500"
                                onClick={() => { setSelectedAdminCategory(item); setAdminView('registry'); }}
                            >
                                <img src={item.image} className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" alt={item.name} />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent group-hover:from-slate-950/80 transition-all"></div>
                                
                                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                                    <div className="w-14 h-14 bg-brand-600 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-2xl shadow-brand-600/30">
                                        <CategoryIcon iconName={item.icon} />
                                    </div>
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-2">{item.name}</h3>
                                    
                                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                        <div className="flex flex-col">
                                            <span className="text-[12px] font-black text-brand-400 uppercase tracking-widest">{getCount(item.id)} Assets</span>
                                            <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest italic">Managed Registry</span>
                                        </div>
                                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white group-hover:bg-brand-600 transition-all">
                                            <FaChevronRight size={10} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div 
                        key="admin-registry"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Search Bar */}
                        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
                            <div className="relative flex-grow group">
                                <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-600 transition-colors" />
                                <input 
                                    className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-16 rounded-2xl font-black text-xs text-slate-950 focus:bg-white focus:border-brand-500 outline-none transition-all shadow-inner" 
                                    placeholder={`Search within ${selectedAdminCategory?.name} registry...`}
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100">
                                Showing {filteredProducts.length} Results
                            </div>
                        </div>

                        {/* Product Grid (Admin) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                            {filteredProducts.map((product) => (
                                <motion.div 
                                    key={product.id}
                                    layout
                                    className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-100 border border-slate-100 shadow-xl"
                                >
                                    <img src={product.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" alt={product.name} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent group-hover:from-slate-950 transition-all duration-700 p-8 flex flex-col justify-end">
                                        <div className="text-[8px] font-black text-brand-400 uppercase tracking-widest mb-2 opacity-60">ID: {product.id.slice(-6)}</div>
                                        <h4 className="text-xl font-black text-white uppercase tracking-tighter italic mb-6 leading-none">{product.name || product.title}</h4>
                                        
                                        <div className="flex gap-3 mt-4">
                                            <button 
                                                onClick={() => openEdit(product)}
                                                className="flex-1 bg-white/10 backdrop-blur-md text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-600 transition-all border border-white/10"
                                            >
                                                <FaEdit /> Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(product.id)}
                                                className="bg-rose-500/20 backdrop-blur-md text-rose-500 w-12 h-12 rounded-xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all border border-rose-500/30"
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {filteredProducts.length === 0 && (
                                <div className="col-span-full py-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[3rem] bg-slate-50">
                                    <FaBox className="text-7xl text-slate-200 mb-8" />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.5em]">No Assets Identified in this Node</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductManager;
