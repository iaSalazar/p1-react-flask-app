import logging
import time
import boto3
from botocore.exceptions import ClientError
import json
from botocore import UNSIGNED
import datetime
import zipfile
from celery import Celery
import sqlite3
import ffmpeg
from sqlalchemy import create_engine, MetaData
import yagmail
import psycopg2
import sendgrid
import os
from sendgrid.helpers.mail import *
from botocore.config import Config
import boto3
from botocore import UNSIGNED
import logging
import glob


PATH_TRANSFORM = './transform/'
AWS_REGION = 'us-west-2'
s3 = boto3.client('s3', config=Config(signature_version=UNSIGNED))
# Create SQS client
sqs = boto3.client('sqs', AWS_REGION, config=Config(
    signature_version=UNSIGNED))
if not os.path.isdir(PATH_TRANSFORM):
    # pathlib.mkdir(upload_path, parents = True, exist_ok= True)
    os.umask(0)
    os.makedirs(PATH_TRANSFORM)
    logging.info('Created directory {}'.format(PATH_TRANSFORM))


queue_url = 'https://sqs.us-west-2.amazonaws.com/724199215181/voices'

while 1:
    response = sqs.receive_message(
        QueueUrl=queue_url,
        AttributeNames=[
            'SentTimestamp'
        ],
        MaxNumberOfMessages=1,
        MessageAttributeNames=[
            'All'
        ],
        VisibilityTimeout=0,
        WaitTimeSeconds=0
    )

    try:
        message = response['Messages'][0]
        receipt_handle = message['ReceiptHandle']

        # Delete received message from queue
        sqs.delete_message(
            QueueUrl=queue_url,
            ReceiptHandle=receipt_handle
        )
        print('Received and deleted message: %s' % message.get('Body'))

        data = json.loads(message.get('Body'))
        print(data)
        print(data.get('full_contest_url'))

        url_original = data.get('file_path_original')
        url_destiny = data.get('file_path_transformed')
        voice_id = data.get('new_voice.id')
        email = data.get('new_voice.email')
        name = data.get('name')
        url = data.get('full_contest_url')
        print(data.get('date_uploaded'))
        date_uploaded = data.get('date_uploaded')

        

        time_queue = (datetime.datetime.now() - datetime.datetime.strptime(
            date_uploaded.replace('T', ' '), '%Y-%m-%d %H:%M:%S.%f')).total_seconds()

        print(str(datetime.datetime.now)+'||||||'+date_uploaded)

        print('downloading original audio')
        print(url_destiny)
        print(url_original.rsplit('/', 1))
        path_to_transform = PATH_TRANSFORM+url_original.rsplit('/', 1)[1]
        path_transformed = PATH_TRANSFORM+url_destiny.rsplit('/', 1)[1]
        s3.download_file('contests-voices', url_original, path_to_transform)

        input = ffmpeg.input(path_to_transform)
        # #remove default file extension

        output = ffmpeg.output(input, path_transformed)

        output.run()

        print('Uploading transformed file')
        s3.upload_file(path_transformed, 'contests-voices', url_destiny)
        files = glob.glob(PATH_TRANSFORM+'/*')
        for f in files:
            os.remove(f)

        try:
            host = os.environ.get('RDS_AWS_HOST')
            password = os.environ.get('RDS_AWS_PSW')
            database = os.environ.get('RDS_AWS_DBN')
            user = os.environ.get('RDS_AWS_USR')
            print(user)
            #conn = psycopg2.connect(host="localhost", database="test", user="postgres",password="2006iaso")
            conn = psycopg2.connect(
                host=host, database=database, user=user, password=password)

            cursor = conn.cursor()

            # sqliteConnection = sqlite3.connect('test.db')
            # cursor = sqliteConnection.cursor()

            print("Database created and Successfully Connected")
            query = "UPDATE voice SET transformed=true WHERE id ={}".format(
                voice_id)
            cursor.execute(query)
            query = "UPDATE voice SET queue_time={} WHERE id ={}".format(
                time_queue, voice_id)
            cursor.execute(query)
            # sqliteConnection.commit()
            conn.commit()
            # sqlite_select_Query = "Select * FROM voice where id={}".format(voice_id)
            # cursor.execute(sqlite_select_Query)
            # record = cursor.fetchall()
            print('updated')
            cursor.close()
            # initializing the server connection

            # print(os.environ['SENDGRID_API_KEY'])
            sg = sendgrid.SendGridAPIClient(
                api_key=os.environ.get('SENDGRID_API_KEY'))
            from_email = Email("cloud5202010@gmail.com")
            to_email = To(email)
            subject = 'Thanks for participating with your voice'
            content = Content(
                "text/plain", 'Hi {} your audio is already posted in the contes page {} !'.format(name, url))
            mail = Mail(from_email, to_email, subject, content)
            response = sg.client.mail.send.post(request_body=mail.get())
            # print(response.status_code)
            # print(response.body)
            # print(response.headers)
            print("Email sent successfully")

        except sqlite3.Error as error:
                pass

    except KeyError as e:
        print('error')
        time.sleep(10)
