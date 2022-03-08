# import ffmpeg
# input = ffmpeg.input('./contests/1/voices/07e5e258-9491-4b3d-b325-6ca074cceb79.mp4')
# output = ffmpeg.output(input,'./contests/1/voices/07e5e258-9491-4b3d-b325-6ca074cceb79.mp3')
# output.run()

import sendgrid
import os
from sendgrid.helpers.mail import *


print(os.environ['SENDGRID_API_KEY'])
sg = sendgrid.SendGridAPIClient(api_key=os.environ.get('SENDGRID_API_KEY'))
from_email = Email("cloud5202010@gmail.com")
to_email = To("ivanarturo9620@gmail.com")
subject = "Sending with SendGrid is Fun"
content = Content("text/plain", "and easy to do anywhere, even with Python")
mail = Mail(from_email, to_email, subject, content)
response = sg.client.mail.send.post(request_body=mail.get())
print(response.status_code)
print(response.body)
print(response.headers)