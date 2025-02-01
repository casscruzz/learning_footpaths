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
  const [filteredExhibitions, setFilteredExhibitions] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [bigQuestion, setBigQuestion] = useState("");
  const [footpathId, setFootpathId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // fetching completed exhibitions for the current user
  const [completedExhibitions, setCompletedExhibitions] = useState([]);

  // fetching completed exhibitions for the current user
  useEffect(() => {
    const fetchCompletedExhibitions = async () => {
      try {
        const completedResponse = await axios.get(
          "http://localhost:8888/api/user/completed-exhibitions",
          { withCredentials: true }
        );
        setCompletedExhibitions(
          completedResponse.data.map((exhibition) => exhibition.exhibition_id)
        );
      } catch (error) {
        console.error("Error fetching completed exhibitions:", error);
        setCompletedExhibitions([]);
      }
    };

    fetchCompletedExhibitions();
  }, []);
  // Add new useEffect to check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:8888/@me", {
          withCredentials: true,
        });
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchExhibitions = async () => {
      if (selectedFootpath) {
        try {
          const response = await axios.get(
            `http://localhost:8888/api/exhibitions/${selectedFootpath}`,
            { withCredentials: true }
          );
          setExhibitions(response.data);

          const footpathResponse = await axios.get(
            `http://localhost:8888/api/footpath-id/${selectedFootpath}`,
            { withCredentials: true }
          );
          setFootpathId(footpathResponse.data.footpath_id);
        } catch (error) {
          console.error("Error fetching exhibitions:", error);
        }
      }
    };

    fetchExhibitions();
  }, [selectedFootpath]);

  // Add new useEffect for filtering exhibitions
  useEffect(() => {
    if (selectedGrade) {
      setFilteredExhibitions(
        exhibitions.filter((exhibition) =>
          exhibition.grade_levels.includes(selectedGrade)
        )
      );
    } else {
      setFilteredExhibitions(exhibitions);
    }
  }, [selectedGrade, exhibitions]);

  const handleGradeChange = (grade) => {
    setSelectedGrade(grade);
  };

  return (
    <div>
      <Header />
      <div className="page-container">
        <ExhibitionPageText bigQuestion={bigQuestion} />
        {isAuthenticated && footpathId && (
          <ProgressBarSection footpathId={footpathId} />
        )}
        <GradeLevelToggle
          selectedGrade={selectedGrade}
          onGradeChange={handleGradeChange}
        />
        <ExhibitionCards
          exhibitions={filteredExhibitions}
          footpathName={selectedFootpath}
          completedExhibitions={completedExhibitions}
        />
      </div>
    </div>
  );
}
