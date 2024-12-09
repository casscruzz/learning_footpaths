// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Header from "../components/Header";
// import styles from "../css/exhibitions_page/ExhibitionQuiz.module.css";
// import saveTempQuizResult from "../components/SaveTempQuizResult.jsx"; // Import the function

// export default function ExhibitionQuizPage() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { exhibitionId, exhibitionTitle, returnPath, footpathName } =
//     location.state || {};

//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [score, setScore] = useState(0);
//   const [highestScore, setHighestScore] = useState(0);
//   const [showFeedback, setShowFeedback] = useState(false);
//   const [isCorrect, setIsCorrect] = useState(false);
//   const [isComplete, setIsComplete] = useState(false);
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showPopup, setShowPopup] = useState(false);

//   // Check if user is logged in and fetch highest score
//   useEffect(() => {
//     const checkAuthAndFetchScore = async () => {
//       try {
//         const resp = await axios.get("http://localhost:8888/@me", {
//           withCredentials: true,
//         });
//         setUser(resp.data);

//         if (exhibitionId) {
//           // Fetch existing score
//           const scoreResp = await axios.get(
//             `http://localhost:8888/api/get-exhibition-score/${exhibitionId}`,
//             { withCredentials: true }
//           );
//           setHighestScore(scoreResp.data.score || 0);
//         }
//       } catch (error) {
//         console.log("Not authenticated or error fetching score");
//       }
//     };
//     checkAuthAndFetchScore();
//   }, [exhibitionId]);

//   // Fetch exhibition questions
//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8888/api/exhibition-questions/${exhibitionId}`,
//           { withCredentials: true }
//         );
//         setQuestions(response.data);
//         setError(null);
//       } catch (error) {
//         setError("Failed to load questions");
//         console.error("Error fetching questions:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (exhibitionId) {
//       fetchQuestions();
//     }
//   }, [exhibitionId]);

//   const handleAnswerSelect = (selectedOptionNumber) => {
//     setSelectedAnswer(selectedOptionNumber);
//     const currentQuestion = questions[currentQuestionIndex];

//     const correctOptionNumber = parseInt(
//       currentQuestion.correct_answer.split(" ")[1]
//     );
//     const isAnswerCorrect = selectedOptionNumber === correctOptionNumber;
//     setIsCorrect(isAnswerCorrect);
//     setShowFeedback(true);

//     if (isAnswerCorrect) {
//       setScore((prevScore) => prevScore + 10);
//     }

//     setTimeout(() => {
//       setShowFeedback(false);
//       setSelectedAnswer(null);

//       if (currentQuestionIndex < questions.length - 1) {
//         setCurrentQuestionIndex(currentQuestionIndex + 1);
//       } else {
//         const finalScore = score + (isAnswerCorrect ? 10 : 0);
//         handleQuizCompletion(finalScore);
//       }
//     }, 2000);
//   };

//   const handleQuizCompletion = async (finalScore) => {
//     setIsComplete(true);

//     if (user) {
//       await axios.post(
//         "http://localhost:8888/api/save-exhibition-progress",
//         {
//           exhibitionId,
//           score: finalScore,
//           completed: true,
//         },
//         { withCredentials: true }
//       );
//     } else {
//       await saveTempQuizResult(exhibitionId, finalScore, footpathName);
//       sessionStorage.setItem("returnFootpath", footpathName);
//     }
//     setShowPopup(true);
//   };

//   if (isLoading) return <div>Loading questions...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!questions.length) return <div>No questions available</div>;

//   const currentQuestion = questions[currentQuestionIndex];

//   return (
//     <div>
//       <Header />
//       <div className={styles.quizContainer}>
//         <h2>{exhibitionTitle}</h2>
//         <h3>
//           Question {currentQuestionIndex + 1} of {questions.length}
//         </h3>
//         <div className={styles.question}>
//           <p>{currentQuestion?.text}</p>
//           <div className={styles.options}>
//             {["option_a", "option_b", "option_c", "option_d"].map(
//               (option, index) => (
//                 <button
//                   key={option}
//                   onClick={() => handleAnswerSelect(index + 1)}
//                   className={`${styles.optionButton} ${
//                     showFeedback && selectedAnswer === index + 1
//                       ? isCorrect
//                         ? styles.correct
//                         : styles.incorrect
//                       : ""
//                   }`}
//                   disabled={showFeedback}
//                 >
//                   {currentQuestion?.[option]}
//                 </button>
//               )
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import styles from "../css/exhibitions_page/ExhibitionQuiz.module.css";
import saveTempQuizResult from "../components/SaveTempQuizResult.jsx";

