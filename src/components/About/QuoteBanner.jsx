import React from 'react';
import bannerImage from '../../assets/FlowersAbout.jpg'; // Update with your actual image path

const OurStory = () => {
  return (
    <div className='w-screen'>
      {/* Banner Section - Half Screen Height */}
      <div className='relative h-[50vh] w-full overflow-hidden'>
        {/* Background Image */}
        <div 
          className='absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat'
          style={{ backgroundImage: `url(${bannerImage})` }}
        />
        
        {/* Black Overlay with Opacity */}
        <div className='absolute inset-0 bg-black opacity-50' />
        
        {/* Content - Centered Text */}
        <div className='relative z-10 h-full w-full flex flex-col items-center justify-center'>
          <h2 className='heading-2 text-[#fbfaf9] text-center px-4 overflow-hidden'>
           “Bring nature home, one plant at a time.
Because every leaf adds life to your space.
Let your home breathe with green.”
          </h2>
          
        </div>
      </div>
      
      {/* Rest of your content can go here */}
      
    </div>
  );
}

export default OurStory;
