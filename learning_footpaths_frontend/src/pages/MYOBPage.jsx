import CustomBadgeIcon from "../components/badgemaker_page/CustomBadgeIcon";
import ExhibitionSelector from "../components/badgemaker_page/ExhibitionSelector";
import Header from "../components/Header";

export default function MyobPage() {
  const gradeLevels = [
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
      <Header />
      <h1>Make a Badge!</h1>
      <CustomBadgeIcon />
      <p>Select Grade Level</p>
      <select>
        <option value="" disabled selected>
          Select a Grade Level
        </option>
        {gradeLevels.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>
      <ExhibitionSelector />
      <button>Share Challenge</button>
    </div>
  );
}
