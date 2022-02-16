from flask import Flask
from flask_sqlalchemy import SQLAlchemy 
from flask_marshmallow import Marshmallow  
import flask_cors 


app = Flask(__name__)#, static_folder="../build", static_url_path="/")


app.secret_key = "super-secret"


app.config['JWT_ACCESS_LIFESPAN'] = {'hours': 24}
app.config['JWT_REFRESH_LIFESPAN'] = {'days': 30}
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'



cors = flask_cors.CORS(app)
db = SQLAlchemy(app) 
ma = Marshmallow(app)


db.init_app(app)

from models import *
from controller import *

if __name__ == '__main__':
    app.run(debug=True)

