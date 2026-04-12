import React, { useEffect, useState } from "react";
import {
  Droplets,
  Sun,
  Thermometer,
  Wind,
  Sprout,
  Calendar,
  Shield,
  AlertCircle,
  Sparkles,
  MapPin,
  ShoppingCart,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../ContextApi/AuthContext";
import backend from "../../network/backend";
import StarRating from "../../components/common/StarRating";
import PageLoader from "../../components/Loader/PageLoader";
import { toast } from "react-toastify";

export default function PlantDetailByQR() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const { loading, setLoading } = useAuth();

  useEffect(() => {
    if (id) fetchPlantDetail();
  }, [id]);

  const fetchPlantDetail = async () => {
    setLoading(true);
    try {
      const res = await backend.get(`/plant-detail/details/${id}`);
      if (res.data.success) {
        setPlant(res.data.data);
      } else
        throw new Error(res.data.message || "Failed to fetch plant details");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const potImages = plant?.potRecommendation?.bannerImg;

  const careItems = [
    {
      icon: Droplets,
      label: "Watering",
      value: plant?.careInfo?.waterFrequency,
      color: "text-blue-500",
    },
    {
      icon: Sun,
      label: "Sunlight",
      value: plant?.careInfo?.sunlight,
      color: "text-yellow-500",
    },
    {
      icon: Thermometer,
      label: "Temperature",
      value: plant?.careInfo?.temperatureRange,
      color: "text-red-500",
    },
    {
      icon: Wind,
      label: "Humidity",
      value: plant?.careInfo?.humidityLevel,
      color: "text-cyan-500",
    },
    {
      icon: Sprout,
      label: "Soil Type",
      value: plant?.careInfo?.soilType,
      color: "text-amber-700",
    },
    {
      icon: Sparkles,
      label: "Fertilizer",
      value: plant?.careInfo?.fertilizer,
      color: "text-green-500",
    },
    {
      icon: Calendar,
      label: "Repotting",
      value: plant?.careInfo?.repottingFrequency,
      color: "text-purple-500",
    },
    {
      icon: Shield,
      label: "Pest Control",
      value: plant?.careInfo?.pestControlTips,
      color: "text-emerald-600",
    },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % potImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + potImages.length) % potImages.length
    );
  };

  if (loading)
    return (
      <div className="h-screen w-full bg-gray-200">
        <PageLoader />
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          <div className="grid md:grid-cols-3 gap-0">
            {/* Plant Image */}
            <div className="relative col-span-3 md:col-span-1 h-100 bg-linear-to-br from-green-100 to-emerald-100">
              <img
                src={plant?.plant?.bannerImg?.[0]}
                alt={plant?.plant?.name}
                className="w-full h-full"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <span className="text-sm font-semibold text-green-700">
                  Air Purifying
                </span>
              </div>
            </div>

            {/* Plant Info */}
            <div className="p-4 col-span-3 md:col-span-2  flex flex-col ">
              <h1 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl roboto-serif font-bold text-gray-900 md:mb-3">
                {plant?.plant.name}
              </h1>
              <p className="text-sm text-gray-600 italic md:mb-4">
                {plant?.scientificName}
              </p>
              <p className="text-gray-700 text-sm leading-relaxed mb-2 md:mb-6">
                {plant?.specialty}
              </p>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    Blooms: {plant?.bloomSeason}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    {plant?.origin}
                  </span>
                </div>
                {!plant?.careInfo.toxicity && (
                  <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full">
                    <AlertCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700">
                      Non-Toxic
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Care Guide Section */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 lg:p-10 mb-8">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-8 text-center">
            Essential Care Guide
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6 mb-8">
            {careItems &&
              careItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-linear-to-br from-gray-50 to-white p-2 md:p-6 rounded-2xl border-2 border-gray-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`${item.color} bg-opacity-10 p-3 rounded-xl`}
                    >
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 md:mb-2">
                        {item.label}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Growth Tips */}
          <div className="bg-linear-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-100">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900  md:mb-2 text-lg">
                  Pro Growth Tips
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {plant?.growthTips}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pot Recommendation */}
        <div className="bg-white rounded-t-3xl shadow-xl overflow-hidden">
          <div className="bg-linear-to-r from-green-600 to-emerald-600 md:px-8 py-3 md:py-6">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white text-center">
              Perfect Planter Match
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 p-6 md:p-10">
            {/* Image Gallery Section */}
            <div className="space-y-4">
              {/* Main Image with Navigation */}
              <div className="relative group rounded-2xl overflow-hidden shadow-lg bg-gray-100">
                <img
                  src={potImages?.[currentImageIndex]}
                  alt={`${plant?.potRecommendation?.name} view ${
                    currentImageIndex + 1
                  }`}
                  className="w-full h-64 sm:h-80 md:h-96 object-cover"
                />

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {potImages?.length}
                </div>
              </div>

              {/* Thumbnail Navigation */}
              <div className="flex gap-2 w-full px-1 sm:gap-3 overflow-x-auto py-2">
                {potImages &&
                  potImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`shrink-0 w-13 h-13 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-3 transition-all duration-300 ${
                        currentImageIndex === index
                          ? "border-green-500 shadow-lg scale-105 ring-2 ring-green-200"
                          : "border-gray-200 hover:border-green-300 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
              </div>
            </div>

            {/* Product Details Section */}
            <div className="flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  {plant?.potRecommendation?.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-1">
                    <StarRating
                      rating={plant?.potRecommendation?.rating?.average}
                    />
                  </div>
                  <span className="text-gray-600 text-sm">
                    {plant?.potRecommendation?.rating?.average} (
                    {plant?.potRecommendation?.rating?.total} reviews)
                  </span>
                </div>

                {/* Description */}
                <div className="prose prose-sm sm:prose-base max-w-none">
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    {plant?.potRecommendation?.description?.[0]}
                  </p>
                </div>
              </div>

              {/* Buy Button */}
              <div className="space-y-3">
                <button
                  onClick={() =>
                    navigate(`/product/item/${plant?.potRecommendation?._id}`)
                  }
                  className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer"
                >
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-lg">Buy This Planter</span>
                </button>

                <p className="text-center text-sm text-gray-500">
                  Perfect match for your {plant?.plant?.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