export default function ExhibitionQuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { exhibitionId, exhibitionTitle, returnPath, footpathName } =
    location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [highestScore, setHighestScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const checkAuthAndFetchScore = async () => {
      try {
        const resp = await axios.get("http://localhost:8888/@me", {
          withCredentials: true,
        });
        setUser(resp.data);

        if (exhibitionId) {
          const scoreResp = await axios.get(
            `http://localhost:8888/api/get-exhibition-score/${exhibitionId}`,
            { withCredentials: true }
          );
          setHighestScore(scoreResp.data.score || 0);
        }
      } catch (error) {
        console.log("Not authenticated or error fetching score");
      }
    };
    checkAuthAndFetchScore();
  }, [exhibitionId]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!exhibitionId) return;

      try {
        const response = await axios.get(
          `http://localhost:8888/api/exhibition-questions/${exhibitionId}`,
          { withCredentials: true }
        );
        setQuestions(response.data);
        setError(null);
      } catch (error) {
        setError("Failed to load questions");
        console.error("Error fetching questions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [exhibitionId]);

  const handleAnswerSelect = (selectedOptionNumber) => {
    setSelectedAnswer(selectedOptionNumber);
    const currentQuestion = questions[currentQuestionIndex];
    const correctOptionNumber = parseInt(
      currentQuestion.correct_answer.split(" ")[1]
    );

    const isAnswerCorrect = selectedOptionNumber === correctOptionNumber;
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    if (isAnswerCorrect) {
      setScore((prevScore) => prevScore + 10);
    }

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        const finalScore = score + (isAnswerCorrect ? 10 : 0);
        handleQuizCompletion(finalScore);
      }
    }, 2000);
  };

  const handleQuizCompletion = async (finalScore) => {
    setIsComplete(true);

    try {
      if (user) {
        await axios.post(
          "http://localhost:8888/api/save-exhibition-progress",
          {
            exhibitionId,
            score: finalScore,
            completed: true,
          },
          { withCredentials: true }
        );
      } else {
        // Ensure footpath info is available
        const footpathId = location.state?.footpathId;
        await saveTempQuizResult(
          exhibitionId,
          finalScore,
          footpathName,
          footpathId
        );
      }
      setScore(finalScore);
      setShowPopup(true);
    } catch (error) {
      console.error("Error saving quiz result:", error);
      // Still show popup even if save fails
      setShowPopup(true);
    }
  };

  if (isComplete && showPopup) {
    return (
      <div className={styles.popupOverlay}>
        <div className={styles.popupContent}>
          <h3>Quiz Complete!</h3>
          <p>You earned {score} points!</p>
          {user ? (
            <button
              onClick={() =>
                navigate("/exhibitions", {
                  state: { selectedFootpath: footpathName },
                })
              }
            >
              Return to Exhibitions
            </button>
          ) : (
            <div className={styles.loginButtons}>
              <button onClick={() => navigate("/login")}>
                Login to Save Score
              </button>
              <button onClick={() => navigate("/register")}>
                Register to Save Score
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isLoading) return <div>Loading questions...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!questions.length) return <div>No questions available</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <Header />
      <div className={styles.quizContainer}>
        <h2>{exhibitionTitle}</h2>
        <h3>
          Question {currentQuestionIndex + 1} of {questions.length}
        </h3>
        <div className={styles.question}>
          <p>{currentQuestion?.text}</p>
          <div className={styles.options}>
            {["option_a", "option_b", "option_c", "option_d"].map(
              (option, index) => (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(index + 1)}
                  className={`${styles.optionButton} ${
                    showFeedback && selectedAnswer === index + 1
                      ? isCorrect
                        ? styles.correct
                        : styles.incorrect
                      : ""
                  }`}
                  disabled={showFeedback}
                >
                  {currentQuestion[option]}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
