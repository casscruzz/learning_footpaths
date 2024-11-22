import pandas as pd
from sqlalchemy import inspect
from database import SessionLocal, engine, Base
from models import LearningFootpath, Exhibition, Question


def create_tables():
    print("Creating tables...")
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")


def check_tables_exist():
    inspector = inspect(engine)
    required_tables = {
        "learning_footpaths",
        "exhibitions",
        "questions",
        "footpath_exhibition",
    }
    existing_tables = set(inspector.get_table_names())
    return required_tables.issubset(existing_tables)


def reset_and_populate_db():
    # First, ensure tables exist
    if not check_tables_exist():
        create_tables()

    # Create session
    db = SessionLocal()

    try:
        # Clear existing data
        print("Clearing existing data...")
        db.query(Question).delete()
        db.query(Exhibition).delete()
        db.query(LearningFootpath).delete()
        db.commit()

        # Read the CSV files
        print("Reading CSV files...")
        relations_df = pd.read_csv(
            "../exhibition_questions/exhibition_footpath_relations.csv"
        )
        questions_df = pd.read_csv(
            "../exhibition_questions/exhibition_quiz_questions.csv"
        )
        big_questions_df = pd.read_csv(
            "../exhibition_questions/exhibition_big_questions.csv"
        )

        # Strip any trailing spaces from column names and values
        questions_df.columns = questions_df.columns.str.strip()
        relations_df["Exhbition Title"] = relations_df["Exhbition Title"].str.strip()
        relations_df["Footpath Title"] = relations_df["Footpath Title"].str.strip()
        big_questions_df["Exhibition"] = big_questions_df["Exhibition"].str.strip()

        # First, create the footpaths with their big questions
        print("Creating footpaths...")
        footpaths_data = {
            "Green": "How can nature teach and inspire us to live more sustainably?",
            "The Mind Museum Highlights": "What if the mind could unlock the secrets of the universe?",
            "The Wonders of Modern Medicine": "How did science make the impossible possible in healing?",
            "Convergence: Science + Art": "What happens when imagination and science collide?",
            "I am moving in a moving universe": "How did physics turn our wildest ideas into reality?",
        }

        footpaths = {}
        for name, question in footpaths_data.items():
            try:
                footpath = LearningFootpath(name=name, big_question=question)
                db.add(footpath)
                footpaths[name] = footpath
            except Exception as e:
                print(f"Error creating footpath {name}: {e}")
                raise

        db.commit()  # Commit footpaths first

        # Process exhibitions and their big questions
        print("Creating exhibitions...")
        processed_exhibitions = {}

        for _, row in big_questions_df.iterrows():
            exhibition_title = row["Exhibition"].strip()
            big_question = row["Big Question"].strip()

            if exhibition_title not in processed_exhibitions:
                try:
                    exhibition = Exhibition(
                        title=exhibition_title, big_question=big_question
                    )
                    db.add(exhibition)
                    db.flush()  # Get ID without committing
                    processed_exhibitions[exhibition_title] = exhibition
                except Exception as e:
                    print(f"Error creating exhibition {exhibition_title}: {e}")
                    raise

        db.commit()  # Commit exhibitions

        # Process relations
        print("Creating relations...")
        for _, row in relations_df.iterrows():
            exhibition = processed_exhibitions.get(row["Exhbition Title"])
            footpath = footpaths.get(row["Footpath Title"])
            if exhibition and footpath:
                try:
                    exhibition.footpaths.append(footpath)
                except Exception as e:
                    print(
                        f"Error creating relation between {row['Exhbition Title']} and {row['Footpath Title']}: {e}"
                    )
                    raise

        # Process questions
        print("Creating questions...")
        for _, row in questions_df.iterrows():
            exhibition = processed_exhibitions.get(row["Exhibition Title"])
            if exhibition and pd.notna(row["Questions"]):
                try:
                    question = Question(
                        exhibition_id=exhibition.id,
                        text=row["Questions"].strip(),
                        option_a=row["Option 1"].strip(),
                        option_b=row["Option 2"].strip(),
                        option_c=row["Option 3"].strip(),
                        option_d=row["Option 4"].strip(),
                        correct_answer=row["Correct Answer"].strip(),
                    )
                    db.add(question)
                except Exception as e:
                    print(
                        f"Error creating question for exhibition {row['Exhibition Title']}: {e}"
                    )
                    raise

        db.commit()
        print("Database populated successfully!")

    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    try:
        reset_and_populate_db()
    except Exception as e:
        print(f"Failed to reset and populate database: {e}")
