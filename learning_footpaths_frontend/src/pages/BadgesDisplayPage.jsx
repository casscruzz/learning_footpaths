import IncompleteBadgeCard from "../components/badges_page/IncompleteBadgeCard";
import Header from "../components/Header";
import CompletedBadgeCard from "../components/badges_page/CompletedBadgeCard";
export default function BadgesDisplayPage() {
  {
    /* TODO: Display as a scrollable gallery of badges (grid style) */
  }
  const badges = [
    {
      title: "JavaScript Beginner",
      points: 10,
      completed: true,
      dateEarned: "2023-01-15",
    },
    {
      title: "React Developer",
      points: 20,
      completed: false,
      dateEarned: null,
    },
    {
      title: "CSS Master",
      points: 15,
      completed: true,
      dateEarned: "2023-03-22",
    },
    { title: "HTML Expert", points: 5, completed: false, dateEarned: null },
  ];

  return (
    <div>
      <Header />
      <h1>My Badges</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        {badges.map((badge, index) =>
          badge.completed ? (
            <CompletedBadgeCard
              key={index}
              title={badge.title}
              points={badge.points}
              dateEarned={badge.dateEarned}
            />
          ) : (
            <IncompleteBadgeCard
              key={index}
              title={badge.title}
              points={badge.points}
            />
          )
        )}
      </div>
    </div>
  );
}
