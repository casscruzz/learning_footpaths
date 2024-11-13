import LoginAlternative from "../components/login_page/LoginAlternative";
// import LoginRegular from "../components/login_page/LoginRegular";
import Header from "../components/Header";
import React, { useState } from "react";
import httpClient from "../httpClient";

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
      <h1>Log-in Page</h1>
      <LoginAlternative />
      {/* <LoginRegular /> */}
      <div>
        <h1>Log-in Regular</h1>
        <form>
          <div>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
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
              required
            />
          </div>
          <div>
            <a href="/forgot-password">Forgot password?</a>
          </div>
          <button
            type="button"
            onClick={(e) => {
              logInUser();
            }}
          >
            Login
          </button>
        </form>
        <p>
          Don't have an account? <a href="/register">Register Now.</a>
        </p>
      </div>
    </div>
  );
}
