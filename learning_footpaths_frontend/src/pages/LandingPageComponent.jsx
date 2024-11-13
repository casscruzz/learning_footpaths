import FootpathCards from "../components/landing_page/FootpathCards";
import LandingPageText from "../components/landing_page/LandingPageText";
import Header from "../components/Header";
import React, { useState, useEffect } from "react";
import axios from "axios";
import httpClient from "../httpClient"; // Import your custom axios instance

// Configure axios to send cookies with requests
axios.defaults.withCredentials = true;

export default function LandingPageComponent() {
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
  return (
    <div>
      <Header />
      <div>
        {user ? <p>Logged in</p> : <p>Not logged in</p>}
        {user && (
          <>
            <h3>ID:{user.id}</h3>
            <h3>Email:{user.email}</h3>
          </>
        )}
      </div>
      <div>
        <button onClick={logoutUser}>Logout</button>
      </div>
      <LandingPageText />
      <FootpathCards />
    </div>
  );
}
