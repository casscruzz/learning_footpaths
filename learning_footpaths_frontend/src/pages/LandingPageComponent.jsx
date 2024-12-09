// import FootpathCards from "../components/landing_page/FootpathCards";
// import FootpathCard from "../components/landing_page/FootpathCard";
// import LandingPageText from "../components/landing_page/LandingPageText";
// import Header from "../components/Header";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import httpClient from "../httpClient"; // Import your custom axios instance
// import "../css/App.css";
// import styles from "../css/landing_page/FootpathCards.module.css";
// import FootpathScores from "../components/landing_page/FootpathScoresDisplay";
// // Configure axios to send cookies with requests
// axios.defaults.withCredentials = true;

// const LandingPageComponent = () => {
//   const [user, setUser] = useState(null);
//   const [bigQuestions, setBigQuestions] = useState([]);

//   useEffect(() => {
//     const fetchUserAndQuestions = async () => {
//       try {
//         // Separate the API calls
//         const questionsResp = await fetch(
//           "http://localhost:8888/api/big-questions"
//         );
//         const questionsData = await questionsResp.json();
//         setBigQuestions(questionsData);

//         // Try to get user info, but don't block on failure
//         try {
//           const userResp = await axios.get("http://localhost:8888/@me", {
//             withCredentials: true,
//           });
//           setUser(userResp.data);
//         } catch (error) {
//           console.log("User not authenticated");
//         }
//       } catch (error) {
//         console.error("Error fetching questions:", error);
//       }
//     };

//     fetchUserAndQuestions();
//   }, []);

//   const logoutUser = async () => {
//     await httpClient.post("http://localhost:8888/logout");
//     window.location.href = "/";
//   };

//   return (
//     <div>
//       <Header />
//       <LandingPageText />
//       <div>
//         {/* <div className={styles.cardHolder}>
//           {bigQuestions.map((question, index) => (
//             <FootpathCard key={index} title={question} />
//           ))}
//         </div> */}
//         {/* <div className={styles.cardHolder}>
//           {Object.entries(bigQuestions).map(([title, question], index) => (
//             <FootpathCard key={index} title={title} question={question} />
//           ))}
//         </div> */}
//         <div className={styles.cardHolder}>
//           {Object.entries(bigQuestions).map(([title, question], index) => (
//             <FootpathCard key={index} title={title} question={question} />
//           ))}
//         </div>
//       </div>
//       {/* <FootpathCards /> */}
//       {console.log("Fetched big questions:", bigQuestions)}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           flexDirection: "column",
//         }}
//       >
//         <div>
//           {user && <FootpathScores />}
//           <h3> Status Check (for Development)</h3>
//           {user ? <p>Logged in</p> : <p>Not logged in</p>}
//           {user && (
//             <>
//               <h3>ID:{user.id}</h3>
//               <h3>Email:{user.email}</h3>
//             </>
//           )}
//         </div>
//         <div>
//           <button className="button" onClick={logoutUser}>
//             Logout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LandingPageComponent;
import React, { useState, useEffect } from "react";
import FootpathCard from "../components/landing_page/FootpathCard";
import LandingPageText from "../components/landing_page/LandingPageText";
import Header from "../components/Header";
import FootpathScores from "../components/landing_page/FootpathScoresDisplay";
import styles from "../css/landing_page/FootpathCards.module.css";

const LandingPageComponent = () => {
  const [user, setUser] = useState(null);
  const [bigQuestions, setBigQuestions] = useState([]);

  useEffect(() => {
    const fetchUserAndQuestions = async () => {
      try {
        // Fetch big questions - this should always work
        const questionsResp = await fetch(
          "http://localhost:8888/api/big-questions"
        );
        const questionsData = await questionsResp.json();
        setBigQuestions(questionsData);

        // Try to get user info but don't block on failure
        try {
          const userResp = await fetch("http://localhost:8888/@me", {
            credentials: "include",
          });
          if (userResp.ok) {
            const userData = await userResp.json();
            setUser(userData);
          }
          // If user fetch fails, we just don't set the user - no redirect
        } catch (error) {
          console.log("User not authenticated");
          // Don't do anything on error - user stays null
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchUserAndQuestions();
  }, []);

  const logoutUser = async () => {
    try {
      const response = await fetch("http://localhost:8888/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setUser(null);
        // Optional: you might want to reload the page or clear other state
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div>
      <Header />
      <LandingPageText />
      <div>
        <div className={styles.cardHolder}>
          {Object.entries(bigQuestions).map(([title, question], index) => (
            <FootpathCard key={index} title={title} question={question} />
          ))}
        </div>
      </div>

      {/* Only show user info and scores if logged in */}
      {user && (
        <div className="flex flex-col items-center mt-4">
          <div>
            <h3>User Information</h3>
            <p>Email: {user.email}</p>
            <FootpathScores />
          </div>
          <button className="button mt-4" onClick={logoutUser}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default LandingPageComponent;
