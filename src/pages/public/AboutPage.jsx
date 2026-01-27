import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, pageTransition } from '../../utils/animations';
import { FaUserShield, FaCompass, FaLightbulb, FaHistory, FaGem, FaCheckDouble, FaAward, FaIndustry, FaShieldAlt, FaMicrochip, FaGlobe } from 'react-icons/fa';
import { useFadeIn, useStaggerFadeIn, useParallax } from '../../hooks/useGsap';

const AboutPage = () => {
    const [content, setContent] = useState({
        title: 'Mastering the Science of Toughened Glass',
        description: 'Glass Tuffan is a pioneering force in the thermal processing and engineering of glass. We specialize in high-end horizontal tempering, multi-layered lamination, and precision ceramic printing, converting raw float glass into high-performance architectural assets that define modern urban landscapes.',
        companySubheading: 'Excellence in every Reflection.',
        estYear: '2008',
        clientCount: '500+',
        visionTitle: 'Our Vision',
        visionText: 'To lead the industrial evolution in smart-glass technology—where total transparency, advanced heat-shielding, and indestructible safety coexist in every pane.',
        missionTitle: 'Our Mission',
        missionText: 'To empower the global construction industry through state-of-the-art tempering furnaces, automated CNC cutting lines, and a data-driven approach to structural glass integrity.',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000',
        values: []
    });

    const [pageHero, setPageHero] = useState({
        title: 'Architectural Excellence',
        subtitle: 'Elevating structural designs with precision glass solutions.',
        bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000',
        badge: 'Founded on Innovation'
    });

    const aboutHeroRef = useStaggerFadeIn(0.2);
    const narrativeRef = useFadeIn('right', 50, 0.1);
    const narrativeImageRef = useFadeIn('left', 50, 0.3);
    const pillarsRef = useStaggerFadeIn(0.1);
    const protocolsHeaderRef = useFadeIn('up', 40, 0.1);
    const protocolsGridRef = useStaggerFadeIn(0.1);
    const quoteRef = useFadeIn('up', 60, 0.2);
    const aboutHeroParallaxRef = useParallax(25);

    const IconRegistry = {
        FaGem: <FaGem />,
        FaHistory: <FaHistory />,
        FaUserShield: <FaUserShield />,
        FaCheckDouble: <FaCheckDouble />,
        FaIndustry: <FaIndustry />,
        FaShieldAlt: <FaShieldAlt />,
        FaMicrochip: <FaMicrochip />,
        FaAward: <FaAward />
    };

    useEffect(() => {
        const unsubscribeHero = onSnapshot(doc(db, 'page_content', 'about'), (doc) => {
            if (doc.exists()) {
                setPageHero(prev => ({ ...prev, ...doc.data() }));
            }
        });

        const unsubscribeContent = onSnapshot(doc(db, 'site_content', 'about'), (doc) => {
            if (doc.exists()) {
                setContent(prev => ({ ...prev, ...doc.data() }));
            }
        });

        return () => {
            unsubscribeHero();
            unsubscribeContent();
        };
    }, []);

    const values = [
        { 
            icon: IconRegistry[content.values?.[0]?.icon] || <FaGem />, 
            title: content.values?.[0]?.title || 'Optical Clarity', 
            desc: content.values?.[0]?.desc || 'Utilizing low-iron technology and advanced de-ionized washing systems to ensure zero distortion and 99% light transmission.', 
            color: 'from-blue-500/10 to-transparent', 
            iconColor: 'text-blue-600'
        },
        { 
            icon: IconRegistry[content.values?.[1]?.icon] || <FaHistory />, 
            title: content.values?.[1]?.title || 'Thermal Resistance', 
            desc: content.values?.[1]?.desc || 'Engineered for extreme performance, our glass reduces solar heat gain by 60% without compromising natural aesthetics.', 
            color: 'from-indigo-500/10 to-transparent', 
            iconColor: 'text-indigo-600'
        },
        { 
            icon: IconRegistry[content.values?.[2]?.icon] || <FaUserShield />, 
            title: content.values?.[2]?.title || 'Structural Integrity', 
            desc: content.values?.[2]?.desc || 'Every toughened sheet is tested for surface compression and break patterns to exceed BIS and ASTM safety standards.', 
            color: 'from-blue-600/10 to-transparent', 
            iconColor: 'text-blue-600'
        },
        { 
            icon: IconRegistry[content.values?.[3]?.icon] || <FaCheckDouble />, 
            title: content.values?.[3]?.title || 'Safety Engineering', 
            desc: content.values?.[3]?.desc || 'Our lamination technology facilitates maximum protection against impact while maintaining 100% optical fidelity.', 
            color: 'from-emerald-500/10 to-transparent', 
            iconColor: 'text-emerald-600'
        }
    ];

    return (
        <motion.div 
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen bg-white font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden"
        >
            {/* Cinematic Hero Section */}
            <section className="relative min-h-[60vh] flex items-center pt-24 pb-12 overflow-hidden bg-slate-950">
                <div ref={aboutHeroParallaxRef} className="absolute inset-0 z-0 opacity-40">
                    <img 
                        src={pageHero.bgImage}
                        className="w-full h-full object-cover scale-110"
                        alt="Background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950"></div>
                </div>
                
                {/* Tactical Grid Overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none z-[1]" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }}></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div ref={aboutHeroRef} className="max-w-4xl mx-auto">
                        <div className="bg-blue-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.5em] inline-flex items-center gap-3 mb-10 shadow-2xl shadow-blue-600/40 border border-blue-400/30">
                            <FaGlobe className="animate-spin-slow" /> {pageHero.badge || 'Founded on Innovation'}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white leading-none uppercase tracking-tighter mb-8 italic">
                            {pageHero.title}
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto opacity-80">
                            {pageHero.subtitle}
                        </p>
                    </div>
                </div>
            </section>

            {/* Corporate Narrative */}
            <section className="py-12 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-10 items-center">
                        <div 
                            ref={narrativeRef}
                            className="space-y-10"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-[2px] w-12 bg-blue-600"></div>
                                <span className="text-blue-600 font-black uppercase tracking-[0.4em] text-[10px]">Commercial Heritage</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-950 leading-[0.9] tracking-tighter uppercase italic">
                                {content.companySubheading}
                            </h2>
                            <p className="text-lg text-slate-500 leading-relaxed font-medium uppercase tracking-wider">
                                {content.description}
                            </p>
                            <div className="grid grid-cols-2 gap-12 pt-10 border-t border-slate-100">
                                <div>
                                    <div className="text-4xl font-black text-slate-950 mb-2 tracking-tighter">{content.estYear}</div>
                                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">Established Operation</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-black text-slate-950 mb-2 tracking-tighter">{content.clientCount}</div>
                                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">Institutional Partners</div>
                                </div>
                            </div>
                        </div>
                        
                        <div 
                            ref={narrativeImageRef}
                            className="relative"
                        >
                            <div className="aspect-[4/5] rounded-[4rem] bg-slate-100 overflow-hidden shadow-2xl relative group border border-slate-200">
                                <img 
                                    src={content.imageUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000"} 
                                    alt="Facility" 
                                    className="w-full h-full object-cover transition-transform duration-2000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-blue-600/5 mix-blend-overlay"></div>
                            </div>
                            <div className="absolute -bottom-12 -left-12 bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-50 hidden md:flex flex-col items-center">
                                <FaAward className="text-blue-600 text-6xl mb-4 animate-bounce" />
                                <p className="font-black text-slate-900 uppercase tracking-widest text-[9px] text-center">Certified <br/> Industrial Grade</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Background Decal */}
                <div className="absolute top-1/2 right-0 -translate-y-1/2 text-[15vw] font-black text-slate-50 pointer-events-none select-none tracking-tighter uppercase whitespace-nowrap z-0">
                    Legacy 01
                </div>
            </section>

            {/* Strategic Pillars */}
            <section className="py-16 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full"></div>
                
                <div className="container mx-auto px-6 relative z-10">
                    <div 
                        ref={pillarsRef}
                        className="grid md:grid-cols-2 gap-12"
                    >
                        <div className="bg-white/5 backdrop-blur-3xl p-16 rounded-[4rem] border border-white/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 text-white/5 font-black text-9xl group-hover:text-white/10 transition-colors select-none">V</div>
                            <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-3xl mb-10 shadow-2xl shadow-blue-600/30 group-hover:rotate-[10deg] transition-all duration-700">
                                <FaCompass className="text-white" />
                            </div>
                            <h3 className="text-3xl font-black mb-6 uppercase tracking-tighter text-white italic">{content.visionTitle}</h3>
                            <p className="text-lg text-slate-400 font-medium leading-relaxed uppercase tracking-wider opacity-80">{content.visionText}</p>
                        </div>
                        
                        <div className="bg-white/5 backdrop-blur-3xl p-16 rounded-[4rem] border border-white/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 text-white/5 font-black text-9xl group-hover:text-white/10 transition-colors select-none">M</div>
                            <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-3xl mb-10 shadow-2xl shadow-white/5 group-hover:rotate-[-10deg] transition-all duration-700">
                                <FaLightbulb className="text-slate-900" />
                            </div>
                            <h3 className="text-3xl font-black mb-6 uppercase tracking-tighter text-white italic">{content.missionTitle}</h3>
                            <p className="text-lg text-slate-400 font-medium leading-relaxed uppercase tracking-wider opacity-80">{content.missionText}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Protocols */}
            <section className="py-16 bg-white relative">
                <div className="container mx-auto px-6">
                    <div ref={protocolsHeaderRef} className="text-center max-w-3xl mx-auto mb-12">
                        <div className="inline-block bg-blue-50 text-blue-600 px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.5em] mb-6">Execution Standards</div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-950 uppercase tracking-tighter italic">Foundational <span className="text-blue-600 italic-none">Protocols.</span></h2>
                    </div>
                    
                    <div 
                        ref={protocolsGridRef}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {values.map((v, i) => (
                            <div 
                                key={i}
                                className={`p-10 rounded-[3.5rem] bg-gradient-to-br ${v.color} border border-slate-100 group transition-all duration-700 hover:border-blue-500/20`}
                            >
                                <div className={`w-20 h-20 bg-white shadow-xl ${v.iconColor} rounded-[2rem] flex items-center justify-center text-3xl mb-10 transform group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-700 group-hover:rotate-6 border border-slate-50`}>
                                    {v.icon}
                                </div>
                                <h4 className="text-xl font-black text-slate-950 mb-5 uppercase tracking-tighter leading-none">{v.title}</h4>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed uppercase tracking-wide opacity-80">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Cinematic Conclusion */}
            <section className="py-20 bg-white relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-5 grayscale pointer-events-none">
                     <img src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="Industrial" />
                </div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 
                        ref={quoteRef}
                        className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-950 uppercase tracking-tighter leading-none max-w-6xl mx-auto italic"
                    >
                        "Transparency is not just our product, <br /> <span className="text-blue-600 NOT-ITALIC">it's our operational integrity."</span>
                    </h2>
                </div>
            </section>
        </motion.div>
    );
};

export default AboutPage;

