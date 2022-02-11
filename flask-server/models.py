
from sqlalchemy import Integer
from api import db, ma


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, unique=True)
    password = db.Column(db.Text)
    roles = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True, server_default='true')
    

    @property
    def rolenames(self):
        try:
            return self.roles.split(',')
        except Exception:
            return []

    @classmethod
    def lookup(cls, username):
        return cls.query.filter_by(username=username).one_or_none()

    @classmethod
    def identify(cls, id):
        return cls.query.get(id)

    @property
    def identity(self):
        return self.id

    def is_valid(self):
        return self.is_active

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String(50))
    description=db.Column(db.String(255))
    id_user=db.Column(Integer, db.ForeignKey(User.id))

###############################################
###############################################3
#SCHEMAS 
class UserSchema(ma.Schema):
    class Meta:
        fields = ("id", "username", "password","roles", "is_active")

class EventSchema(ma.Schema):
    class Meta:
        fields = ("id", "name", "description","id_user")

user_schema = UserSchema()

event_schema = EventSchema()
events_schema = EventSchema(many = True)
