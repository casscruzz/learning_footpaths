import ExhibitionCards from "./ExhibitionCards";
import ExhibitionPageText from "./ExhibitionPageText";
import GradeLevelToggle from "./GradeLevelToggle";
import ProgressBarSection from "./ProgressBarSection";

export default function ExhibitionPageComponent() {
  return (
    <div>
      <h1>Exhibition Page</h1>
      <ExhibitionPageText />
      <ProgressBarSection />
      <GradeLevelToggle />
      <ExhibitionCards />
    </div>
  );
}
