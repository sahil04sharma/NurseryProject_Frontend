// import React, { useCallback, useEffect } from "react";

// const OfferSection = () => {
//   const fetchOffers = useCallback(async () => {
//     try {
//       const res = await backend.get("/offer-banner/get");
//       const data = res?.data?.data;

//       if (Array.isArray(data)) {
//         localStorage.setItem("offer-banner");
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   }, []);

//   useEffect(() => {
//     fetchOffers();
//   }, []);
//   return <div></div>;
// };

// export default OfferSection;
