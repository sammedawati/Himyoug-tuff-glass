import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTimes, FaLayerGroup, FaArrowRight, FaExpand, FaPlay } from 'react-icons/fa';
import { db } from '../../services/firebase';
import { collection, onSnapshot, query, orderBy, doc } from 'firebase/firestore';
import { fadeInUp, staggerContainer, pageTransition } from '../../utils/animations';
import { useFadeIn, useStaggerFadeIn, useParallax } from '../../hooks/useGsap';


const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [ytVideos, setYtVideos] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ytConfig, setYtConfig] = useState(null);
  const [pageContent, setPageContent] = useState({
    title: 'Visual Portfolio',
    subtitle: 'Capturing the fusion of engineering precision and architectural elegance in glass.',
    bgImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=2000'
  });

  const galleryHeaderRef = useStaggerFadeIn(0.2);
  const filterRef = useFadeIn('up', 40, 0.4);
  const galleryGridRef = useStaggerFadeIn(0.1);
  const galleryHeroParallaxRef = useParallax(20);
  const videoSectionRef = useRef(null);

  useEffect(() => {
      if (activeCategory === 'channel_feed' && videoSectionRef.current) {
          setTimeout(() => {
              videoSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
      }
  }, [activeCategory]);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const images = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setGalleryImages(images);
        setLoading(false);
    }, (error) => {
        console.error("Gallery fetch error:", error);
        setLoading(false); 
    });

    const unsubscribePage = onSnapshot(doc(db, 'page_content', 'gallery'), (doc) => {
      if (doc.exists()) {
        setPageContent(prev => ({ ...prev, ...doc.data() }));
      }
    });

    const unsubscribeCats = onSnapshot(doc(db, 'site_content', 'gallery_categories'), (doc) => {
        if (doc.exists()) setCategoriesList(doc.data().items || []);
    });

    const unsubscribeConfig = onSnapshot(doc(db, 'site_settings', 'config'), (docSnap) => {
        if (docSnap.exists() && docSnap.data().youtube?.apiKey) {
            setYtConfig(docSnap.data().youtube);
            fetchYoutubeVideos(docSnap.data().youtube);
        }
    });

    const fetchYoutubeVideos = async (config) => {
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?key=${config.apiKey}&channelId=${config.channelId}&part=snippet,id&order=date&maxResults=50&type=video`
            );
            const data = await response.json();
            if (data.items) {
                const formattedVideos = data.items.map(v => ({
                    id: v.id.videoId,
                    youtubeId: v.id.videoId,
                    type: 'video',
                    title: v.snippet.title,
                    description: v.snippet.description,
                    imageUrl: v.snippet.thumbnails.high?.url || v.snippet.thumbnails.default?.url,
                    category: 'Live Feed',
                    createdAt: v.snippet.publishedAt
                }));
                setYtVideos(formattedVideos);
            }
        } catch (e) {
            console.error("YouTube Fetch Error:", e);
        }
    };

    return () => {
      unsubscribe();
      unsubscribePage();
      unsubscribeCats();
      unsubscribeConfig();
    };
  }, []);

  const allAssets = [...galleryImages, ...ytVideos].sort((a, b) => {
      const dateA = a.createdAt?.seconds ? a.createdAt.toDate() : new Date(a.createdAt || 0);
      const dateB = b.createdAt?.seconds ? b.createdAt.toDate() : new Date(b.createdAt || 0);
      return dateB - dateA;
  });

  const filteredImages = activeCategory === 'all' 
    ? allAssets 
    : activeCategory === 'videos'
    ? allAssets.filter(img => img.type === 'video')
    : allAssets.filter(img => img.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <motion.div 
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-slate-50/50 overflow-hidden"
    >
      {/* Cinematic Visual Portfolio Hero */}
      <section className="relative min-h-[60vh] flex items-center pt-24 pb-12 bg-slate-950 overflow-hidden">
        <div ref={galleryHeroParallaxRef} className="absolute inset-0 z-0">
          <img 
            src={pageContent.bgImage} 
            alt="Portfolio" 
            className="w-full h-full object-cover scale-110 opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
            <div 
              ref={galleryHeaderRef}
              className="max-w-4xl mx-auto"
            >
                <div className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.5em] inline-block mb-6 shadow-2xl shadow-blue-600/40">
                    Precision Showcase
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white leading-none uppercase tracking-tighter mb-4 italic">
                    {pageContent.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-300 font-medium leading-relaxed max-w-2xl mx-auto opacity-70">
                    {pageContent.subtitle}
                </p>
            </div>
        </div>
        
        {/* Background Decal */}
        <div className="absolute bottom-0 left-0 text-[10vw] font-black text-white/5 pointer-events-none select-none tracking-tighter uppercase leading-none z-0 whitespace-nowrap">
            Architecture Gallery 2026
        </div>
      </section>

      <div className="container mx-auto px-6 -mt-8 relative z-20 pb-20">
        {/* Tactical Filter Control */}
        <div ref={filterRef} className="bg-white p-3 rounded-[2rem] shadow-2xl border border-slate-100 mb-10 max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-2">
                {categoriesList.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap ${
                            activeCategory === cat.id
                            ? 'bg-slate-900 text-white shadow-xl scale-105'
                            : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
                
                {/* Dedicated Video Channel Tab */}
                <button
                    onClick={() => setActiveCategory('channel_feed')}
                    className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap flex items-center gap-3 ${
                        activeCategory === 'channel_feed'
                        ? 'bg-red-600 text-white shadow-xl scale-105 shadow-red-600/20'
                        : 'text-red-400 hover:text-red-600 hover:bg-red-50'
                    }`}
                >
                    <FaPlay size={10} /> Industrial Films
                </button>
                {ytVideos.length > 0 && (
                    <button
                        onClick={() => setActiveCategory('live feed')}
                        className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap ${
                            activeCategory === 'live feed'
                            ? 'bg-red-600 text-white shadow-xl scale-105 shadow-red-600/20'
                            : 'text-red-400 hover:text-red-600 hover:bg-red-50'
                        }`}
                    >
                        Live Feed
                    </button>
                )}
            </div>
        </div>

        {/* Dynamic Asset Grid or Channel Feed */}
        {activeCategory === 'channel_feed' ? (
             <motion.div 
                ref={videoSectionRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-6xl mx-auto mb-24 scroll-mt-40"
             >
                 <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-800 aspect-video relative group">
                     {ytConfig?.channelId ? (
                        <iframe 
                            src={`https://www.youtube.com/embed/videoseries?list=${ytConfig.channelId.replace(/^UC/, 'UU')}`}
                            title="Industrial Films Channel"
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                     ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-950">
                            <FaPlay size={64} className="mb-6 opacity-20" />
                            <h3 className="text-xl font-black uppercase tracking-widest opacity-40">Channel Feed Offline</h3>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-2 opacity-30">Configuration Required in Admin Panel</p>
                        </div>
                     )}
                 </div>
                 <div className="text-center mt-10">
                     <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Official Broadcast Feed</h3>
                     <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-3">Streaming direct from our industrial archives.</p>
                 </div>
             </motion.div>
        ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="h-80 bg-white rounded-[2.5rem] animate-pulse items-center justify-center flex border border-slate-200 shadow-sm">
                         <div className="w-12 h-12 bg-slate-50 rounded-full"></div>
                    </div>
                ))}
            </div>
        ) : (
          <div 
            ref={galleryGridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative cursor-pointer overflow-hidden rounded-[2rem] shadow-xl bg-slate-900 h-[300px] border border-white/5"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.imageUrl || image.src}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent">
                    <div className="flex items-center gap-3 text-blue-500 text-[8px] font-black uppercase tracking-[0.4em] mb-3">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div> {image.category}
                    </div>
                    {image.type === 'video' && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/50 scale-125 opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <FaPlay size={20} className="ml-1" />
                        </div>
                    )}
                    <h3 className="font-black text-white text-xl uppercase tracking-tighter mb-4">{image.title}</h3>
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                         <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-xl text-white">
                             <FaExpand size={14} />
                         </div>
                    </div>
                  </div>
                </div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Ultra-Premium Lightbox Terminal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/98 backdrop-blur-2xl p-4 md:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="fixed top-8 right-8 text-white/40 hover:text-white transition-all duration-500 hover:rotate-90 z-[110] p-4 bg-white/5 hover:bg-white/10 rounded-full border border-white/10"
            >
              <FaTimes size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              className="relative max-w-7xl w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
               <div className="relative group w-full flex justify-center overflow-hidden rounded-[2rem]">
                  {selectedImage.type === 'channel' ? (
                      <div className="aspect-video w-full max-w-4xl shadow-2xl border border-white/10">
                          <iframe 
                            src={`https://www.youtube.com/embed/videoseries?list=${selectedImage.playlistId}`}
                            title="Channel Feed"
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                          ></iframe>
                      </div>
                  ) : selectedImage.type === 'video' && selectedImage.youtubeId ? (
                      <div className="aspect-video w-full max-w-4xl shadow-2xl border border-white/10">
                          <iframe 
                            src={`https://www.youtube.com/embed/${selectedImage.youtubeId}?autoplay=1&rel=0`}
                            title={selectedImage.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                          ></iframe>
                      </div>
                  ) : (
                      <img
                        src={selectedImage.imageUrl || selectedImage.src}
                        alt={selectedImage.title}
                        className="max-h-[70vh] w-auto object-contain rounded-[2rem] shadow-2xl border border-white/10"
                      />
                  )}
              </div>
              
              <div className="mt-8 text-center text-white max-w-2xl px-6">
                <div className="inline-block px-5 py-1.5 bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] rounded-full border border-blue-500/30 mb-6">
                    {selectedImage.category}
                </div>
                <h3 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter italic">{selectedImage.title}</h3>
                <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed uppercase tracking-wider opacity-80">{selectedImage.description}</p>
                <div className="mt-10 h-[1px] w-24 bg-blue-600 mx-auto"></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GalleryPage;
