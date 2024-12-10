import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import styles from "../../css/exhibitions_page/ProgressBar.module.css";

const ProgressBar = ({ value, max, label }) => {
  const percentage = Math.min(100, (value / max) * 100);

  return (
    <div className={styles.progress_container}>
      <div className={styles.progress_bar}>
        <div
          className={styles.progress_bar_completed}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className={styles.progress_label}>{label}</div>
    </div>
  );
};

export default function ProgressBarSection() {
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const [footpathId, setFootpathId] = useState(null);
  const location = useLocation();
  const { selectedFootpath } = location.state || {};

  // First fetch the footpath ID
  useEffect(() => {
    const fetchFootpathId = async () => {
      if (selectedFootpath) {
        try {
          const response = await axios.get(
            `http://localhost:8888/api/footpath-id/${selectedFootpath}`,
            { withCredentials: true }
          );
          setFootpathId(response.data.footpath_id);
          setError(null);
        } catch (error) {
          console.error("Error fetching footpath ID:", error);
          setError("Error loading footpath information");
        }
      }
    };

    fetchFootpathId();
  }, [selectedFootpath]);

  // Then fetch the progress once we have the footpath ID
  useEffect(() => {
    const fetchProgress = async () => {
      if (footpathId) {
        try {
          console.log("Fetching progress for footpath:", footpathId);
          const response = await axios.get(
            `http://localhost:8888/api/footpath-progress/${footpathId}`,
            { withCredentials: true }
          );
          console.log("Progress response:", response.data);
          setProgress(response.data);
          setError(null);
        } catch (error) {
          console.error("Error fetching progress:", error);
          if (error.response) {
            console.error("Error response:", error.response.data);
          }
          setError("Error loading progress");
        }
      }
    };

    fetchProgress();
  }, [footpathId]);

  // Show error if there is one
  if (error) {
    console.error("Error state:", error);
  }

  // Default state when no progress exists
  if (!progress) {
    return (
      <div className={styles.progress_section}>
        <h3>Progress Towards {selectedFootpath} Badge</h3>
        <ProgressBar value={0} max={250} label="0 / 250 points" />
        <p className={styles.remaining_text}>
          Start earning points towards your badge!
        </p>
      </div>
    );
  }

  return (
    <div className={styles.progress_section}>
      <h3>Progress Towards {progress.footpath_name} Badge</h3>
      <ProgressBar
        value={progress.total_points}
        max={progress.points_needed}
        label={`${progress.total_points} / ${progress.points_needed} points`}
      />
      {progress.points_remaining > 0 ? (
        <p className={styles.remaining_text}>
          {progress.points_remaining} points needed for badge
        </p>
      ) : (
        <p className={styles.badge_earned}>
          Congratulations! You've earned the badge! 🏆
        </p>
      )}
    </div>
  );
}
