// src/components/PlantCareSteps.jsx
import React from 'react';
import { Droplets, Sun, Wind, Scissors } from 'lucide-react';

const plantCareSteps = [
  {
    icon: <Droplets className="w-6 h-6 text-white" />,
    title: "Watering",
    description: "Water your plants regularly, ensuring the soil stays moist but not waterlogged. Check soil moisture before watering and adjust frequency based on season and plant type."
  },
  {
    icon: <Sun className="w-6 h-6 text-white" />,
    title: "Sunlight",
    description: "Provide adequate sunlight based on plant requirements. Most indoor plants thrive in bright, indirect light. Rotate plants weekly for even growth and balanced exposure."
  },
  {
    icon: <Wind className="w-6 h-6 text-white" />,
    title: "Air Circulation",
    description: "Ensure proper ventilation around your plants. Good air flow prevents fungal diseases, strengthens stems, and helps regulate temperature and humidity levels."
  }
];

export default function PlantCareSteps() {
  return (
    <div className="border-gray-300  mx-auto py-6">
      <div className="mb-2 md:mb-8">
        <h4 className="text-lg sm:text-xl md:text-2xl lg:text-3xl roboto-serif text-center text-gray-900 mb-2">
          Steps to Take Care of Your Plants
        </h4>
        <h3 className="text-sm sm:text-xl md:text-2xl lg:text-3xl roboto-serif text-center text-gray-600 max-w-2xl mx-auto">
          Follow these essential care guidelines to keep your plants healthy and thriving
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6  md:mx-20">
        {plantCareSteps.map((step, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center text-center px-2 rounded-lg   transition-all duration-300"
          >
            <div className="flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-[#1A4122] rounded-full md:mb-4 shadow-lg">
              {step.icon}
            </div>
            <h4 className="roboto-serif text-xl sm:text-2xl md:text-3xl text-gray-900 md:mb-3">
              {step.title}
            </h4>
            <p className="text-body text-gray-600 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>

     
    </div>
  );
}
