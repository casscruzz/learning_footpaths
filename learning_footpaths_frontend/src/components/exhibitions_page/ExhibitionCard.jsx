import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../css/exhibitions_page/ExhibitionCard.module.css";

const ExhibitionCard = ({
  id,
  title,
  description,
  footpathName, // Make sure we're passing footpathName
  footpathId,
  isCompleted,
}) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      await axios.post(
        "http://localhost:8888/api/track-last-footpath",
        { footpath_name: footpathName }, // Use footpathName here
        { withCredentials: true }
      );
    } catch (error) {
      console.log("Error tracking footpath:", error);
    }

    navigate("/exhibition-quiz", {
      state: {
        exhibitionId: id,
        exhibitionTitle: title,
        exhibitionDescription: description,
        footpathName, // Make sure to pass footpathName in navigation
        returnPath: "/exhibitions",
      },
    });
  };

  return (
    <div
      className={`${styles.exhibition_card} ${
        isCompleted ? styles.completed : ""
      }`}
      onClick={handleClick}
    >
      <h2>{title}</h2>
      <p>{description}</p>
      {isCompleted && (
        <div className={styles.completedIndicator}>✓ Completed</div>
      )}
    </div>
  );
};

export default ExhibitionCard;
