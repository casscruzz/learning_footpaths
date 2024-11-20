import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from sqlalchemy import text

import os

# Database connection (update with your credentials if needed)
# Load environment variables from .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

# Load the CSV file
csv_path = "/Users/mrgxcrz/Desktop/University/Fall 2024/Capstone/learning_footpaths/exhibition_questions/[CAPSTONE] MCQ Questions and Answers  - DO NOT OPEN Unified Database (for Coding).csv"  # Update this with the correct path
data = pd.read_csv(csv_path)

# Rename columns for clarity (match your schema)
data.columns = [
    "Exhibition Title",
    "Big Question",
    "Questions",
    "Option A",
    "Option B",
    "Option C",
    "Option D",
    "Correct Answer",
    "Learning Footpaths",
]

# Drop rows that are completely empty (e.g., NaN headers)
data = data.dropna(subset=["Exhibition Title", "Questions"])

# Populate the Learning Footpaths table
unique_footpaths = (
    data["Learning Footpaths"].str.split(",").explode().str.strip().drop_duplicates()
)

for footpath in unique_footpaths:
    session.execute(
        text(
            "INSERT INTO learning_footpaths (name, big_question) VALUES (:name, :big_question) ON CONFLICT DO NOTHING"
        ),
        {
            "name": footpath,
            "big_question": "PLACEHOLDER",  # Replace with actual question if you want
        },
    )
session.commit()

# Populate the Exhibitions table
unique_exhibitions = data[["Exhibition Title", "Learning Footpaths"]].drop_duplicates()
for _, row in unique_exhibitions.iterrows():
    exhibition_title = row["Exhibition Title"]
    footpaths = [fp.strip() for fp in row["Learning Footpaths"].split(",")]
    for footpath in footpaths:
        session.execute(
            text(
                """
                INSERT INTO exhibitions (title, footpath_id)
                SELECT :title, id FROM learning_footpaths WHERE name = :footpath
                ON CONFLICT DO NOTHING
                """
            ),
            {"title": exhibition_title, "footpath": footpath},
        )
session.commit()

# Populate the Questions table
for _, row in data.iterrows():
    session.execute(
        text(
            """
            INSERT INTO questions (text, option_a, option_b, option_c, option_d, correct_answer, exhibition_id)
            SELECT :text, :option_a, :option_b, :option_c, :option_d, :correct_answer, id
            FROM exhibitions WHERE title = :exhibition_title
            """
        ),
        {
            "text": row["Questions"],
            "option_a": row["Option A"],
            "option_b": row["Option B"],
            "option_c": row["Option C"],
            "option_d": row["Option D"],
            "correct_answer": row["Correct Answer"],
            "exhibition_title": row["Exhibition Title"],
        },
    )
session.commit()

print("Database populated successfully!")
