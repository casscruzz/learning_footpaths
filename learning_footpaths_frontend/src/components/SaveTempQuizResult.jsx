// // SaveTempQuizResult.js

// import axios from "axios";

// const saveTempQuizResult = async (
//   exhibitionId,
//   score,
//   footpathName,
//   footpathId
// ) => {
//   try {
//     const sessionId = Math.random().toString(36).substring(2);
//     const response = await axios.post("http://localhost:8888/save_temp_quiz", {
//       session_id: sessionId,
//       exhibition_id: exhibitionId,
//       score: score,
//       footpath_name: footpathName,
//       footpath_id: footpathId,
//     });
//     sessionStorage.setItem("quiz_session_id", sessionId);
//     sessionStorage.setItem("returnFootpath", footpathName);
//     return response;
//   } catch (error) {
//     console.error("Error saving temp quiz:", error);
//   }
// };

// export default saveTempQuizResult;

// THIS ONE WORKED SO FAR BUT DELETE LATER IF THE ONE AT THE BOTTOM WORKS
// import axios from "axios";

// const saveTempQuizResult = async (
//   exhibitionId,
//   score,
//   footpathName,
//   footpathId
// ) => {
//   try {
//     // Generate session ID if not exists
//     let sessionId = sessionStorage.getItem("quiz_session_id");
//     if (!sessionId) {
//       sessionId = Math.random().toString(36).substr(2, 9);
//       sessionStorage.setItem("quiz_session_id", sessionId);
//     }

//     const response = await axios.post("http://localhost:8888/save_temp_quiz", {
//       session_id: sessionId,
//       exhibition_id: exhibitionId,
//       score: score,
//       footpath_name: footpathName,
//       footpath_id: footpathId,
//     });

//     return response.data;
//   } catch (error) {
//     console.error("Error saving temporary quiz result:", error);
//     // Don't throw error - allow flow to continue to login/register
//     return null;
//   }
// };

// export default saveTempQuizResult;

import axios from "axios";

const saveTempQuizResult = async (
  exhibitionId,
  score,
  footpathName,
  footpathId
) => {
  try {
    // Generate session ID if not exists
    let sessionId = sessionStorage.getItem("quiz_session_id");
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2);
      sessionStorage.setItem("quiz_session_id", sessionId);
    }

    // Save footpath info for redirection after login
    sessionStorage.setItem("returnFootpath", footpathName);

    const response = await axios.post("http://localhost:8888/save_temp_quiz", {
      session_id: sessionId,
      exhibition_id: exhibitionId,
      score,
      footpath_name: footpathName,
      footpath_id: footpathId,
    });

    return response.data;
  } catch (error) {
    console.error("Error saving temporary quiz result:", error);
    return null;
  }
};

export default saveTempQuizResult;
