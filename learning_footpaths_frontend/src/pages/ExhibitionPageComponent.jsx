// ExhibitionPageComponent.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import Header from "../components/Header";
import ExhibitionPageText from "../components/exhibitions_page/ExhibitionPageText.jsx";
import ProgressBarSection from "../components/exhibitions_page/ProgressBarSection.jsx";
import GradeLevelToggle from "../components/exhibitions_page/GradeLevelToggle.jsx";
import ExhibitionCards from "../components/exhibitions_page/ExhibitionCards.jsx";

export default function ExhibitionPageComponent() {
  const location = useLocation();
  const { selectedFootpath } = location.state || {};
  const [exhibitions, setExhibitions] = useState([]);
  const [bigQuestion, setBigQuestion] = useState("");

  useEffect(() => {
    const fetchExhibitions = async () => {
      if (selectedFootpath) {
        try {
          const response = await axios.get(
            `http://localhost:8888/api/exhibitions/${selectedFootpath}`,
            { withCredentials: true }
          );
          setExhibitions(response.data);
        } catch (error) {
          console.error("Error fetching exhibitions:", error);
        }
      }
    };

    fetchExhibitions();
  }, [selectedFootpath]);

  return (
    <div>
      <Header />
      <div className="page-container">
        <ExhibitionPageText bigQuestion={bigQuestion} />
        <ProgressBarSection />
        <GradeLevelToggle />
        <ExhibitionCards
          exhibitions={exhibitions}
          footpathName={selectedFootpath}
        />
      </div>
    </div>
  );
}
