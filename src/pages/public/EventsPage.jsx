import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, onSnapshot, query, orderBy, doc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, pageTransition } from '../../utils/animations';
import { FaCalendarAlt, FaMapMarkerAlt, FaNewspaper } from 'react-icons/fa';
import { useFadeIn, useStaggerFadeIn, useParallax } from '../../hooks/useGsap';

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageContent, setPageContent] = useState({
        title: 'Global Events',
        subtitle: 'Tracking our engagement and presence at leading architecture and manufacturing exhibitions.',
        bgImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=2000'
    });

    const eventsHeaderRef = useStaggerFadeIn(0.2);
    const eventsGridRef = useStaggerFadeIn(0.1);
    const eventsHeroParallaxRef = useParallax(20);

    useEffect(() => {
        const q = query(collection(db, 'events'), orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        }, () => setLoading(false));

        const unsubscribePage = onSnapshot(doc(db, 'page_content', 'events'), (doc) => {
          if (doc.exists()) {
            setPageContent(prev => ({ ...prev, ...doc.data() }));
          }
        });

        return () => {
            unsubscribe();
            unsubscribePage();
        };
    }, []);

    const trunkVariants = {
        initial: { height: 0, opacity: 0 },
        animate: { height: "100%", opacity: 1, transition: { duration: 2, ease: "easeInOut" } }
    };

    const cardLeftVariants = {
        initial: { x: -100, opacity: 0, scale: 0.9 },
        animate: { 
            x: 0, 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut" } 
        }
    };

    const cardRightVariants = {
        initial: { x: 100, opacity: 0, scale: 0.9 },
        animate: { 
            x: 0, 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut" } 
        }
    };

    return (
        <motion.div 
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen bg-gray-50/50"
        >
            {/* Cinematic Events Hero - Centered Nexus style */}
            <section className="relative min-h-[60vh] flex items-center pt-24 pb-12 bg-slate-950 overflow-hidden">
        <div ref={eventsHeroParallaxRef} className="absolute inset-0 z-0 opacity-30">
          <img 
            src={pageContent.bgImage} 
            alt="Events" 
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div ref={eventsHeaderRef} className="max-w-4xl mx-auto text-center">
                        <div 
                            className="bg-cyan-500 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.5em] inline-block mb-6 shadow-lg shadow-cyan-500/20"
                        >
                            Corporate Timeline
                        </div>
                        <h1 
                            className="text-4xl md:text-6xl font-black text-white leading-[1.1] uppercase tracking-tighter mb-4 whitespace-pre-line"
                        >
                            {pageContent.title}
                        </h1>
                        <p 
                            className="text-lg md:text-xl text-gray-300 font-medium leading-relaxed max-w-2xl mx-auto"
                        >
                            {pageContent.subtitle}
                        </p>
                    </div>
                </div>
            </section>

            {/* Industrial Intelligence Board - Grid Style */}
            <section className="py-16 bg-gray-50/50 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-64 bg-white rounded-3xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : events.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="max-w-4xl mx-auto text-center py-40 bg-white rounded-[4rem] border border-dashed border-gray-200"
                        >
                            <FaNewspaper className="text-6xl text-gray-100 mx-auto mb-6" />
                            <h2 className="text-2xl font-black text-gray-200 uppercase tracking-widest">Database Syncing</h2>
                            <p className="text-gray-400 mt-4 font-medium uppercase text-[10px] tracking-widest">Awaiting new commercial intelligence feeds.</p>
                        </motion.div>
                    ) : (
                        <div 
                            ref={eventsGridRef}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {events.map((event, i) => (
                                <div 
                                    key={event.id} 
                                    className="group relative bg-white rounded-[2.5rem] p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-brand-500/20"
                                >
                                    {/* Technical Date Ribbon */}
                                    <div className="absolute top-0 right-10 flex flex-col items-center">
                                        <div className="w-10 h-14 bg-slate-900 rounded-b-xl flex flex-col items-center justify-center text-white shadow-xl">
                                            <span className="text-xs font-black leading-none">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</span>
                                            <span className="text-xl font-black text-brand-500">{new Date(event.date).getDate()}</span>
                                        </div>
                                    </div>

                                    {/* Module Content */}
                                    <div className="space-y-6 pt-6">
                                        <div className="flex items-center gap-3">
                                            <div className="px-3 py-1 bg-brand-500/10 text-brand-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-brand-500/10">
                                                Verified Entry
                                            </div>
                                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                ID: {event.id.slice(0, 6).toUpperCase()}
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-black text-slate-900 leading-tight tracking-tighter uppercase group-hover:text-brand-600 transition-colors duration-500">
                                            {event.title}
                                        </h3>

                                        <p className="text-slate-500 font-medium text-sm leading-relaxed line-clamp-4">
                                            {event.description}
                                        </p>

                                        {/* Footer Metadata */}
                                        <div className="pt-6 mt-4 border-t border-slate-50 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                                <FaMapMarkerAlt className="text-brand-500" /> 
                                                {event.location}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                                <FaCalendarAlt className="text-brand-500" /> 
                                                {new Date(event.date).getFullYear()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover Decorative Element */}
                                    <div className="absolute -bottom-8 -right-8 text-gray-50 text-8xl transition-all duration-700 group-hover:scale-125 group-hover:-translate-x-4 group-hover:-translate-y-4 pointer-events-none">
                                        <FaNewspaper className="opacity-10" />
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

export default EventsPage;
