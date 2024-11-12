import React, { useState } from "react";
import httpClient from "./httpClient";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const logInUser = async () => {
    console.log(email, password);

    try {
      await httpClient.post("//localhost:5000/login", {
        email,
        password,
      });

      window.location.href = "/";
    } catch (error) {
      if (error.response.status === 401) {
        alert("Invalid credentials");
      }
    }
  };

  return (
    <div>
      <form>
        <div>
          <label>Email: </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="button" onClick={() => logInUser()}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
