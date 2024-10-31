import ExhibitionCards from "../components/exhibitions_page/ExhibitionCards";
import ExhibitionPageText from "../components/exhibitions_page/ExhibitionPageText";
import GradeLevelToggle from "../components/exhibitions_page/GradeLevelToggle";
import ProgressBarSection from "../components/exhibitions_page/ProgressBarSection";
import Header from "../components/Header";

export default function ExhibitionPageComponent() {
  return (
    <div>
      <Header />
      <ExhibitionPageText />
      <ProgressBarSection />
      <GradeLevelToggle />
      <ExhibitionCards />
    </div>
  );
}
