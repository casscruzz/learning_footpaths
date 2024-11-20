import { useState } from "react";
import RegistrationAlternative from "../components/register_page/RegistrationAlternative";
import Header from "../components/Header";
import httpClient from "../httpClient"; // Assuming httpClient is imported from somewhere
import styles from "../css/register_page/RegisterPage.module.css";

export default function RegistrationComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async () => {
    try {
      const resp = await httpClient.post("http://localhost:8888/register", {
        email,
        password,
      });
      if (resp.status === 200) {
        window.location.href = "/";
      }
    } catch (e) {
      if (e.response && e.response.status === 401) {
        alert("Invalid email or password");
      }
      return;
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.registrationContainer}>
        <h1>Registration Page</h1>
        <RegistrationAlternative />
        <div>
          <h3>Create an account with your email</h3>
          <form className={styles.registrationForm}>
            <div>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.registrationInput}
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
                className={styles.registrationInput}
              />
            </div>
            <button className="button" type="button" onClick={registerUser}>
              Register User
            </button>
          </form>
          <p style={{ textAlign: "center", fontSize: "12px", color: "grey" }}>
            Already have an account? <a href="/login">Login here.</a>
          </p>
        </div>
      </div>
    </div>
  );
}
