// import React from "react";
// import { Link } from "react-router-dom";
// import Header from "../components/Header";

// export default function AccountPage() {
//   return (
//     <>
//       <Header />
//       <div style={{ textAlign: "center", padding: "20px" }}>
//         <div>
//           <img
//             src="path_to_photo.jpg"
//             alt="User Photo"
//             style={{ width: "150px", height: "150px", borderRadius: "50%" }}
//           />
//           <div>
//             <Link to="/edit-photo">Edit Photo</Link>
//           </div>
//         </div>
//         <div style={{ marginTop: "20px" }}>
//           <h2>First N. Last Name</h2>
//           <p>Grade Level</p>
//           <button>Edit Information</button>
//         </div>
//         <div style={{ marginTop: "20px" }}>
//           <button>My Badges</button>
//           <button>Create Custom Badge</button>
//           <button>Account Settings</button>
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import styles from "../css/AccountPage.module.css";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [footpathScores, setFootpathScores] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get("http://localhost:8888/@me", {
          withCredentials: true,
        });
        setUser(userResponse.data);

        const scoresResponse = await axios.get(
          "http://localhost:8888/api/user/footpath-scores",
          { withCredentials: true }
        );
        setFootpathScores(scoresResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <div>Please log in to view your account.</div>;
  }

  return (
    <div className={styles.accountContainer}>
      <Header />
      <div className={styles.contentWrapper}>
        <div className={styles.profileSection}>
          <div className={styles.photoContainer}>
            <img
              src="/api/placeholder/150/150"
              alt="User Photo"
              className={styles.profilePhoto}
            />
          </div>
          <div className={styles.userInfo}>
            <h2>{user.email}</h2>
            <p>Member since {new Date().getFullYear()}</p>
          </div>
        </div>

        <div className={styles.progressSection}>
          <h3>My Learning Progress</h3>
          {footpathScores.length > 0 ? (
            <div className={styles.footpathProgress}>
              {footpathScores.map((score) => (
                <div key={score.footpath_id} className={styles.progressCard}>
                  <h4>{score.footpath_name}</h4>
                  <div className={styles.scoreInfo}>
                    <span>Total Points: {score.total_score}</span>
                    {score.total_score >= 150 && (
                      <span className={styles.badgeEarned}>
                        🏆 Badge Earned!
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No learning progress yet. Start exploring footpaths!</p>
          )}
        </div>
      </div>
    </div>
  );
}
