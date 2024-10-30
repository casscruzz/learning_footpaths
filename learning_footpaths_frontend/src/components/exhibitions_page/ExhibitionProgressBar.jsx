import styles from "../../css/exhibitions_page/ProgressBar.module.css";
// export default function ExhibitionProgressBar({ value, max }) {
//   // simulating progress
//   const [progress, setProgress] = useState(0);

//   const simulateProgress = () => {
//     setProgress(progress + 10);
//   }
//   return (
//     <div className={styles.progress_bar}>
//       <h3>Progress</h3>
//       <div
//         className={styles.progress_bar_completed}}
//         style={{ width: `${(value / max) * 100}%` }}
//       ></div>
//     </div>
//   );
// }

export default function ProgressBar({ value, max }) {
  return (
    <div className={styles.progress_bar}>
      <div
        className={styles.progress_bar_completed}
        style={{ width: `${(value / max) * 100}%` }}
      ></div>
      {max - value} points left until you complete the badge
    </div>
  );
}
