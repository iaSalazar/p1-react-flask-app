
from api import app, db
from models import User, Contest, user_schema, contest_schema

import datetime
from flask import request, jsonify

import flask_praetorian


guard = flask_praetorian.Praetorian()

guard.init_app(app, User)

@app.route('/')
def index():
    return app.send_static_file('index.html')

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
            username = request.json['email'],
            password = guard.hash_password(request.json['password']),
            roles = request.json['roles']


        )

    db.session.add(new_user)

    db.session.commit()
    return user_schema.dump(new_user)

@app.route("/api/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    """
    get user
    """
    user = User.query.get_or_404(user_id)
    print(user.roles)
    return user_schema.dump(user)

@app.route("/api/contest/create", methods=["POST"])
#@flask_praetorian.auth_required
@flask_praetorian.roles_required("admin")
def add_event():
    """
    add new event
    """
    
    date_start_split = request.json['date_start'].split('-')
    date_end_split = request.json['date_end'].split('-')
    print(type(date_start_split))
    print(date_start_split)
    new_contest = Contest(
 
            
            name = request.json['name'],
            image = request.json['image'],
            url = request.json['name'],
            
            date_start = datetime.date(int(date_start_split[0]),int(date_start_split[1]),int(date_start_split[2])),#request.json['date_start'],
            date_end = datetime.date(int(date_end_split[0]),int(date_end_split[1]),int(date_end_split[2])),#request.json['date_end'],
            pay = request.json['pay'],
            script = request.json['script'],
            tips = request.json['tips'],
            user_id = flask_praetorian.current_user().id

        )

    db.session.add(new_contest)

    db.session.commit()
    
    return contest_schema.dump(new_contest)


# @app.route("/api/events", methods=["GET"])
# @flask_praetorian.auth_required
# def get_all_event():
#     """
#     Get all events
#     """
    
#     event = Event.query.filter(Event.id_user==flask_praetorian.current_user().id)
#     id_user = flask_praetorian.current_user().id
#     return jsonify(events_schema.dump(event))

# @app.route("/api/events/<int:id_event>", methods=["GET"])
# def get_event(id_event):
#     """
#     Get specific event
#     """
   
#     event = Event.query.get_or_404(id_event)

    

#     return event_schema.dump(event)


# @app.route("/api/events/<int:id_event>", methods=["PUT"])
# def update_event(id_event):
    
   
#     event = Event.query.get_or_404(id_event)

#     if 'name' in request.json:

#         event.titulo = request.json['name']

#     if 'description' in request.json:

#         event.contenido = request.json['description']
    
#     db.session.commit()
#     return event_schema.dump(event)

# @app.route("/api/events/<int:id_event>", methods=["DELETE"])
# def delete_event(id_event):
    
   
#     event = Event.query.get_or_404(id_event)

#     db.session.delete(event)

#     db.session.commit()

#     return event_schema.dump(event)




# class ResourceOneEvent(Resource):


#     def get(self):

#         event = Event.query.all()

#         return event_schema.dump(event)
#     # def get(self, id_event):

#     #     event = Event.query.get_or_404(id_event)

#     #     return event_schema.dump(event)

#     def put(self):

#         new_event = Event(
 
            
#             name = request.json['name'],
#             description = request.json['description']

#         )
#         db.session.add(new_event)

#         db.session.commit()
    
#         return user_schema.dump(new_event)

#     def delete(self, id_event):

#         event = Event.query.get_or_404(id_event)

#         db.session.delete(event)

#         db.session.commit()

#         return '', 204
# api.add_resource(ResourceOneEvent, '/event')
#api.add_resource(ResourceOneEvent, '/event/<int:id_event>')