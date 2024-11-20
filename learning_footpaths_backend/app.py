from flask import Flask, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_session import Session
from config import ApplicationConfig
from database import Base, engine, db  # Import the db instance from database.py
from models import (
    User,
    LearningFootpath,
    Exhibition,
    Question,
)  # Import your models here
from redis import Redis

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

db.init_app(app)
migrate = Migrate(app, db)


cors = CORS(app, supports_credentials=True)
bcrypt = Bcrypt(app)
server_session = Session(app)


# get current user route
@app.route("/@me", methods=["GET"])
def get_current_user():
    user_id = session.get("user_id")

    # if no user id
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    user = User.query.get(user_id)
    return jsonify({"id": user.id, "email": user.email})


@app.route("/register", methods=["POST"])
def register_user():
    email = request.json["email"]
    password = request.json["password"]

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.id

    return jsonify({"id": new_user.id, "email": new_user.email})


@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()

    # if user does not exist
    if user is None:
        return jsonify({"error": "Unauthorized"}), 401

    # if password is incorrect
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401

    session["user_id"] = user.id

    return jsonify({"id": user.id, "email": user.email})


@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id", None)
    return "200"


# Create all tables in the database
Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    # db.init_app(app)
    # migrate = Migrate(app, db)
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=8888)
    print("Database initialized!")
