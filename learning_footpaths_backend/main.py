from flask import Flask, jsonify, request, session
from flask_cors import CORS
from config import ApplicationConfig
from flask_bcrypt import Bcrypt
from flask_session import Session
from models import db, user

app = Flask(__name__)
cors = CORS(app, origins="*")
bcrypt = Bcrypt(app)


@app.route("/api/users", methods=["GET"])
def users():
    return jsonify({"users": ["arpan", "zach", "joe"]})


# if i get lost, i used this tutorial: https://medium.com/@yasmeen.yousef05/authentication-in-react-app-with-flask-server-sided-sessions-e97006db749e
@app.route("/register", methods=["POST"])
def register_user():
    # gets email and password input
    email = request.json["email"]
    password = request.json["password"]

    # checks if user already exists
    # one user only per email
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

    if user is None:
        return jsonify({"error": "Unauthorized"}), 401
    # checking if the password is the same as hashed password
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401

    session["user_id"] = user.id
    return jsonify({"id": user.id, "email": user.email})


@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")
    return "200"


@app.route("/@me")
def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    user = User.query.filter_by(id=user_id).first()
    return jsonify({"id": user.id, "email": user.email})


# initialize the app with the configuration from config.py
app.config.from_object(ApplicationConfig)
db.init_app(app)
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True, port=8888)

server_session = Session(app)
