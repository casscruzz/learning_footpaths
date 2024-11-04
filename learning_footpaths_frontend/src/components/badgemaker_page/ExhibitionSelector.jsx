import React, { useState } from "react";

const sampleExhibitions = [
  { name: "Exhibition 1", question: "What is the impact of climate change?" },
  { name: "Exhibition 2", question: "How does technology shape our future?" },
  { name: "Exhibition 3", question: "What are the wonders of the universe?" },
  { name: "Exhibition 4", question: "How do ecosystems function?" },
  {
    name: "Exhibition 5",
    question: "What is the history of human civilization?",
  },
];

export default function ExhibitionSelector() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExhibitions, setSelectedExhibitions] = useState([]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCheckboxChange = (exhibition) => {
    setSelectedExhibitions((prevSelected) =>
      prevSelected.includes(exhibition)
        ? prevSelected.filter((item) => item !== exhibition)
        : [...prevSelected, exhibition]
    );
  };

  const filteredExhibitions = sampleExhibitions.filter((exhibition) =>
    exhibition.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h3>Select 5-10 Exhibitions below</h3>
      <input
        type="text"
        placeholder="Search exhibitions..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <ul>
        {filteredExhibitions.map((exhibition) => (
          <li key={exhibition.name}>
            <label>
              <input
                type="checkbox"
                checked={selectedExhibitions.includes(exhibition.name)}
                onChange={() => handleCheckboxChange(exhibition.name)}
              />
              {exhibition.name}
              <br />
              <small>{exhibition.question}</small>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
