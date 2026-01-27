import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, pageTransition } from '../../utils/animations';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, FreeMode } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCogs, FaShieldAlt, FaLightbulb, FaIndustry, FaGlobe, FaChevronRight, FaPlay, FaMicrochip, FaQuoteLeft } from 'react-icons/fa';
import { dummyClients, homeStats, homeFeatures, homeShowcase, dummyTestimonials } from '../../utils/dummyData';
import { useFadeIn, useStaggerFadeIn, useParallax } from '../../hooks/useGsap';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const HomePage = () => {
    const heroParallaxRef = useParallax(30);
    
    const [homeHero, setHomeHero] = useState({
        badge: 'Excellence in Glass Manufacturing',
        title: 'Structural Glass Intelligence.',
        subtitle: 'Architectural solutions engineered for clarity, safety, and thermodynamic performance.',
        bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000'
    });

    const [stats, setStats] = useState(homeStats);
    const [features, setFeatures] = useState(homeFeatures);
    const [showcase, setShowcase] = useState({
        badge: 'Elite Showcase',
        title: 'Selection Matrix.',
        items: homeShowcase
    });
    const [testimonials, setTestimonials] = useState([]);
    const [clients, setClients] = useState([]);

    const displayClients = clients.length > 0 ? clients : dummyClients;
    const displayTestimonials = testimonials.length > 0 ? testimonials : dummyTestimonials;

    const heroTextRef = useStaggerFadeIn(0.5);
    const statsRef = useStaggerFadeIn(0.2);
    const competenciesHeaderRef = useFadeIn('up', 50, 0.1);
    const featuresRef = useStaggerFadeIn(0.1);

    const clientsHeaderRef = useFadeIn('up', 40, 0.2);
    const clientsGridRef = useFadeIn('up', 30, 0.2);
    const feedbackHeaderRef = useStaggerFadeIn(0.2);

    useEffect(() => {
        const unsubConfig = onSnapshot(doc(db, 'site_settings', 'config'), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setHomeHero(prev => ({
                    ...prev,
                    title: data.hero?.title || prev.title,
                    subtitle: data.hero?.subtitle || prev.subtitle,
                    bgImage: data.hero?.bgImage || prev.bgImage,
                    badge: data.general?.siteName ? `${data.general.siteName} Excellence` : prev.badge
                }));
            }
        });

        const unsubHero = onSnapshot(doc(db, 'page_content', 'home'), (doc) => {
            if (doc.exists()) setHomeHero(prev => ({ ...prev, ...doc.data() }));
        });

        const unsubStats = onSnapshot(doc(db, 'site_content', 'home_stats'), (doc) => {
            if (doc.exists()) setStats(doc.data().items || homeStats);
        });

        const unsubFeatures = onSnapshot(doc(db, 'site_content', 'home_features'), (doc) => {
            if (doc.exists()) setFeatures(doc.data().items || homeFeatures);
        });

        const unsubShowcase = onSnapshot(doc(db, 'site_content', 'home_showcase'), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setShowcase({
                    badge: data.badge || 'Elite Showcase',
                    title: data.title || 'Selection Matrix.',
                    items: data.items || homeShowcase
                });
            }
        });

        const unsubTestimonials = onSnapshot(collection(db, 'testimonials'), (snap) => {
            setTestimonials(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        const unsubClients = onSnapshot(collection(db, 'clients'), (snap) => {
            setClients(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        return () => {
            unsubConfig();
            unsubHero();
            unsubStats();
            unsubFeatures();
            unsubShowcase();
            unsubTestimonials();
            unsubClients();
        };
    }, []);

    return (
        <motion.div 
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col w-full overflow-x-hidden"
        >
            {/* Cinematic Hero Terminal */}
            <section className="relative min-h-[85vh] flex items-center bg-gray-900 overflow-hidden">
                <div ref={heroParallaxRef} className="absolute inset-0 z-0">
                    <img src={homeHero.bgImage} className="w-full h-full object-cover scale-110 opacity-60 grayscale-[0.2]" alt="Hero" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                </div>
                
                <div className="absolute inset-0 z-[1] pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}></div>

                <div className="container mx-auto px-6 relative z-10 pt-20">
                    <div ref={heroTextRef} className="flex flex-col items-center text-center">
                        <div className="bg-brand-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.5em] mb-8 shadow-2xl shadow-brand-600/40 border border-brand-400/30 flex items-center gap-3">
                            <FaGlobe className="animate-spin-slow" /> {homeHero.badge}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter mb-8 max-w-6xl uppercase italic whitespace-pre-line">
                            {homeHero.title}
                        </h1>
                        <p className="text-base md:text-lg text-gray-300 max-w-3xl mb-12 font-medium leading-relaxed opacity-80 uppercase tracking-widest">
                            {homeHero.subtitle}
                        </p>
                        
                        <div className="flex flex-wrap justify-center gap-8 mt-4 mb-10">
                            <Link to="/products" className="group bg-brand-600 hover:bg-brand-700 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-2xl flex items-center gap-4 active:scale-95">
                                Explore Inventory <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                            </Link>
                            <Link to="/quote" className="group bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-2xl flex items-center gap-4 active:scale-95">
                                Technical RFP <FaChevronRight />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-10 left-10 hidden xl:flex flex-col gap-4 text-white/40">
                    <div className="h-16 w-[1px] bg-gradient-to-b from-transparent to-white/40 mx-auto"></div>
                    <span className="[writing-mode:vertical-lr] font-black text-[10px] uppercase tracking-[0.5em]">Scroll to Deploy</span>
                </div>
            </section>

            <section className="bg-gray-950 py-16 border-y border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }}></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, i) => (
                            <div 
                                key={i}
                                className="relative group bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-[2rem] text-center hover:bg-brand-600/10 hover:border-brand-500/50 transition-all duration-500"
                            >
                                <div className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tighter group-hover:text-brand-500 transition-colors duration-500">{stat.value}</div>
                                <div className="text-[9px] font-black text-brand-500 uppercase tracking-[0.3em] mb-1">{stat.label}</div>
                                <div className="absolute top-4 right-6 text-white/5 text-3xl font-black italic select-none group-hover:text-brand-500/10 transition-colors">0{i+1}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Competencies - The Nexus Layout */}
            <section className="py-20 bg-white relative overflow-hidden">
                {/* Technical Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '80px 80px' }}></div>
                
                <div className="container mx-auto px-6 relative z-10">
                    <div ref={competenciesHeaderRef} className="max-w-4xl mx-auto text-center mb-12">
                        <div className="inline-block bg-blue-100 text-blue-700 px-5 py-2 rounded-full text-[8px] font-black uppercase tracking-[0.4em] mb-6 border border-blue-200">
                            Industrial Systems 01
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-[1.1] tracking-tighter uppercase italic mb-6">
                            Engineering <span className="text-blue-600 NOT-ITALIC">Superiority.</span>
                        </h2>
                        <p className="text-sm md:text-base text-gray-500 leading-relaxed font-semibold uppercase tracking-wider max-w-xl mx-auto mb-10">
                            Our vertically integrated manufacturing facility utilizes automated CNC precision and advanced thermal convection technology.
                        </p>
                        <div className="flex justify-center">
                            <Link to="/facilities" className="inline-flex items-center gap-4 group text-blue-600 font-black uppercase tracking-[0.3em] text-[9px] hover:text-black transition-all">
                                Plant Tour Protocol <div className="w-10 h-10 border-2 border-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-500 shadow-lg"><FaArrowRight className="group-hover:translate-x-1" /></div>
                            </Link>
                        </div>
                    </div>

                    <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                         {features.map((feature, i) => {
                            const icons = [<FaCogs />, <FaMicrochip />, <FaShieldAlt />, <FaIndustry />];
                            return (
                                <div 
                                    key={i}
                                    className="bg-blue-100/60 p-8 rounded-[2.5rem] group hover:bg-blue-700 transition-all duration-700 hover:-translate-y-2 shadow-xl border border-blue-200/50 flex flex-col items-center text-center relative overflow-hidden"
                                >
                                    <div className="absolute bottom-0 right-0 p-6 text-7xl font-black text-blue-900/5 group-hover:text-white/5 transition-colors select-none">
                                        0{i+1}
                                    </div>
                                    <div className="w-16 h-16 bg-white shadow-2xl text-blue-600 rounded-[1.5rem] flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:bg-white/10 group-hover:text-white transition-all duration-700 group-hover:rotate-[360deg]">
                                        {icons[i % icons.length]}
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 mb-4 uppercase tracking-tighter group-hover:text-white leading-none whitespace-pre-line">{feature.title}</h3>
                                    <p className="text-[10px] text-gray-500 font-bold leading-relaxed group-hover:text-white/70 uppercase tracking-widest">{feature.desc || feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[15vw] font-black text-gray-100/50 pointer-events-none select-none tracking-tighter uppercase whitespace-nowrap z-0">
                    PRECISION
                </div>
            </section>

            <section className="py-12 bg-gray-950 text-white">
                <div className="text-center max-w-4xl mx-auto mb-8 px-6">
                        <div className="inline-block bg-brand-500/10 text-brand-500 px-5 py-2 rounded-full text-[8px] font-black uppercase tracking-[0.4em] mb-4 border border-brand-500/20">{showcase.badge}</div>
                        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic">{showcase.title.split(' ').slice(0, -1).join(' ')} <span className="text-brand-500 NOT-ITALIC">{showcase.title.split(' ').slice(-1)}</span></h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 max-w-[1500px] mx-auto">
                     {showcase.items.map((item, i) => (
                        <div key={i} className="group relative rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 aspect-[4/3] shadow-2xl">
                            <img src={item.imageUrl || item.url} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-100" alt={item.title} />
                            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent">
                                <div className="flex items-center gap-2 text-brand-500 text-[9px] font-black uppercase tracking-[0.3em] mb-2">
                                    <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse"></div> {item.category || 'Premium Glass'}
                                </div>
                                <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-2">{item.title}</h3>
                                <p className="text-gray-400 text-[10px] font-medium leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 line-clamp-2">{item.description || item.desc || 'Architectural Excellence'}</p>
                                <Link to="/products" className="bg-white text-gray-900 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-brand-500 hover:text-white border border-white/20">
                                    <FaArrowRight size={10} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* The Industrial Network - Industrial Glass Pods */}
            <section className="py-20 bg-white relative overflow-hidden border-y border-gray-100">
                {/* Technical Substrate Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2563eb 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
                
                {/* Cinematic Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-100/20 blur-[100px] rounded-full"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div ref={clientsHeaderRef} className="flex flex-col items-center text-center mb-12">
                        <div 
                            className="flex items-center gap-3 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full mb-4"
                        >
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                            <span className="text-[9px] font-black text-blue-800 uppercase tracking-[0.4em]">Industrial Alliance Network</span>
                        </div>
                        
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">
                            Trusted by <span className="text-blue-600 NOT-ITALIC">Commanders.</span>
                        </h2>
                        <div className="w-16 h-1 bg-blue-600 mt-6 rounded-full"></div>
                    </div>

                    <div ref={clientsGridRef} className="w-full relative px-4">
                        <Swiper
                            modules={[Autoplay, FreeMode]}
                            spaceBetween={24}
                            slidesPerView={2}
                            loop={true}
                            speed={4000}
                            autoplay={{
                                delay: 0,
                                disableOnInteraction: false,
                            }}
                            freeMode={true}
                            className="marquee-linear py-6"
                            breakpoints={{
                                640: { slidesPerView: 3 },
                                768: { slidesPerView: 4 },
                                1024: { slidesPerView: 5 },
                                1280: { slidesPerView: 6 },
                            }}
                        >
                            {(displayClients || []).map((client, idx) => (
                                <SwiperSlide key={client.id || idx} className="h-auto">
                                    <div 
                                        className="relative group h-32"
                                    >
                                        {/* The Glass Pod Container */}
                                        <div className="h-full bg-white border border-gray-100 rounded-[2rem] p-6 flex items-center justify-center transition-all duration-700 group-hover:border-blue-500/30 group-hover:shadow-[0_40px_80px_-20px_rgba(37,99,235,0.12)] group-hover:bg-blue-50/50 relative overflow-hidden">
                                             {/* Inner Glow Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            
                                            <img 
                                                src={client.logo} 
                                                alt={client.name} 
                                                className="h-10 md:h-12 w-full object-contain transition-all duration-700 transform group-hover:scale-110" 
                                                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${client.name}&background=0284c7&color=fff&size=256`; }}
                                            />
                                        </div>
                                        

                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </section>

            {/* Stakeholder Perspectives - Continuous Running Marquee */}
            <section className="py-16 bg-white relative overflow-hidden border-y border-gray-100">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

                <div ref={feedbackHeaderRef} className="container mx-auto px-6 mb-12 text-center relative z-10">
                    <div
                        className="inline-block bg-blue-50 text-blue-700 px-5 py-2 rounded-full text-[8px] font-black uppercase tracking-[0.4em] mb-4 border border-blue-100"
                    >
                        Reputation Verification
                    </div>
                    <h2
                        className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase italic"
                    >
                        Institutional <span className="text-blue-600 NOT-ITALIC">Feedback.</span>
                    </h2>
                </div>

                <div className="relative z-10">
                    <Swiper
                        modules={[Autoplay, FreeMode]}
                        spaceBetween={24}
                        slidesPerView={1}
                        loop={true}
                        speed={8000}
                        autoplay={{ delay: 0, disableOnInteraction: false }}
                        freeMode={true}
                        className="marquee-linear"
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            1024: { slidesPerView: 4 },
                            1440: { slidesPerView: 5 }
                        }}
                    >
                        {displayTestimonials.map((t, i) => (
                            <SwiperSlide key={t.id || i}>
                                <div className="bg-blue-50/50 border border-blue-100/60 p-6 rounded-[2rem] h-full flex flex-col justify-between group hover:bg-blue-700 transition-all duration-700 shadow-lg hover:shadow-blue-900/20 relative overflow-hidden">
                                     <div className="absolute top-6 right-6 text-3xl font-black text-blue-900/5 group-hover:text-white/5 transition-colors select-none">
                                        <FaQuoteLeft />
                                    </div>
                                    <p className="text-sm font-bold text-gray-700 italic leading-relaxed group-hover:text-white/90 relative z-10">"{t.content || t.text || t.quote}"</p>
                                    <div className="mt-8 flex items-center gap-4 relative z-10">
                                        <div className="w-10 h-10 bg-white shadow-xl text-blue-600 rounded-xl flex items-center justify-center text-xs font-black group-hover:bg-white/10 group-hover:text-white transition-all duration-500">
                                            {(t.name || 'C').charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-black text-gray-900 uppercase tracking-tighter text-xs group-hover:text-white transition-colors">{t.name || 'Client'}</div>
                                            <div className="text-[8px] font-black text-blue-600 uppercase tracking-widest group-hover:text-white/60 transition-colors">{t.role || t.position || 'Partner'}</div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>
        </motion.div>
    );
};

export default HomePage;
