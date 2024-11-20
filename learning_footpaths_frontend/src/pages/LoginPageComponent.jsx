import LoginAlternative from "../components/login_page/LoginAlternative";
import Header from "../components/Header";
import React, { useState } from "react";
import httpClient from "../httpClient";
import "../css/App.css";
import styles from "../css/login_page/LoginPage.module.css";

export default function LoginPageComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const logInUser = async () => {
    console.log(email, password);

    let resp;
    try {
      resp = await httpClient.post("http://localhost:8888/login", {
        email,
        password,
      });
    } catch (e) {
      if (e.response && e.response.status === 401) {
        alert("Invalid email or password");
      }
      return;
    }

    if (resp.status === 200) {
      window.location.href = "/";
    } else if (resp.status === 401) {
      console.log("Invalid email or password");
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
            <button
              className="button"
              type="button"
              onClick={(e) => {
                logInUser();
              }}
            >
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
