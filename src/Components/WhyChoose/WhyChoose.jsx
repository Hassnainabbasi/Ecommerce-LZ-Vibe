
function WhyChoose() {
    return (
        <section id="why-choose" className="py-16 px-5 text-center bg-slate-50 border-t border-slate-200 text-slate-900">
            <h2 className="text-2xl font-semibold mb-3 tracking-tight text-slate-900">
              Why shop with us
            </h2>
            <p className="max-w-3xl text-base mx-auto text-slate-600 mb-12 leading-relaxed">
                Curated products, secure checkout, and reliable delivery. We focus on clear pricing,
                helpful support, and a smooth shopping experience from browse to doorstep.
            </p>

            <div className="flex justify-around flex-wrap gap-10 justify-items-center">
                <div className="flex flex-col items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 w-full md:w-80">
                    <i className="fa-solid fa-medal text-4xl text-blue-600 mb-4"></i>
                    <h3 className="text-lg font-semibold mb-3">Trusted quality</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        We work with reliable suppliers and check listings so you get what you expect—
                        accurate descriptions and consistent quality.
                    </p>
                </div>
                <div className="flex flex-col items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 w-full md:w-80">
                    <i className="fa-solid fa-truck-fast text-4xl text-blue-600 mb-4"></i>
                    <h3 className="text-lg font-semibold mb-3">Fast shipping</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Orders are packed and dispatched quickly. Track your package and get updates
                        as it moves to you.
                    </p>
                </div>
                <div className="flex flex-col items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 w-full md:w-80">
                    <i className="fa-solid fa-rotate-left text-4xl text-blue-600 mb-4"></i>
                    <h3 className="text-lg font-semibold mb-3">Easy support</h3>
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
