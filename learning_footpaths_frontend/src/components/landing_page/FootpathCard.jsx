import styles from "../../css/landing_page/FootpathCard.module.css";
import { useNavigate } from "react-router-dom";

const FootpathCard = ({ key, title, question }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/exhibitions", {
      state: { footpathName: title, bigQuestion: question },
    });
  };
  return (
    <div>
      <button className={styles.footpathButton} onClick={handleClick}>
        {question}
      </button>
    </div>
  );
};

export default FootpathCard;
