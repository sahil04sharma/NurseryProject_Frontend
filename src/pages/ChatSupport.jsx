import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";
import ChatBot from "../components/support/ChatBot";
import ChatSupportForm from "../components/support/ChatSupportForm";

export default function ChatSupport() {
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get("itemId");
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "Why are my plant leaves turning yellow?",
      a: "Yellow leaves usually mean overwatering or poor drainage. Let the soil dry out before watering again and ensure your pot has drainage holes.",
    },
    {
      q: "How much sunlight does my plant need?",
      a: "Most indoor plants thrive in bright, indirect sunlight. Avoid placing them under direct sunlight for long hours.",
    },
    {
      q: "What’s the best time to water my plants?",
      a: "Morning is the best time to water plants — it allows moisture to reach roots before midday heat.",
    },
    {
      q: "Why are my plant leaves drooping?",
      a: "Droopy leaves can indicate either overwatering or underwatering. Check the soil moisture — if it’s soggy, hold off watering; if dry, give it a drink.",
    },
    {
      q: "How often should I fertilize indoor plants?",
      a: "During growing season (spring to early autumn), fertilize every 2–4 weeks. Reduce in winter when growth slows down.",
    },
    {
      q: "Can I use tap water for plants?",
      a: "Yes, but let it sit for 24 hours before using to let chlorine evaporate. Distilled or filtered water is even better for sensitive plants.",
    },
    {
      q: "What’s the ideal temperature for indoor plants?",
      a: "Most indoor plants prefer temperatures between 18°C–27°C. Avoid placing them near heaters or cold drafts.",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 bg-white">
      {/* LEFT PANEL */}
      <div className=" bg-white shadow-lg border-r border-green-100 flex flex-col p-5 overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <ChevronLeft
            className="w-5 h-5 text-green-600 cursor-pointer hover:opacity-70"
            onClick={() => window.history.back()}
          />
          <h3 className="font-semibold text-lg text-green-800 flex items-center gap-2">
            <Leaf className="w-5 h-5" /> GreenNest Support
          </h3>
        </div>

        <p className="font-medium text-green-700 mb-4">Product ID: {itemId}</p>

        <div className="border-t border-green-100 pt-4">
          <h3 className="font-semibold text-green-800 mb-3 text-sm">
            Common Plant FAQs 🌼
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-green-100 rounded-lg p-3 bg-green-50/30 hover:bg-green-50 transition"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center text-left"
                >
                  <span className="text-sm font-medium text-green-800">
                    {faq.q}
                  </span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-green-600" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-gray-600 mt-2 leading-relaxed"
                    >
                      {faq.a}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — ChatBot (Half Width) */}
      <div className="w-full h-full">
        {/* <ChatBot /> */}
        <ChatSupportForm />
      </div>
    </div>
  );
}
