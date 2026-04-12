import React from 'react';

const OurProcess = () => {
  const processSteps = [
    {
      id: 1,
      text: "Carefully curated selection of healthy, sustainable plants sourced from trusted growers, ensuring quality and vitality for your garden."
    },
    {
      id: 2,
      text: "Expert guidance and personalized recommendations to help you choose the perfect plants for your space, climate, and gardening goals."
    },
    {
      id: 3,
      text: "Seamless delivery and ongoing support with care tips, maintenance advice, and resources to help your garden thrive all year round."
    }
  ];

  return (
    <div className="w-full bg-[#FBFAF9] py-16 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Left Side - Image and Text */}
          <div className="space-y-6">
            {/* Image */}
            <div className="w-full">
              <img 
                src="https://i.pinimg.com/736x/4f/b2/5b/4fb25b386dc411a130317200e18a2407.jpg" 
                alt="Plant arrangement"
                className="w-full h-[400px] md:h-[500px] xl:h-[500px] 2xl:h-[700px] object-cover rounded-lg shadow-md"
              />
            </div>
            
            {/* Text below image */}
            <div className="text-center lg:text-left">
              <p className="text-[#1A4122] text-body leading-relaxed opacity-80">
                At Green Nest, we believe in nurturing connections between people and nature. 
                Every plant tells a story, and we're here to help you cultivate yours with care, 
                expertise, and a genuine passion for greenery.
              </p>
            </div>
          </div>

          {/* Right Side - Main Content and Process */}
          <div className="flex flex-col justify-center space-y-8">
            
            {/* Main Heading and Paragraph */}
            <div>
              <h2 className="text-[#1A4122] heading-2 mb-6 leading-tight">
                Growing together, one plant at a time
              </h2>
              <p className="text-[#1A4122] text-body leading-relaxed">
                From vibrant succulents to lush tropical plants, we offer a handpicked 
                collection designed to bring life and beauty to every corner of your home 
                or garden. Whether you're a seasoned gardener or just beginning your green 
                journey, we're committed to providing quality plants and expert advice to 
                help you succeed.
              </p>
            </div>

            {/* Our Process Section */}
            <div className="space-y-6">
              <h3 className="text-[#1A4122] heading-3 tracking-wide">
                OUR PROCESS
              </h3>
              
              <div className="space-y-4">
                {processSteps.map((step) => (
                  <div key={step.id} className="flex items-start gap-4">
                    {/* Circle Number */}
                    <div className="shrink-0 w-8 h-8 rounded-full bg-[#1A4122] flex items-center justify-center">
                      <span className="text-[#f5f1e8] text-sm font-semibold">{step.id}</span>
                    </div>
                    
                    {/* Process Text */}
                    <p className="text-[#1A4122] text-body leading-relaxed flex-1">
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default OurProcess;
