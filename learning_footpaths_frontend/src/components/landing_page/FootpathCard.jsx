import styles from "../../css/landing_page/FootpathCard.module.css";
import { useNavigate } from "react-router-dom";

// const FootpathCard = ({ key, title, question }) => {
//   const navigate = useNavigate();

//   const handleClick = () => {
//     navigate("/exhibitions", {
//       state: { footpathName: title, bigQuestion: question },
//     });
//   };

const FootpathCard = ({ title, question }) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      await axios.post(
        "http://localhost:8888/api/track-last-footpath",
        { footpath_name: title },
        { withCredentials: true }
      );
      navigate("/exhibitions", { state: { selectedFootpath: title } });
    } catch (error) {
      console.error("Error tracking footpath:", error);
      // Still navigate even if tracking fails
      navigate("/exhibitions", { state: { selectedFootpath: title } });
    }
  };
  return (
    <div onClick={handleClick}>
      {/* <button className={styles.footpathButton} onClick={handleClick}> */}
      <button className={styles.footpathButton}>{question}</button>
    </div>
  );
};

export default FootpathCard;
