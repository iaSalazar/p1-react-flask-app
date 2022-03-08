import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy 
from flask_marshmallow import Marshmallow  
import flask_cors 


app = Flask(__name__)#, static_folder="../build", static_url_path="/")


app.secret_key = "super-secret"


app.config['JWT_ACCESS_LIFESPAN'] = {'hours': 24}
app.config['JWT_REFRESH_LIFESPAN'] = {'days': 30}
#app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:2006iaso@localhost:5432/test'
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://<user>:<password>@<AWS_RDS_HOST>:<port>/<db_name>'
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('RDS_AWS')

app.app_context()






cors = flask_cors.CORS(app) 
db = SQLAlchemy(app) 
ma = Marshmallow(app)


db.init_app(app)

from models import *
from controller import *


if __name__ == '__main__':
    app.run(debug=True)

