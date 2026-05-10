import React from "react";
import TrustUs from "../../Components/CustomersTrust/TrustUs";

function About() {
  return (
    <>
      <div className="w-[min(100%,calc(1320px-30px))] mx-auto flex flex-col md:flex-row justify-center p-6 md:p-10 gap-8">
        <div className="w-full md:w-1/2 p-4 md:p-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight text-slate-900 mb-6">
            About <span className="text-blue-600">our store</span>
          </h1>
          <p className="leading-relaxed text-lg text-slate-600 mb-4">
            We are an online retailer focused on a simple experience: easy browsing, secure checkout,
            and dependable delivery. Our team works to keep product information accurate and support
            responsive when you need help.
          </p>
          <p className="leading-relaxed text-lg text-slate-600">
            Whether you are buying essentials or treating yourself, we aim to earn your trust with
            fair policies and consistent service.
          </p>
        </div>

        <div className="w-full md:w-1/2 flex items-stretch">
          <div className="w-full rounded-xl bg-slate-900 text-white flex flex-col justify-center p-8 shadow-lg">
            <p className="text-slate-300 text-sm leading-relaxed mb-8">
              From curated categories to order tracking, we built this shop around what customers expect
              from a modern e-commerce experience—clarity, speed, and support at every step.
            </p>
            <div className="border-t border-slate-700 pt-6">
              <h4 className="text-lg font-semibold text-white mb-1">Our team</h4>
              <p className="text-sm text-slate-400">
                Replace this block with your brand story, founder note, or store mission.
              </p>
            </div>
          </div>
        </div>
      </div>
      <TrustUs />
    </>
  );
}

export default About;
