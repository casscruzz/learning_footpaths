import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import styles from "../css/AccountPage.module.css";

export default function AccountPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEmailConfirm, setShowEmailConfirm] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [error, setError] = useState("");

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8888/@me", {
        withCredentials: true,
      });
      const userDetailsResponse = await axios.get(
        "http://localhost:8888/api/account/profile",
        {
          withCredentials: true,
        }
      );
      setUser({ ...response.data, ...userDetailsResponse.data });
    } catch (error) {
      console.error("Error fetching user data:", error);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [navigate, location.state?.updated]);

  const handleDeleteClick = () => {
    setShowDeletePopup(true);
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setShowEmailConfirm(false);
    setConfirmEmail("");
    setError("");
  };

  const handleConfirmDelete = async () => {
    if (confirmEmail !== user.email) {
      setError("Email does not match");
      return;
    }

    try {
      await axios.delete("http://localhost:8888/api/delete-account", {
        withCredentials: true,
        data: { email: confirmEmail },
      });
      // Clear session and navigate to home
      await axios.post(
        "http://localhost:8888/logout",
        {},
        { withCredentials: true }
      );
      navigate("/");
    } catch (error) {
      console.error("Delete account error:", error);
      setError(
        error.response?.data?.error ||
          "Failed to delete account. Please try again."
      );
    }
  };

  const formatMemberSince = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  if (!user) return null;

  return (
    <div>
      <Header />
      <div className={styles.accountContainer}>
        <div
          className={styles.profileImage}
          style={{
            backgroundColor: user.profile_photo ? "transparent" : "var(--blue)",
            backgroundImage: user.profile_photo
              ? `url(http://localhost:8888/static/profile_photos/${user.profile_photo})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <h1 className={styles.userName}>
          {user.first_name && user.last_name
            ? `${user.first_name} ${user.last_name}`
            : user.email}
        </h1>
        <p className={styles.userEmail}>{user.email}</p>
        {/* <p className={styles.memberSince}>
          Member since {formatMemberSince(user.created_at)}
        </p> */}
        <p className={styles.gradeLevel}>
          {user.grade_level
            ? `Grade ${user.grade_level}`
            : 'Please add your grade level through the "Edit My Profile" button below'}
        </p>

        <div className={styles.buttonContainer}>
          <button
            className={`${styles.button} ${styles.editButton}`}
            onClick={() => navigate("/accountsettings")}
          >
            Edit My Profile
          </button>
          <button
            className={`${styles.button} ${styles.badgesButton}`}
            onClick={() => navigate("/badges")}
          >
            See My Badges
          </button>
          <button
            className={`${styles.button} ${styles.deleteButton}`}
            onClick={handleDeleteClick}
          >
            Delete My Account
          </button>
        </div>

        {showDeletePopup && (
          <div className={styles.deletePopupOverlay}>
            <div className={styles.deletePopupContent}>
              <button
                className={styles.closeButton}
                onClick={handleCancelDelete}
              >
                ×
              </button>
              <h2 className={styles.deleteTitle}>
                Are you sure you want to{" "}
                <span className={styles.highlightText}>
                  delete your account
                </span>
                ?
              </h2>
              {!showEmailConfirm ? (
                <div className={styles.buttonContainer}>
                  <button
                    className={`${styles.button} ${styles.editButton}`}
                    onClick={handleCancelDelete}
                  >
                    No, take me back!
                  </button>
                  <button
                    className={`${styles.button} ${styles.badgesButton}`}
                    onClick={() => setShowEmailConfirm(true)}
                  >
                    Yes, I'm sure
                  </button>
                </div>
              ) : (
                <div className={styles.emailConfirmContainer}>
                  <p className={styles.confirmText}>
                    Enter your email to confirm deleting your account
                  </p>
                  <input
                    type="email"
                    className={styles.emailInput}
                    value={confirmEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    placeholder="name@email.com"
                  />
                  {error && <p className={styles.error}>{error}</p>}
                  <div className={styles.buttonContainer}>
                    <button
                      className={`${styles.button} ${styles.deleteButton}`}
                      onClick={handleConfirmDelete}
                    >
                      Delete My Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
