from flask import Blueprint

# Define the Blueprint here
main = Blueprint('main', __name__)

# Import the routes so they get registered with the Blueprint
from . import auth, admin, student, warden, mentor