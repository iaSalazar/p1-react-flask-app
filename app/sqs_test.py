
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

response = sqs.send_message(
    QueueUrl='https://sqs.us-west-2.amazonaws.com/724199215181/audio',
    DelaySeconds=10,
    MessageAttributes={
        'Title': {
            'DataType': 'String',
            'StringValue': 'The Whistler'
        },
        'Author': {
            'DataType': 'String',
            'StringValue': 'John Grisham'
        },
        'WeeksOn': {
            'DataType': 'Number',
            'StringValue': '6'
        }
    },
    MessageBody=(
        'Information about current NY Times fiction bestseller for '
        'week of 12/11/2016.'
    )
)

print(response['MessageId'])