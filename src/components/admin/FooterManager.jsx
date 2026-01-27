import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { FaSave, FaQuoteLeft, FaLink } from 'react-icons/fa';

const FooterManager = () => {
    const [content, setContent] = useState({
        aboutText: 'Precision engineering meets architectural elegance. We are the leading global manufacturer of premium industrial glass solutions.',
        specialties: [
            'Tempered Glass Solutions',
            'High-Strength Laminated',
            'Insulated Thermal Glass',
            'Architectural Glass Design'
        ],
        footerBadge: 'Industrial Glass'
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            const docSnap = await getDoc(doc(db, 'site_content', 'footer'));
            if (docSnap.exists()) {
                setContent(prev => ({ ...prev, ...docSnap.data() }));
            }
            setLoading(false);
        };
        fetchContent();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await setDoc(doc(db, 'site_content', 'footer'), {
                ...content,
                updatedAt: serverTimestamp()
            });
            setMsg('Footer configuration indexed successfully!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            console.error(err);
            setMsg('Error saving.');
        }
        setLoading(false);
    };

    const updateSpecialty = (index, value) => {
        const newSpecialties = [...content.specialties];
        newSpecialties[index] = value;
        setContent({ ...content, specialties: newSpecialties });
    };

    return (
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <h2 className="text-xl font-black mb-8 text-gray-900 uppercase tracking-tighter">Global Footer Interface</h2>
            
            {msg && <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-2xl text-xs font-bold">{msg}</div>}

            <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Brand Meta */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 pl-1">Brand Sub-heading</label>
                            <input 
                                className="w-full border border-gray-100 p-4 rounded-2xl bg-gray-50 focus:bg-white focus:border-cyan-500 outline-none transition-all font-bold text-sm" 
                                value={content.footerBadge}
                                onChange={e => setContent({...content, footerBadge: e.target.value})}
                                placeholder="e.g. Industrial Glass"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 pl-1">
                                <FaQuoteLeft className="inline mr-1 mb-1 text-cyan-500" /> Brief Company Narrative
                            </label>
                            <textarea 
                                className="w-full border border-gray-100 p-4 rounded-2xl bg-gray-50 focus:bg-white focus:border-cyan-500 outline-none transition-all font-bold text-sm" 
                                rows="4"
                                value={content.aboutText}
                                onChange={e => setContent({...content, aboutText: e.target.value})}
                                placeholder="Brief summary of your company..."
                            />
                        </div>
                    </div>

                    {/* Industrial Specialties */}
                    <div className="space-y-4 bg-slate-50 p-6 rounded-[2rem] border border-gray-100">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 pl-1 flex items-center gap-2">
                            <FaLink className="text-cyan-500" /> Key Specialties (Catalog Links)
                        </label>
                        {content.specialties.map((spec, idx) => (
                            <input 
                                key={idx}
                                className="w-full border border-gray-200 p-4 rounded-xl bg-white focus:border-cyan-500 outline-none transition-all font-bold text-sm shadow-sm" 
                                value={spec}
                                onChange={e => updateSpecialty(idx, e.target.value)}
                                placeholder={`Specialty link ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-50">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-slate-900 text-white px-10 py-4 rounded-2xl flex items-center gap-3 hover:bg-black disabled:opacity-50 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-slate-900/20 transition-all active:scale-95"
                    >
                        <FaSave /> Update Footer Architecture
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FooterManager;
