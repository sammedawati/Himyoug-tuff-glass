import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdMenu, MdClose } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Facilities', path: '/facilities' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Events', path: '/events' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  const isHome = location.pathname === '/';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-100 py-2' 
        : 'bg-transparent py-2 sm:py-3'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12 sm:h-14">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 sm:gap-3 group">
            <div className={`w-10 h-10 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-black font-bold text-lg sm:text-xl transition-all duration-300 transform group-hover:rotate-6 ${
              scrolled ? 'bg-brand-600 scale-90' : 'bg-white scale-100'
            }`}>
              {settings?.general?.logoUrl ? (
                <img src={settings.general.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-xl" />
              ) : (
                settings?.general?.siteName?.charAt(0) || 'G'
              )}
            </div>
            <span className={`font-heading font-black text-base sm:text-xl tracking-tighter transition-all duration-300 ${
              scrolled ? 'text-gray-900' : 'text-white drop-shadow-md'
            }`}>
              {settings?.general?.siteName || 'GlassTuffan'}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-1 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                  isActive(link.path)
                    ? (scrolled ? 'bg-brand-600/10 text-brand-600' : 'text-brand-400 font-black drop-shadow-lg')
                    : (scrolled ? 'text-gray-600 hover:text-brand-600 hover:bg-gray-50' : 'text-white hover:text-brand-200 drop-shadow-md')
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="ml-4 pl-4 border-l border-white/20">
              <Link
                to="/quote"
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 ${
                  scrolled
                    ? 'bg-brand-600 text-white hover:bg-brand-700' 
                    : 'bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-white/20 hover:border-white/40'
                }`}
              >
                Get a Quote
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-3 sm:p-3 rounded-xl transition-colors ${
                scrolled ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/20'
              }`}
              aria-label="Toggle menu"
            >
              <motion.div
                initial={false}
                animate={{ rotate: isOpen ? 90 : 0 }}
              >
                {isOpen ? <MdClose size={32} /> : <MdMenu size={32} />}
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
            className="lg:hidden absolute top-full left-0 w-full bg-white shadow-2xl overflow-hidden border-t border-gray-100"
          >
            <motion.div 
               initial="initial"
               animate="animate"
               variants={{
                 animate: { transition: { staggerChildren: 0.05 } }
               }}
               className="px-3 sm:px-4 pt-4 pb-8 space-y-2"
            >
              {navLinks.map((link) => (
                <motion.div key={link.name} variants={{
                  initial: { opacity: 0, x: -20 },
                  animate: { opacity: 1, x: 0 }
                }}>
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 sm:px-5 py-3 sm:py-4 rounded-2xl text-base sm:text-lg font-bold transition-all ${
                      isActive(link.path)
                        ? 'bg-brand-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 }
                }}
                className="pt-4"
              >
                <Link
                  to="/quote"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-4 sm:py-5 bg-brand-600 text-white text-base sm:text-lg font-black uppercase tracking-widest rounded-2xl shadow-xl active:scale-95 transition-transform"
                >
                  Get a Quote
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
