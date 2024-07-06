import React, { useState, useEffect, useRef } from 'react';
import TransitionSlide from '../TransitionSlide/TransitionSlide';
import IntroSlide from '../IntroSlide/IntroSlide';
import ThumbnailSlide from '../ThumbnailSlide/ThumbnailSlide';
import QuestionSlide from '../QuestionSlide/QuestionSlide';

const QuizSlide = ({ slide, nextSlide }) => {
  const [timer, setTimer] = useState(10);
  const [showAnswer, setShowAnswer] = useState(false);
  const timerRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (slide.type === 'question') {
      startTimer();
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [slide]);

  const startTimer = () => {
    setTimer(10);
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          setShowAnswer(true);
          clearInterval(timerRef.current);
          setTimeout(() => {
            setShowAnswer(false);
            setIsTransitioning(true);
          }, 3000); // Show the answer for 3 seconds before transition
          return 10;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (isTransitioning) {
      nextSlide();
    }
  }, [isTransitioning]);

  if (isTransitioning) {
    return <TransitionSlide nextSlide={nextSlide} setIsTransitioning={setIsTransitioning} />;
  }

  switch (slide.type) {
    case 'intro':
      return <IntroSlide nextSlide={nextSlide} />;
    case 'thumbnail':
      return <ThumbnailSlide thumbnail={slide.thumbnail} nextSlide={nextSlide} />;
    case 'question':
      return (
        <QuestionSlide
          question={slide.question}
          timer={timer}
          showAnswer={showAnswer}
          nextSlide={nextSlide}
        />
      );
    case 'transition':
      return <TransitionSlide nextSlide={nextSlide} setIsTransitioning={setIsTransitioning} />;
    default:
      return null;
  }
};

export default QuizSlide;
