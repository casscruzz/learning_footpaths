import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ExhibitionCards from "../components/exhibitions_page/ExhibitionCards";
import ExhibitionPageText from "../components/exhibitions_page/ExhibitionPageText";
import GradeLevelToggle from "../components/exhibitions_page/GradeLevelToggle";
import ProgressBarSection from "../components/exhibitions_page/ProgressBarSection";
import Header from "../components/Header";
import "../css/App.css";

export default function ExhibitionPageComponent() {
  // fetch exhibitions from database
  const location = useLocation();
  const { footpathId, footpathName, bigQuestion } = location.state || {};
  const [exhibitions, setExhibitions] = useState([]);

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const response = await fetch(
          `http://localhost:8888/api/exhibitions/${footpathId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setExhibitions(data);
      } catch (error) {
        console.error("Error fetching exhibitions:", error);
      }
    };

    if (footpathId) {
      fetchExhibitions();
    }
  }, [footpathId]);
  return (
    <div>
      <Header />
      <div className="page-container">
        <ExhibitionPageText bigQuestion={bigQuestion} />
        <ProgressBarSection />
        <GradeLevelToggle />
        <ExhibitionCards exhibitions={exhibitions} />
      </div>
    </div>
  );
}
