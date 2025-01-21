import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import styles from "../css/AccountPage.module.css";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [footpathScores, setFootpathScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch basic user data
        const userResponse = await axios.get("http://localhost:8888/@me", {
          withCredentials: true,
        });
        setUser(userResponse.data);

        // Fetch detailed profile data
        const profileResponse = await axios.get(
          "http://localhost:8888/api/account/profile",
          {
            withCredentials: true,
          }
        );
        setUserProfile(profileResponse.data);

        // Fetch footpath scores
        const scoresResponse = await axios.get(
          "http://localhost:8888/api/user/footpath-scores",
          { withCredentials: true }
        );
        setFootpathScores(scoresResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view your account.</div>;
  }

  const getDisplayName = () => {
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name} ${userProfile.last_name}`;
    } else if (userProfile?.first_name) {
      return userProfile.first_name;
    }
    return user.email;
  };

  return (
    <div className={styles.accountContainer}>
      <Header />
      <div className={styles.contentWrapper}>
        <div className={styles.profileSection}>
          <div className={styles.photoContainer}>
            <img
              src={
                userProfile?.profile_photo
                  ? `http://localhost:8888/static/profile_photos/${userProfile.profile_photo}`
                  : "/api/placeholder/150/150"
              }
              alt="User Photo"
              className={styles.profilePhoto}
            />
            <div className={styles.editButtonContainer}>
              <Link to="/accountsettings" className={styles.editButton}>
                Edit Profile
              </Link>
            </div>
          </div>
          <div className={styles.userInfo}>
            <h2>{getDisplayName()}</h2>
            {userProfile?.grade_level && (
              <p className={styles.gradeLevel}>
                Grade {userProfile.grade_level}
              </p>
            )}
            <p className={styles.memberSince}>
              Member since {new Date().getFullYear()}
            </p>
            <p className={styles.email}>{user.email}</p>
          </div>
        </div>

        <div className={styles.progressSection}>
          <div className={styles.sectionHeader}>
            <h3>My Learning Progress</h3>
            <Link to="/badges" className={styles.viewBadgesLink}>
              View All Badges
            </Link>
          </div>
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
            <div className={styles.noProgress}>
              <p>No learning progress yet. Start exploring footpaths!</p>
              <Link to="/" className={styles.exploreLink}>
                Explore Footpaths
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
