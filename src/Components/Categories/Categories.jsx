import './Categories.css'
import ScrollContainer from "react-indiana-drag-scroll";
import "react-indiana-drag-scroll/dist/style.css";
import { useState, useEffect, useRef } from 'react';
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
            gsap.from('.category-circle-item', {
                y: 16,
                opacity: 0,
                duration: 0.45,
                stagger: 0.05,
                ease: 'power3.out',
            });
        }, sectionRef);
        return () => ctx.revert();
    }, [loading, categories.length]);

    const formatLabel = (cat) =>
        cat.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

    if (loading) {
        return (
            <section id='categories' className='categories-section py-8'>
                <div className="container">
                    <p className='text-center text-slate-500'>Loading categories...</p>
                </div>
            </section>
        );
    }

    return (
        <section ref={sectionRef} id='categories' className='categories-section bg-white py-8 md:py-12'>
            <div className="container mb-4 md:mb-6">
                <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-teal-600 sm:text-left">
                  Top categories
                </p>
                <h2 className="collection-title mt-2 text-center text-2xl font-semibold text-slate-500 sm:text-left md:text-3xl lg:text-4xl">
                    Shop by
                    <span className="inline sm:before:content-['_']"> Category</span>
                </h2>
            </div>
            <ScrollContainer
                className="category-circles container flex gap-4 overflow-x-auto py-2 sm:gap-5 md:flex-wrap md:justify-center md:overflow-visible"
                vertical={false}
            >
                {categories?.map((item, index) => (
                    <a
                        className="category-circle-item shrink-0"
                        href={`#${item?.category.toLowerCase().replace(/\s+/g, '-')}`}
                        key={index}
                    >
                        <div className="category-circle">
                            <img
                                src={getImageUrl(item?.image)}
                                alt={item?.category}
                                onError={(e) => {
                                    e.target.src = '/images/placeholder.png';
                                }}
                            />
                        </div>
                        <span className="category-circle-label">{formatLabel(item?.category)}</span>
                    </a>
                ))}
            </ScrollContainer>
        </section>
    )
}

export default Categories
