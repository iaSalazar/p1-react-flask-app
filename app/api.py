from flask import Flask
from flask_sqlalchemy import SQLAlchemy 
from flask_marshmallow import Marshmallow  
import flask_cors 
from flask_mail import Mail, Message 

mail = Mail()
app = Flask(__name__)#, static_folder="../build", static_url_path="/")


app.secret_key = "super-secret"


app.config['JWT_ACCESS_LIFESPAN'] = {'hours': 24}
app.config['JWT_REFRESH_LIFESPAN'] = {'days': 30}
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'

app.app_context()

mail_settings = {
    "MAIL_SERVER": 'smtp.gmail.com',
    "MAIL_PORT": 465,
    "MAIL_USE_TLS": False,
    "MAIL_USE_SSL": True,
    "MAIL_USERNAME": 'vaca3245@gmail.com',
    "MAIL_PASSWORD": 'hlsljdbeackliwmo'
}

app.config.update(mail_settings)



cors = flask_cors.CORS(app) 
db = SQLAlchemy(app) 
ma = Marshmallow(app)


db.init_app(app)

from models import *
from controller import *

mail.init_app(app)
if __name__ == '__main__':
    app.run(debug=True)

