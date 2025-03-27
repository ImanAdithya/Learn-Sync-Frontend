import React, { useState, useEffect,useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export const QuizPage = () => {
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [isTimeout, setIsTimeout] = useState(false);
  const userId = localStorage.getItem("userId");

  const { selectedGrade, selectedSubject } = location.state || {};

  const API_KEY = "AIzaSyDQx4p3UpBn_AsazdOSMOegvqoFd4nUE-I"; 

  const generateQuizQuestions = async () => {
    setIsLoading(true);
    try {
      const prompt = `Generate 10 multiple-choice questions for ${selectedSubject} subject for grade ${selectedGrade}. 
      Format each question as:
      Question: [Question text]
      A: [Option A]
      B: [Option B]
      C: [Option C]
      D: [Option D]
      Answer: [Correct option letter]`;
  
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          contents: [{ role: "user", parts: [{ text: prompt }] }]
        }
      );
  
      const generatedText = response.data.candidates[0].content.parts[0].text;
      const questionBlocks = generatedText.split(/\n\n+/);
  
      const parsedQuestions = questionBlocks.map((block, index) => {
        const lines = block.split('\n').filter(line => line.trim() !== "");
        if (lines.length < 6) return null;
  
        return {
          id: index,
          question: lines[0].replace('Question: ', '').trim(),
          options: {
            A: lines[1].replace('A: ', '').trim(),
            B: lines[2].replace('B: ', '').trim(),
            C: lines[3].replace('C: ', '').trim(),
            D: lines[4].replace('D: ', '').trim()
          },
          correctAnswer: lines[5].replace('Answer: ', '').trim()
        };
      }).filter(q => q !== null);
  
      setQuestions(parsedQuestions);
      setIsLoading(false);
    } catch (error) {
      console.error('Error generating questions:', error);
      setIsLoading(false);
    }
  };

  const timerRef = useRef(null);  // Create a reference for the timer

  useEffect(() => {
    generateQuizQuestions();
  
    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          setIsTimeout(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  
    return () => clearInterval(timerRef.current);
  }, []);
  const handleAnswerSelect = (questionId, selectedOption) => {
    if (!isSubmitted) {
      setUserAnswers(prev => ({
        ...prev,
        [questionId]: selectedOption
      }));
    }
  };

  const handleSubmit = () => {

    clearInterval(timerRef.current); // Stop the timer
   
    let calculatedScore = 0;
    questions.forEach(question => {
      if (userAnswers[question.id] === question.correctAnswer) {
        calculatedScore += 1;
      }
    });
    
    setScore(calculatedScore);
    addExamMark(calculatedScore);
    setIsSubmitted(true);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isTimeout) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-4xl font-bold text-red-600">Time Out! Exam Over.</h1>
      </div>
    );
  }


  const addExamMark=(score)=>{

    const userMark={
        "userId": userId,
        "grade": selectedGrade,
        "subject": selectedSubject,
        "marks": score
      }

    axios
    .post("http://localhost:4000/api/exam", userMark)
    .then((response) => {
      if (response.status === 201) {
        alert("Exam Score Added Succuss..");
      } else {
        alert("Failed to save Exam");
      }
    })
    .catch((error) => {
      console.error("Error saving Exam:", error);
      alert("An error occurred while saving the Exam.");
    });

  }

  return (
    <div className="max-w-4xl mx-auto p-6 font-anek">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">
          {selectedSubject} Quiz - Grade {selectedGrade}
        </h1>
        <span className="text-lg font-bold text-red-500">
          Time Left: {formatTime(timeLeft)}
        </span>
      </div>

      {!isSubmitted ? (
        <div>
          {questions.map((q) => (
            <div key={q.id} className="mb-6 p-4 border rounded-lg">
              <h3 className="text-xl font-semibold mb-4">{q.question}</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(q.options).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => handleAnswerSelect(q.id, key)}
                    className={`p-3 border rounded-lg text-left ${
                      userAnswers[q.id] === key 
                        ? 'bg-blue-100 border-blue-500' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {key}: {value}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={handleSubmit}
            
            className={`w-full p-3 rounded-lg text-white font-bold ${
              Object.keys(userAnswers).length === questions.length 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Submit Quiz
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Your Score: {score}/10</h2>
          <div className="grid grid-cols-2 gap-4 mt-8">
            {questions.map((q) => (
              <div 
                key={q.id} 
                className={`p-4 rounded-lg ${
                  userAnswers[q.id] === q.correctAnswer 
                    ? 'bg-green-100 border-green-500' 
                    : 'bg-red-100 border-red-500'
                }`}
              >
                <h3 className="font-semibold mb-2">{q.question}</h3>
                <p>Your Answer: {q.options[userAnswers[q.id]]}</p>
                <p className="font-bold">Correct Answer: {q.options[q.correctAnswer]}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
