import React from "react";

const OurPromises = () => {
  const ourPromises = [
    {
      _id: 1,
      title: "Excellence",
      description:
        "We are committed to identifying and meeting the needs of our clients, and communities.",
    },
    {
      _id: 2,
      title: "Collaboration",
      description:
        "Our success is directly correlated to active participation and the exchange of sound knowledge.",
    },
    {
      _id: 3,
      title: "Dedication",
      description:
        "We are dedicated to the success of every events and pride are the driving forces behind our team.",
    },
    {
      _id: 4,
      title: "Trustworthiness",
      description:
        "We refuse to compromise on our quality, making us a reliable resource and dependable partner.",
    },
  ];
  return (
    <div className="relative z-19 bg-[#E9ECE7]/90 py-4 sm:py-12 px-6 h-full md:px-20 pb-8">
      {/* Top Section */}
      <div className="text-center  mx-auto">
        <h3 className="text-[#647B4E] text-xl sm:text-3xl md:text-5xl lg:text-5xl gideon-roman  uppercase mb-2">
          Our Core Values
        </h3>
        <h1 className="text-[#1A4122] text-2xl sm:text-4xl md:text-6xl lg:text-7xl gideon-roman overflow-hidden">
          Our Promise to You
        </h1>
      </div>

      {/* Core Values Grid */}

      <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4 mt-4 lg:mt-6  w-full mx-auto text-center md:text-left">
        {/* Service Excellence */}
        {ourPromises.length > 0 &&
          ourPromises.map((p) => (
            <div key={p._id} className="w-full h-full">
              <h2 className="text-xl sm:text-2xl md:text-3xl roboto-serif font-light text-[#1A4122] mb-1 lg:mb-2">
                {p.title}
              </h2>
              <p className="text-gray-700 text-body leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default OurPromises;
