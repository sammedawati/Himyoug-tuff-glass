import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaClock } from 'react-icons/fa';
import { db } from '../../services/firebase';
import { collection, addDoc, serverTimestamp, doc, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { pageTransition } from '../../utils/animations';
import { useFadeIn, useStaggerFadeIn, useParallax } from '../../hooks/useGsap';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState('idle');
  const [pageContent, setPageContent] = useState({
    title: 'Global Nexus',
    subtitle: 'Connect with our industrial consulting team for technical specifications and structural glass intelligence.',
    bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000'
  });

  const contactHeroRef = useStaggerFadeIn(0.2);
  const contactConsoleRef = useFadeIn('right', 60, 0.4);
  const engagementFormRef = useFadeIn('left', 60, 0.6);
  const mapRef = useFadeIn('up', 40, 0.8);
  const contactParallaxRef = useParallax(20);
  const [contactDetails, setContactDetails] = useState({
    nodesTitle: 'Network Nodes',
    mainHeading: 'Command Centers.',
    hqAddress: '123 Industrial Area, Phase II, New Delhi, India',
    hotline: '+91 98765 43210',
    hotlineHours: 'Active Mon-Sat, 09:00 - 19:00 IST',
    emailPrimary: 'info@glasstuffan.com',
    emailSecondary: 'technical@glasstuffan.com',
    latencyLabel: 'Processing Latency',
    latencyValue: 'Under 24 Business Hours',
    mapIframe: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14014.288289578768!2d77.10249015!3d28.7040592!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d03f0b0c0b0b1%3A0x0!2zMjjCsDQyJzE0LjYiTiA3N8KwMDYnMDkuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin'
  });

  React.useEffect(() => {
    const unsubscribeHero = onSnapshot(doc(db, 'page_content', 'contact'), (doc) => {
      if (doc.exists()) {
        setPageContent(prev => ({ ...prev, ...doc.data() }));
      }
    });

    const unsubscribeDetails = onSnapshot(doc(db, 'site_content', 'contact_details'), (doc) => {
      if (doc.exists()) {
        setContactDetails(prev => ({ ...prev, ...doc.data() }));
      }
    });

    return () => {
      unsubscribeHero();
      unsubscribeDetails();
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await addDoc(collection(db, 'inquiries'), {
        ...formData,
        type: 'general_inquiry',
        createdAt: serverTimestamp()
      });
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error("Error submitting form", error);
      setStatus('error');
    }
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-slate-950 min-h-screen text-white overflow-hidden"
    >
      {/* Cinematic Contact Hero - Centered Nexus style */}
      <section className="relative min-h-[60vh] flex items-center pt-24 pb-12 overflow-hidden">
        <div ref={contactParallaxRef} className="absolute inset-0 z-0 opacity-30">
          <img
            src={pageContent.bgImage}
            alt="Contact"
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div ref={contactHeroRef} className="max-w-4xl mx-auto text-center">
            <div
              className="bg-cyan-500 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.5em] inline-block mb-6 shadow-lg shadow-cyan-500/20"
            >
              Commercial Presence
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

      <section className="relative py-12 bg-slate-900 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Contact Details - Transmission Console */}
            <div
              ref={contactConsoleRef}
              className="lg:col-span-5 space-y-10"
            >
              <div className="bg-slate-900/50 backdrop-blur-3xl p-6 rounded-[2rem] border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]">
                <div className="mb-6">
                  <span className="text-emerald-400 font-black uppercase text-[9px] tracking-[0.4em] block mb-3">{contactDetails.nodesTitle}</span>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none whitespace-pre-line">{contactDetails.mainHeading}</h2>
                </div>

                <div className="space-y-6">
                  <ContactInfoItem
                    icon={<FaMapMarkerAlt />}
                    title="Industrial Headquarters"
                    desc={contactDetails.hqAddress}
                  />
                  <ContactInfoItem
                    icon={<FaPhone />}
                    title="Commercial Hotline"
                    desc={contactDetails.hotline}
                    sub={contactDetails.hotlineHours}
                  />
                  <ContactInfoItem
                    icon={<FaEnvelope />}
                    title="Data Pipeline"
                    desc={contactDetails.emailPrimary}
                    sub={contactDetails.emailSecondary}
                  />
                </div>

                <div className="mt-12 bg-white/5 p-6 rounded-[2rem] flex items-center gap-4 border border-white/5">
                  <div className="w-12 h-12 bg-indigo-500 text-white rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                    <FaClock />
                  </div>
                  <div>
                    <h4 className="font-black text-white uppercase tracking-widest text-[8px] mb-1">{contactDetails.latencyLabel}</h4>
                    <p className="text-cyan-400 font-bold text-xs">{contactDetails.latencyValue}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form - Engagement Interface */}
            <div
              ref={engagementFormRef}
              className="lg:col-span-7"
            >
              <div className="bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.4)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[100px] -mr-32 -mt-32 transition-all duration-1000 group-hover:bg-brand-500/20"></div>

                <div className="relative z-10">
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse"></div>
                      <span className="text-emerald-400 font-black uppercase text-[9px] tracking-[0.4em]">Secure Transmission</span>
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Initialize <span className="text-cyan-500 focus:text-cyan-400 transition-colors">Inquiry.</span></h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        label="Contractor Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full Name / Entity"
                        required
                      />
                      <FormInput
                        label="Digital Proxy"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="official@company.com"
                        required
                      />
                    </div>

                    <FormInput
                      label="Mobile ID"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXX XXX XXX"
                    />

                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-[0.4em] text-cyan-500 pl-2">Technical Payload</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="5"
                        className="w-full bg-slate-950/40 border border-white/10 rounded-[1.5rem] px-6 py-4 text-white focus:border-cyan-500 outline-none transition-all font-medium placeholder:text-slate-600 focus:bg-slate-950/60 text-sm shadow-inner"
                        placeholder="Detail your thermodynamic or structural glass requirements..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full bg-gradient-to-br from-cyan-500 via-cyan-600 to-indigo-700 text-white font-black py-4 rounded-[1.5rem] shadow-[0_20px_40px_rgba(6,182,212,0.4)] hover:shadow-[0_25px_50px_rgba(6,182,212,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-4 disabled:opacity-50 uppercase tracking-[0.3em] text-[10px] border border-cyan-400/30"
                    >
                      {status === 'submitting' ? 'UPLOADING...' : 'DISPATCH PROTOCOL'} <FaPaperPlane className={status === 'submitting' ? 'animate-bounce text-lg' : 'text-lg'} />
                    </button>

                    <AnimatePresence>
                      {status === 'success' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-6 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl text-center font-black uppercase tracking-widest text-[9px]"
                        >
                          Transmission Successfully Indexed. Engineering Team Notified.
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Industrial Map Integration */}
          <div
            ref={mapRef}
            className="mt-10 h-[250px] bg-slate-900 rounded-[2rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/10 relative group"
          >
            <div className="absolute inset-0 bg-cyan-500/10 pointer-events-none z-10 mix-blend-overlay opacity-50"></div>
            <iframe
              src={contactDetails.mapIframe}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Industrial Command Center Location"
              className="grayscale group-hover:grayscale-0 transition-all duration-1000 opacity-60 group-hover:opacity-100"
            ></iframe>
            <div className="absolute top-10 right-10 z-20 bg-slate-950/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                <span className="text-white font-black uppercase text-[10px] tracking-widest">Live Asset Trace</span>
              </div>
              <p className="text-slate-400 font-bold text-xs">Sector 12, HQ Pipeline 01</p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

const ContactInfoItem = ({ icon, title, desc, sub }) => (
  <div className="flex items-start gap-5 group">
    <div className="w-12 h-12 bg-white/5 text-cyan-500 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 border border-white/5 transition-all duration-500 group-hover:bg-cyan-500 group-hover:text-white group-hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] group-hover:scale-110">
      {icon}
    </div>
    <div>
      <h3 className="font-black text-slate-500 uppercase tracking-[0.3em] text-[8px] mb-1 group-hover:text-cyan-400 transition-colors">{title}</h3>
      <p className="text-lg font-black text-white tracking-tighter leading-tight mb-1 uppercase">{desc}</p>
      {sub && <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{sub}</p>}
    </div>
  </div>
);

const FormInput = ({ label, name, type = "text", value, onChange, placeholder, required }) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-cyan-500 pl-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:border-cyan-500 outline-none transition-all font-bold text-sm placeholder:text-slate-600 focus:bg-white/10"
      placeholder={placeholder}
    />
  </div>
);

export default ContactPage;
