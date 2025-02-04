import React from "react";
import { X } from "lucide-react";
import styles from "../css/SlidingMenu.module.css";

const SlidingMenu = ({ isOpen, onClose, isAuthenticated, onNavigate }) => {
  const handleMenuClick = (path) => {
    onClose();
    onNavigate(path);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8888/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        onClose();
        // Redirect to home page after successful logout
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ""}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
        <button
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Close menu"
        >
          <X size={24} />
        </button>

        <div className={styles.menuItems}>
          {!isAuthenticated && (
            <button
              onClick={() => handleMenuClick("/login")}
              className={`${styles.menuItem} ${styles.loginButton}`}
            >
              Log-in
            </button>
          )}

          <button
            onClick={() => handleMenuClick("/")}
            className={styles.menuItem}
          >
            Choose Your Adventure
          </button>

          {isAuthenticated && (
            <>
              <button
                onClick={() => handleMenuClick("/account")}
                className={styles.menuItem}
              >
                My Account
              </button>

              <button
                onClick={() => handleMenuClick("/badges")}
                className={styles.menuItem}
              >
                My Badges
              </button>

              <button
                onClick={() => handleMenuClick("/badgemaker")}
                className={styles.menuItem}
              >
                Create Custom Badge
              </button>

              <button
                onClick={() => handleMenuClick("/accountsettings")}
                className={styles.menuItem}
              >
                Account Settings
              </button>

              <button
                onClick={handleLogout}
                className={`${styles.menuItem} ${styles.logoutButton}`}
              >
                Log-out
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SlidingMenu;
