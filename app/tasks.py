from datetime import datetime
import zipfile
from celery import Celery
import sqlite3
import ffmpeg
from sqlalchemy import create_engine, MetaData
import yagmail

#app = Celery('tasks', broker='redis://127.0.0.1:6379/0')
app = Celery('tasks', broker='redis://redis:6379/0')
app.conf.broker_transport_options = {'visibility_timeout': 3600}  # 1 hour.
# engine = create_engine("sqlite:///test.db", echo=True, future=True)
# connection = engine.connect()
# metadata = MetaData()

@app.task
def transform_audio_format(url_original, url_destiny, voice_id, email, name, url):

        url_new_file_format = url_destiny.rsplit('.',1)[0]+'.mp3'
       
        print(url_original)
        print(url_destiny)
        print(url_new_file_format)
        input = ffmpeg.input(url_original)
        # #remove default file extension
        
        output = ffmpeg.output(input,url_new_file_format)

        output.run()

        try:
                sqliteConnection = sqlite3.connect('test.db')
                cursor = sqliteConnection.cursor()
                print("Database created and Successfully Connected to SQLite")
                sqlite_select_Query = "UPDATE voice SET transformed=true WHERE id ={}".format(voice_id)
                cursor.execute(sqlite_select_Query)
                sqliteConnection.commit()
                # sqlite_select_Query = "Select * FROM voice where id={}".format(voice_id)
                # cursor.execute(sqlite_select_Query)
                # record = cursor.fetchall()
                print('updated') 
                cursor.close()
                #initializing the server connection
                yag = yagmail.SMTP(user='cloud5202010@gmail.com', password='12345ASDF')
                #sending the email
                yag.send(to= email, subject='Thanks for participating with your voice', contents='Hi {} your audio is already posted in the contes page {} !'.format(name, url))
                print("Email sent successfully")


                 


        except sqlite3.Error as error:
                return "Error while connecting to sqlite"
        
        return 'trasnformo'

    
