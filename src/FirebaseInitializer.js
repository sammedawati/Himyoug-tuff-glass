import { db } from './services/firebase';
import { doc, getDoc, setDoc, serverTimestamp, collection, getDocs, addDoc } from 'firebase/firestore';
import { homeFeatures, homeStats, homeShowcase, dummyAbout, dummyProducts, dummyGallery, dummyEvents, dummyFacilities, dummyTestimonials, dummyClients, dummyInquiries } from './utils/dummyData';

export const initializeFirebaseData = async () => {
    try {
        // 1. Check if Site Config exists
        const configRef = doc(db, 'site_settings', 'config');
        const configSnap = await getDoc(configRef);
        if (!configSnap.exists()) {
            await setDoc(configRef, {
                general: { siteName: 'Glass Tuffan', logoUrl: '' },
                contact: { 
                    phone: '+91 98765 43210', 
                    email: 'info@glasstuffan.com', 
                    address: '123 Industrial Area, Phase II, New Delhi',
                    mapUrl: '' 
                },
                social: { facebook: '#', instagram: '#', linkedin: '#', twitter: '#' },
                hero: {
                    title: 'Forging the Future\nwith Tuff Glass.',
                    subtitle: 'World-class tempered, laminated, and insulated glass manufacturing.',
                    bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000'
                },
                updatedAt: serverTimestamp()
            });
            console.log('Site Config Initialized');
        }

        // 2. Check for Home Features
        const featuresRef = doc(db, 'site_content', 'home_features');
        const featuresSnap = await getDoc(featuresRef);
        if (!featuresSnap.exists()) {
            await setDoc(featuresRef, { items: homeFeatures, updatedAt: serverTimestamp() });
            console.log('Home Features Initialized');
        }

        // 3. Check for Home Stats
        const statsRef = doc(db, 'site_content', 'home_stats');
        const statsSnap = await getDoc(statsRef);
        if (!statsSnap.exists()) {
            await setDoc(statsRef, { items: homeStats, updatedAt: serverTimestamp() });
            console.log('Home Stats Initialized');
        }

        // 4. Check for Home Showcase
        const showcaseRef = doc(db, 'site_content', 'home_showcase');
        const showcaseSnap = await getDoc(showcaseRef);
        if (!showcaseSnap.exists() || (showcaseSnap.data().items?.length || 0) === 0) {
            await setDoc(showcaseRef, {
                badge: 'Premium Showcase',
                title: 'Elite Glass Collection.',
                items: homeShowcase,
                updatedAt: serverTimestamp()
            }, { merge: true });
            console.log('Home Showcase Synchronized');
        }

        // 5. Check for About Content
        const aboutRef = doc(db, 'site_content', 'about');
        const aboutSnap = await getDoc(aboutRef);
        if (!aboutSnap.exists()) {
            await setDoc(aboutRef, { ...dummyAbout, updatedAt: serverTimestamp() });
            console.log('About Content Initialized');
        }

        // 5.2 Product Categories
        const productCatsRef = doc(db, 'site_content', 'product_categories');
        const productCatsSnap = await getDoc(productCatsRef);
        if (!productCatsSnap.exists()) {
            await setDoc(productCatsRef, {
                items: [
                    { id: 'tempered', name: 'Tempered Glass', icon: 'FaShieldAlt', desc: 'Structural toughened glass with 5x standard strength.', image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=800' },
                    { id: 'laminated', name: 'Laminated Glass', icon: 'FaLayerGroup', desc: 'Security protocols with multi-layer bonding technology.', image: 'https://images.unsplash.com/photo-1495433324511-bf8e92934d90?q=80&w=800' },
                    { id: 'insulated', name: 'Insulated Glass', icon: 'FaTemperatureHigh', desc: 'Thermodynamic efficiency with dual-seal argon units.', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800' },
                    { id: 'frosted', name: 'Frosted Glass', icon: 'FaVial', desc: 'Privacy-focused acid etching and decorative branding.', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800' },
                    { id: 'reflective', name: 'Reflective Glass', icon: 'FaBuilding', desc: 'Solar control coatings for commercial skyscraper facades.', image: 'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?q=80&w=800' },
                    { id: 'specialty', name: 'Specialty Glass', icon: 'FaCogs', desc: 'Bullet-resistant, smart, and fire-rated glass assets.', image: 'https://images.unsplash.com/photo-1558442074-3c19857bc1d5?q=80&w=800' }
                ],
                updatedAt: serverTimestamp()
            });
            console.log('Product Categories Initialized');
        }

        // 5.3 Facilities Highlights
        const facilitiesContentRef = doc(db, 'site_content', 'facilities');
        const facilitiesContentSnap = await getDoc(facilitiesContentRef);
        if (!facilitiesContentSnap.exists()) {
            await setDoc(facilitiesContentRef, {
                techNodes: [
                    { id: 1, title: 'Convection Protocol', desc: 'Full horizontal convection tempering for premium optical clarity.', icon: 'FaRobot' },
                    { id: 2, title: 'Precision CNC', desc: 'Automated glass processing with micron-level tolerance.', icon: 'FaMicrochip' },
                    { id: 3, title: 'De-Ionized Wash', desc: 'Reverse osmosis water treatment for zero-residue surface prep.', icon: 'FaFingerprint' },
                    { id: 4, title: 'Optical Scan', desc: 'AI-driven surface distortion monitoring in real-time.', icon: 'FaEye' }
                ],
                updatedAt: serverTimestamp()
            });
            console.log('Facilities Highlights Initialized');
        }

        // 5.1 Check for Footer Content
        const footerRef = doc(db, 'site_content', 'footer');
        const footerSnap = await getDoc(footerRef);
        if (!footerSnap.exists()) {
            await setDoc(footerRef, {
                aboutText: 'Precision engineering meets architectural elegance. We are the leading global manufacturer of premium industrial glass solutions.',
                specialties: [
                    'Tempered Glass Solutions',
                    'High-Strength Laminated',
                    'Insulated Thermal Glass',
                    'Architectural Glass Design'
                ],
                footerBadge: 'Industrial Glass',
                updatedAt: serverTimestamp()
            });
            console.log('Footer Content Initialized');
        }

        // 6. Check for Page Hero Content
        const pagesToInitialize = [
            { id: 'home', title: 'Structural Glass\nIntelligence.', subtitle: 'Architectural solutions engineered for clarity, safety, and thermodynamic performance.', bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000', badge: 'Excellence in Glass Manufacturing' },
            { id: 'about', title: 'Precision in\nEvery Reflection.', subtitle: 'Since 2008, setting the absolute benchmark in high-performance glass tempering.', bgImage: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=2000', badge: 'Our Heritage' },
            { id: 'products', title: 'Industrial Glass\nPortfolio.', subtitle: 'Comprehensive range of tempered, laminated, and insulated architectural assets.', bgImage: 'https://images.unsplash.com/photo-1495433324511-bf8e92934d90?q=80&w=2000', badge: 'Solutions' },
            { id: 'facilities', title: 'Robotic Glass\nManufacturing.', subtitle: 'State-of-the-art horizontal tempering furnaces and automated CNC processing lines.', bgImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000', badge: 'Technology' },
            { id: 'gallery', title: 'Architectural\nShowcase.', subtitle: 'Visual documentation of our structural glass implementations across global skylines.', bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000', badge: 'Portfolio' },
            { id: 'events', title: 'Glass Industry\nIntelligence.', subtitle: 'Latest updates on global expos, safety certifications, and industrial milestones.', bgImage: 'https://images.unsplash.com/photo-1565151443833-2c5e9118c4b9?q=80&w=2000', badge: 'Events Feed' },
            { id: 'contact', title: 'Connect with\nEngineering.', subtitle: 'Coordinate with our technical department for structural glass specifications and inquiries.', bgImage: 'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?q=80&w=2000', badge: 'Command Center' },
            { id: 'quote', title: 'Secure a\nTechno-Commercial Quote.', subtitle: 'Submit your requirements for precision glass manufacturing and logistical coordination.', bgImage: 'https://images.unsplash.com/photo-1507646227500-4d389b0012be?q=80&w=2000', badge: 'Strategic Inquiry' }
        ];

        // 5.4 Gallery Categories
        const galleryCatsRef = doc(db, 'site_content', 'gallery_categories');
        const galleryCatsSnap = await getDoc(galleryCatsRef);
        if (!galleryCatsSnap.exists()) {
            await setDoc(galleryCatsRef, {
                items: [
                    { id: 'all', label: 'All Operations' },
                    { id: 'architectural', label: 'Architecture' },
                    { id: 'interior', label: 'Interiors' },
                    { id: 'industrial', label: 'Manufacturing' }
                ],
                updatedAt: serverTimestamp()
            });
            console.log('Gallery Categories Initialized');
        }

        for (const pg of pagesToInitialize) {
            const pgRef = doc(db, 'page_content', pg.id);
            const pgSnap = await getDoc(pgRef);
            if (!pgSnap.exists()) {
                await setDoc(pgRef, { ...pg, updatedAt: serverTimestamp() });
                console.log(`Page Content Initialized: ${pg.id}`);
            }
        }

        // 7. Check if collections are empty and seed if needed
        const collectionsToSeed = [
            { name: 'products', data: dummyProducts },
            { name: 'facilities', data: dummyFacilities },
            { name: 'gallery', data: dummyGallery },
            { name: 'events', data: dummyEvents },
            { name: 'testimonials', data: dummyTestimonials },
            { name: 'clients', data: dummyClients },
            { name: 'inquiries', data: dummyInquiries }
        ];

        for (const col of collectionsToSeed) {
            const snap = await getDocs(collection(db, col.name));
            if (snap.empty) {
                console.log(`Seeding ${col.name}...`);
                for (const item of col.data) {
                    await addDoc(collection(db, col.name), { ...item, createdAt: serverTimestamp() });
                }
            }
        }

    } catch (error) {
        console.error('Data initialization failed:', error);
    }
};
