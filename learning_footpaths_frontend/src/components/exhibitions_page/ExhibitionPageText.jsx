import styles from "../../css/exhibitions_page/ExhibitionPageText.module.css";

export default function ExhibitionPageText({
  bigQuestion,
  selectedFootpath,
  customBadge,
}) {
  // Determine the title based on whether it's a custom badge or footpath
  const title = customBadge ? customBadge.name : selectedFootpath;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title || "Exhibition"}</h1>
      {!customBadge && bigQuestion && (
        <p className={styles.bigQuestion}>{bigQuestion}</p>
      )}
    </div>
  );
}
