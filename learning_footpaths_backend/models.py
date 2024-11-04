from flask_sqlalchemy
from uuid import uuid

db = SQLAlchemy(metadata=metadata)

class User(db.Model):
  __tablename__ = "users" #for table name
  id = db.Column( db.Integer, primary_key=True ) #assigns an id as a primary Key
  email = db.Column( db.String, unique = True ) #each email given has to be unique
  password = db.Column(db.String(30)) #limit bycrypt password hash 30