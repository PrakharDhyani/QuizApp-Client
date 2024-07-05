import React, { useEffect } from 'react';

const ThumbnailSlide = ({ thumbnail, nextSlide }) => {
  useEffect(() => {
    setTimeout(nextSlide, 5000);
  }, [nextSlide]);

  return <img src={thumbnail} alt="Quiz Thumbnail" className="full-screen-media" />;
};

export default ThumbnailSlide;
