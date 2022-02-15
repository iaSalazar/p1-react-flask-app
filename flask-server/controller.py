
import uuid
from api import app, db
from models import User, Contest, Voice, user_schema, contest_schema, voice_schema, voices_schema
import datetime
from flask import request, jsonify, send_from_directory
import flask_praetorian
import os
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
    filename = secure_filename('banner.jpg')
    
    new_contest = Contest(
 
            
            name = name,
            image = 'not assigned',
            url = request.form['name'],
            
            date_start = datetime.date(int(date_start_split[0]),int(date_start_split[1]),int(date_start_split[2])),#request.json['date_start'],
            date_end = datetime.date(int(date_end_split[0]),int(date_end_split[1]),int(date_end_split[2])),#request.json['date_end'],
            pay = request.form['pay'],
            script = request.form['script'],
            tips = request.form['tips'],
            user_id = user_id

        )
    

    db.session.add(new_contest)
    db.session.flush()
    db.session.commit()
    #
    #  contests/user-id/contest_banner/img.jpg
    upload_path = './contests/{}/contest_banner/'.format(new_contest.id)

    new_contest.image = upload_path+filename

    db.session.commit()

    if not os.path.isdir(upload_path):
        #pathlib.mkdir(upload_path, parents = True, exist_ok= True)
        os.umask(0)
        os.makedirs(upload_path)
        logging.info('Created directory {}'.format(upload_path))

    uploaded_file.save(os.path.join(upload_path, filename))

    return contest_schema.dump(new_contest)

@app.route("/api/contests/url_update/<id_contest>", methods=["PUT"])
def update_event_url(id_contest):
    
   
    contest = Contest.query.get_or_404(id_contest)

    if 'url' in request.json:

        contest.url = request.json['url']

    
    
    db.session.commit()
    return contest_schema.dump(contest)


@app.route("/api/contests/<int:contest_id>/<contest_url>", methods=["GET"])
def get_contest(contest_id, contest_url):
    """
    Get specific contest
    """
    print(contest_url)
    # URL = contest_id+url_name
    contest = Contest.query.filter((Contest.url == contest_url),(Contest.id == contest_id)).first()
    #contest = Contest.query.get_or_404(contest_id)
    return contest_schema.dump(contest)

@app.route("/api/contests/<int:contest_id>/<contest_url>/banner", methods=["GET"])
def get_contest_img(contest_id,contest_url):
    """
    Get specific contest banner
    """
    print(contest_url)
    contest = Contest.query.filter((Contest.url == contest_url),(Contest.id ==contest_id)).first()
    print(contest.image)
    img_path = contest.image.rsplit("/",1)

    logging.info('Getting banner image from {}'.format(contest.image))
    
    return send_from_directory(img_path[0],img_path[1])


@app.route("/api/contests/<int:contest_id>/<contest_url>/upload", methods=["POST"])
def upload_voice(contest_id,contest_url):
    """
    add new voice
    """
    
    
    file_name = str(uuid.uuid4())
    uploaded_file = request.files['audio_file']
    extension = uploaded_file.content_type
    
    file_format = uploaded_file.filename.rsplit('.',1)[1]
    filename = secure_filename('{}.{}'.format(file_name,file_format))

    file_path = ''
    transformed = False
    #contest = Contest.query.filter((Contest.url == contest_url),(Contest.id ==contest_id)).first()
    # contests/user-id/voices/voice.xxx
    upload_path = './contests/{}/voices/'.format(contest_id)

    #in case the file is already mp3 format it will be considered as transformed
    if file_format == 'mp3':
        file_path = upload_path+filename
        transformed = True

    if not os.path.isdir(upload_path):
        #pathlib.mkdir(upload_path, parents = True, exist_ok= True)
        os.umask(0)
        os.makedirs(upload_path)
        logging.info('Created directory {}'.format(upload_path))
        

    uploaded_file.save(os.path.join(upload_path, filename))
    new_voice = Voice(
 
            first_name = request.form['first_name'],
            second_name = request.form['second_name'],
            last_name = request.form['last_name'],
            email = request.form['email'],
            observations = request.form['observations'],
            file_path = file_path,
            file_path_org = upload_path+filename,
            transformed = transformed,
            date_uploaded = datetime.datetime.now(),
            contest_id = contest_id


        )
    

    db.session.add(new_voice)

    db.session.commit()
    
    return voice_schema.dump(new_voice)

@app.route("/api/contests/<int:contest_id>/org/<int:voice_id>", methods=["GET"])
@flask_praetorian.auth_required
def get_voice_org(voice_id,contest_id):
    """
    get original voice file for downlaod or streaming
    """
    voice = Voice.query.filter((Voice.contest_id == contest_id),(Voice.id ==voice_id)).first()
    print(voice.file_path)
    file_path = voice.file_path_org.rsplit('/',1)
    print(file_path)
    return send_from_directory(file_path[0],file_path[1])

@app.route("/api/contests/<int:contest_id>/trns/<int:voice_id>", methods=["GET"])
@flask_praetorian.auth_required
def get_voice(voice_id,contest_id):
    """
    get transformed (mp3) voice file for downlaod or streaming
    """
    voice = Voice.query.filter((Voice.contest_id == contest_id),(Voice.id ==voice_id)).first()
    print(voice.file_path)
    file_path = voice.file_path.rsplit('/',1)
    print(file_path)
    return send_from_directory(file_path[0],file_path[1])


@app.route("/api/contests/<int:contest_id>/voices", methods=["GET"])
@flask_praetorian.auth_required
@flask_praetorian.roles_required("admin")
def get_all_event(contest_id):
    """
    Get all voices metadata
    """
    
    voices = Voice.query.filter(Voice.contest_id==contest_id)

    
    return jsonify(voices_schema.dump(voices))