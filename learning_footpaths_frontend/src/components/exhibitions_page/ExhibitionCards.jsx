import { useNavigate } from "react-router-dom";
import styles from "../../css/exhibitions_page/ExhibitionCards.module.css";

export default function ExhibitionCards({
  exhibitions,
  footpathName,
  completedExhibitions,
  selectedGrade,
  customBadge,
}) {
  const navigate = useNavigate();

  const handleCardClick = (exhibition) => {
    navigate("/exhibition-quiz", {
      state: {
        exhibitionId: exhibition.id,
        exhibitionTitle: exhibition.title,
        description: exhibition.description,
        footpathName: footpathName,
        customBadge: customBadge,
        selectedGrade: selectedGrade,
        footpathId: exhibition.footpathId,
      },
    });
  };

  const isCompleted = (exhibitionId) => {
    return completedExhibitions.includes(exhibitionId);
  };

  return (
    <div
      className={`${styles.container} ${
        exhibitions.length === 1 ? styles.singleCard : ""
      }`}
    >
      {exhibitions.map((exhibition) => (
        <div
          key={exhibition.id}
          className={`${styles.card} ${
            isCompleted(exhibition.id) ? styles.completed : ""
          }`}
          onClick={() => handleCardClick(exhibition)}
        >
          <h3 className={styles.title}>{exhibition.title}</h3>
          <p className={styles.description}>{exhibition.description}</p>
          {isCompleted(exhibition.id) ? (
            <span className={styles.checkmark}>✓</span>
          ) : (
            <span className={styles.arrow}>→</span>
          )}
        </div>
      ))}
    </div>
  );
}
