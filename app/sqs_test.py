
import logging
import boto3
from botocore.exceptions import ClientError
import json
from botocore.config import Config
import boto3
from botocore import UNSIGNED

AWS_REGION = 'us-west-2'
# Create SQS client
sqs = boto3.client('sqs',AWS_REGION,config=Config(signature_version=UNSIGNED))


import logging
import boto3
from botocore.exceptions import ClientError
import json
from botocore.config import Config
import boto3
from botocore import UNSIGNED

AWS_REGION = 'us-west-2'
# Create SQS client
sqs = boto3.client('sqs',AWS_REGION,config=Config(signature_version=UNSIGNED))

queue_url='https://sqs.us-west-2.amazonaws.com/724199215181/voices'
response = sqs.send_message(
    QueueUrl=queue_url,
    DelaySeconds=10,
    MessageAttributes={
        
        'file_path_original':{'DataType': 'String' ,'StringValue':'hola'}
        
        
    },
    MessageBody=(json.dumps(
        {'file_path_original':'hola',
        'file_path_transformed':'1',
        'new_voice.id':'1',
        'new_voice.email': '1',
        'new_voice.first_name':'1',
        'new_voice.last_name': '1',
        'full_contest_url': '1',
        'date_uploaded': '1'})
    )
)

print(response['MessageId'])