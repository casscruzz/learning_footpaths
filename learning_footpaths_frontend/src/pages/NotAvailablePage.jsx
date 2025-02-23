import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import styles from "../css/login_page/LoginPage.module.css";

export default function NotAvailablePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const message =
    location.state?.message ||
    "Sorry, this feature is not available in the prototype";

  return (
    <div>
      <Header />
      <div className={styles.loginContainer}>
        <h1 className={styles.title}>{message}</h1>
        <button
          className={styles.loginButton}
          onClick={() => navigate("/login")}
          style={{ maxWidth: "400px" }}
        >
          Go back to Log-in
        </button>
      </div>
    </div>
  );
}
