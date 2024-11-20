import ExhibitionCards from "../components/exhibitions_page/ExhibitionCards";
import ExhibitionPageText from "../components/exhibitions_page/ExhibitionPageText";
import GradeLevelToggle from "../components/exhibitions_page/GradeLevelToggle";
import ProgressBarSection from "../components/exhibitions_page/ProgressBarSection";
import Header from "../components/Header";
import "../css/App.css";

export default function ExhibitionPageComponent() {
  return (
    <div>
      <Header />
      <div className="page-container">
        <ExhibitionPageText />
        <ProgressBarSection />
        <GradeLevelToggle />
        <ExhibitionCards />
      </div>
    </div>
  );
}
