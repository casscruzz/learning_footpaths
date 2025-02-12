import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import CompletedBadgeCard from "../components/badges_page/CompletedBadgeCard";
import IncompleteBadgeCard from "../components/badges_page/IncompleteBadgeCard";
import CustomBadgeCard from "../components/badges_page/CustomBadgeCard";
import DiscoverBadgeSection from "../components/badges_page/DiscoverBadgeSection";
import styles from "../css/badges_page/BadgesDisplay.module.css";

const POINTS_NEEDED = 150;

export default function BadgesDisplayPage() {
  const navigate = useNavigate();
  const [footpathScores, setFootpathScores] = useState([]);
  const [customBadges, setCustomBadges] = useState([]);
  const [discoveredBadges, setDiscoveredBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBadgeProgress = async () => {
      try {
        // Fetch footpath scores, custom badges, and discovered badges
        const [
          footpathResponse,
          customBadgesResponse,
          discoveredBadgesResponse,
        ] = await Promise.all([
          axios.get("http://localhost:8888/api/user/footpath-scores", {
            withCredentials: true,
          }),
          axios
            .get("http://localhost:8888/api/user/custom-badges", {
              withCredentials: true,
            })
            .catch((err) => {
              console.log("No custom badges found");
              return { data: [] };
            }),
          axios
            .get("http://localhost:8888/api/user/discovered-badges", {
              withCredentials: true,
            })
            .catch((err) => {
              console.log("No discovered badges found");
              return { data: [] };
            }),
        ]);

        setFootpathScores(footpathResponse.data);
        setCustomBadges(customBadgesResponse.data);
        setDiscoveredBadges(discoveredBadgesResponse.data);
      } catch (err) {
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

  const handleBadgeDiscovered = (newBadge) => {
    // Add the new badge to the discoveredBadges list
    setDiscoveredBadges((prevBadges) => [...prevBadges, newBadge]);
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

        <DiscoverBadgeSection onBadgeDiscovered={handleBadgeDiscovered} />

        {/* Default Learning Path Badges */}
        <div className={styles.section}>
          <h2>Learning Path Badges</h2>
          <div className={styles.badgeGrid}>
            {completedBadges.map((badge) => (
              <CompletedBadgeCard
                key={badge.footpath_id}
                title={badge.footpath_name}
                dateEarned={badge.completion_date}
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

        {/* Custom Badges */}
        {customBadges.length > 0 && (
          <div className={styles.section}>
            <h2>Created Badges</h2>
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

        {/* Discovered Badges */}
        {discoveredBadges.length > 0 && (
          <div className={styles.section}>
            <h2>Discovered Badges</h2>
            <div className={styles.badgeGrid}>
              {discoveredBadges.map((badge) => (
                <CustomBadgeCard
                  key={badge.id}
                  badge={{
                    ...badge,
                    exhibitions: badge.exhibitions || [],
                  }}
                  onClick={() => handleBadgeClick(badge, true)}
                />
              ))}
            </div>
          </div>
        )}

        {footpathScores.length === 0 &&
          customBadges.length === 0 &&
          discoveredBadges.length === 0 && (
            <div className={styles.emptyState}>
              <p>Start exploring footpaths to earn badges!</p>
            </div>
          )}
      </div>
    </div>
  );
}
