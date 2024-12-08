import FootpathCards from "../components/landing_page/FootpathCards";
import FootpathCard from "../components/landing_page/FootpathCard";
import LandingPageText from "../components/landing_page/LandingPageText";
import Header from "../components/Header";
import React, { useState, useEffect } from "react";
import axios from "axios";
import httpClient from "../httpClient"; // Import your custom axios instance
import "../css/App.css";
import styles from "../css/landing_page/FootpathCards.module.css";
// Configure axios to send cookies with requests
axios.defaults.withCredentials = true;

const LandingPageComponent = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const resp = await axios.get("http://localhost:8888/@me");
        setUser(resp.data);
      } catch (error) {
        console.log("Not Authenticated");
      }
    })();
  }, []);

  const logoutUser = async () => {
    await httpClient.post("http://localhost:8888/logout");
    window.location.href = "/";
  };

  // rendering with big questions from database
  const [bigQuestions, setBigQuestions] = useState([]); // previously {}

  useEffect(() => {
    const fetchBigQuestions = async () => {
      try {
        const response = await fetch("http://localhost:8888/api/big-questions");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setBigQuestions(data);
      } catch (error) {
        console.error("Error fetching big questions:", error);
      }
    };

    fetchBigQuestions();
    // console.log("Questions have been fetched");
    console.log("Fetched big questions:", bigQuestions);
  }, []);

  return (
    <div>
      <Header />
      <LandingPageText />
      <div>
        {/* <div className={styles.cardHolder}>
          {bigQuestions.map((question, index) => (
            <FootpathCard key={index} title={question} />
          ))}
        </div> */}
        <div className={styles.cardHolder}>
          {bigQuestions.map((footpath) => (
            <FootpathCard
              key={footpath.id}
              id={footpath.id}
              title={footpath.name}
              question={footpath.big_question}
            />
          ))}
        </div>
      </div>
      {/* <FootpathCards /> */}
      {console.log("Fetched big questions:", bigQuestions)}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div>
          <h3> Status Check (for Development)</h3>
          {user ? <p>Logged in</p> : <p>Not logged in</p>}
          {user && (
            <>
              <h3>ID:{user.id}</h3>
              <h3>Email:{user.email}</h3>
            </>
          )}
        </div>
        <div>
          <button className="button" onClick={logoutUser}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPageComponent;
