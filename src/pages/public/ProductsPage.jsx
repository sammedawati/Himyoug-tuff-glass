import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import {  pageTransition } from '../../utils/animations';
import {  FaLayerGroup, FaCogs, FaChevronRight,  FaShieldAlt, FaTemperatureHigh, FaBuilding, FaVial, FaPencilRuler, FaProjectDiagram, FaTools, FaBox } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { useFadeIn, useStaggerFadeIn, useParallax } from '../../hooks/useGsap';

const ProductsPage = () => {
    const { category: urlCategory } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [pageContent, setPageContent] = useState({
        title: 'Industrial Asset Registry',
        subtitle: 'Exploring high-performance structural glass solutions engineered for institutional excellence.',
        bgImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=2000'
    });

    const productsHeaderRef = useFadeIn('up', 60, 0.2);
    const productsGridRef = useStaggerFadeIn(0.1);
    const categoryHeaderRef = useStaggerFadeIn(0.2);
    const categoryGridRef = useStaggerFadeIn(0.1);
    const registryParallaxRef = useParallax(25);
    const categoryParallaxRef = useParallax(20);

    useEffect(() => {
        const unsubscribeProds = onSnapshot(collection(db, 'products'), (snapshot) => {
            setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false); // Set loading to false once products are fetched
        });

        const unsubscribeCats = onSnapshot(doc(db, 'site_content', 'product_categories'), (doc) => {
            if (doc.exists()) {
                const fetchedCategories = doc.data().items || [];
                setCategories(fetchedCategories);
                // If a URL category is present, try to set it as selected
                if (urlCategory) {
                    const decodedCat = decodeURIComponent(urlCategory);
                    const foundCat = fetchedCategories.find(cat => cat.name.toLowerCase() === decodedCat.toLowerCase());
                    if (foundCat) {
                        setSelectedCategory(foundCat.name);
                    } else {
                        setSelectedCategory(null); // Or a default if not found
                    }
                } else {
                    // Default to the first category or 'All Assets' if no URL category
                    setSelectedCategory(fetchedCategories.length > 0 ? fetchedCategories[0].name : null);
                }
            }
        });

        const unsubscribePageContent = onSnapshot(doc(db, 'page_content', 'products'), (doc) => {
            if (doc.exists()) setPageContent(prev => ({ ...prev, ...doc.data() }));
        });

        return () => {
            unsubscribeProds();
            unsubscribeCats();
            unsubscribePageContent();
        };
    }, [urlCategory]); // Re-run if urlCategory changes to update selectedCategory

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

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === null || product.category === selectedCategory || (product.parentType && product.parentType === selectedCategory.toLowerCase());
        const title = product.title || product.name || '';
        const description = product.description || '';
        const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (urlCategory) {
        const decodedCat = decodeURIComponent(urlCategory);
        const currentCategory = categories.find(p => p.name.toLowerCase() === decodedCat.toLowerCase()) || { name: decodedCat, image: pageContent.bgImage, id: decodedCat.toLowerCase(), desc: 'No description available.' };
        
        const categoryProducts = products.filter(p => {
            const searchKey = currentCategory.id.toLowerCase();
            const nameKey = currentCategory.name.toLowerCase().split(' ')[0];
            const pName = (p.title || p.name || '').toLowerCase();
            const pCat = (p.category || '').toLowerCase();
            const pParent = (p.parentType || '').toLowerCase();

            return pCat.includes(searchKey) || 
                   pName.includes(searchKey) || 
                   pCat.includes(nameKey) || 
                   pName.includes(nameKey) || 
                   pParent === searchKey;
        });

        return (
            <motion.div 
                variants={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                className="min-h-screen bg-slate-50"
            >
                {/* Minimal Full Width Header */}
                <section className="relative min-h-[60vh] flex flex-col pt-24 bg-slate-950 overflow-hidden">
                    <div ref={categoryParallaxRef} className="absolute inset-0 z-0 opacity-50 grayscale">
                        <img src={currentCategory.image} className="w-full h-full object-cover scale-110" alt={currentCategory.name} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950/40"></div>
                    
                    <div className="w-full relative z-10 flex flex-col items-center justify-center px-10 flex-grow pb-12">
                        <button 
                            onClick={() => navigate('/products')}
                            className="absolute top-10 md:top-24 left-10 flex items-center gap-4 text-white hover:text-brand-400 transition-all uppercase text-[10px] font-black tracking-[0.4em] group"
                        >
                            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-brand-400 group-hover:bg-brand-400/10">
                                <FaChevronRight className="rotate-180 translate-x-[-1px]" />
                            </div> Portfolio Index
                        </button>
                        
                        <div
                            ref={categoryHeaderRef}
                            className="text-center max-w-7xl mx-auto"
                        >
                            <div className="text-[10px] font-black text-brand-400 uppercase tracking-[0.6em] mb-4 bg-brand-400/10 px-6 py-2 rounded-full border border-brand-400/20 inline-block">
                                Material Category Registry
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic leading-[0.8] mb-6 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                {currentCategory.name}
                            </h1>
                            
                            <p className="text-white/40 text-sm md:text-base font-bold uppercase tracking-[0.3em] max-w-3xl mx-auto mb-8 leading-relaxed">
                                {currentCategory.desc}
                            </p>

                            <div className="flex items-center justify-center gap-6">
                                <div className="h-[2px] w-20 bg-brand-600/30"></div>
                                <div className="text-sm font-black text-brand-400 uppercase tracking-[0.5em]">
                                    {categoryProducts.length} System Nodes Identified
                                </div>
                                <div className="h-[2px] w-20 bg-brand-600/30"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Full Width Grid */}
                <section className="py-12 px-8">
                    <div ref={categoryGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                        {categoryProducts.map((product, idx) => (
                            <div 
                                key={product.id}
                                className="group"
                            >
                                <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-slate-100 mb-6 shadow-2xl transition-all duration-700 group-hover:-translate-y-4">
                                    <img 
                                        src={product.imageUrl} 
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" 
                                        alt={product.name} 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                                        <button 
                                            onClick={() => navigate('/quote')}
                                            className="bg-brand-600 text-white w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:text-brand-600 transition-all"
                                        >
                                            Inquire Specifications <FaChevronRight size={8} />
                                        </button>
                                    </div>
                                </div>
                                <div className="px-4">
                                    <div className="text-[9px] font-black text-brand-600 uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-brand-600 rounded-full"></div> {product.id.slice(-8)}
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tighter italic hover:text-brand-600 transition-colors cursor-pointer">{product.title || product.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {categoryProducts.length === 0 && (
                        <div className="text-center py-40 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200">
                            <FaProjectDiagram className="text-8xl text-slate-200 mx-auto mb-8 animate-pulse" />
                            <h2 className="text-3xl font-black text-slate-300 uppercase tracking-[0.5em]">No Data Mapped</h2>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-4">Registry synchronization in progress for category: {currentCategory.name}</p>
                        </div>
                    )}
                </section>
            </motion.div>
        );
    }

    return (
        <motion.div 
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen bg-white"
        >
            {/* Cinematic Hero Section */}
            <section className="relative min-h-[60vh] flex items-center pt-24 pb-12 bg-slate-950 overflow-hidden">
                <div ref={registryParallaxRef} className="absolute inset-0 z-0">
                    <img 
                        src={pageContent.bgImage} 
                        className="w-full h-full object-cover grayscale opacity-35 scale-110"
                        alt="Hero"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/40 to-white"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div ref={productsHeaderRef} className="max-w-5xl mx-auto">
                        <div className="bg-brand-600/20 text-brand-400 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.5em] inline-block mb-10 border border-brand-500/30">
                            Verified Production Protocols
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white leading-[0.9] uppercase tracking-tighter mb-8 italic">
                            {pageContent.title}
                        </h1>
                        <p className="text-base md:text-lg text-white font-bold leading-relaxed max-w-2xl mx-auto opacity-100 uppercase tracking-widest drop-shadow-md">
                            {pageContent.subtitle}
                        </p>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 text-[10vw] font-black text-slate-100/10 pointer-events-none select-none tracking-tighter uppercase leading-none z-0 whitespace-nowrap">
                    Material Registry 2026
                </div>
            </section>

            <section className="relative py-16 px-6 -mt-12 z-20">
                <div className="container mx-auto">
                    <div ref={productsGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((item, idx) => ( // Changed from mainProducts to categories
                            <div
                                key={item.id}
                                onClick={() => navigate(`/products/${encodeURIComponent(item.name)}`)}
                                className={`group relative h-[24rem] rounded-[3rem] overflow-hidden cursor-pointer border-[3px] transition-all duration-700 ${
                                    urlCategory === item.name 
                                    ? 'border-brand-600 shadow-[0_50px_100px_-20px_rgba(37,99,235,0.3)]' 
                                    : 'border-white shadow-2xl hover:border-brand-600/30'
                                }`}
                            >
                                <img src={item.image} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" alt={item.name} />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent group-hover:from-brand-950/90 transition-all duration-700"></div>
                                
                                <div className="absolute inset-0 p-12 flex flex-col justify-end">
                                    <div className="w-16 h-16 bg-brand-600 text-white rounded-[1.5rem] flex items-center justify-center text-3xl mb-8 shadow-2xl shadow-brand-600/40 border border-brand-400/30">
                                        <CategoryIcon iconName={item.icon} /> {/* Used CategoryIcon */}
                                    </div>
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-4 italic">{item.name}</h3>
                                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 max-w-[80%]">{item.desc}</p>
                                    
                                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-brand-400 uppercase tracking-widest">{item.count}</span>
                                            <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Active Protocols</span>
                                        </div>
                                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:bg-brand-600 transition-all">
                                            <FaChevronRight size={12} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </motion.div>
    );
};

export default ProductsPage;
