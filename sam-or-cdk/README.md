<!-- Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: MIT-0 -->
# AWS SAM or AWS CDK

This project builds an Amazon S3 secure url generator. When the API is called it will return a signed upload URL, a signed download URL, and a unique ID for the signed download URL that can be used as a shortened link. The same application is built twice. Once with [AWS SAM](https://aws.amazon.com/serverless/sam/) and then again with [AWS CDK](https://aws.amazon.com/cdk/).

## Deploy the application(s)

### SAM
```bash
cd sam
sam deploy --guided
```

### CDK
```bash
cd cdk
cdk bootstrap
cdk deploy
```

## Resources created
* Amazon API Gateway HTTP APIs endpoint
* AWS Step Function express workflow
* Three lambda functions
* Amazon DynamoDB table

## Test the application

### Request the upload URLs
```bash
curl --location --request POST '<your endpoint here>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "key":"me.jpg",
    "contentType":"image/jpeg"
}'
```
### Response
```json
{
    "billingDetails": {
        "billedDurationInMilliseconds": 900,
        "billedMemoryUsedInMB": 64
    },
    "executionArn": "arn:aws:states:us-west-2:5555:express:SM5555:21674d47-53cf-437e-be99-71121cb67ae7:6816dfd5-2e05-413f-aa2d-01c289f0250d",
    "input": "{\n\"key\":\"me.jpg\",\n\"contentType\":\"image/jpeg\"\n}",
    "inputDetails": {
        "__type": "com.amazonaws.swf.base.model#CloudWatchEventsExecutionDataDetails",
        "included": true
    },
    "name": "21674d47-53cf-437e-be99-71121cb67ae7",
    "output": "{
      \"UploadUrl\":\"https://cdksignedurlstack-storagebucket19db2ff8-g6q401c2jbdg.s3.us-west-2.amazonaws.com/me.jpg?AWSAccessKeyId=ASIAR ... \"
      \"DownloadShortId\":\"9KewK8fnmLHNT8NodejgMr\",
      \"DownloadUrl\":\"https://cdksignedurlstack-storagebucket19db2ff8-g6q401c2jbdg.s3.us-west-2.amazonaws.com/me.jpg?AWSAccessKeyId=ASIAR ...\"}",
    "outputDetails": {
        "__type": "com.amazonaws.swf.base.model#CloudWatchEventsExecutionDataDetails",
        "included": true
    },
    "startDate": 1.616643997576E9,
    "stateMachineArn": "arn:aws:states:us-west-2:5555:stateMachine:StateMachine2E01A3A5-mRsRt1eaZz9O",
    "status": "SUCCEEDED",
    "stopDate": 1.616643998458E9,
    "traceHeader": "Root=1-605c079d-38fa1808c641d88d0cfa2501;Sampled=1"
}
```

The part you are interested in is the **output**

## Teardown
### SAM
```bash
aws cloudformation delete-stack --stack-name <your stack name>
```

### CDK
```bash
cd cdk
cdk destroy
```