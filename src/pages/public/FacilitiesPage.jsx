import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { FaIndustry, FaCogs, FaTools, FaCheckCircle, FaRobot, FaMicrochip, FaShieldAlt, FaAtom, FaDiceD6, FaFingerprint } from 'react-icons/fa';
import { useFadeIn, useStaggerFadeIn, useParallax } from '../../hooks/useGsap';
import { pageTransition } from '../../utils/animations';

const FacilitiesPage = () => {
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [techNodes, setTechNodes] = useState([]);
    const [pageContent, setPageContent] = useState({
        title: 'Industrial Infrastructure',
        subtitle: 'State-of-the-art manufacturing facility equipped with advanced robotic precision and smart inspection systems.',
        bgImage: 'https://images.unsplash.com/photo-1517420812314-8b17177f0a99?auto=format&fit=crop&q=80&w=2000'
    });

    const facilitiesHeroRef = useFadeIn('up', 80, 0.2);
    const techBarRef = useFadeIn('up', 40, 0.4);
    const facilitiesGridRef = useStaggerFadeIn(0.1);
    const facilitiesParallaxRef = useParallax(15);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'facilities'), snapshot => {
            setFacilities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });

        const unsubscribePage = onSnapshot(doc(db, 'page_content', 'facilities'), (doc) => {
          if (doc.exists()) {
            setPageContent(prev => ({ ...prev, ...doc.data() }));
          }
        });

        const unsubscribeTech = onSnapshot(doc(db, 'site_content', 'facilities'), (doc) => {
            if (doc.exists()) {
                setTechNodes(doc.data().techNodes || []);
            }
        });

        return () => {
            unsubscribe();
            unsubscribePage();
            unsubscribeTech();
        };
    }, []);

    const TechIcon = ({ iconName }) => {
        const icons = {
            FaRobot: <FaRobot />,
            FaAtom: <FaAtom />,
            FaFingerprint: <FaFingerprint />,
            FaMicrochip: <FaMicrochip />,
            FaShieldAlt: <FaShieldAlt />,
            FaCogs: <FaCogs />,
            FaIndustry: <FaIndustry />,
            FaEye: <FaIndustry /> // Using industry as fallback or specifically identifying Eye
        };
        // Special case for FaEye if it's imported (adding to FaIndustry list above)
        return icons[iconName] || <FaCogs />;
    };


    return (
        <motion.div 
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen bg-white"
         >
            {/* Massive Cinematic Hero */}
            <section className="relative min-h-[60vh] flex items-center pt-24 pb-12 bg-slate-950 overflow-hidden">
                <div ref={facilitiesParallaxRef} className="absolute inset-0 z-0 opacity-40 grayscale">
                    <img 
                        src={pageContent.bgImage} 
                        alt="Infrastructure" 
                        className="w-full h-full object-cover scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950/40"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div
                        ref={facilitiesHeroRef}
                        className="max-w-4xl sm:max-w-5xl mx-auto"
                    >
                        <div className="bg-brand-600/20 text-brand-400 px-3 sm:px-4 md:px-5 py-1.5 rounded-full text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] inline-block mb-4 sm:mb-6 md:mb-8 border border-brand-500/30">
                            Infrastructure Core Registry
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[0.9] uppercase tracking-tighter mb-4 sm:mb-6 md:mb-8 italic px-2">
                            {pageContent.title}
                        </h1>
                        
                        <p className="text-sm sm:text-base md:text-lg text-white/40 font-medium leading-relaxed max-w-lg sm:max-w-xl md:max-w-2xl mx-auto opacity-80 uppercase tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] px-4">
                            {pageContent.subtitle}
                        </p>

                        <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
                            <div className="h-[2px] w-16 sm:w-20 md:w-24 bg-brand-600/30"></div>
                            <div className="text-[8px] sm:text-[9px] md:text-xs font-black text-brand-400 uppercase tracking-[0.4em] sm:tracking-[0.5em] md:tracking-[0.6em]">
                                V8-Industrial System Protocol
                            </div>
                            <div className="h-[2px] w-16 sm:w-20 md:w-24 bg-brand-600/30"></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative z-20 -mt-12 flex justify-center px-6">
                <div ref={techBarRef} className="w-full max-w-7xl bg-slate-900/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 p-10 flex flex-col md:flex-row gap-10 divide-y md:divide-y-0 md:divide-x divide-white/5">
                    {(techNodes || []).map((unit, i) => (
                        <div key={i} className="flex-1 flex gap-8 items-center md:px-8 first:pl-0 last:pr-0 group">
                            <div className="w-16 h-16 bg-brand-600 text-white rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-2xl shadow-brand-600/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                <TechIcon iconName={unit.icon} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-black text-brand-400 uppercase text-[10px] tracking-[0.4em]">{unit.title || unit.label}</h4>
                                <p className="text-sm text-white font-bold uppercase tracking-widest opacity-60 leading-tight">{unit.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Infrastructure Modules - Technical Registry Grid */}
            <section className="py-16 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                
                <div className="container mx-auto px-6">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-96 bg-gray-50 rounded-[3rem] animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div ref={facilitiesGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {facilities.map((fac, index) => (
                                <div 
                                    key={fac.id}
                                    className="group flex flex-col bg-slate-50/50 rounded-[3rem] p-4 border border-slate-100 hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-500"
                                >
                                    {/* Asset Media Node - Compact */}
                                    <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-950 mb-6">
                                        {fac.imageUrl ? (
                                            <img 
                                                src={fac.imageUrl} 
                                                alt={fac.title} 
                                                className="w-full h-full object-cover transition-all duration-1000 grayscale group-hover:grayscale-0 group-hover:scale-110" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <FaIndustry className="text-white/5 text-7xl" />
                                            </div>
                                        )}
                                        
                                        {/* Counter Badge - Compact */}
                                        <div className="absolute top-6 left-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                                            <span className="text-xs font-black text-white italic">0{index + 1}</span>
                                        </div>

                                        {/* Status Light */}
                                        <div className="absolute top-6 right-6 px-4 py-1.5 bg-brand-600/90 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                            <span className="text-[7px] font-black text-white uppercase tracking-widest">Active</span>
                                        </div>
                                    </div>
                                    
                                    {/* Detailed Narrative Section - Scaled Down */}
                                    <div className="px-4 pb-6 space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-[2px] w-8 bg-brand-600"></div>
                                            <span className="text-brand-600 font-black uppercase tracking-[0.4em] text-[8px]">Node Registry</span>
                                        </div>
                                        
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tighter italic leading-tight mb-2">
                                                {fac.title}
                                            </h2>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed line-clamp-3">
                                                {fac.description}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs">
                                                    <FaCogs />
                                                </div>
                                                <div className="text-[7px] font-black uppercase tracking-widest text-slate-400">Standard V8.5</div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs">
                                                    <FaShieldAlt />
                                                </div>
                                                <div className="text-[7px] font-black uppercase tracking-widest text-slate-400">Safe Protect</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </motion.div>
    );
};

export default FacilitiesPage;
