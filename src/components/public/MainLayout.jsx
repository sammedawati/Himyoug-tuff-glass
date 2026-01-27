import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import GlobalCTA from './GlobalCTA';
import { Outlet, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { motion } from 'framer-motion';
import { db } from '../../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { pageTransition } from '../../utils/animations';

const MainLayout = () => {
  const { pathname } = useLocation();
  const [settings, setSettings] = useState({
      general: {
          siteName: 'Glass Tuffan',
          logoUrl: '',
      },
      contact: {
          phone: '+91 98765 43210',
          email: 'info@glasstuffan.com',
          address: '123 Industrial Area, New Delhi',
          mapUrl: ''
      },
      hero: {
          title: 'Forging the Future with Tuff Glass',
          subtitle: 'World-class tempered, laminated, and insulated glass manufacturing.',
          bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3'
      },
      social: {
          facebook: '#',
          instagram: '#',
          linkedin: '#',
          twitter: '#'
      }
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
      offset: 100,
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'site_settings', 'config'), (doc) => {
        if (doc.exists()) {
            setSettings(prev => ({ ...prev, ...doc.data() }));
        }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-900">
      <Navbar settings={settings} />
      <main className="flex-grow overflow-hidden">
        <motion.div
           key={pathname}
           variants={pageTransition}
           initial="initial"
           animate="animate"
           exit="exit"
        >
          <Outlet context={{ settings }} />
        </motion.div>
      </main>
      <GlobalCTA />
      <Footer settings={settings} />

    </div>
  );
};

export default MainLayout;
