import pandas as pd
from database import SessionLocal, engine, Base
from models import LearningFootpath, Exhibition, Question


def populate_database():
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Create session
    db = SessionLocal()

    try:
        # First, create the footpaths with their big questions
        footpaths_data = {
            "Green": "How can nature teach and inspire us to live more sustainably?",
            "The Mind Museum Highlights": "What if the mind could unlock the secrets of the universe?",
            "The Wonders of Modern Medicine": "How did science make the impossible possible in healing?",
            "Convergence: Science + Art": "What happens when imagination and science collide?",
            "I am moving in a moving universe": "How did physics turn our wildest ideas into reality?",
        }

        footpaths = {}
        for name, question in footpaths_data.items():
            footpath = LearningFootpath(name=name, big_question=question)
            db.add(footpath)
            footpaths[name] = footpath

        try:
            # Read the CSV file
            data_csv = "/Users/mrgxcrz/Desktop/University/Fall 2024/Capstone/learning_footpaths/exhibition_questions/[CAPSTONE] MCQ Questions and Answers  - DO NOT OPEN Unified Database (for Coding).csv"
            df = pd.read_csv(data_csv)
            df = df.fillna("")

            # Process each unique exhibition
            processed_exhibitions = {}

            for _, row in df.iterrows():
                exhibition_title = row["Exhibition Title"]

                # Skip if exhibition is already processed
                if exhibition_title not in processed_exhibitions:
                    # Create exhibition
                    exhibition = Exhibition(
                        title=exhibition_title, big_question=row["Big Question"]
                    )
                    processed_exhibitions[exhibition_title] = exhibition
                    db.add(exhibition)

                # Get the exhibition (either newly created or from processed ones)
                exhibition = processed_exhibitions[exhibition_title]

                # Split question options (assuming they're in one column)
                options = (
                    str(row["Question Options"]).split("\n")
                    if pd.notna(row["Question Options"])
                    else ["", "", "", ""]
                )
                while len(options) < 4:  # Ensure we have 4 options
                    options.append("")

                # Create question with the correct column names
                question = Question(
                    exhibition_id=exhibition.id,
                    text=row["Questions "].strip(),  # Note the space after "Questions"
                    option_a=options[0],
                    option_b=options[1],
                    option_c=options[2],
                    option_d=options[3],
                    correct_answer=row["Correct Answer"],
                )
                db.add(question)

            db.commit()
            print("Database populated successfully!")
        except Exception as e:
            print(f"An error occurred: {e}")
            db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    populate_database()
