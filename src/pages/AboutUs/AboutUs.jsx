import React from "react";
import ArchCards from "./ArchCards";
import OurPromises from "./OurPromises";
import OurStory from "../../components/About/OurStory.jsx";
import AboutBanner from "../../components/About/Box.jsx";
import InfoSection from "../../components/About/Info.jsx";
import OurProcess from "../../components/About/OurProcess.jsx";
import QuoteBanner from "../../components/About/QuoteBanner.jsx";
import ErrorBoundary from "../../components/ErrorBoundaries";

const AboutUs = () => {
  return (
    <div className="pt-26 sm:pt-6 md:pt-2">
      <header className="">
        <h1 className="gideon-roman text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#1A4122] text-center overflow-hidden">
          Making Moments <br /> Memorable
        </h1>
      </header>
      <div className="max-w-4xl lg:max-w-5xl mx-auto px-4">
      <div className="w-full ">
        <p className="md:text-center roboto-serif text-sm sm:text-lg text-[#1A4122] leading-loose md:px-6">
          As a passionate plant and gardening hub, GreenNest goes beyond simply
          selling plants. We cultivate experiences that connect people with
          nature, helping every garden flourish with life, beauty, and harmony.
          Our dedicated team blends expertise in horticulture with creative
          care, offering guidance, sustainable solutions, and thoughtfully
          curated plants that transform spaces into vibrant, thriving
          ecosystems. From unique plant selections to innovative gardening
          ideas, we make every green space a place to breathe, grow, and enjoy.
        </p>
      </div>
      </div>

<ErrorBoundary>
      <AboutBanner />
      </ErrorBoundary>

      <ErrorBoundary>
      <ArchCards />
      </ErrorBoundary>

     <ErrorBoundary>
      <OurPromises />
      </ErrorBoundary>

      <ErrorBoundary>
      <OurStory />
      </ErrorBoundary>

      <ErrorBoundary>
      <InfoSection />
      </ErrorBoundary>

      <ErrorBoundary>
      <OurProcess />
      </ErrorBoundary>

      <ErrorBoundary>
      <QuoteBanner />
      </ErrorBoundary>
    </div>
  );
};

export default AboutUs;
