// src/components/ProductFAQ.jsx
import { useState } from "react";
import { ChevronUp } from "lucide-react";

// Default FAQs if none are provided
const defaultFAQs = [
  {
    question: "How often should I water this plant?",
    answer: "Water when the top 2 inches of soil feel dry to touch. Typically, this means watering once a week, but adjust based on your environment and season. Overwatering is more harmful than underwatering for most plants."
  },
  {
    question: "What kind of sunlight does this plant need?",
    answer: "This plant thrives in bright, indirect sunlight. Avoid direct harsh sunlight which can scorch the leaves. A spot near an east or west-facing window is ideal. If leaves start yellowing, it may need more light."
  },
  {
    question: "Is this plant pet-friendly?",
    answer: "Please check the specific plant details before purchasing. Many common houseplants can be toxic to pets if ingested. If you have curious pets, consider keeping plants on high shelves or in rooms pets don't access."
  },
  {
    question: "How do I know if my plant is healthy?",
    answer: "Healthy plants have vibrant green leaves, steady growth, and firm stems. Watch for yellowing leaves, wilting, brown spots, or pest infestations as signs of issues. Regular inspection helps catch problems early."
  },
  {
    question: "Do I need to fertilize this plant?",
    answer: "Yes, fertilize during the growing season (spring and summer) once a month with a balanced liquid fertilizer diluted to half strength. Reduce or stop fertilizing in fall and winter when growth slows."
  },
  {
    question: "When should I repot this plant?",
    answer: "Repot when roots start growing out of drainage holes or the plant becomes rootbound, typically every 1-2 years. Spring is the best time for repotting. Choose a pot 2 inches larger in diameter than the current one."
  }
];

const ProductFAQ = ({ productName = "Plant", faqs = defaultFAQs }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Don't render if no FAQs provided
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <div className=" bg-[#FBFAF9] px-2 sm:px-0  mx-auto">
    <div className="md:mx-20 py-12 ">
      {/* Heading */}
      <h4 className="text-lg sm:text-xl md:text-2xl lg:text-3xl roboto-serif md:mb-8 text-gray-900">
        {productName} FAQs
      </h4>

      {/* FAQ List */}
      <div className="space-y-0">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between py-2 md:py-6 text-left hover:bg-gray-50 transition-colors px-4 rounded-t-lg"
            >
              <h3 className=" pr-8 text-sm md:text-lg text-gray-900">
                {faq.question}
              </h3>
              <ChevronUp
                className={`w-6 h-6 shrink-0 transition-transform duration-300 text-gray-600 ${
                  openIndex === index ? "" : "rotate-180"
                }`}
              />
            </button>

            {/* Answer */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="pb-6 px-4 pr-12">
                <p className="text-body text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default ProductFAQ;
