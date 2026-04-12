import React from "react";
import Bike from "../../assets/bike 1.png";

export default function NavbarTopBar() {
  return (
    <div className="bg-[#CB6129] text-white overflow-hidden relative h-8 flex items-center">
      <div className="marquee-track">
        <div className="marquee-item">
          <img src={Bike} alt="Delivery" className="h-8" />
          <p className="text-body">Free Delivery above Rs.499 | Next Day Delivery Available</p>
        </div>
      </div>
    </div>
  );
}
