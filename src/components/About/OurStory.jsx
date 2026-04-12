// src/sections/OurStory.jsx
import React, { useEffect, useState } from "react";
import backend from "../../network/backend"; // your axios instance with baseURL/interceptors
import { useAuth } from "../../ContextApi/AuthContext";

const OurStory = () => {
  const [header, setHeader] = useState("Our Story");
  const [headerImg, setHeaderImg] = useState("");
  const { loading, setLoading, error, setError } = useAuth();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");

        // GET /about/all
        const res = await backend.get("/about/all");
        // Accept shapes: { success, data: [...] }
        const dataArr = Array.isArray(res?.data?.data) ? res.data.data : [];

        if (dataArr.length > 0) {
          const first = dataArr[0];
          if (alive) {
            setHeader(first?.header || "Our Story");
            setHeaderImg(first?.headerImg || "");
          }
        } else {
          if (alive) {
            setHeader("Our Story");
            setHeaderImg("");
          }
        }
      } catch (e) {
        if (alive) {
          setError(
            e?.response?.data?.message ||
              e?.message ||
              "Failed to load content."
          );
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const bannerStyle = headerImg ? { backgroundImage: `url(${headerImg})` } : {}; // keep empty if no image yet

  return (
    <>
      {!error && (
        <div className="w-screen">
          {/* Banner Section - Half Screen Height */}
          <div className="relative h-[50vh] w-full overflow-hidden">
            {/* Background Image */}
            <div
              className={`absolute inset-0 bg-black/90 w-full h-full bg-cover bg-center bg-no-repeat ${
                !headerImg ? "bg-gray-100" : ""
              }`}
              style={bannerStyle}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div className="relative z-10 h-full w-full flex flex-col items-center justify-center overflow-hidden">
              <h1 className="heading-1 text-white text-center px-4 overflow-hidden">
                {loading ? "Loading..." : header}
              </h1>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OurStory;
