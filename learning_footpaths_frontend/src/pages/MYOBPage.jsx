import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import styles from "../css/badgemaker_page/BadgeMaker.module.css";

export default function MyobPage() {
  const navigate = useNavigate();
  const [selectedGrade, setSelectedGrade] = useState("");
  const [badgeName, setBadgeName] = useState("");
  const [description, setDescription] = useState("");
  const [exhibitions, setExhibitions] = useState([]);
  const [selectedExhibitions, setSelectedExhibitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const gradeLevels = [
    { value: "K", label: "Kindergarten" },
    ...Array.from({ length: 12 }, (_, i) => ({
      value: String(i + 1),
      label: `Grade ${i + 1}`,
    })),
  ];

  // Fetch available exhibitions when grade level changes
  useEffect(() => {
    const fetchExhibitions = async () => {
      if (!selectedGrade) return;

      try {
        setLoading(true);
        setError("");
        const response = await axios.get(
          `http://localhost:8888/api/exhibitions-by-grade/${selectedGrade}`,
          { withCredentials: true }
        );
        setExhibitions(response.data);
      } catch (err) {
        console.error("Error fetching exhibitions:", err);
        setError(err.response?.data?.error || "Failed to load exhibitions");
      } finally {
        setLoading(false);
      }
    };

    fetchExhibitions();
  }, [selectedGrade]);

  const handleExhibitionToggle = (exhibitionId) => {
    setSelectedExhibitions((prev) => {
      if (prev.includes(exhibitionId)) {
        return prev.filter((id) => id !== exhibitionId);
      }
      return [...prev, exhibitionId];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !badgeName ||
      !description ||
      !selectedGrade ||
      selectedExhibitions.length === 0
    ) {
      setError(
        "Please fill in all required fields and select at least one exhibition"
      );
      return;
    }

    try {
      const badgeData = {
        name: badgeName,
        description: description,
        grade_level: selectedGrade,
        exhibitions: selectedExhibitions,
      };

      await axios.post("http://localhost:8888/api/custom-badges", badgeData, {
        withCredentials: true,
      });

      // Redirect to badges page on success
      navigate("/badges");
    } catch (err) {
      console.error("Error creating badge:", err);
      setError("Failed to create badge");
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Create Your Custom Badge</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Badge Name</label>
            <input
              type="text"
              value={badgeName}
              onChange={(e) => setBadgeName(e.target.value)}
              placeholder="Enter badge name"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter badge description"
              className={styles.textarea}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Grade Level</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className={styles.select}
            >
              <option value="">Select Grade Level</option>
              {gradeLevels.map((grade) => (
                <option key={grade.value} value={grade.value}>
                  {grade.label}
                </option>
              ))}
            </select>
          </div>

          {selectedGrade && (
            <div className={styles.formGroup}>
              <label>Select Exhibitions</label>
              {loading ? (
                <p>Loading exhibitions...</p>
              ) : (
                <div className={styles.exhibitionsList}>
                  {exhibitions.map((exhibition) => (
                    <label key={exhibition.id} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={selectedExhibitions.includes(exhibition.id)}
                        onChange={() => handleExhibitionToggle(exhibition.id)}
                      />
                      {exhibition.title}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.submitButton}>
            Create Badge
          </button>
        </form>
      </div>
    </div>
  );
}
