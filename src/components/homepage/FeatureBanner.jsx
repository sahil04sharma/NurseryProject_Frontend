import React from "react";
import { Truck, Headphones, RotateCcw, ShieldCheck } from "lucide-react";
import OfferBanner from "./OfferBanner";


export default function PlantFeaturesSection() {
  return (
    <section>
      <div className="section lg:min-h-screen h-full flex items-center justify-center p-4">
        <div className="w-full md:max-w-7xl xl:max-w-352 2xl:max-w-384">
          {/* Heading Section */}
          <div className="text-center mb-8 lg:mb-20 xl:mb-24">
            <h2 className="gideon-roman text-xl md:text-2xl lg:text-4xl font-semibold text-[#0A6041] mb-2 lg:mb-4 overflow-hidden">
              Why Shop with GreenNest?
            </h2>
            <p className="text-gray-600 text-body max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed">
              From your screen to your space - we're here to make plant shopping
              smooth and stress free
            </p>
          </div>

          {/* Features Grid */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16 xl:gap-24 2xl:gap-32">
            {/* Left Column - 2 Features */}
            <div className="flex flex-col justify-between space-y-4 md:space-y-16 lg:space-y-20 xl:space-y-24 w-full md:w-auto md:flex-1 md:max-w-[280px] lg:max-w-[340px] xl:max-w-[380px] md:pl-0 lg:pl-8 xl:pl-10 2xl:pl-12">
              {/* Free and Fast Delivery */}
              <div className="text-center md:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 bg-gray-100 rounded-lg mb-2 lg:mb-5">
                  <Truck className="w-6 h-6 lg:w-7 lg:h-7 text-[#0A6041]" />
                </div>
                <h3 className="heading-3 text-gray-900 mb-2 lg:mb-4">
                  Free and Fast Delivery
                </h3>
                <p className="text-gray-600 text-body">
                  Plants delivered fresh to your door — free on orders over $50.
                </p>
              </div>

              {/* Hassle-Free Returns */}
              <div className="text-center md:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 bg-gray-100 rounded-lg mb-2 lg:mb-5">
                  <RotateCcw className="w-6 h-6 lg:w-7 lg:h-7 text-[#0A6041]" />
                </div>
                <h3 className="heading-3 text-gray-900 mb-2 lg:mb-4">
                  Hassle-Free Returns
                </h3>
                <p className="text-gray-600 text-body">
                  Changed your mind? Return it within 30 days, no stress.
                </p>
              </div>
            </div>

            {/* Center Image */}
            <div className="shrink-0 order-first md:order-0">
              <img
                src="https://24carrots.com/wp-content/uploads/2023/10/Home_Services_GIF_R3.gif"
                alt="Feature"
                className="w-[280px] md:w-[300px] lg:w-[420px] 2xl:w-[480px] rounded-t-full transition-[width] duration-300 ease-out"
              />
            </div>

            {/* Right Column - 2 Features */}
            <div className="flex flex-col justify-between space-y-6 md:space-y-16 lg:space-y-20 xl:space-y-24 w-full md:w-auto md:flex-1 md:max-w-[280px] lg:max-w-[340px] xl:max-w-[380px] md:pr-0 lg:pr-8 xl:pr-10 2xl:pr-12">
              {/* 24/7 Customer Support */}
              <div className="text-center md:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 bg-gray-100 rounded-lg mb-2 lg:mb-5">
                  <Headphones className="w-6 h-6 lg:w-7 lg:h-7 text-[#0A6041]" />
                </div>
                <h3 className="heading-3 text-gray-900 mb-2 lg:mb-4">
                  24/7 Customer Support
                </h3>
                <p className="text-gray-600 text-body">
                  We're here whenever you need us — day or night.
                </p>
              </div>

              {/* Secure Payments */}
              <div className="text-center md:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 bg-gray-100 rounded-lg mb-2 lg:mb-5">
                  <ShieldCheck className="w-6 h-6 lg:w-7 lg:h-7 text-[#0A6041]" />
                </div>
                <h3 className="heading-3 text-gray-900 mb-2 lg:mb-4">
                  Secure Payments
                </h3>
                <p className="text-gray-600 text-body">
                  Pay safely with 100% encrypted checkout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <OfferBanner index={0} />
      </div>
    </section>
  );
}
