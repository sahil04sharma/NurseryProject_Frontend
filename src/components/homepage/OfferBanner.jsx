import { useEffect, useState } from "react";
import backend from "../../network/backend";
import { useAuth } from "../../ContextApi/AuthContext";
import { getWithExpiry, setWithExpiry } from "../../utils/storageWithExpiry";

export default function OfferBanner({ index = 0 }) {
  const [offers, setOffers] = useState(getWithExpiry("offer-banner"));
  const { loading, setLoading, error, setError } = useAuth();

  const fetchOffers = async () => {
    const savedOffers = getWithExpiry("offer-banner");
    if (savedOffers) return;
    setLoading(true);
    try {
      const res = await backend.get("/offer-banner/get");
      const data = res?.data?.data;

      if (Array.isArray(data)) {
        setOffers(data);
        setWithExpiry("offer-banner", data, 24 * 60 * 60 * 1000);
      } else {
        setOffers([]);
      }
    } catch (err) {
      setError("Failed to load offer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  if (!loading && (!offers?.[index] || error)) return null;

  if (loading) return null;

  const offer = offers?.[index];

  if (!offer) return null;

  return (
    <div className="w-full px-4 md:px-6 lg:px-20">
      <aside className="relative w-full mx-auto rounded-xl overflow-hidden shadow-lg my-10">
        <img
          src={offer.image}
          alt={offer.title}
          className="w-full h-72 md:h-96 object-cover"
        />

        <div className="absolute inset-0 bg-black/40"></div>

        <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-10 text-white">
          <span className="bg-green-600 text-white px-3 py-1 rounded-md text-sm font-semibold w-fit mb-3">
            {offer.discountText}
          </span>

          <h2 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg line-clamp-3">
            {offer.title}
          </h2>

          <p className="text-sm md:text-base text-gray-200 max-w-2xl mb-4 drop-shadow line-clamp-2">
            {offer.description}
          </p>

          <a
            href={offer.redirectLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black font-semibold px-5 py-2 rounded-lg shadow hover:bg-gray-200 transition-all w-fit"
          >
            Shop Now →
          </a>
        </div>
      </aside>
    </div>
  );
}
