import ExhibitionCard from "./ExhibitionCard";
export default function ExhibitionCards({ exhibitions }) {
  // const sampleExhibitions = [
  //   {
  //     id: 1,
  //     title: "Exhibition 1",
  //     description: "Description for Exhibition 1",
  //   },
  //   {
  //     id: 2,
  //     title: "Exhibition 2",
  //     description: "Description for Exhibition 2",
  //   },
  //   {
  //     id: 3,
  //     title: "Exhibition 3",
  //     description: "Description for Exhibition 3",
  //   },
  //   {
  //     id: 4,
  //     title: "Exhibition 4",
  //     description: "Description for Exhibition 4",
  //   },
  //   {
  //     id: 5,
  //     title: "Exhibition 5",
  //     description: "Description for Exhibition 5",
  //   },
  //   {
  //     id: 6,
  //     title: "Exhibition 6",
  //     description: "Description for Exhibition 6",
  //   },
  //   {
  //     id: 7,
  //     title: "Exhibition 7",
  //     description: "Description for Exhibition 7",
  //   },
  //   {
  //     id: 8,
  //     title: "Exhibition 8",
  //     description: "Description for Exhibition 8",
  //   },
  // ];

  // return (
  //   <div>
  //     {sampleExhibitions.map((exhibition) => (
  //       <ExhibitionCard
  //         key={exhibition.id}
  //         title={exhibition.title}
  //         description={exhibition.description}
  //       />
  //     ))}
  //   </div>
  return (
    <div className={styles.exhibition_cards_container}>
      {exhibitions.map((exhibition, index) => (
        <ExhibitionCard
          key={index}
          title={exhibition.title}
          description={exhibition.description}
        />
      ))}
    </div>
  );
}
