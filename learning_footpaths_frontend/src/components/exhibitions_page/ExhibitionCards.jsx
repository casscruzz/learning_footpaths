import ExhibitionCard from "./ExhibitionCard";
import styles from "../../css/exhibitions_page/ExhibitionCard.module.css";

export default function ExhibitionCards({
  exhibitions,
  footpathName,
  completedExhibitions,
  selectedGrade,
}) {
  return (
    <div className={styles.cardHolder}>
      {exhibitions?.map((exhibition) => (
        <ExhibitionCard
          key={exhibition.id}
          id={exhibition.id}
          title={exhibition.title}
          description={exhibition.description}
          footpathName={footpathName}
          footpathId={exhibition.footpathId}
          isCompleted={completedExhibitions?.includes(exhibition.id)}
          selectedGrade={selectedGrade}
        />
      ))}
    </div>
  );
}
