import React, { useState } from 'react'
import "./Quizcard.css"



function Quizcard({quiz}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handlePlay = () => {
      console.log("play clicked")
      
  }

  const handleUpdate = () => {
    console.log("update click")
  }
  
  const handleDelete = () => {
    console.log("delete click")
  }

  return (
    <div className='quiz-card' style={{backgroundColor: quiz.background_color }}  onMouseEnter={handleMouseEnter}  onMouseLeave={handleMouseLeave} >
     {quiz.title}
     {isHovered && (
        <div className='modal'>
          <p>This is a modal for {quiz.title}</p>
          <button onClick={handlePlay}>Play</button>
          <button  onClick={handleUpdate} >update</button>
          <button onClick={handleDelete} >Delete</button>
        </div>
      )}
    </div>
  )
}

export default Quizcard
