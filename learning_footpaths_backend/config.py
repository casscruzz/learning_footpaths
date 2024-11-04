from dotenv import load_dotenv
import os
import redis

load_dotenv()


class ApplicationConfig:
    SECRET_KEY = os.environ["SECRET_KEY"]
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = r"sqlite:///./db.sqlite"


# enable session config
SESSION_TYPE = "redis"
# so that session won't be permenant
SESSION_PERMANENT = False
# use secret key signer
SESSION_USE_SIGNER = True
# set the path
SESSION_REDIS = redis.from_url("redis://127.0.0.1:6379")
