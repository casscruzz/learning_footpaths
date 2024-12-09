import LoginAlternative from "../components/login_page/LoginAlternative";
import Header from "../components/Header";
import React, { useState, useEffect } from "react";
import axios from "axios"; // Change to axios for consistency
import "../css/App.css";
import styles from "../css/login_page/LoginPage.module.css";
import { useNavigate } from "react-router-dom";

export default function LoginPageComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // const logInUser = async () => {
  //   try {
  //     const quiz_session_id = sessionStorage.getItem("quiz_session_id");

  //     const resp = await axios.post(
  //       "http://localhost:8888/login",
  //       {
  //         email,
  //         password,
  //         quiz_session_id,
  //       },
  //       {
  //         withCredentials: true,
  //       }
  //     );

  //     if (resp.status === 200) {
  //       // Clear the session ID
  //       sessionStorage.removeItem("quiz_session_id");

  //       // Navigate based on response
  //       if (resp.data.footpath_name) {
  //         navigate("/exhibitions", {
  //           state: { footpathName: resp.data.footpath_name },
  //         });
  //       } else {
  //         navigate("/");
  //       }
  //     }
  //   } catch (error) {
  //     if (error.response?.status === 401) {
  //       alert("Invalid email or password");
  //     }
  //     console.error("Login error:", error);
  //   }
  // };

  const logInUser = async () => {
    try {
      const quiz_session_id = sessionStorage.getItem("quiz_session_id");
      const returnFootpath = sessionStorage.getItem("returnFootpath");

      const resp = await axios.post(
        "http://localhost:8888/login", // Fix URL
        {
          email,
          password,
          quiz_session_id,
        },
        { withCredentials: true }
      );

      sessionStorage.removeItem("quiz_session_id");
      sessionStorage.removeItem("returnFootpath");

      if (returnFootpath) {
        navigate("/exhibitions", {
          state: { selectedFootpath: returnFootpath },
        });
      } else {
        navigate("/");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Invalid email or password");
      }
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.loginContainer}>
        <h1 style={{ textAlign: "center" }}>Log-in</h1>
        <LoginAlternative />

        <div>
          <h2 style={{ textAlign: "center" }}>Log-in with email</h2>
          <form className={styles.loginForm}>
            <div>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
                className={styles.loginInput}
                required
              />
            </div>
            <div>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
                className={styles.loginInput}
                required
              />
            </div>
            <div
              style={{ textAlign: "center", fontSize: "12px", color: "grey" }}
            >
              <a href="/forgot-password">Forgot password?</a>
            </div>
            <button className="button" type="button" onClick={logInUser}>
              Login
            </button>
          </form>
          <p style={{ textAlign: "center", fontSize: "12px", color: "grey" }}>
            Don't have an account? <a href="/register">Register Now.</a>
          </p>
        </div>
      </div>
    </div>
  );
}
