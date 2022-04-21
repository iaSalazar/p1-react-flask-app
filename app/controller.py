
import uuid
from webbrowser import get
from api import app, db
from models import User, Contest, Voice, user_schema, contest_schema, contests_schema, voice_schema, voices_schema
import datetime
from flask import request, jsonify, send_from_directory, session
import flask_praetorian
import os
from werkzeug.utils import secure_filename
import logging
import shutil
import sendgrid
import os
from sendgrid.helpers.mail import *
from aws_utils import create_presigned_url, create_presigned_post
from flask_session import Session
import logging
import boto3
from botocore.exceptions import ClientError
import json
from botocore.config import Config
import boto3
from botocore import UNSIGNED


AWS_REGION = 'us-west-2'
sqs = boto3.client('sqs',AWS_REGION,config=Config(signature_version=UNSIGNED))

guard = flask_praetorian.Praetorian()

guard.init_app(app, User)

CLOUD_FRONT_URL = 'https://df2jjl013rfn1.cloudfront.net/'
SESSION_REDIS = 'sessionhandler.jomdrt.ng.0001.usw2.cache.amazonaws.com:6379'


def get_current_user():

    return session.get("user_id")


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/api/members', methods=["GET"])
@flask_praetorian.auth_required
def members():
    # Access the identity of the current user with get_jwt_identity

    # return jsonify(logged_in_as=current_user), 200
    return jsonify(
        message="protected endpoint (allowed user {})".format(
            flask_praetorian.current_user().username,
        )
    )
    return {"members": ["member1", "Member2", "Member3"]}, 200


# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.

@app.route("/api/logins", methods=["POST"])
def login_session():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    user = guard.authenticate(username, password)
    if user is None:
        return jsonify({'error': 'Unathorized'}), 409

    session["user_id"] = user.id

    return jsonify({'status': "200"})


@app.route("/api/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")
    return jsonify({'status': "200"})


@app.route("/api/check_logged", methods=["GET"])
def check_logged():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unathorized"})

    return jsonify({'status_loged': "logged"})


@app.route("/api/login", methods=["POST"])
def login():

    # req = request.get_json(force=True)
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    user = guard.authenticate(username, password)
    print(user.username, user.password, user.roles)
    session["user_id"] = user.id
    ret = {'access_token': guard.encode_jwt_token(user),
           'id': user.id}
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


@app.route("/api/signUp", methods=["POST"])
def add_user():
    """
    add new user
    """
    new_user = User(


        first_name=request.json['first_name'],
        second_name=request.json['second_name'],
        last_name=request.json['last_name'],
        email=request.json['email'],
        username=request.json['email'],
        password=guard.hash_password(request.json['password']),
        roles=request.json['roles']


    )

    db.session.add(new_user)
    db.session.flush()
    db.session.commit()
    username = request.json.get("email", None)
    password = request.json.get("password", None)

    print(username, password)

    user = User.query.filter_by(username=username).first()
    usert = guard.authenticate(username, password)
    ret = {'access_token': guard.encode_jwt_token(usert),
           'id': new_user.id}
    return ret


