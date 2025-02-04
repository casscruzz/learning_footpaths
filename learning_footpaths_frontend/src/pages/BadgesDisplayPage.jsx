import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import CompletedBadgeCard from "../components/badges_page/CompletedBadgeCard";
import IncompleteBadgeCard from "../components/badges_page/IncompleteBadgeCard";
import CustomBadgeCard from "../components/badges_page/CustomBadgeCard";
import styles from "../css/badges_page/BadgesDisplay.module.css";

const POINTS_NEEDED = 150;

export default function BadgesDisplayPage() {
  const navigate = useNavigate();
  const [footpathScores, setFootpathScores] = useState([]);
  const [customBadges, setCustomBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBadgeProgress = async () => {
      try {
        // Fetch both footpath scores and custom badges
        const [footpathResponse, customBadgesResponse] = await Promise.all([
          axios.get("http://localhost:8888/api/user/footpath-scores", {
            withCredentials: true,
          }),
          axios
            .get("http://localhost:8888/api/user/custom-badges", {
              withCredentials: true,
            })
            .catch((err) => {
              // If there's an error fetching custom badges, return empty array
              console.log("No custom badges found");
              return { data: [] };
            }),
        ]);

        setFootpathScores(footpathResponse.data);
        setCustomBadges(customBadgesResponse.data);
      } catch (err) {
        // If footpath scores fails, show error
        setError("Failed to load badges");
        console.error("Error fetching badges:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBadgeProgress();
  }, []);

  const handleBadgeClick = (badge, isCustom) => {
    navigate("/exhibitions", {
      state: {
        selectedFootpath: isCustom ? null : badge.footpath_name,
        customBadge: isCustom ? badge : null,
      },
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.loadingState}>Loading your badges...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.errorState}>{error}</div>
      </div>
    );
  }

  const completedBadges = footpathScores.filter(
    (score) => score.total_score >= POINTS_NEEDED
  );
  const incompleteBadges = footpathScores.filter(
    (score) => score.total_score < POINTS_NEEDED
  );

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <div className={styles.headerSection}>
          <h1>My Badges</h1>
        </div>

        {/* Default Learning Path Badges - Always show this section */}
        <div className={styles.section}>
          <h2>Learning Path Badges</h2>
          <div className={styles.badgeGrid}>
            {completedBadges.map((badge) => (
              <CompletedBadgeCard
                key={badge.footpath_id}
                title={badge.footpath_name}
                onClick={() => handleBadgeClick(badge, false)}
              />
            ))}
            {incompleteBadges.map((badge) => (
              <IncompleteBadgeCard
                key={badge.footpath_id}
                title={badge.footpath_name}
                points={badge.total_score}
                pointsNeeded={POINTS_NEEDED}
                onClick={() => handleBadgeClick(badge, false)}
              />
            ))}
          </div>
        </div>

        {/* Custom Badges - Only show if there are any */}
        {customBadges.length > 0 && (
          <div className={styles.section}>
            <h2>Custom Badges</h2>
            <div className={styles.badgeGrid}>
              {customBadges.map((badge) => (
                <CustomBadgeCard
                  key={badge.id}
                  badge={badge}
                  onClick={() => handleBadgeClick(badge, true)}
                />
              ))}
            </div>
          </div>
        )}

        {footpathScores.length === 0 && (
          <div className={styles.emptyState}>
            <p>Start exploring footpaths to earn badges!</p>
          </div>
        )}
      </div>
    </div>
  );
}
