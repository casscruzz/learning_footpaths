export default function GradeLevelToggle({ gradeLevels }) {
  const gradeLevelsList = [
    "Kindergarten",
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "Grade 11",
    "Grade 12",
  ];

  return (
    <div>
      <h3>Grade Levels</h3>
      <div>
        <select defaultValue="">
          <option value="" disabled>
            Select grade level
          </option>
          {gradeLevelsList.map((grade, index) => (
            <option key={index} value={grade}>
              {grade}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
