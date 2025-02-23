import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../css/landing_page/FootpathCards.module.css";

export default function FootpathCards() {
  const [footpaths, setFootpaths] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFootpaths = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8888/api/big-questions"
        );
        const data = response.data;
        // Convert the object into an array of footpath objects
        const footpathArray = Object.entries(data).map(
          ([name, bigQuestion]) => ({
            name,
            bigQuestion,
          })
        );
        setFootpaths(footpathArray);
      } catch (error) {
        console.error("Error fetching footpaths:", error);
      }
    };

    fetchFootpaths();
  }, []);

  const handleCardClick = (footpathName) => {
    navigate("/exhibitions", { state: { selectedFootpath: footpathName } });
  };

  return (
    <div className={styles.cardHolder}>
      {footpaths.map((footpath, index) => (
        <div
          key={footpath.name}
          className={styles.card}
          onClick={() => handleCardClick(footpath.name)}
        >
          <h2 className={styles.bigQuestion}>{footpath.bigQuestion}</h2>
          <p className={styles.footpathName}>{footpath.name}</p>
          <span className={styles.arrow}>→</span>
        </div>
      ))}
    </div>
  );
}
