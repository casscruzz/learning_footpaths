import ExhibitionCard from "./ExhibitionCard";
import styles from "../../css/exhibitions_page/ExhibitionCard.module.css";

export default function ExhibitionCards({
  exhibitions,
  footpathName,
  completedExhibitions,
}) {
  return (
    <div className={styles.cardHolder}>
      {exhibitions?.map((exhibition) => (
        <ExhibitionCard
          key={exhibition.id}
          id={exhibition.id}
          title={exhibition.title}
          description={exhibition.description}
          footpathName={footpathName} // Make sure this is passed
          footpathId={exhibition.footpathId}
          isCompleted={completedExhibitions?.includes(exhibition.id)}
        />
      ))}
    </div>
  );
}
