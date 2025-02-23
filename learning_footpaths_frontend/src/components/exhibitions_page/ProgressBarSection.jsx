import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import styles from "../../css/exhibitions_page/ProgressBarSection.module.css";

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

export default function ProgressBarSection({ footpathId }) {
  const [progress, setProgress] = useState({
    total_points: 0,
    points_needed: 150,
    progress_percentage: 0,
  });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8888/api/footpath-progress/${footpathId}`,
          { withCredentials: true }
        );
        setProgress(response.data);
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    if (footpathId) {
      fetchProgress();
    }
  }, [footpathId]);

  return (
    <div className={styles.progressContainer}>
      <p className={styles.progressText}>
        You've almost completed this footpath!
      </p>
      <div className={styles.progressBarWrapper}>
        <div
          className={styles.progressBar}
          style={{ width: `${progress.progress_percentage}%` }}
        />
      </div>
      <p className={styles.pointsText}>
        {progress.total_points}/{progress.points_needed} points
      </p>
    </div>
  );
}
