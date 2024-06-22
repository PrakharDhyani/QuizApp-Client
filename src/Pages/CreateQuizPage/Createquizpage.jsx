import React, { useState } from 'react';
import axios from 'axios';
import Header from '../../Components/Header/Header';
import "./Createquizpage.css";

function Createquizpage() {
  const [step, setStep] = useState(1);
  const [quizDetails, setQuizDetails] = useState({
    title: '',
    thumbnail: null,
    numQuestions: 1,
  });
  const [questions, setQuestions] = useState([]);

  const predefinedAnimations = [
    { name: 'Animation 1', file: 'animation1.mp4' },
    { name: 'Animation 2', file: 'animation2.mp4' },
    { name: 'Animation 3', file: 'animation3.mp4' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuizDetails({
      ...quizDetails,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setQuizDetails({
      ...quizDetails,
      [name]: files[0],
    });
  };

  const handleNext = () => {
    setQuestions(Array.from({ length: quizDetails.numQuestions }, () => ({
      questionText: '',
      options: ['', '', '', ''],
      correctOption: '',
      questionPhoto: null,
      answerPhoto: null,
      backgroundAnimation: 'text',
      predefinedAnimation: '',
      backgroundGif: null,
      backgroundMp4: null,
    })));
    setStep(2);
  };

  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const newQuestions = [...questions];
    newQuestions[index][name] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (index, optionIndex, e) => {
    const { value } = e.target;
    const newQuestions = [...questions];
    newQuestions[index].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleQuestionFileChange = (index, e) => {
    const { name, files } = e.target;
    const newQuestions = [...questions];
    newQuestions[index][name] = files[0];
    setQuestions(newQuestions);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'MyQuizCloud'); // Replace with your Cloudinary upload preset


    const response = await axios.post(`https://api.cloudinary.com/v1_1/dntvaedst/upload`, formData);
    return response.data.secure_url; // Return the secure URL of the uploaded file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Upload thumbnail to Cloudinary
      const thumbnailUrl = await uploadToCloudinary(quizDetails.thumbnail);

      // Upload questions media to Cloudinary
      const updatedQuestions = await Promise.all(questions.map(async (question) => {
        const questionPhotoUrl = question.questionPhoto ? await uploadToCloudinary(question.questionPhoto) : null;
        const answerPhotoUrl = question.answerPhoto ? await uploadToCloudinary(question.answerPhoto) : null;
        const backgroundGifUrl = question.backgroundGif ? await uploadToCloudinary(question.backgroundGif) : null;
        const backgroundMp4Url = question.backgroundMp4 ? await uploadToCloudinary(question.backgroundMp4) : null;

        return {
          ...question,
          questionPhotoUrl,
          answerPhotoUrl,
          backgroundGifUrl,
          backgroundMp4Url,
        };
      }));

      // Prepare data for backend
      const quizData = {
        title: quizDetails.title,
        thumbnail: thumbnailUrl,
        numQuestions: quizDetails.numQuestions,
        questions: updatedQuestions,
      };

      // Send data to backend
      const response = await axios.post('/api/quizzes', quizData);
      console.log(response.data);
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="main-container">
        {step === 1 && (
          <form onSubmit={handleNext} className="create-quiz-form">
            <div className="inputDiv">
              <label>Quiz Title:</label>
              <input
                type="text"
                name="title"
                value={quizDetails.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="inputDiv">
              <label>Thumbnail:</label>
              <input
                type="file"
                name="thumbnail"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>
            <div className="inputDiv">
              <label>Number of Questions:</label>
              <input
                type="number"
                name="numQuestions"
                value={quizDetails.numQuestions}
                onChange={handleInputChange}
                required
                min="1"
              />
            </div>
            <button type="submit">Next</button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="questions-form">
            {questions.map((question, index) => (
              <div key={index} className="question-form">
                <div className="inputDiv">
                  <label>Question {index + 1}:</label>
                  <textarea
                    name="questionText"
                    value={question.questionText}
                    onChange={(e) => handleQuestionChange(index, e)}
                    required
                  />
                </div>
                <div className="inputDiv">
                  <label>Options:</label>
                  {question.options.map((option, optionIndex) => (
                    <input
                      key={optionIndex}
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, optionIndex, e)}
                      required
                    />
                  ))}
                </div>
                <div className="inputDiv">
                  <label>Correct Option:</label>
                  <select
                    name="correctOption"
                    value={question.correctOption}
                    onChange={(e) => handleQuestionChange(index, e)}
                    required
                  >
                    <option value="">Select Correct Option</option>
                    {question.options.map((option, optionIndex) => (
                      <option key={optionIndex} value={optionIndex}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="inputDiv">
                  <label>Upload Question Photo:</label>
                  <input
                    type="file"
                    name="questionPhoto"
                    accept="image/*"
                    onChange={(e) => handleQuestionFileChange(index, e)}
                  />
                </div>
                <div className="inputDiv">
                  <label>Upload Answer Photo:</label>
                  <input
                    type="file"
                    name="answerPhoto"
                    accept="image/*"
                    onChange={(e) => handleQuestionFileChange(index, e)}
                  />
                </div>
                <div className="inputDiv">
                  <label>Background Animation:</label>
                  <select
                    name="backgroundAnimation"
                    value={question.backgroundAnimation}
                    onChange={(e) => handleQuestionChange(index, e)}
                    required
                  >
                    <option value="text">Text</option>
                    <option value="predefined">Predefined</option>
                    <option value="gif">GIF</option>
                    <option value="mp4">MP4</option>
                  </select>
                </div>
                {question.backgroundAnimation === 'predefined' && (
                  <div className="inputDiv">
                    <label>Choose Predefined Animation:</label>
                    <select
                      name="predefinedAnimation"
                      value={question.predefinedAnimation}
                      onChange={(e) => handleQuestionChange(index, e)}
                      required
                    >
                      <option value="">Select Animation</option>
                      {predefinedAnimations.map((animation, animationIndex) => (
                        <option key={animationIndex} value={animation.file}>
                          {animation.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {question.backgroundAnimation === 'gif' && (
                  <div className="inputDiv">
                    <label>Upload GIF:</label>
                    <input
                      type="file"
                      name="backgroundGif"
                      accept="image/gif"
                      onChange={(e) => handleQuestionFileChange(index, e)}
                    />
                  </div>
                )}
                {question.backgroundAnimation === 'mp4' && (
                  <div className="inputDiv">
                    <label>Upload MP4:</label>
                    <input
                      type="file"
                      name="backgroundMp4"
                      accept="video/mp4"
                      onChange={(e) => handleQuestionFileChange(index, e)}
                    />
                  </div>
                )}
              </div>
            ))}
            <button type="submit">Create Quiz</button>
          </form>
        )}
      </div>
    </>
  );
}

export default Createquizpage;