@app.route("/api/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    """
    get user
    """
    user = User.query.get_or_404(user_id)
    print(user.roles)
    return user_schema.dump(user)


@app.route("/api/contests/create", methods=["POST"])
@flask_praetorian.auth_required
@flask_praetorian.roles_required("admin")
def add_event():
    """
    add new contest
    """

    # print(request.form['name'])
    print("######################################################################")
    print(request.form)
    print("######################################################################")

    # return jsonify(request.form.to_dict)

    date_start_split = request.form['date_start'].split('-')
    date_end_split = request.form['date_end'].split('-')
    print(type(date_start_split))
    print(date_start_split)

    name = request.form['name']
    user_id = flask_praetorian.current_user().id
    filename = secure_filename('banner.jpg')

    new_contest = Contest(


        name=name,
        image='not assigned',
        url=request.form['name'],
        date_start=datetime.date(int(date_start_split[0]), int(
            date_start_split[1]), int(date_start_split[2])),  # request.json['date_start'],

        date_end=datetime.date(int(date_end_split[0]), int(date_end_split[1]), int(
            date_end_split[2])),  # request.json['date_end'],
        pay=request.form['pay'],
        script=request.form['script'],
        tips=request.form['tips'],
        user_id=user_id

    )

    db.session.add(new_contest)
    db.session.flush()
    db.session.commit()
    #
    #  contests/user-id/contest_banner/img.jpg
    upload_path = 'contests/{}/contest_banner/'.format(new_contest.id)

    new_contest.image = upload_path+filename

    db.session.commit()

    response = contest_schema.dump(new_contest)
    response_aws = create_presigned_post('contests-voices', 'carpeta/img1.png')
    response.update(response_aws)
    return response


@app.route("/api/contests/url_update/<id_contest>", methods=["PUT"])
def update_event_url(id_contest):

    contest = Contest.query.get_or_404(id_contest)

    if 'url' in request.json:

        contest.url = request.json['url']

    db.session.commit()
    return contest_schema.dump(contest)


@app.route("/api/contests/<int:contest_id>/update", methods=["PUT"])
@flask_praetorian.auth_required
@flask_praetorian.roles_required("admin")
def update_contest(contest_id):

    date_start_split = request.form['date_start'].split('-')
    print(date_start_split)
    date_end_split = request.form['date_end'].split('-')
    uploaded_file = request.files['img_file']
    contest = Contest.query.get_or_404(contest_id)
    filename = secure_filename('banner.jpg')

    if 'name' in request.form:

        contest.name = request.form['name']
        print(request.form['name'])

    if 'url' in request.form:

        contest.url = request.form['url']

    if 'date_start' in request.form:

        contest.date_start = datetime.date(int(date_start_split[0]), int(
            date_start_split[1]), int(date_start_split[2]))  # request.json['date_start'],

    if 'date_end' in request.form:

        contest.date_end = datetime.date(int(date_end_split[0]), int(
            date_end_split[1]), int(date_end_split[2]))  # request.json['date_end'],

    if 'pay' in request.form:

        contest.pay = request.form['pay']

    if 'script' in request.form:

        contest.script = request.form['script']

    if 'tips' in request.form:

        contest.tips = request.form['tips']

    upload_path = './contests/{}/contest_banner/'.format(contest_id)

    db.session.commit()

    uploaded_file.save(os.path.join(upload_path, filename))

    db.session.commit()
    return contest_schema.dump(contest)


@app.route("/api/contests/<int:contest_id>/<contest_url>", methods=["GET"])
def get_contest(contest_id, contest_url):
    """
    Get specific contest
    """
    print(contest_url)
    # URL = contest_id+url_name
    contest = Contest.query.filter(
        (Contest.url == contest_url), (Contest.id == contest_id)).first()
    # contest = Contest.query.get_or_404(contest_id)
    return contest_schema.dump(contest)


@app.route("/api/contests/<int:contest_id>/delete", methods=["DELETE"])
def delete_contest(contest_id):
    """
    Get specific contest
    """
    contest = Contest.query.filter(Contest.id == contest_id).first()
    db.session.delete(contest)
    shutil.rmtree('./contests/{}'.format(contest_id), ignore_errors=True)
    db.session.commit()
    return contest_schema.dump(contest)


@app.route("/api/contests/user/<int:user_id>/list", methods=["GET"])
def get_all_contest(user_id):
    """
    Get all contests metadata
    """

    contests = Contest.query.filter(Contest.user_id == user_id).all()

    return jsonify(contests_schema.dump(contests))


@app.route("/api/contests/<int:contest_id>/<contest_url>/banner", methods=["GET"])
def get_contest_img(contest_id, contest_url):
    """
    Get specific contest banner
    """
    print(contest_url)
    contest = Contest.query.filter(
        (Contest.url == contest_url), (Contest.id == contest_id)).first()
    print(contest.image)
    img_path = contest.image.rsplit("/", 1)

    logging.info('Getting banner image from {}'.format(contest.image))
    url = CLOUD_FRONT_URL+contest.image

    # return send_from_directory(img_path[0],img_path[1])
    return url


@app.route("/api/contests/<int:contest_id>/<contest_url>/upload", methods=["POST"])
def upload_voice(contest_id, contest_url):
    """
    add new voice
    """

    full_contest_url = 'http://44.196.116.204/contests/' + \
        str(contest_id)+'/'+contest_url
    file_name = request.form['file_name'].split('.')[0]
    file_format = request.form['file_name'].split('.')[1]
    file_name_final = secure_filename('{}.{}'.format(file_name, file_format))
    file_name_transformed = secure_filename(
        '{}_transformed.{}'.format(file_name, 'mp3'))
    # file_name_transformed = secure_filename('{}.{}'.format(file_name,'mp3'))

    transformed = False
    # contest = Contest.query.filter((Contest.url == contest_url),(Contest.id ==contest_id)).first()
    # contests/user-id/voices/voice.xxx
    upload_path_original = 'contests/{}/voices/original/'.format(contest_id)
    upload_path_transformed = 'contests/{}/voices/transformed/'.format(
        contest_id)
    file_path_original = upload_path_original+file_name_final
    file_path_transformed = upload_path_transformed+file_name_transformed
    # in case the file is already mp3 format it will be considered as transformed

    if file_format == 'mp3':
        file_name_transformed = secure_filename(
            '{}.{}'.format(file_name, 'mp3'))
        file_path_transformed = upload_path_transformed+file_name_transformed
        # file_path_transformed = file_path_original
        transformed = True
        date_uploaded = datetime.datetime.now()
        new_voice = Voice(

            first_name=request.form['first_name'],
            second_name=request.form['second_name'],
            last_name=request.form['last_name'],
            email=request.form['email'],
            observations=request.form['observations'],
            file_path=file_path_transformed,
            file_path_org=file_path_transformed,
            transformed=transformed,
            date_uploaded=date_uploaded,
            queue_time=0,
            contest_id=contest_id


        )
        db.session.add(new_voice)
        db.session.flush()
        db.session.commit()
        sg = sendgrid.SendGridAPIClient(
            api_key=os.environ.get('SENDGRID_API_KEY'))
        from_email = Email("cloud5202010@gmail.com")
        to_email = To(new_voice.email)
        subject = 'Thanks for participating with your voice'
        content = Content("text/plain", 'Hi {} your audio is already posted in the contes page {} !'.format(
            new_voice.first_name+' '+new_voice.last_name, full_contest_url))
        mail = Mail(from_email, to_email, subject, content)
        response = sg.client.mail.send.post(request_body=mail.get())
        # response = sg.client.mail.send.post(request_body=mail.get())

    else:

        date_uploaded = datetime.datetime.now()
        new_voice = Voice(

            first_name=request.form['first_name'],
            second_name=request.form['second_name'],
            last_name=request.form['last_name'],
            email=request.form['email'],
            observations=request.form['observations'],
            file_path=file_path_transformed,
            file_path_org=file_path_original,
            transformed=transformed,
            date_uploaded=date_uploaded,
            contest_id=contest_id


        )
        db.session.add(new_voice)

        db.session.flush()
        db.session.commit()
        
        response = sqs.send_message(
            QueueUrl = 'https://sqs.us-west-2.amazonaws.com/724199215181/voices',
            DelaySeconds=10,
            MessageAttributes={

                'file_path_original': {'DataType': 'String', 'StringValue': 'hola'}

            },
            MessageBody=(json.dumps(
                {'file_path_original': file_path_original,
                 'file_path_transformed': file_path_transformed,
                 'new_voice.id': new_voice.id,
                 'new_voice.email': new_voice.email,
                 'name': new_voice.first_name+' '+new_voice.last_name,
                 'full_contest_url': full_contest_url,
                 'date_uploaded': date_uploaded}, default=str)

            )
            
        )
        print('FUNCIONOOO')
        print(response['MessageId'])

        

        # transform_audio_format.delay(file_path_original, file_path_transformed, new_voice.id, new_voice.email,
        #                              new_voice.first_name+' '+new_voice.last_name, full_contest_url, date_uploaded)
        # db.session.commit()

    return voice_schema.dump(new_voice)


@app.route("/api/contests/<int:contest_id>/org/<int:voice_id>", methods=["GET"])
@flask_praetorian.auth_required
def get_voice_org(voice_id, contest_id):
    """
    get original voice file for downlaod or streaming
    """
    voice = Voice.query.filter(
        (Voice.contest_id == contest_id), (Voice.id == voice_id)).first()
    file_path_org = voice.file_path_org
    print(file_path_org)
    logging.info('Getting contest audio from {}'.format(file_path_org))
    url = CLOUD_FRONT_URL+file_path_org
    return url


@app.route("/api/contests/<int:contest_id>/trns/<int:voice_id>", methods=["GET"])
# @flask_praetorian.auth_required
def get_voice(voice_id, contest_id):
    """
    get transformed (mp3) voice file for downlaod or streaming
    """
    voice = Voice.query.filter(
        (Voice.contest_id == contest_id), (Voice.id == voice_id)).first()
    file_path = voice.file_path
    print(file_path)
    logging.info('Getting contest audio from {}'.format(file_path))
    url = CLOUD_FRONT_URL+file_path
    return url

    return send_from_directory(file_path[0], file_path[1])


@app.route("/api/contests/<int:contest_id>/play/<int:voice_id>", methods=["GET"])
def get_play_voice(voice_id, contest_id):
    """
    get transformed (mp3) voice file for downlaod or streaming
    """
    voice = Voice.query.filter(
        (Voice.contest_id == contest_id), (Voice.id == voice_id)).first()
    file_path = voice.file_path
    print(file_path)
    logging.info('Getting contest audio from {}'.format(file_path))
    url = CLOUD_FRONT_URL+file_path
    return url


@app.route("/api/contests/<int:contest_id>/voices", methods=["GET"])
def get_all_voices(contest_id):
    """
    Get all voices metadata
    """

    voices = Voice.query.filter(Voice.contest_id == contest_id)

    return jsonify(voices_schema.dump(voices))


@app.route("/api/pre_signed_url/<file_name>", methods=["GET"])
def get_pre_signed_url(file_name):
    """
    Get presigned s3 link
    """

    url = create_presigned_url('contests-voices', file_name)

    return url


@app.route("/api/pre_signed_url_post/<file_name>", methods=["GET"])
def get_pre_signed_url_post(file_name):
    """
    Get all voices metadata
    """

    url = create_presigned_post('contests-voices', file_name)

    return url
