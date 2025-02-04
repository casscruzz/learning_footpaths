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
  const { selectedFootpath, customBadge } = location.state || {};

  const [exhibitions, setExhibitions] = useState([]);
  const [filteredExhibitions, setFilteredExhibitions] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(
    customBadge?.grade_level || null
  );
  const [bigQuestion, setBigQuestion] = useState("");
  const [footpathId, setFootpathId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [completedExhibitions, setCompletedExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        if (customBadge) {
          // For custom badges, need to fetch updated badge data
          const response = await axios.get(
            `http://localhost:8888/api/custom-badge/${customBadge.id}`,
            { withCredentials: true }
          );
          const updatedBadge = response.data;
          setExhibitions(updatedBadge.exhibitions);
          setBigQuestion(updatedBadge.description);
          setFootpathId(updatedBadge.id);
        } else if (selectedFootpath) {
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
        }
      } catch (error) {
        console.error("Error fetching exhibitions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExhibitions();
  }, [selectedFootpath, customBadge]);

  // Fetch completed exhibitions
  useEffect(() => {
    const fetchCompletedExhibitions = async () => {
      try {
        const response = await axios.get(
          customBadge
            ? `http://localhost:8888/api/custom-badge/${customBadge.id}/completed-exhibitions`
            : "http://localhost:8888/api/user/completed-exhibitions",
          { withCredentials: true }
        );
        setCompletedExhibitions(response.data.map((ex) => ex.exhibition_id));
      } catch (error) {
        console.error("Error fetching completed exhibitions:", error);
      }
    };

    if (isAuthenticated) {
      fetchCompletedExhibitions();
    }
  }, [isAuthenticated, customBadge]);

  // Filter exhibitions by grade level (only for regular footpaths)
  useEffect(() => {
    if (customBadge) {
      setFilteredExhibitions(exhibitions);
    } else if (selectedGrade) {
      const filtered = exhibitions.filter((exhibition) =>
        exhibition.grade_levels.includes(selectedGrade)
      );
      setFilteredExhibitions(filtered);
    } else {
      setFilteredExhibitions(exhibitions);
    }
  }, [selectedGrade, exhibitions, customBadge]);

  if (loading) {
    return <div>Loading exhibitions...</div>;
  }

  return (
    <div>
      <Header />
      <div className="page-container">
        <ExhibitionPageText bigQuestion={bigQuestion} />

        {isAuthenticated && footpathId && !customBadge && (
          <ProgressBarSection footpathId={footpathId} />
        )}

        {!customBadge && (
          <GradeLevelToggle
            selectedGrade={selectedGrade}
            onGradeChange={setSelectedGrade}
          />
        )}

        <ExhibitionCards
          exhibitions={filteredExhibitions}
          footpathName={selectedFootpath}
          completedExhibitions={completedExhibitions}
          selectedGrade={selectedGrade}
          customBadge={customBadge}
        />
      </div>
    </div>
  );
}
