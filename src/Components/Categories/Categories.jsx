import './Categories.css'
import ScrollContainer from "react-indiana-drag-scroll";
import "react-indiana-drag-scroll/dist/style.css";
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Tags } from 'lucide-react';
import gsap from 'gsap';
import { fetchAllProducts } from '../../api';
import { getImageUrl } from '../../utils/imageHelper';

function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const sectionRef = useRef(null);

    useEffect(() => {
        (async () => {
            try {
                const products = await fetchAllProducts();
                
                const categoryMap = {};
                products.forEach(p => {
                    const cat = p.category || 'Uncategorized';
                    if (!categoryMap[cat]) {
                        categoryMap[cat] = {
                            category: cat,
                            image: p.image || ''
                        };
                    }
                });
                
                setCategories(Object.values(categoryMap));
            } catch (err) {
                console.error("Failed to load categories", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        if (loading || categories.length === 0) return;
        const ctx = gsap.context(() => {
            gsap.from('.category-card', {
                y: 24,
                opacity: 0,
                duration: 0.55,
                stagger: 0.06,
                ease: 'power3.out',
            });
        }, sectionRef);
        return () => ctx.revert();
    }, [loading, categories.length]);

    if (loading) {
        return (
            <section id='categories' className='py-14 px-5 bg-white'>
                <div className="container">
                    <h2 className='text-2xl sm:text-3xl font-black text-slate-950 tracking-tight'>
                      Top categories
                    </h2>
                    <p className='mt-2 text-gray-600'>Loading categories...</p>
                </div>
            </section>
        );
    }

    return (
        <section ref={sectionRef} id='categories' className='py-14 bg-white'>
            <div className="container mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-red-700">
                        <Tags className="h-4 w-4" aria-hidden />
                        Top categories
                    </p>
                    <h2 className='mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl'>
                      Shop by category
                    </h2>
                    <p className="mt-2 max-w-xl text-sm text-slate-500">
                        Quick links inspired by modern value-retail stores so customers reach products faster.
                    </p>
                </div>
                <a href="#products" className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700">
                    See all products
                    <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
            </div>
            <ScrollContainer
                className="category-items container flex gap-4 py-3 active:cursor-grab overflow-x-auto"
                vertical={false}>
                {
                    categories?.map((item, index) => (
                        <a className="category-card group block min-w-[190px]" href={`#${item?.category.toLowerCase().replace(/\s+/g, '-')}`} key={index}>
                            <div className='overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl'>
                                <div className="image h-36 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 to-yellow-50">
                                    <img 
                                        className='h-full w-full object-cover transition duration-500 group-hover:scale-110' 
                                        src={getImageUrl(item?.image)} 
                                        alt={item?.category}
                                        onError={(e) => {
                                            e.target.src = '/images/placeholder.png';
                                        }}
                                    />
                                </div>
                                <div className="mt-4 flex items-center justify-between gap-3">
                                    <h3 className="line-clamp-1 font-black text-slate-900 transition-colors group-hover:text-red-700">{item?.category.charAt(0).toUpperCase() + item?.category.slice(1)}</h3>
                                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 transition group-hover:bg-red-600 group-hover:text-white">
                                        <ArrowRight className="h-4 w-4" aria-hidden />
                                    </span>
                                </div>
                                <p className="mt-1 text-xs font-semibold text-slate-400">Shop deals</p>
                            </div>
                        </a>
                    ))
                }
            </ScrollContainer>
        </section>
    )
}

export default Categories