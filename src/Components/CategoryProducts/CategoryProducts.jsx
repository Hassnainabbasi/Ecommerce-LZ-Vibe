import React from 'react';
import { ArrowRight, BadgePercent } from 'lucide-react';
import ProductCard from '../ProductCard/ProductCard';

function CategoryProducts({ product, catId }) {
    if (!product?.products || product.products.length === 0) {
        return null;
    }
        const capitalizeCategory = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };
    
    return (
        <section
            id={`${product?.category.toLowerCase().replace(/\s+/g, '-')}`} 
            className='category-product-section py-12'
        >
            <div className="container mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-yellow-800">
                        <BadgePercent className="h-4 w-4" aria-hidden />
                        Weekly offer
                    </p>
                    <h2 className='mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl'>
                        {capitalizeCategory(product?.category)}
                    </h2>
                    <p className="mt-2 text-sm font-medium text-slate-500">
                        Hot picks with clear prices and quick add-to-cart.
                    </p>
                </div>
                <a
                    href="#products"
                    className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-red-700"
                >
                    More deals
                    <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
            </div>
            <div className="container grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {product?.products?.map((item, index) => (
                    <ProductCard
                        key={item?._id || `${catId}-${index}`} 
                        product={item} 
                    />
                ))}
            </div>
        </section>
    );
}

export default CategoryProducts;