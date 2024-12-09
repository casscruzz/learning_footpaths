import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../css/exhibitions_page/ExhibitionCard.module.css";

const ExhibitionCard = ({ id, title, description, footpathName }) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      await axios.post(
        "http://localhost:8888/api/track-last-footpath",
        { footpath_name: footpathName },
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
        footpathName,
        returnPath: "/exhibitions",
      },
    });
  };

  return (
    <div className={styles.exhibition_card} onClick={handleClick}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

export default ExhibitionCard;
