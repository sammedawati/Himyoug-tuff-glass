import React, { useState } from 'react';
import { db } from '../../services/firebase';
import { collection, addDoc, serverTimestamp, doc, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaCheckCircle, FaProjectDiagram, FaArrowLeft } from 'react-icons/fa';
import { pageTransition } from '../../utils/animations';
import { useFadeIn, useStaggerFadeIn, useParallax } from '../../hooks/useGsap';

const QuotePage = () => {
    const [status, setStatus] = useState('idle');
    const [formData, setFormData] = useState({
        projectName: '',
        company: '',
        name: '',
        email: '',
        phone: '',
        type: 'Commercial Building',
        glassType: '',
        quantity: '',
        urgency: 'Standard'
    });
    const [pageContent, setPageContent] = useState({
        title: 'Project Proposal',
        subtitle: 'Initiate your commercial project deployment with our technical consulting team.',
        bgImage: 'https://images.unsplash.com/photo-1504917595217-d4dc5f9c4739?auto=format&fit=crop&q=80&w=2000'
    });

    const quoteHeroRef = useStaggerFadeIn(0.2);
    const formContainerRef = useFadeIn('up', 60, 0.4);
    const footerActionRef = useFadeIn('up', 40, 0.6);
    const quoteHeroParallaxRef = useParallax(30);

    React.useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'page_content', 'quote'), (doc) => {
            if (doc.exists()) {
                setPageContent(prev => ({ ...prev, ...doc.data() }));
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            await addDoc(collection(db, 'inquiries'), {
                ...formData,
                type: 'quote_request',
                createdAt: serverTimestamp()
            });
            setStatus('success');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

  return (
    <motion.div 
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-slate-950 min-h-screen text-white overflow-hidden"
    >
      {/* Cinematic Quote Hero */}
      <section className="relative min-h-[60vh] flex items-center pt-24 pb-12 overflow-hidden">
        <div ref={quoteHeroParallaxRef} className="absolute inset-0 z-0 opacity-30">
          <img 
            src={pageContent.bgImage} 
            alt="Engineering" 
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div ref={quoteHeroRef} className="max-w-4xl mx-auto text-center">
            <div 
              className="bg-cyan-500 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.5em] inline-block mb-6 shadow-2xl shadow-cyan-500/20 border border-cyan-400/30"
            >
              Enterprise Solutions
            </div>
            <h1 
              className="text-4xl md:text-7xl font-black text-white leading-none uppercase tracking-tighter mb-4 italic"
            >
              {pageContent.title}
            </h1>
            <p 
              className="text-lg md:text-xl text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto opacity-80 uppercase tracking-widest"
            >
              {pageContent.subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="relative py-12 bg-slate-900 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 max-w-5xl">
          <div 
            ref={formContainerRef}
            className="bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden relative"
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="p-16 md:p-32 text-center flex flex-col items-center justify-center min-h-[600px]"
                >
                    <motion.div 
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-24 h-24 bg-cyan-500 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-10 text-5xl shadow-2xl shadow-cyan-500/40"
                    >
                        <FaCheckCircle />
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-8 uppercase tracking-tighter italic">TRANSMISSION COMPLETE</h2>
                    <p className="text-slate-400 text-lg max-w-lg mx-auto leading-relaxed font-medium uppercase tracking-wider opacity-60">
                        Our industrial analysis department has received your parameters. A technical consultant will engage shortly.
                    </p>
                    <button 
                        onClick={() => setStatus('idle')}
                        className="mt-12 flex items-center gap-4 bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all shadow-xl active:scale-95"
                    >
                        <FaArrowLeft /> New Transmission
                    </button>
                </motion.div>
              ) : (
                <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit} 
                    className="p-8 md:p-10"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-white/5 border border-white/10 text-cyan-500 rounded-2xl flex items-center justify-center text-xl shadow-inner">
                            <FaProjectDiagram />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Project <span className="text-cyan-500 italic">Specifications.</span></h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                        <FormGroup label="Primary Domain">
                            <select 
                                name="type" 
                                value={formData.type} 
                                onChange={handleChange}
                                className="w-full bg-slate-950/40 border border-white/10 px-6 py-4 rounded-xl focus:border-cyan-500 outline-none transition-all font-black text-white text-xs appearance-none cursor-pointer focus:bg-slate-950/60 uppercase tracking-widest"
                            >
                                <option className="bg-slate-900">Commercial Tower</option>
                                <option className="bg-slate-900">Residential Luxury</option>
                                <option className="bg-slate-900">Industrial Complex</option>
                                <option className="bg-slate-900">Architectural Landmark</option>
                                <option className="bg-slate-900">Other</option>
                            </select>
                        </FormGroup>
                        <FormGroup label="Priority Level">
                            <select 
                                name="urgency" 
                                value={formData.urgency} 
                                onChange={handleChange}
                                className="w-full bg-slate-950/40 border border-white/10 px-6 py-4 rounded-xl focus:border-cyan-500 outline-none transition-all font-black text-white text-xs appearance-none cursor-pointer focus:bg-slate-950/60 uppercase tracking-widest"
                            >
                                <option className="bg-slate-900">Critical (Immediate)</option>
                                <option className="bg-slate-900">Medium (Planning)</option>
                                <option className="bg-slate-900">Standard Operations</option>
                            </select>
                        </FormGroup>
                        <FormGroup label="Glass specification">
                            <input 
                                type="text" 
                                name="glassType"
                                placeholder="E.G. 12.52MM TEMPERED LAMINATED" 
                                value={formData.glassType}
                                onChange={handleChange}
                                required
                                className="w-full bg-slate-950/40 border border-white/10 px-6 py-4 rounded-xl focus:border-cyan-500 outline-none transition-all font-black text-white text-xs placeholder:text-slate-600 focus:bg-slate-950/60 uppercase tracking-widest" 
                            />
                        </FormGroup>
                        <FormGroup label="Volume (sq. ft)">
                            <input 
                                type="number" 
                                name="quantity"
                                placeholder="10,000" 
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                                className="w-full bg-slate-950/40 border border-white/10 px-6 py-4 rounded-xl focus:border-cyan-500 outline-none transition-all font-black text-white text-xs placeholder:text-slate-600 focus:bg-slate-950/60 uppercase tracking-widest" 
                            />
                        </FormGroup>
                        <FormGroup label="Liaison Name">
                            <input type="text" name="name" placeholder="FULL NAME" required value={formData.name} onChange={handleChange} className="w-full bg-slate-950/40 border border-white/10 px-6 py-4 rounded-xl focus:border-cyan-500 outline-none transition-all font-black text-white text-xs placeholder:text-slate-600 focus:bg-slate-950/60 uppercase tracking-widest" />
                        </FormGroup>
                        <FormGroup label="Entity Name">
                            <input type="text" name="company" placeholder="COMPANY NAME" value={formData.company} onChange={handleChange} className="w-full bg-slate-950/40 border border-white/10 px-6 py-4 rounded-xl focus:border-cyan-500 outline-none transition-all font-black text-white text-xs placeholder:text-slate-600 focus:bg-slate-950/60 uppercase tracking-widest" />
                        </FormGroup>
                        <FormGroup label="Commercial Email">
                            <input type="email" name="email" placeholder="CORPORATE@ENTITY.COM" required value={formData.email} onChange={handleChange} className="w-full bg-slate-950/40 border border-white/10 px-6 py-4 rounded-xl focus:border-cyan-500 outline-none transition-all font-black text-white text-xs placeholder:text-slate-600 focus:bg-slate-950/60" />
                        </FormGroup>
                        <FormGroup label="Direct Communication">
                            <input type="tel" name="phone" placeholder="+91 XXXX XXX XXX" required value={formData.phone} onChange={handleChange} className="w-full bg-slate-950/40 border border-white/10 px-6 py-4 rounded-xl focus:border-cyan-500 outline-none transition-all font-black text-white text-xs placeholder:text-slate-600 focus:bg-slate-950/60" />
                        </FormGroup>
                    </div>

                    <div 
                        ref={footerActionRef}
                        className="mt-10 bg-slate-950/80 backdrop-blur-xl border border-white/5 p-8 md:p-10 rounded-[2rem] flex flex-col lg:flex-row items-center justify-between gap-6"
                    >
                        <div className="text-white lg:text-left text-center">
                            <div className="flex items-center gap-3 mb-2 lg:justify-start justify-center">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,211,238,0.8)]"></div>
                                <h4 className="text-xl font-black uppercase tracking-tighter text-cyan-500 italic">Finalize Transmission</h4>
                            </div>
                            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.5em] opacity-60">Encrypted commercial standards applied</p>
                        </div>
                        <button 
                            type="submit" 
                            disabled={status === 'submitting'}
                            className="w-full lg:w-auto bg-gradient-to-br from-cyan-500 via-cyan-600 to-indigo-700 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50 border border-cyan-400/30"
                        >
                            <FaPaperPlane className={status === 'submitting' ? 'animate-bounce' : ''} />
                            {status === 'submitting' ? 'SENDING...' : 'DISPATCH REQUEST'}
                        </button>
                    </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

const FormGroup = ({ label, children }) => (
    <div className="space-y-3">
        <label className="text-[9px] font-black uppercase tracking-[0.4em] text-cyan-500/80 pl-2">{label}</label>
        {children}
    </div>
);

export default QuotePage;
