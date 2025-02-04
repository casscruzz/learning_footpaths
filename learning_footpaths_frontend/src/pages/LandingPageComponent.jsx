import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Add this import
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
    </div>
  );
};

export default LandingPageComponent;
