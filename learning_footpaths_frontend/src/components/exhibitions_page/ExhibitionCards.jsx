import React from "react";
import ExhibitionCard from "./ExhibitionCard";
import styles from "../../css/exhibitions_page/ExhibitionCards.module.css";
export default function ExhibitionCards({ exhibitions }) {
  return (
    <div className={styles.exhibition_cards_container}>
      {exhibitions &&
        exhibitions.map((exhibition) => (
          <ExhibitionCard
            key={exhibition.id}
            title={exhibition.title}
            description={exhibition.big_question}
          />
        ))}
    </div>
  );
}
