from datetime import datetime
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
import uuid
import csv
import time

#app = Celery('tasks', broker='redis://127.0.0.1:6379/0')
app = Celery('tasks', broker='redis://127.0.0.1:6379/0')
app.conf.broker_transport_options = {'visibility_timeout': 3600}  # 1 hour.
# engine = create_engine("sqlite:///test.db", echo=True, future=True)
# connection = engine.connect()
# metadata = MetaData()

@app.task
def transform_audio_format(url_original, url_destiny, voice_id, email, name, url):
        time_start = time.time()
        file_name =str(uuid.uuid4())
        url_new_file_format = url_destiny.rsplit('.',1)[0]+'.mp3'
       
        print(url_original)
        print(url_destiny)
        print(url_new_file_format)
        input = ffmpeg.input(url_original)
        # #remove default file extension
        
        output = ffmpeg.output(input,url_new_file_format)

        output.run()
        total_time= time.time() - time_start

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
                if not os.path.isdir('./tiempos'):
                #pathlib.mkdir(upload_path, parents = True, exist_ok= True)
                        os.umask(0)
                        os.makedirs('./tiempos')
                row = [voice_id, total_time]
                f = open('tiempos/{}.csv'.format(file_name), 'a')
                writer = csv.writer(f)
                writer.writerow(row)
                f.close() 
                print('tiempo almacenado')


                 


        except sqlite3.Error as error:
                return "Error while connecting to sqlite"
        
        return 'trasnformo'

    
