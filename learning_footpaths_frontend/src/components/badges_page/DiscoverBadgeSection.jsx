import React, { useState } from "react";
import axios from "axios";
import styles from "../../css/badges_page/DiscoverBadge.module.css";

export default function DiscoverBadgeSection({ onBadgeDiscovered }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(null);
    setLoading(true);

    try {
      // First check if the badge exists and if we already have it
      const checkResponse = await axios.get(
        `http://localhost:8888/api/discover-badge/${code}`,
        { withCredentials: true }
      );

      const badgeInfo = checkResponse.data;

      if (badgeInfo.already_discovered) {
        setError("You already have this badge in your collection");
        setLoading(false);
        return;
      }

      // Add the badge to the user's collection
      const addResponse = await axios.post(
        `http://localhost:8888/api/add-discovered-badge/${code}`,
        {},
        { withCredentials: true }
      );

      // Update the success state and parent component
      const newBadge = addResponse.data.badge;
      setSuccess(newBadge);

      // Clear the input and notify parent component
      setCode("");
      if (onBadgeDiscovered) {
        onBadgeDiscovered({
          ...newBadge,
          exhibitions: [], // Initialize with empty exhibitions array
          created_at: new Date().toISOString(),
          share_code: code,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.status === 404) {
        setError("Badge not found. Please check the code and try again.");
      } else if (error.response?.status === 400) {
        setError(
          error.response.data.error ||
            "You already have this badge in your collection"
        );
      } else {
        setError("Failed to add badge. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h3>Discover New Badges</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter 5-digit code"
          maxLength={5}
          className={styles.input}
          disabled={loading}
        />
        <button
          type="submit"
          className={styles.button}
          disabled={loading || code.length !== 5}
        >
          {loading ? "Adding..." : "Add Badge"}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}
      {success && (
        <div className={styles.success}>
          <p>Successfully added "{success.name}" to your collection!</p>
        </div>
      )}
    </div>
  );
}
