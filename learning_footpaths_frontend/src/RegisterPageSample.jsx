import React, { useState } from "react";
import axios from "axios";

const RegisterPageSample = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async () => {
    try {
      const resp = await axios.post("http://localhost:5000/register", {
        email,
        password,
      });

      window.location.href = "/";
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Invalid credentials");
      }
    }
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={registerUser}>Register</button>
    </div>
  );
};

export default RegisterPageSample;
