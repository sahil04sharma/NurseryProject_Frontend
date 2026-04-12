import React, { useState, useEffect } from "react";
import backend from "../../network/backend";
import { getWithExpiry, setWithExpiry } from "../../utils/storageWithExpiry";

const EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours

function VideoBanner() {
  const [bannerSection, setBannerSection] = useState(
    getWithExpiry("video-banner")
  );

  const fetchBannerVideos = async () => {
    if (bannerSection) return;

    const { data } = await backend.get("/video-section/get");
    setBannerSection(data.data);
    console.log(data.data);
    setWithExpiry("video-banner", data.data, EXPIRY_TIME);
  };

  useEffect(() => {
    fetchBannerVideos();
  }, []);

  if (!bannerSection) return null;

  const { header, description, videos } = bannerSection;

  return (
    <section className="relative py-6 px-5 bg-cover bg-center overflow-hidden">
      <div className="absolute inset-0 bg-[#CB6129] overflow-hidden"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FFF8DC] drop-shadow-lg overflow-hidden">
            {header}
          </h1>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          {videos?.map((video, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-10 rounded-xl overflow-hidden"
              data-testid="video-wrapper"
            >
              <div className="relative pb-[150%]">
                <video
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
                  loop
                  muted
                  playsInline
                  autoPlay
                  src={video}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        <p className="md:text-center text-[#FFF8DC] text-body leading-relaxed max-w-5xl mx-auto px-5 drop-shadow-md">
          {description}
        </p>
      </div>
    </section>
  );
}

export default VideoBanner;
