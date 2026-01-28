import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { FaPlus, FaTrash, FaDatabase } from 'react-icons/fa';
import { dummyGallery } from '../../utils/dummyData';

const GalleryManager = () => {
    const [images, setImages] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: 'architectural',
        imageUrl: '',
        videoUrl: '',
        type: 'image',
        description: ''
    });
    const [categories, setCategories] = useState([]);
    const [editCats, setEditCats] = useState(false);

    const seedData = async () => {
        if (window.confirm('Add sample images to gallery?')) {
            try {
                const promises = dummyGallery.map(img => addDoc(collection(db, 'gallery'), {
                    title: img.title,
                    category: img.category,
                    imageUrl: img.imageUrl,
                    description: img.description,
                    createdAt: serverTimestamp()
                }));
                await Promise.all(promises);
            } catch (e) {
                console.error(e);
            }
        }
    };

    useEffect(() => {
        const unsubscribeImgs = onSnapshot(collection(db, 'gallery'), (snapshot) => {
            setImages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (error) => console.error(error));
        const unsubscribeCats = onSnapshot(doc(db, 'site_content', 'gallery_categories'), (doc) => {
            if (doc.exists()) setCategories(doc.data().items || []);
        });
        return () => {
            unsubscribeImgs();
            unsubscribeCats();
        };
    }, []);

    const handleSaveCats = async () => {
        try {
            await setDoc(doc(db, 'site_content', 'gallery_categories'), {
                items: categories,
                updatedAt: serverTimestamp()
            });
            setEditCats(false);
        } catch (e) {
            console.error(e);
        }
    };

    const extractYoutubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSave = { ...formData };
            if (formData.type === 'video' && formData.videoUrl) {
                const yId = extractYoutubeId(formData.videoUrl);
                if (yId) {
                    dataToSave.youtubeId = yId;
                    // If no image is provided for a video, use the YouTube thumbnail
                    if (!formData.imageUrl) {
                        dataToSave.imageUrl = `https://img.youtube.com/vi/${yId}/maxresdefault.jpg`;
                    }
                }
            }

            await addDoc(collection(db, 'gallery'), {
                ...dataToSave,
                createdAt: serverTimestamp()
            });
            setIsAdding(false);
            setFormData({ title: '', category: 'architectural', imageUrl: '', videoUrl: '', type: 'image', description: '' });
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this image?')) {
            await deleteDoc(doc(db, 'gallery', id));
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Gallery Management</h2>
                <div className="flex gap-2">
                    <button onClick={() => setEditCats(!editCats)} className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded hover:bg-slate-200 flex items-center gap-1">
                        Manage Taxonomies
                    </button>
                    <button onClick={seedData} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded hover:bg-gray-200 flex items-center gap-1">
                        <FaDatabase /> Add Demo Data
                    </button>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="bg-brand-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-brand-700"
                    >
                        {isAdding ? 'Cancel' : <><FaPlus /> Add Image</>}
                    </button>
                </div>
            </div>

            {editCats && (
                <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-200 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Gallery Taxonomy Management</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {categories.map((cat, idx) => (
                            <div key={cat.id} className="space-y-2">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Label Node {idx + 1}</label>
                                <input
                                    className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs"
                                    value={cat.label}
                                    onChange={e => {
                                        const n = [...categories];
                                        n[idx] = { ...n[idx], label: e.target.value };
                                        setCategories(n);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end">
                        <button onClick={handleSaveCats} className="bg-slate-900 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                            Save Architecture
                        </button>
                    </div>
                </div>
            )}

            {isAdding && (
                <div className="bg-gray-50 p-4 rounded mb-6 border">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            placeholder="Title"
                            className="border p-2 rounded"
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                        <select
                            className="border p-2 rounded"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            {categories.filter(c => c.id !== 'all').map(c => (
                                <option key={c.id} value={c.id}>{c.label}</option>
                            ))}
                        </select>
                        <div className="md:col-span-2 flex gap-4 bg-white p-1 rounded-xl border border-slate-200">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'image' })}
                                className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${formData.type === 'image' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}
                            >
                                Static Asset (Image)
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'video' })}
                                className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${formData.type === 'video' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}
                            >
                                Dynamic Feed (YouTube)
                            </button>
                        </div>

                        <input
                            placeholder={formData.type === 'image' ? "Direct Image URL" : "Cover Image URL (Optional)"}
                            type="url"
                            className="border p-2 rounded"
                            required={formData.type === 'image'}
                            value={formData.imageUrl}
                            onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                        />
                        {formData.type === 'video' && (
                            <input
                                placeholder="YouTube Video URL (e.g. https://www.youtube.com/watch?v=...)"
                                type="url"
                                className="border p-2 rounded"
                                required
                                value={formData.videoUrl}
                                onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                            />
                        )}
                        <textarea
                            placeholder="Description"
                            className="border p-2 rounded md:col-span-2"
                            rows="2"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                        <button type="submit" className="bg-green-600 text-white py-2 rounded md:col-span-2 hover:bg-green-700">Add to Gallery</button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img) => (
                    <div key={img.id} className="relative group border rounded overflow-hidden">
                        <div className="relative aspect-video">
                            <img src={img.imageUrl || img.src} alt={img.title} className="w-full h-full object-cover" />
                            {img.type === 'video' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                                    <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg">
                                        <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[7px] border-l-white border-b-[4px] border-b-transparent ml-1"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-2">
                            <h4 className="font-bold text-sm truncate">{img.title}</h4>
                            <span className="text-xs text-brand-600 uppercase">{img.category}</span>
                        </div>
                        <button
                            onClick={() => handleDelete(img.id)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <FaTrash size={12} />
                        </button>
                    </div>
                ))}
                {images.length === 0 && !isAdding && <p className="col-span-full text-center text-gray-400 py-10">No images yet.</p>}
            </div>
        </div>
    );
};

export default GalleryManager;
