import React from 'react';
import AboutBanner from '../../assets/About.png'

const Box = () => {
  return (
    <div className="w-full px-8 md:px-20 py-8 max-w-7xl mx-auto">
      <img 
        src={AboutBanner} 
        alt="About Banner" 
        className="w-full h-auto rounded-lg max-h-[700px]" 
      />
    </div>
  );
}

export default Box;
