import { ArrowRight } from 'lucide-react';
import ProductCard from '../ProductCard/ProductCard';

function CategoryProducts({ product, catId, view = 'grid' }) {
    if (!product?.products || product.products.length === 0) {
        return null;
    }

    const capitalizeCategory = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const gridClass = view === 'list' ? 'list-view-grid container' : 'product-grid container';
    
    return (
        <section
            id={`${product?.category.toLowerCase().replace(/\s+/g, '-')}`} 
            className='category-product-section py-6 sm:py-8 md:py-12'
        >
            <div className="container mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between md:mb-8">
                <div className="text-center sm:text-left">
                    <h2 className='collection-title text-xl font-semibold text-slate-500 sm:text-2xl md:text-3xl lg:text-4xl'>
                        {capitalizeCategory(product?.category)}
                        <span className="block sm:inline sm:before:content-['_']">Collection</span>
                    </h2>
                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                        Browse products with clear prices and quick add-to-cart.
                    </p>
                </div>
                <a
                    href="#products"
                    className="mx-auto inline-flex w-fit items-center gap-2 rounded-full bg-teal-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-700 sm:mx-0"
                >
                    View all
                    <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
            </div>
            <div className={gridClass}>
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
