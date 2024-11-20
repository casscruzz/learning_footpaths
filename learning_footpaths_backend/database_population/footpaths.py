from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv


# Database connection setup
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

# Extract unique learning footpaths and their big questions
footpath_questions = {
    "Green": "How can nature teach and inspire us to live more sustainably?",
    "The Mind Museum Highlights": "What if the mind could unlock the secrets of the universe?",
    "The Wonders of Modern Medicine": "How did science make the impossible possible in healing?",
    "Convergence: Science + Art": "What happens when imagination and science collide?",
    "I am moving in a moving universe": "How did physics turn our wildest ideas into reality?",
}

# Insert each footpath into the database
for name, big_question in footpath_questions.items():
    session.execute(
        text(
            "INSERT INTO learning_footpaths (name, big_question) VALUES (:name, :big_question) ON CONFLICT DO NOTHING"
        ),
        {"name": name, "big_question": big_question},
    )
session.commit()

print("Learning footpaths populated!")
