
from ..api import db, ma
from sqlalchemy import Integer, ForeignKey

from server.model.user import User, user_schema
from ..api import app, db

from flask import request , jsonify
from flask_restful import Api, Resource 
import flask_praetorian

import time


guard = flask_praetorian.Praetorian()

guard.init_app(app, User)

@app.route('/api/user',methods=['GET'])
def get_current_time_2():
    return {'time_user': time.time()}



@app.route('/api/members', methods=["GET"])
@flask_praetorian.auth_required
def members():
    # Access the identity of the current user with get_jwt_identity
    
    #return jsonify(logged_in_as=current_user), 200
    return jsonify(
        message="protected endpoint (allowed user {})".format(
            flask_praetorian.current_user().username,
        )
    )
    return {"members": ["member1","Member2","Member3"]}, 200



# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.
@app.route("/api/login", methods=["POST"])
def login():
    
    #req = request.get_json(force=True)
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    user = guard.authenticate(username, password)
    ret = {'access_token': guard.encode_jwt_token(user)}
    return ret, 200
    """ username = request.json.get("username", None)
    password = request.json.get("password", None)
    
    if username != "test" or password != "test" or username =='':
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token) """
    


@app.route('/api/refresh', methods=['POST'])
def refresh():
    """
    Refreshes an existing JWT by creating a new one that is a copy of the old
    except that it has a refrehsed access expiration.
    .. example::
       $ curl http://localhost:5000/api/refresh -X GET \
         -H "Authorization: Bearer <your_token>"
    """
    print("refresh request")
    old_token = request.get_data()
    new_token = guard.refresh_jwt_token(old_token)
    ret = {'access_token': new_token}
    return ret, 200


@app.route("/api/singUp", methods=["POST"])
def add_user():
    """
    add new user
    """
    new_user = User(
 
            
            
            
            first_name = request.json['first_name'],
            second_name = request.json['second_name'],
            last_name = request.json['last_name'],
            email = request.json['email'],
            password = guard.hash_password(request.json['password']),
            roles = request.json['roles']

        )

    db.session.add(new_user)

    db.session.commit()
    return user_schema.dump(new_user)