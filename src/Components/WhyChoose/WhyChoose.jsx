
function WhyChoose() {
    return (
        <section id="why-choose" className="py-14 px-5 text-center bg-white border-t border-slate-100 text-slate-900">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-teal-600">Why customers choose us</p>
            <h2 className="text-2xl font-bold mb-3 tracking-tight text-slate-700 sm:text-3xl">
              Shopping that feels fast, clear, and trustworthy
            </h2>
            <p className="max-w-2xl text-sm mx-auto text-slate-500 mb-10 leading-relaxed">
                Clear prices, reliable fulfilment, and a smooth path from browsing to checkout.
            </p>

            <div className="container grid gap-4 md:grid-cols-3">
                <div className="flex flex-col items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <i className="fa-solid fa-medal text-3xl text-teal-600 mb-3"></i>
                    <h3 className="text-base font-bold mb-2">Trusted quality</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Reliable suppliers and accurate product listings so you get what you expect.
                    </p>
                </div>
                <div className="flex flex-col items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <i className="fa-solid fa-truck-fast text-3xl text-teal-600 mb-3"></i>
                    <h3 className="text-base font-bold mb-2">Fast shipping</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Orders packed and dispatched quickly with tracking updates.
                    </p>
                </div>
                <div className="flex flex-col items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <i className="fa-solid fa-rotate-left text-3xl text-teal-600 mb-3"></i>
                    <h3 className="text-base font-bold mb-2">Easy support</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Help with returns, exchanges, and product questions when you need it.
                    </p>
                </div>
            </div>
        </section>

    )
}

export default WhyChoose
