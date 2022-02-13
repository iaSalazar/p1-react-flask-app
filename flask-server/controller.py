
from api import app, db
from models import User, Contest, user_schema, contest_schema

import datetime
from flask import request, jsonify, send_from_directory

import flask_praetorian
import os
import pathlib
from werkzeug.utils import secure_filename
import logging


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


@app.route("/api/contests/create", methods=["POST"])
#@flask_praetorian.auth_required
@flask_praetorian.roles_required("admin")
def add_event():
    """
    add new contest
    """
    print(request.form['name'])
    date_start_split = request.form['date_start'].split('-')
    date_end_split = request.form['date_end'].split('-')
    print(type(date_start_split))
    print(date_start_split)

    name = request.form['name']
    user_id = flask_praetorian.current_user().id
    uploaded_file = request.files['img_file']
    filename = secure_filename(uploaded_file.filename)
    #  contests/user-id/contest-name/banner
    upload_path = './contests/user-{}/{}/contest-banner/'.format(user_id,name)
    

    if not os.path.isdir(upload_path):
        #pathlib.mkdir(upload_path, parents = True, exist_ok= True)
        os.umask(0)
        os.makedirs(upload_path)
        logging.info('Created directory {}'.format(upload_path))
        

    uploaded_file.save(os.path.join(upload_path, filename))
    new_contest = Contest(
 
            
            name = name,
            image = upload_path+filename,
            url = request.form['name'],
            
            date_start = datetime.date(int(date_start_split[0]),int(date_start_split[1]),int(date_start_split[2])),#request.json['date_start'],
            date_end = datetime.date(int(date_end_split[0]),int(date_end_split[1]),int(date_end_split[2])),#request.json['date_end'],
            pay = request.form['pay'],
            script = request.form['script'],
            tips = request.form['tips'],
            user_id = user_id

        )
    

    db.session.add(new_contest)

    db.session.commit()
    
    return contest_schema.dump(new_contest)

@app.route("/api/contests/url_update/<id_contest>", methods=["PUT"])
def update_event_url(id_contest):
    
   
    contest = Contest.query.get_or_404(id_contest)

    if 'url' in request.json:

        contest.url = request.json['url']

    
    
    db.session.commit()
    return contest_schema.dump(contest)


@app.route("/api/contests/<contest_url>", methods=["GET"])
def get_contest(contest_url):
    """
    Get specific contest
    """
    print(contest_url)
    contest = Contest.query.filter(Contest.url == contest_url).first()
   
    return contest_schema.dump(contest)

@app.route("/api/contests/img/<contest_url>", methods=["GET"])
def get_contest_img(contest_url):
    """
    Get specific contest
    """
    print(contest_url)
    contest = Contest.query.filter(Contest.url == contest_url).first()
    img_path = contest.image.rsplit("/",1)
    return send_from_directory(img_path[0],img_path[1])
