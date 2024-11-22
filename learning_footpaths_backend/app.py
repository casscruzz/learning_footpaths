# from flask import Flask, jsonify, request, session
# from flask_sqlalchemy import SQLAlchemy
# from flask_migrate import Migrate
# from flask_cors import CORS
# from flask_bcrypt import Bcrypt
# from flask_session import Session
# from config import ApplicationConfig
# from database import Base, engine, db  # Import the db instance from database.py
# from models import Session, User  # Import your models here
# from redis import Redis
from flask import Flask, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_session import Session as FlaskSession
from config import ApplicationConfig
from database import db, SessionLocal  # Base, engine, ,
from models import User, LearningFootpath, Exhibition
from redis import Redis

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

db.init_app(app)
migrate = Migrate(app, db)

cors = CORS(
    app,
    resources={r"/*": {"origins": "http://localhost:5173"}},
    supports_credentials=True,
)

bcrypt = Bcrypt(app)
server_session = FlaskSession(app)


# get current user route
@app.route("/@me", methods=["GET"])
def get_current_user():
    user_id = session.get("user_id")

    # if no user id
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    db_session = SessionLocal()
    try:
        user = db_session.query(User).get(user_id)
        return jsonify({"id": user.id, "email": user.email})
    finally:
        db_session.close()
    return jsonify({"id": user.id, "email": user.email})


@app.route("/register", methods=["POST"])
def register_user():
    email = request.json["email"]
    password = request.json["password"]

    db_session = SessionLocal()
    try:
        user_exists = db_session.query(User).filter_by(email=email).first() is not None

        if user_exists:
            return jsonify({"error": "User already exists"}), 409

        # Ensure you're using generate_password_hash with a default method
        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
        new_user = User(email=email, password=hashed_password)
        db_session.add(new_user)
        db_session.commit()

        session["user_id"] = new_user.id
        return jsonify({"id": new_user.id, "email": email})
    finally:
        db_session.close()


@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]

    db_session = SessionLocal()
    try:
        user = db_session.query(User).filter_by(email=email).first()

        if user is None:
            return jsonify({"error": "Unauthorized"}), 401

        if not bcrypt.check_password_hash(user.password, password):
            return jsonify({"error": "Unauthorized"}), 401

        session["user_id"] = user.id
        return jsonify({"id": user.id, "email": user.email})
    finally:
        db_session.close()


@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id", None)
    return "200"


# route for rendering footpath questions on landing page
@app.route("/api/big-questions", methods=["GET"])
def get_big_questions():
    db_session = SessionLocal()
    try:
        footpaths = db_session.query(
            LearningFootpath.name, LearningFootpath.big_question
        ).all()
        return jsonify({footpath.name: footpath.big_question for footpath in footpaths})
    finally:
        db_session.close()


# route for rendering exhibitions after selecting footpath
@app.route("/api/exhibitions/<footpath_name>", methods=["GET"])
def get_exhibitions(footpath_name):
    db_session = SessionLocal()
    try:
        exhibitions = (
            db_session.query(Exhibition)
            .join(LearningFootpath)
            .filter(LearningFootpath.name == footpath_name)
            .all()
        )

        return jsonify(
            [
                {"title": exhibition.title, "description": exhibition.description}
                for exhibition in exhibitions
            ]
        )
    finally:
        db_session.close()


if __name__ == "__main__":

    app.run(debug=True, port=8888)
    print("Database initialized!")
