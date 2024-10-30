import ProgressBar from "./ExhibitionProgressBar";

export default function ProgressBarSection() {
  return (
    <div>
      <h3>Progress</h3>
      <ProgressBar value={50} max={100} />
    </div>
  );
}
