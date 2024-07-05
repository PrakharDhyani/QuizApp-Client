import React from 'react';

const QuestionSlide = ({ question, timer, showAnswer }) => {
  const animationUrl = Object.values(question.backgroundAnimations)[0];
  // console.log("reached in question slide")
  return (
    <div className="question-slide full-screen-media">
      <video src={animationUrl} autoPlay loop muted className="background-video" />
      <div className="question-section">
        <div className="question-header">
          <div className="question-number">{question.questionNumber}</div>
          <div className="question-text">{question.questionText}</div>
          <div className='timer'>
            {timer}s
          </div>
        </div>
        <div className="question-body">
          <img 
            src={showAnswer ? question.answerPhotoUrl : question.questionPhotoUrl} 
            alt="Question" 
            className="question-image img-animation" 
          />
          <div className="options">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`option option-${index + 1} ${showAnswer && option === question.correctAnswer ? 'correct' : ''}`}
              >
                <span className="option-label">{String.fromCharCode(97 + index)}</span>
                {option}
              </div>
            ))}
          </div>
        </div>
        <div className="timer-container">
          <div className='timer-bar-container'>
            <div 
            style={{ width: `${(timer / 10) * 100}%` }}
            >
              <div 
                  className={`timer-bar ${timer <= 3 ? 'urgent' : ''}`}  
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionSlide;
