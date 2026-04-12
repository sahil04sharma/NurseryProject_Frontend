import React from 'react';


const Loader = () => {
  return (
    <div data-testid="loader" className="loader-wrapper">
      <div className="loader">
        <div className="item"></div>
        <div className="item"></div>
        <div className="item"></div>
        <div className="item"></div>
      </div>
    </div>
  );
};

export default Loader;
