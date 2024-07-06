import React, { useEffect } from 'react';

const TransitionSlide = ({ nextSlide,setIsTransitioning }) => {
  useEffect(()=>{
    console.log("inside transition")

    return()=>{
      console.log("transition finish");
    }
  },[])

  const onEnd = ()=>{
    setIsTransitioning(false);
    nextSlide();
  }
  return <video src="../../src/assets/transition.mp4" autoPlay className="full-screen-media" onEnded={onEnd}/>;
};

export default TransitionSlide;
