import os

import redis
from dotenv import load_dotenv

load_dotenv()


class ApplicationConfig:
    SECRET_KEY = os.environ["SECRET_KEY"]
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = r"sqlite:///./db.sqlite"
    # SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql://username:password@localhost/dbname'
    # SESSION_TYPE = 'filesystem'

    # enable session config
    SESSION_TYPE = "redis"
    # so that session won't be permanent
    SESSION_PERMANENT = False
    # use secret key signer
    SESSION_USE_SIGNER = True
    # set the path
    SESSION_REDIS = redis.from_url("redis://127.0.0.1:6379")
