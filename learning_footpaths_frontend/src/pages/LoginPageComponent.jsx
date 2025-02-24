import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import styles from "../css/login_page/LoginPage.module.css";

export default function LoginPageComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSocialLogin = (type) => {
    navigate("/forgot-password", {
      state: {
        message: `Sorry, ${type} login is not available for this prototype`,
      },
    });
  };

  const logInUser = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // First, try to clear any existing session
      try {
        await axios.post(
          "http://localhost:8888/logout",
          {},
          { withCredentials: true }
        );
      } catch (err) {
        console.log("No existing session to clear");
      }

      const quiz_session_id = sessionStorage.getItem("quiz_session_id");
      const returnFootpath = sessionStorage.getItem("returnFootpath");

      // Attempt login
      const resp = await axios.post(
        "http://localhost:8888/login",
        {
          email,
          password,
          quiz_session_id,
        },
        {
          withCredentials: true,
        }
      );

      // Clear session storage
      sessionStorage.removeItem("quiz_session_id");
      sessionStorage.removeItem("returnFootpath");

      // Verify the session is established
      try {
        const userCheck = await axios.get("http://localhost:8888/@me", {
          withCredentials: true,
        });

        if (!userCheck.data) {
          throw new Error("Session not established");
        }

        // Navigate based on response
        if (resp.data.footpath_name) {
          navigate("/exhibitions", {
            state: { selectedFootpath: resp.data.footpath_name },
          });
        } else if (returnFootpath) {
          navigate("/exhibitions", {
            state: { selectedFootpath: returnFootpath },
          });
        } else {
          navigate("/");
        }
      } catch (sessionError) {
        console.error("Session verification failed:", sessionError);
        setError(
          "Login successful but session not established. Please try again."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.loginContainer}>
        <h1 className={styles.title}>Welcome to the Learning Footpaths!</h1>

        <div className={styles.socialButtons}>
          <button
            className={styles.googleButton}
            onClick={() => handleSocialLogin("Google")}
          >
            Log-in with Google
          </button>
          <button
            className={styles.facebookButton}
            onClick={() => handleSocialLogin("Facebook")}
          >
            Log-in with Facebook
          </button>
        </div>

        <div className={styles.emailSection}>
          <h2 className={styles.emailTitle}>Log-in with Your Email</h2>
          <form className={styles.loginForm} onSubmit={logInUser}>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.loginInput}
              required
            />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.loginInput}
              required
            />
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.forgotPassword}>
              <a href="/forgot-password">Forgot your password?</a>
            </div>
            <button type="submit" className={styles.loginButton}>
              Log-in
            </button>
          </form>
          <div className={styles.registerLink}>
            <a href="/register">Don't have an account yet? Register now!</a>
          </div>
        </div>
      </div>
    </div>
  );
}
