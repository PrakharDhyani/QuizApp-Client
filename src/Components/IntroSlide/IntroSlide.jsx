import React, { useEffect } from 'react';

const IntroSlide = ({ nextSlide }) => {
  useEffect(() => {
    setTimeout(nextSlide, 5000);
  }, [nextSlide]);

  return <video src="../../src/assets/Intro.mp4" autoPlay className="full-screen-media" />;
};

export default IntroSlide;
