import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../Components/Header/Header";
import api from "../../Common/apis";
import "./Createquizpage.css";

function Createquizpage() {
  const [step, setStep] = useState(1);
  const [quizDetails, setQuizDetails] = useState({
    title: "",
    thumbnail: null,
    numQuestions: 1,
  });
  const [questions, setQuestions] = useState([]);
  const [predefinedAnimations, setPredefinedAnimations] = useState([]);
  const [loadingPredefinedAnimations, setLoadingPredefinedAnimations] = useState(true);

  useEffect(() => {
    const fetchPredefinedAnimations = async () => {
      try {
        const response = await api.get("/cloudinaryurls");
        console.log('Fetched predefined animations:', response.data); // Log the response
        setPredefinedAnimations(response.data);
      } catch (error) {
        console.error("Error fetching predefined animations:", error);
        setPredefinedAnimations([]);
      } finally {
        setLoadingPredefinedAnimations(false);
      }
    };

    fetchPredefinedAnimations();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuizDetails({ ...quizDetails, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setQuizDetails({ ...quizDetails, [name]: files[0] });
  };

  const handleNext = () => {
    setQuestions(
      Array.from({ length: quizDetails.numQuestions }, () => ({
        questionText: "",
        options: ["", "", "", ""],
        correctOption: "",
        questionPhoto: null,
        answerPhoto: null,
        backgroundAnimationOption: "predefined",
        predefinedAnimationUrl: "",
        backgroundAnimationFile: null,
      }))
    );
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
    formData.append("file", file);
    formData.append("upload_preset", "QuizCloud"); // Replace with your Cloudinary upload preset

    const uploadRes = await axios.post(
      "https://api.cloudinary.com/v1_1/dwwhvnadl/auto/upload",
      formData
    );
    return uploadRes.data.url; // Return the secure URL of the uploaded file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Uploading thumbnail...");
      const thumbnailUrl = await uploadToCloudinary(quizDetails.thumbnail);
      console.log("Thumbnail uploaded:", thumbnailUrl);

      console.log("Preparing questions data...");
      const updatedQuestions = await Promise.all(
        questions.map(async (question, index) => {
          console.log(`Processing question ${index + 1}...`);
          const questionPhotoUrl = question.questionPhoto
            ? await uploadToCloudinary(question.questionPhoto)
            : null;
          const answerPhotoUrl = question.answerPhoto
            ? await uploadToCloudinary(question.answerPhoto)
            : null;

          let backgroundAnimation = '';
          if (question.backgroundAnimationOption === 'predefined') {
            backgroundAnimation = question.predefinedAnimationUrl;
          } else if (
            question.backgroundAnimationOption === 'upload' &&
            question.backgroundAnimationFile
          ) {
            backgroundAnimation = await uploadToCloudinary(
              question.backgroundAnimationFile
            );
          }

          console.log(`Question ${index + 1} processed data:`, {
            questionText: question.questionText,
            options: question.options,
            correctAnswer: question.correctOption,
            questionPhotoUrl,
            answerPhotoUrl,
            backgroundAnimation,
          });

          return {
            questionText: question.questionText,
            options: question.options,
            correctAnswer: question.correctOption,
            questionPhotoUrl,
            answerPhotoUrl,
            backgroundAnimation,
          };
        })
      );

      const newQuizData = {
        title: quizDetails.title,
        thumbnail: thumbnailUrl,
        numQuestions: quizDetails.numQuestions,
        questions: updatedQuestions,
      };

      console.log("Quiz data prepared:", newQuizData);

      console.log("Sending quiz data to backend...");
      const response = await api.post('/quizzes/createQuiz', newQuizData);
      console.log("Quiz creation response:", response.data);
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
                      onChange={(e) =>
                        handleOptionChange(index, optionIndex, e)
                      }
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
                    <option value="">Select correct option</option>
                    {question.options.map((option, optionIndex) => (
                      <option key={optionIndex} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="inputDiv">
                  <label>Question Photo:</label>
                  <input
                    type="file"
                    name="questionPhoto"
                    accept="image/*"
                    onChange={(e) => handleQuestionFileChange(index, e)}
                    required
                  />
                </div>
                <div className="inputDiv">
                  <label>Answer Photo:</label>
                  <input
                    type="file"
                    name="answerPhoto"
                    accept="image/*"
                    onChange={(e) => handleQuestionFileChange(index, e)}
                    required
                  />
                </div>
                <div className="inputDiv">
                  <label>Background Animation:</label>
                  <select
                    name="backgroundAnimationOption"
                    value={question.backgroundAnimationOption}
                    onChange={(e) => handleQuestionChange(index, e)}
                    required
                  >
                    <option value="predefined">Predefined</option>
                    <option value="upload">Upload</option>
                  </select>
                  {question.backgroundAnimationOption === "predefined" && (
                    <select
                      name="predefinedAnimationUrl"
                      value={question.predefinedAnimationUrl}
                      onChange={(e) => handleQuestionChange(index, e)}
                      required
                    >
                      <option value="">Select animation</option>
                      {predefinedAnimations.map((animation, animationIndex) => (
                        <option key={animationIndex} value={animation.url}>
                          {animation.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {question.backgroundAnimationOption === "upload" && (
                    <input
                      type="file"
                      name="backgroundAnimationFile"
                      accept="image/*"
                      onChange={(e) => handleQuestionFileChange(index, e)}
                      required
                    />
                  )}
                </div>
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
