<!-- Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: MIT-0
//
Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so.
//
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. -->

# HTTP API direct integration example

This template demonstrates using the new HTTP APIs direct integration to an Amazon SQS queue, a Kinesis Data Stream, and the default EventBridge bus. The following resources are built:
* SQS Queue
* Kinesis Data Stream
* HTTP API
* IAM Role for HTTP API
* A Lambda function for testing.

The *api.yaml* file contains the OpenAPI definition for the direct integration.

## Deployement
From this folder run:
```bash
sam deploy -g
```

## Testing
Update the '\<url\>' with your URL after deployment

### SQS
```bash
curl --location --request POST '<url>/sqs' \
--header 'Content-Type: application/json' \
--data-raw '{"MessageBody":"This is my message"}'
```

### EventBridge
```bash
curl --location --request POST '<url>/eb' \
--header 'Content-Type: application/json' \
--data-raw '{"Detail": {"First Name": "My first name"}}'
```

### Kinesis
```bash
curl --location --request POST '<url>/kinesis' \
--header 'Content-Type: application/json' \
--data-raw '{"Data": "Here is the data"}'
```