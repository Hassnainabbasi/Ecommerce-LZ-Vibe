
function WhyChoose() {
    return (
        <section id="why-choose" className="py-16 px-5 text-center bg-white border-t border-slate-200 text-slate-900">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-red-600">Why customers choose us</p>
            <h2 className="text-3xl font-black mb-3 tracking-tight text-slate-950 sm:text-4xl">
              A retail experience that feels fast, clear, and trustworthy
            </h2>
            <p className="max-w-3xl text-base mx-auto text-slate-600 mb-12 leading-relaxed">
                Bizmart style confidence: bold prices, reliable fulfilment, and a smooth path
                from browsing to checkout.
            </p>

            <div className="container grid gap-5 md:grid-cols-3">
                <div className="flex flex-col items-center bg-white p-7 rounded-[1.75rem] border border-slate-200 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-red-200 transition-all duration-300">
                    <i className="fa-solid fa-medal text-4xl text-red-600 mb-4"></i>
                    <h3 className="text-lg font-black mb-3">Trusted quality</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        We work with reliable suppliers and check listings so you get what you expect—
                        accurate descriptions and consistent quality.
                    </p>
                </div>
                <div className="flex flex-col items-center bg-white p-7 rounded-[1.75rem] border border-slate-200 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-red-200 transition-all duration-300">
                    <i className="fa-solid fa-truck-fast text-4xl text-red-600 mb-4"></i>
                    <h3 className="text-lg font-black mb-3">Fast shipping</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Orders are packed and dispatched quickly. Track your package and get updates
                        as it moves to you.
                    </p>
                </div>
                <div className="flex flex-col items-center bg-white p-7 rounded-[1.75rem] border border-slate-200 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-red-200 transition-all duration-300">
                    <i className="fa-solid fa-rotate-left text-4xl text-red-600 mb-4"></i>
                    <h3 className="text-lg font-black mb-3">Easy support</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Questions about an order? Our team is here to help with returns, exchanges,
                        and product information.
                    </p>
                </div>
            </div>
        </section>

    )
}

export default WhyChoose
