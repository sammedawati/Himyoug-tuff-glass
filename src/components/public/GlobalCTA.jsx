import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';

const GlobalCTA = () => {
    const { pathname } = useLocation();
    
    // Hide CTA on specific pages to avoid redundancy.
    if (pathname === '/contact' || pathname === '/quote') return null;

    return (
        <section className="py-20 bg-gray-950 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '60px 60px' }}></div>
            <div className="container mx-auto px-6 text-center relative z-10">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 uppercase tracking-tighter italic text-center">Ready for <span className="text-brand-600 NOT-ITALIC">Deployment?</span></h2>
                <p className="text-xl text-gray-400 font-bold uppercase tracking-[0.3em] mb-10 max-w-2xl mx-auto opacity-60">Initialize technical consultation for your commercial infrastructure.</p>
                <Link to="/contact" className="inline-flex items-center gap-3 sm:gap-4 bg-brand-600 hover:bg-brand-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs transition-all shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95 group">
                    <span className="text-[10px] sm:text-xs">Contact Command Center</span> <FaPlay className="text-[8px] sm:text-[10px] group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
            
            <div className="absolute top-0 right-0 p-10 hidden lg:block">
                <div className="flex flex-col gap-2 text-right">
                    <div className="text-[10px] font-black text-brand-500 uppercase tracking-widest">System Ready</div>
                    <div className="flex gap-1 justify-end">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-1 bg-brand-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>)}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GlobalCTA;
