import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaLinkedin, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope, FaChevronRight, FaArrowRight } from 'react-icons/fa';
import { db } from '../../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const Footer = ({ settings }) => {
  const [footerContent, setFooterContent] = React.useState({
    aboutText: 'Precision engineering meets architectural elegance. We are the leading global manufacturer of premium industrial glass solutions.',
    specialties: [
      'Tempered Glass Solutions',
      'High-Strength Laminated',
      'Insulated Thermal Glass',
      'Architectural Glass Design'
    ],
    footerBadge: 'Industrial Glass'
  });

  React.useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'site_content', 'footer'), (doc) => {
      if (doc.exists()) {
        setFooterContent(prev => ({ ...prev, ...doc.data() }));
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <footer className="bg-[#050505] text-white pt-6 pb-4 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-600/50 to-transparent"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600/5 blur-[120px] -mr-64 -mt-64 rounded-full"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-4">
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center text-white font-black text-2xl transition-all duration-500 group-hover:rotate-[10deg] shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                 {settings?.general?.logoUrl ? (
                   <img src={settings.general.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                 ) : (
                   settings?.general?.siteName?.charAt(0) || 'G'
                 )}
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-2xl tracking-tighter leading-none">
                  {settings?.general?.siteName || 'GlassTuffan'}
                </span>
                <span className="text-brand-500 text-[9px] font-black uppercase tracking-[0.3em] mt-1 opacity-80">{footerContent.footerBadge}</span>
              </div>
            </Link>
            <p className="text-gray-400 text-base leading-relaxed font-medium max-w-sm">
              {footerContent.aboutText}
            </p>
            <div className="flex space-x-3">
              {[
                { icon: <FaFacebook />, url: settings?.social?.facebook },
                { icon: <FaLinkedin />, url: settings?.social?.linkedin },
                { icon: <FaInstagram />, url: settings?.social?.instagram },
                { icon: <FaTwitter />, url: settings?.social?.twitter }
              ].map((social, i) => (
                social.url && social.url !== '#' && (
                  <a 
                    key={i} 
                    href={social.url} 
                    className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-lg text-gray-400 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all duration-300"
                  >
                    {social.icon}
                  </a>
                )
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-3 text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-600 rounded-full"></span> Explorer
            </h3>
            <ul className="space-y-1">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Facilities', path: '/facilities' },
                { name: 'News & Events', path: '/events' },
                { name: 'Gallery', path: '/gallery' },
                { name: 'Contact Us', path: '/contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-white transition-all flex items-center gap-2 group font-bold text-base">
                    <FaChevronRight className="text-[8px] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-500" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-3 text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-600 rounded-full"></span> Specialties
            </h3>
            <ul className="space-y-1">
              {footerContent.specialties.map((p) => (
                <li key={p}>
                  <Link to="/products" className="text-gray-400 hover:text-white transition-all font-bold text-base flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-gray-800 rounded-full group-hover:bg-brand-500 transition-colors"></span>
                    {p}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link to="/products" className="inline-flex items-center gap-2 text-brand-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest">
                  View Full Catalog <FaArrowRight />
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-3 text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-600 rounded-full"></span> Headquarters
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-3 group">
                <div className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-brand-500 flex-shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-all">
                  <FaMapMarkerAlt className="text-sm" />
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-xs font-medium leading-relaxed group-hover:text-white transition-colors">
                    {settings?.contact?.address || '123 Industrial Area, Phase II, New Delhi'}
                  </span>
                </div>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-brand-500 flex-shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-all">
                  <FaPhone className="text-sm" />
                </div>
                <span className="text-white font-bold text-sm tracking-wide">{settings?.contact?.phone || '+91 98765 43210'}</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-brand-500 flex-shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-all">
                  <FaEnvelope className="text-sm" />
                </div>
                <span className="text-white font-bold text-sm">{settings?.contact?.email || 'info@glasstuffan.com'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs font-medium">
            &copy; {new Date().getFullYear()} {settings?.general?.siteName || 'GlassTuffan'}. Precise Engineering.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Link to="/privacy" className="text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Privacy</Link>
            <Link to="/terms" className="text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Terms</Link>
            <Link to="/admin/login" className="text-gray-500 hover:text-brand-500 text-[10px] font-black uppercase tracking-widest transition-all">
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
