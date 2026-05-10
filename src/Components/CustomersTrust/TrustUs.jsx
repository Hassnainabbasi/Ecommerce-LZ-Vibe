import React from "react";

function TrustUs() {
  return (
    <div className="w-[min(100%,calc(1320px-30px))] mx-auto flex flex-col p-6 md:p-10">
      <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-8 text-center mx-auto">
        <p className="max-w-[520px] text-sm md:text-[15px] font-medium leading-7 text-slate-500 text-center uppercase tracking-wide">
          Customers trust us
        </p>
        <h1 className="text-[28px] sm:text-3xl md:text-4xl font-semibold pt-2 pb-2 text-center leading-snug text-slate-900">
          Quality products and a shopping experience you can rely on
        </h1>
        <p className="max-w-[740px] text-sm sm:text-base mb-4 text-center px-2 text-slate-600">
          We focus on clear product information, fair pricing, and dependable fulfilment.
          Every order matters—whether it is your first purchase or you shop with us regularly.
        </p>
        <p className="leading-7 text-center mb-4 px-2 text-sm sm:text-base text-slate-600">
          From browsing categories to checkout and delivery, we keep things simple: honest listings,
          secure payments, and support when you need it.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="sm:w-[30%] flex flex-col items-center p-3 rounded-lg bg-white border border-slate-100 shadow-sm">
          <i className="fa-solid fa-truck-fast text-blue-600 text-3xl mb-2"></i>
          <h3 className="font-semibold text-lg mb-1 text-center text-slate-900">Fast delivery</h3>
          <p className="text-center text-sm text-slate-600">
            Quick dispatch and tracking so you know when your order will arrive.
          </p>
        </div>

        <div className="sm:w-[30%] flex flex-col items-center p-3 rounded-lg bg-white border border-slate-100 shadow-sm">
          <i className="fa-solid fa-award text-blue-600 text-3xl mb-2"></i>
          <h3 className="font-semibold text-lg mb-1 text-center text-slate-900">Quality first</h3>
          <p className="text-center text-sm text-slate-600">
            We prioritize products that meet our standards and match what you see online.
          </p>
        </div>

        <div className="sm:w-[30%] flex flex-col items-center p-3 rounded-lg bg-white border border-slate-100 shadow-sm">
          <i className="fa-solid fa-rotate-right text-blue-600 text-3xl mb-2"></i>
          <h3 className="font-semibold text-lg mb-1 text-center text-slate-900">Hassle-free help</h3>
          <p className="text-center text-sm text-slate-600">
            Straightforward returns and responsive support if something is not right.
          </p>
        </div>
      </div>
    </div>
  );
}

export default TrustUs;
