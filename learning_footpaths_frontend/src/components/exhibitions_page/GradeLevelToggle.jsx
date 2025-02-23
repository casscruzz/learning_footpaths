import styles from "../../css/exhibitions_page/GradeLevelToggle.module.css";
import { useEffect } from "react";
import axios from "axios";

export default function GradeLevelToggle({ selectedGrade, onGradeChange }) {
  const gradeLevelsList = [
    { display: "Kindergarten", value: "K" },
    { display: "Grade 1", value: "1" },
    { display: "Grade 2", value: "2" },
    { display: "Grade 3", value: "3" },
    { display: "Grade 4", value: "4" },
    { display: "Grade 5", value: "5" },
    { display: "Grade 6", value: "6" },
    { display: "Grade 7", value: "7" },
    { display: "Grade 8", value: "8" },
    { display: "Grade 9", value: "9" },
    { display: "Grade 10", value: "10" },
    { display: "Grade 11", value: "11" },
    { display: "Grade 12", value: "12" },
  ];

  useEffect(() => {
    // Fetch user's grade level when component mounts
    const fetchUserGradeLevel = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8888/api/user/grade-level",
          {
            withCredentials: true,
          }
        );
        if (response.data.grade_level) {
          onGradeChange(response.data.grade_level);
        }
      } catch (error) {
        console.error("Error fetching user grade level:", error);
      }
    };

    fetchUserGradeLevel();
  }, []);

  const handleChange = (event) => {
    const value = event.target.value;
    onGradeChange(value === "" ? null : value);
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>
        <span>
          What is your <span className={styles.bold}>Grade Level</span>?
        </span>
      </label>
      <select
        className={styles.select}
        value={selectedGrade || ""}
        onChange={handleChange}
      >
        <option value="">All Grades</option>
        {gradeLevelsList.map((grade) => (
          <option key={grade.value} value={grade.value}>
            {grade.display}
          </option>
        ))}
      </select>
    </div>
  );
}
