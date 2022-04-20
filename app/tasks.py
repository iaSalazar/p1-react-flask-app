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

app = Celery('tasks', broker='redis://127.0.0.1:6379/0')
#app = Celery('tasks', broker='redis://172.31.92.111:6379/0')
app.conf.broker_transport_options = {'visibility_timeout': 3600}  # 1 hour.
# engine = create_engine("sqlite:///test.db", echo=True, future=True)
# connection = engine.connect()
# metadata = MetaData()

PATH_TRANSFORM = './transform/'

s3 = boto3.client('s3',config=Config(signature_version=UNSIGNED))

if not os.path.isdir(PATH_TRANSFORM):
        #pathlib.mkdir(upload_path, parents = True, exist_ok= True)
        os.umask(0)
        os.makedirs(PATH_TRANSFORM)
        logging.info('Created directory {}'.format(PATH_TRANSFORM))


@app.task
def transform_audio_format(url_original, url_destiny, voice_id, email, name, url, date_uploaded):
        
        time_queue = (datetime.datetime.now() - datetime.datetime.strptime(date_uploaded.replace('T',' '), '%Y-%m-%d %H:%M:%S.%f') ).total_seconds()

        
        print(str(datetime.datetime.now)+'||||||'+date_uploaded)

        


        print('downloading original audio')
        print(url_destiny)
        print(url_original.rsplit('/',1))
        path_to_transform = PATH_TRANSFORM+url_original.rsplit('/',1)[1]
        path_transformed = PATH_TRANSFORM+url_destiny.rsplit('/',1)[1]
        s3.download_file('contests-voices',url_original,path_to_transform)

        input = ffmpeg.input(path_to_transform)
        # #remove default file extension
        
        output = ffmpeg.output(input,path_transformed)

        output.run()
        
        print('Uploading transformed file')
        s3.upload_file(path_transformed, 'contests-voices', url_destiny)
        files = glob.glob(PATH_TRANSFORM+'/*')
        for f in files:
                os.remove(f)

        try:
                host = os.environ.get('RDS_AWS_HOST')
                password= os.environ.get('RDS_AWS_PSW')
                database= os.environ.get('RDS_AWS_DBN')
                user = os.environ.get('RDS_AWS_USR')
                print(user)
                #conn = psycopg2.connect(host="localhost", database="test", user="postgres",password="2006iaso")
                conn = psycopg2.connect(host=host, database=database, user=user,password=password)


                cursor = conn.cursor()
               
                # sqliteConnection = sqlite3.connect('test.db')
                # cursor = sqliteConnection.cursor()
                
                print("Database created and Successfully Connected")
                query = "UPDATE voice SET transformed=true WHERE id ={}".format(voice_id)
                cursor.execute(query)
                query = "UPDATE voice SET queue_time={} WHERE id ={}".format(time_queue,voice_id)
                cursor.execute(query)
                #sqliteConnection.commit()
                conn.commit()
                # sqlite_select_Query = "Select * FROM voice where id={}".format(voice_id)
                # cursor.execute(sqlite_select_Query)
                # record = cursor.fetchall()
                print('updated') 
                cursor.close()
                #initializing the server connection


                # print(os.environ['SENDGRID_API_KEY'])
                sg = sendgrid.SendGridAPIClient(api_key=os.environ.get('SENDGRID_API_KEY'))
                from_email = Email("cloud5202010@gmail.com")
                to_email = To(email)
                subject = 'Thanks for participating with your voice'
                content = Content("text/plain", 'Hi {} your audio is already posted in the contes page {} !'.format(name, url))
                mail = Mail(from_email, to_email, subject, content)
                response = sg.client.mail.send.post(request_body=mail.get())
                # print(response.status_code)
                # print(response.body)
                # print(response.headers)
                print("Email sent successfully")
               


                 


        except sqlite3.Error as error:
                return "Error while connecting to sqlite"
        
        return 'trasnformo'

    
