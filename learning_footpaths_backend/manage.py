# database migration manager
# necessary since I'll be making changes to the database later on

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from app import app, db
from models import User, LearningFootpath, Exhibition, Question

migrate = Migrate(app, db)

if __name__ == "__main__":
    from flask.cli import FlaskGroup

    cli = FlaskGroup(app)

    @cli.command("create_tables")
    def create_tables():
        with app.app_context():
            db.create_all()
            print("Tables created successfully!")

    @cli.command("drop_tables")
    def drop_tables():
        with app.app_context():
            db.drop_all()
            print("Tables dropped successfully!")

    cli()
