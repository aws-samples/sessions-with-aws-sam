# HTTP API direct integration example

This template demonstrates using the new HTTP APIs direct integration to an Amazon SQS queue. The following resources are built:
* SQS Queue
* HTTP API
* IAM Role for HTTP API

The *api.yaml* file contains the OpenAPI definition for the direct integration.

### Deployement
From this folder run:
```bash
sam deploy -g
```

### Testing
Update the '\<url\>' with your URL after deployment
```bash
curl --location --request POST '<url>' \
--header 'Content-Type: application/json' \
--data-raw '{"MessageBody":"This is my message"}'
```