from ..api import db, ma

from sqlalchemy import Integer, ForeignKey




class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.Text)
    second_name = db.Column(db.Text)
    last_name = db.Column(db.Text)
    email = db.Column(db.Text)
    password = db.Column(db.Text)
    roles = db.Column(db.Text)
    #contests = db.relationship('Contest', back_populates='user')

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

class UserSchema(ma.Schema):
    class Meta:
        fields = ("id", "first_name", "second_name", "last_name", "email", "password", "role")

user_schema = UserSchema()