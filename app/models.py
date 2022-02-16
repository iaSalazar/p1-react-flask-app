
from sqlalchemy import Integer
from api import db, ma


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.Text)
    second_name = db.Column(db.Text)
    last_name = db.Column(db.Text)
    email = db.Column(db.Text, unique=True)
    username = db.Column(db.Text, unique=True)
    password = db.Column(db.Text)
    roles = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True, server_default='true')
    contests = db.relationship('Contest', back_populates='user')


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


class Contest(db.Model):
    __tablename__ = 'contest'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    image = db.Column(db.Text)
    url = db.Column(db.Text)
    date_start = db.Column(db.DateTime)
    date_end = db.Column(db.DateTime)
    pay = db.Column(db.Integer)
    script = db.Column(db.Text)
    tips = db.Column(db.Text)
    user_id = db.Column(Integer, db.ForeignKey('user.id'))
    user = db.relationship('User',back_populates = 'contests')
    voices = db.relationship('Voice', back_populates='contest')
    


class Voice(db.Model):
    __tablename__ = 'voice'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.Text)
    second_name = db.Column(db.Text)
    last_name = db.Column(db.Text)
    email = db.Column(db.Text)
    observations = db.Column(db.Text)
    file_path = db.Column(db.Text)
    file_path_org = db.Column(db.Text)
    transformed = db.Column(db.Boolean)
    date_uploaded = db.Column(db.DateTime)
    contest_id = db.Column(Integer, db.ForeignKey('contest.id'))
    contest = db.relationship('Contest', back_populates='voices')
###############################################
###############################################3
#SCHEMAS 

class VoiceSchema(ma.Schema):
    class Meta:
        fields = ("id", "file_path", "file_path_org", "transformed", "date_uploaded", "contest_id", "first_name", "second_name","last_name","email", "observations", "transformed")

voice_schema = VoiceSchema()
voices_schema = VoiceSchema(many = True)

class ContestSchema(ma.Schema):
    class Meta:
        fields = ("id", "name", "image","url", "date_start", "date_end", "pay", "script", "tips", "user_id")

contest_schema = ContestSchema()
contests_schema = ContestSchema(many = True)

class UserSchema(ma.Schema):
    class Meta:
        fields = ("id", "first_name", "second_name", "last_name", "email", "password", "role")

user_schema = UserSchema()

