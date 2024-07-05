import React, { useEffect } from 'react';

const TransitionSlide = ({ nextSlide }) => {
  useEffect(() => {
    setTimeout(nextSlide, 3000);
  }, [nextSlide]);

  return <video src="../../src/assets/transition.mp4" autoPlay className="full-screen-media" />;
};

export default TransitionSlide;
