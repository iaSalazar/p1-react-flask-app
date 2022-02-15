from datetime import datetime
import zipfile
from celery import Celery
import sqlite3
import ffmpeg

app = Celery('tasks', broker='redis://127.0.0.1:6379/0')
app.conf.broker_transport_options = {'visibility_timeout': 3600}  # 1 hour.

@app.task
def transform_audio_format(url_original, url_destiny):
        url_new_file_format = url_destiny.rsplit('.',1)[0]+'.mp3'
       
        print(url_original)
        print(url_destiny)
        print(url_new_file_format)
        input = ffmpeg.input(url_original)
        # #remove default file extension
        
        output = ffmpeg.output(input,url_new_file_format)

        output.run()
        
        return 'trasnformo'
#     try:
#         sqliteConnection = sqlite3.connect('test.db')
#         cursor = sqliteConnection.cursor()
#         print("Database created and Successfully Connected to SQLite")
#         sqlite_select_Query = "Select * FROM voice WHERE id =1"
#         cursor.execute(sqlite_select_Query)
#         record = cursor.fetchall()
#         print("SQLite Database Version is: ", record)
#         cursor.close()
#         return "SQLite Database Version is: " 


#     except sqlite3.Error as error:
#          return "Error while connecting to sqlite"
    
